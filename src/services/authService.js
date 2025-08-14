import { localStorageService } from '../lib/localStorage';

export const authService = {
  // Get current session
  async getSession() {
    try {
      const user = localStorageService.getUser();
      return user ? { user } : null;
    } catch (error) {
      throw error;
    }
  },

  // Sign in with email/password
  async signIn(email, password) {
    try {
      // Mock authentication
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
      
      localStorageService.setUser(mockUser);
      localStorageService.setUserProfile(mockProfile);
      
      return mockUser;
    } catch (error) {
      throw error;
    }
  },

  // Sign up with email/password
  async signUp(email, password, userData = {}) {
    try {
      // Mock user creation
      const mockUser = {
        id: '1',
        email: email,
        created_at: new Date().toISOString()
      };
      
      const mockProfile = {
        id: '1',
        full_name: userData?.full_name || email.split('@')[0],
        email: email,
        avatar_url: null
      };
      
      localStorageService.setUser(mockUser);
      localStorageService.setUserProfile(mockProfile);
      
      return mockUser;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  async signOut() {
    try {
      localStorageService.removeUser();
      localStorageService.removeUserProfile();
    } catch (error) {
      throw error;
    }
  },

  // Get user profile from local storage
  async getUserProfile(userId) {
    try {
      return localStorageService.getUserProfile();
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const currentProfile = localStorageService.getUserProfile();
      const updatedProfile = { ...currentProfile, ...updates };
      localStorageService.setUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      // Mock password reset - in a real app, you'd send an email
      console.log('Password reset requested for:', email);
    } catch (error) {
      throw error;
    }
  },

  // Update password
  async updatePassword(newPassword) {
    try {
      // Mock password update - in a real app, you'd update the password
      console.log('Password updated successfully');
    } catch (error) {
      throw error;
    }
  }
};

export default authService;