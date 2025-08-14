import React, { createContext, useContext, useState, useEffect } from "react";
import { localStorageService } from "../lib/localStorage";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Initialize sample data
    localStorageService.initializeSampleData();
    
    // Get initial user from local storage
    const storedUser = localStorageService.getUser();
    const storedProfile = localStorageService.getUserProfile();
    
    if (storedUser) {
      setUser(storedUser);
      setUserProfile(storedProfile);
    }
    
    setLoading(false);
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const profile = localStorageService.getUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
    } catch (error) {
      setAuthError('Failed to load user profile');
    }
  };

  // Auth functions
  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError('');
    try {
      // Mock authentication - in a real app, you'd validate credentials
      const mockUser = {
        id: '1',
        email: email,
        created_at: new Date().toISOString()
      };
      
      const mockProfile = {
        id: '1',
        full_name: email.split('@')[0],
        email: email,
        avatar_url: null
      };
      
      // Store user data
      localStorageService.setUser(mockUser);
      localStorageService.setUserProfile(mockProfile);
      
      setUser(mockUser);
      setUserProfile(mockProfile);
      setLoading(false);
      
      return { data: mockUser, error: null };
    } catch (error) {
      setLoading(false);
      setAuthError('Something went wrong. Please try again.');
      return { data: null, error };
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    setLoading(true);
    setAuthError('');
    try {
      // Mock user creation - in a real app, you'd create a real user
      const mockUser = {
        id: '1',
        email: email,
        created_at: new Date().toISOString()
      };
      
      const mockProfile = {
        id: '1',
        full_name: metadata?.full_name || email.split('@')[0],
        email: email,
        avatar_url: null
      };
      
      // Store user data
      localStorageService.setUser(mockUser);
      localStorageService.setUserProfile(mockProfile);
      
      setUser(mockUser);
      setUserProfile(mockProfile);
      setLoading(false);
      
      return { data: mockUser, error: null };
    } catch (error) {
      setLoading(false);
      setAuthError('Something went wrong. Please try again.');
      return { data: null, error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    setAuthError('');
    try {
      // Clear local storage
      localStorageService.removeUser();
      localStorageService.removeUserProfile();
      
      // Clear local state
      setUser(null);
      setUserProfile(null);
      setLoading(false);
      
      return { error: null };
    } catch (error) {
      setLoading(false);
      setAuthError('Something went wrong during sign out.');
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    setAuthError('');
    try {
      const updatedProfile = { ...userProfile, ...updates };
      localStorageService.setUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
      return { data: updatedProfile, error: null };
    } catch (error) {
      setAuthError('Failed to update profile');
      return { data: null, error };
    }
  };

  const clearAuthError = () => {
    setAuthError('');
  };

  const value = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;