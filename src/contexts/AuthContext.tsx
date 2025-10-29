import React, { createContext, useContext, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { signUp, confirmSignUp, signIn, signOut, getCurrentUser, AuthUser } from 'aws-amplify/auth';
import amplifyconfig from '../amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, email: string) => Promise<boolean>;
  confirmSignup: (username: string, code: string) => Promise<boolean>;
  forgotPassword: (username: string) => Promise<boolean>;
  resetPassword: (username: string, code: string, newPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const signup = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      console.log('📝 Attempting signup for:', { username, email });
      console.log('📝 Password length:', password.length);
      
      const signUpResult = await signUp({
        username,
        password,
        options: {
          userAttributes: { email }
        }
      });
      
      console.log('✅ Signup result:', signUpResult);
      return true;
      
    } catch (error) {
      console.error('💥 Signup error details:', error);
      console.error('💥 Error name:', error.name);
      console.error('💥 Error message:', error.message);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await signIn({ username, password });
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const confirmSignup = async (username: string, code: string): Promise<boolean> => {
    try {
      await confirmSignUp({ username, confirmationCode: code });
      return true;
    } catch (error) {
      console.error('Confirmation error:', error);
      return false;
    }
  };

  const forgotPassword = async (username: string): Promise<boolean> => {
    try {
      await resetPassword({ username });
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const resetPassword = async (username: string, code: string, newPassword: string): Promise<boolean> => {
    try {
      await confirmResetPassword({ username, confirmationCode: code, newPassword });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin,
    login,
    signup,
    confirmSignup,
    forgotPassword,
    resetPassword,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
