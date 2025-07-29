import { db } from "./config";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  where,
  query,
  orderBy,
} from "firebase/firestore";

// Types
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  photoURL: string | null;
  dailyGoal: number;
  timezone: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
}

export interface Activity {
  id: string;
  date: Timestamp;
  duration: number; // in seconds
  taskId?: string;
  taskText?: string;
}

// --- User Profile Functions ---

export const createUserProfile = async (
  uid: string,
  email: string,
  name: string,
  photoURL: string | null = null
): Promise<void> => {
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);
  if (!docSnap.exists()) {
    await setDoc(userDocRef, {
      uid,
      email,
      name,
      photoURL,
      dailyGoal: 5,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    return null;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const usersCollection = collection(db, "users");
  const usersSnapshot = await getDocs(usersCollection);
  return usersSnapshot.docs.map((doc) => doc.data() as UserProfile);
};

// --- Task Functions ---

// --- REFACTORED: Switched to a more robust start-of-day/end-of-day query ---
export const getTasks = async (uid: string): Promise<Task[]> => {
  // Get the start of the current day (midnight)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startTimestamp = Timestamp.fromDate(startOfToday);

  // Get the end of the current day (23:59:59.999)
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const endTimestamp = Timestamp.fromDate(endOfToday);

  const tasksRef = collection(db, "users", uid, "tasks");
  // This query now reliably fetches all tasks for the current calendar day.
  const q = query(
    tasksRef,
    where("createdAt", ">=", startTimestamp),
    where("createdAt", "<=", endTimestamp),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Task)
  );
};

export const addTask = async (uid: string, text: string): Promise<Task> => {
  const newTask = {
    text,
    completed: false,
    createdAt: serverTimestamp(),
  };
  const tasksRef = collection(db, "users", uid, "tasks");
  const docRef = await addDoc(tasksRef, newTask);

  return { id: docRef.id, text, completed: false, createdAt: Timestamp.now() };
};

export const toggleTask = async (
  uid: string,
  taskId: string,
  completed: boolean
): Promise<void> => {
  const taskRef = doc(db, "users", uid, "tasks", taskId);
  await updateDoc(taskRef, { completed });
};

export const deleteTask = async (
  uid: string,
  taskId: string
): Promise<void> => {
  const taskRef = doc(db, "users", uid, "tasks", taskId);
  await deleteDoc(taskRef);
};

// --- Activity/Streak Functions ---

export const addActivity = async (
  uid: string,
  duration: number,
  taskId?: string,
  taskText?: string
): Promise<void> => {
  const today = new Date();
  const activityRef = collection(db, "users", uid, "activity");

  const activityData: {
    date: Timestamp;
    duration: number;
    taskId?: string;
    taskText?: string;
  } = {
    date: Timestamp.fromDate(today),
    duration,
  };

  if (taskId && taskText) {
    activityData.taskId = taskId;
    activityData.taskText = taskText;
  }

  await addDoc(activityRef, activityData);
};

export const getActivity = async (
  uid:string,
  days = 365
): Promise<Activity[]> => {
  const activityRef = collection(db, "users", uid, "activity");
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const q = query(
    activityRef,
    where("date", ">=", startDate),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Activity)
  );
};
