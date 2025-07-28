"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  User,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import {
  createUserProfile,
  getUserProfile,
  UserProfile,
  getActivity,
  addActivity,
  getTasks,
  addTask as addTaskFS,
  toggleTask as toggleTaskFS,
  deleteTask as deleteTaskFS,
  Task,
} from "@/lib/firebase/firestore";
import { useRouter } from "next/navigation";
import { startOfDay, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  codingTimeToday: number;
  currentStreak: number;
  longestStreak: number;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  fetchCodingTimeToday: () => void;
  login: (email: string, pass: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  signup: (email: string, pass: string, name: string) => Promise<any>;
  logout: () => Promise<void>;

  // Task Management
  tasks: Task[];
  loadingTasks: boolean;
  addTask: (text: string) => Promise<void>;
  toggleTask: (id: string, completed: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  // Global Timer State
  isTimerActive: boolean;
  timerElapsedTime: number;
  activeTask: Task | null;
  isTimerSaving: boolean;
  startGlobalTimer: (task: Task) => void;
  stopGlobalTimer: () => Promise<void>;
  resetGlobalTimer: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [codingTimeToday, setCodingTimeToday] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  // --- Task State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // --- Global Timer State ---
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerElapsedTime, setTimerElapsedTime] = useState(0); // in milliseconds
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTimerSaving, setIsTimerSaving] = useState(false);

  const fetchCodingTimeToday = useCallback(async () => {
    if (!auth.currentUser) return;
    const activities = await getActivity(auth.currentUser.uid, 1);
    const today = startOfDay(new Date());
    const todayActivities = activities.filter(
      (a) => startOfDay(a.date.toDate()).getTime() === today.getTime()
    );
    const totalSecondsToday = todayActivities.reduce(
      (sum, a) => sum + a.duration,
      0
    );
    setCodingTimeToday(totalSecondsToday);
  }, []);

  const fetchTasks = useCallback(async (uid: string) => {
    setLoadingTasks(true);
    try {
      const userTasks = await getTasks(uid);
      setTasks(userTasks);
    } catch (error) {
      console.error("Failed to load tasks from Firestore", error);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const calculateStreaks = useCallback(async (uid: string) => {
    const activities = await getActivity(uid, 365);
    const today = startOfDay(new Date());

    if (activities.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    const uniqueDates = activities
      .map((activity) => startOfDay(activity.date.toDate()))
      .filter(
        (date, i, self) =>
          self.findIndex((d) => d.getTime() === date.getTime()) === i
      );

    const sortedDates = [...uniqueDates].sort(
      (a, b) => b.getTime() - a.getTime()
    );

    // Calculate Longest Streak
    let maxStreak = 0;
    if (sortedDates.length > 0) {
      maxStreak = 1;
      let currentIterationStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        if (differenceInDays(sortedDates[i - 1], sortedDates[i]) === 1) {
          currentIterationStreak++;
        } else {
          currentIterationStreak = 1;
        }
        if (currentIterationStreak > maxStreak) {
          maxStreak = currentIterationStreak;
        }
      }
    }
    setLongestStreak(maxStreak);

    // Calculate Current Streak
    const mostRecentDate = sortedDates[0];
    const daysSinceLastActivity = differenceInDays(today, mostRecentDate);

    if (daysSinceLastActivity > 1) {
      setCurrentStreak(0);
      return;
    }

    let cStreak = 0;
    if (daysSinceLastActivity <= 1) {
      cStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        if (differenceInDays(sortedDates[i - 1], sortedDates[i]) === 1) {
          cStreak++;
        } else {
          break;
        }
      }
    }
    setCurrentStreak(cStreak);
  }, []);

  // Timer logic moved to context provider
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive) {
      const startTime = Date.now() - timerElapsedTime;
      interval = setInterval(() => {
        setTimerElapsedTime(Date.now() - startTime);
      }, 10);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerElapsedTime]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
          await Promise.all([
            fetchCodingTimeToday(),
            fetchTasks(currentUser.uid),
            calculateStreaks(currentUser.uid),
          ]);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          setProfile(null);
        }
      } else {
        try {
          const result = await getRedirectResult(auth);
          if (result) {
            const user = result.user;
            setUser(user);
            let userProfile = await getUserProfile(user.uid);
            if (!userProfile) {
              await createUserProfile(
                user.uid,
                user.email || "",
                user.displayName || "User",
                user.photoURL || ""
              );
              userProfile = await getUserProfile(user.uid);
            }
            setProfile(userProfile);
            await Promise.all([
              fetchCodingTimeToday(),
              fetchTasks(user.uid),
              calculateStreaks(user.uid),
            ]);
          } else {
            setUser(null);
            setProfile(null);
            setCurrentStreak(0);
            setLongestStreak(0);
          }
        } catch (error) {
          console.error("Social sign-in redirect error:", error);
          setUser(null);
          setProfile(null);
          setCurrentStreak(0);
          setLongestStreak(0);
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [fetchCodingTimeToday, fetchTasks, calculateStreaks]);

  const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const signup = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass
    );
    const user = userCredential.user;
    await createUserProfile(user.uid, email, name, user.photoURL);
    const userProfile = await getUserProfile(user.uid);
    setProfile(userProfile);
  };

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // --- Task Controls ---
  const addTask = async (text: string) => {
    if (!user) throw new Error("User not authenticated");
    const newTask = await addTaskFS(user.uid, text);
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const toggleTask = async (id: string, completed: boolean) => {
    if (!user) throw new Error("User not authenticated");
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, completed } : task))
    );
    await toggleTaskFS(user.uid, id, completed);
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    await deleteTaskFS(user.uid, id);
  };

  // --- Global Timer Controls ---
  const startGlobalTimer = (task: Task) => {
    setActiveTask(task);
    setIsTimerActive(true);
  };

  const stopGlobalTimer = async () => {
    if (!user || !activeTask) return;

    setIsTimerActive(false);
    setIsTimerSaving(true);

    const durationInSeconds = Math.floor(timerElapsedTime / 1000);

    try {
      if (durationInSeconds > 10) {
        // Optimistic UI Update for task completion
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === activeTask.id ? { ...task, completed: true } : task
          )
        );

        // Save activity and mark task as complete in Firestore
        await addActivity(
          user.uid,
          durationInSeconds,
          activeTask.id,
          activeTask.text
        );
        await toggleTaskFS(user.uid, activeTask.id, true);

        // Refresh today's coding time and streak
        await fetchCodingTimeToday();
        await calculateStreaks(user.uid);

        toast({
          title: "Session Saved!",
          description: `You've logged ${formatDuration(
            durationInSeconds
          )} for "${activeTask.text}". Task marked as complete.`,
        });
      } else {
        toast({
          title: "Session Too Short",
          description: "Focus sessions under 10 seconds are not saved.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save your focus session.",
        variant: "destructive",
      });
      console.error("Error saving focus session: ", error);
      // Revert optimistic update if firestore fails
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === activeTask.id ? { ...task, completed: false } : task
        )
      );
    } finally {
      setTimerElapsedTime(0);
      setActiveTask(null);
      setIsTimerSaving(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const resetGlobalTimer = () => {
    if (isTimerActive) {
      toast({
        title: "Timer Reset",
        description: "The session was not saved.",
      });
    }
    setIsTimerActive(false);
    setTimerElapsedTime(0);
    setActiveTask(null);
  };

  const value = {
    user,
    profile,
    loading,
    codingTimeToday,
    currentStreak,
    longestStreak,
    setProfile,
    fetchCodingTimeToday,
    login,
    loginWithGoogle,
    signup,
    logout,

    // Tasks
    tasks,
    loadingTasks,
    addTask,
    toggleTask,
    deleteTask,

    // Global Timer
    isTimerActive,
    timerElapsedTime,
    activeTask,
    isTimerSaving,
    startGlobalTimer,
    stopGlobalTimer,
    resetGlobalTimer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
