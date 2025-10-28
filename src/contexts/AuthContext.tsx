import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp, AuthUser, fetchUserAttributes } from 'aws-amplify/auth';
import amplifyconfig from '../amplifyconfiguration.json';

console.log('🔧 Amplify config:', amplifyconfig);
Amplify.configure(amplifyconfig);
console.log('✅ Amplify configured');

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, email: string) => Promise<boolean>;
  confirmSignup: (username: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session persistence keys
const SESSION_KEYS = {
  USER: 'amplify_user_session',
  IS_ADMIN: 'amplify_is_admin'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthProvider mounted, checking auth state...');
    
    // Check localStorage for any existing session info
    const localStorageKeys = Object.keys(localStorage).filter(key => 
      key.includes('amplify') || key.includes('cognito') || key.includes('aws')
    );
    console.log('🗄️ Auth-related localStorage keys:', localStorageKeys);
    
    // Check our custom session storage
    const storedUser = localStorage.getItem(SESSION_KEYS.USER);
    const storedIsAdmin = localStorage.getItem(SESSION_KEYS.IS_ADMIN);
    console.log('💾 Stored session data:', { storedUser: !!storedUser, storedIsAdmin });
    
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔍 Checking auth state on app load...');
      
      // Try to get current user (this will work if session exists)
      const currentUser = await getCurrentUser();
      console.log('✅ Current user found on refresh:', currentUser);
      
      setUser(currentUser);
      
      // Restore admin status from localStorage if available
      const storedIsAdmin = localStorage.getItem(SESSION_KEYS.IS_ADMIN);
      if (storedIsAdmin === 'true') {
        console.log('🛡️ Restored admin status from localStorage');
        setIsAdmin(true);
      } else {
        await checkAdminStatus(currentUser);
      }
      
      // Store user session
      localStorage.setItem(SESSION_KEYS.USER, JSON.stringify({
        username: currentUser.username,
        userId: currentUser.userId
      }));
      
    } catch (error) {
      console.log('❌ No current user on refresh:', error);
      
      // Clear stored session data
      localStorage.removeItem(SESSION_KEYS.USER);
      localStorage.removeItem(SESSION_KEYS.IS_ADMIN);
      
      setUser(null);
      setIsAdmin(false);
    } finally {
      console.log('🏁 Auth state check complete');
      setLoading(false);
    }
  };

  const checkAdminStatus = async (_user: AuthUser) => {
    try {
      console.log('🔍 Checking admin status...');
      
      // Use fetchUserAttributes instead of fetchAuthSession to avoid Identity Pool issues
      const attributes = await fetchUserAttributes();
      console.log('📋 User attributes:', attributes);
      
      // Check if user is admin by email
      const email = attributes.email;
      const isUserAdmin = email === 'zolisasilolo@gmail.com';
      
      console.log('📧 User email:', email);
      console.log('🛡️ Is admin (by email):', isUserAdmin);
      
      setIsAdmin(isUserAdmin);
      
      // Store admin status
      localStorage.setItem(SESSION_KEYS.IS_ADMIN, isUserAdmin.toString());
      
    } catch (error) {
      console.error('💥 Error checking admin status:', error);
      setIsAdmin(false);
      localStorage.setItem(SESSION_KEYS.IS_ADMIN, 'false');
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', username);
      
      const signInResult = await signIn({ username, password });
      console.log('✅ SignIn result:', signInResult);
      
      const currentUser = await getCurrentUser();
      console.log('👤 Current user after login:', currentUser);
      
      setUser(currentUser);
      await checkAdminStatus(currentUser);
      
      // Store successful login
      localStorage.setItem(SESSION_KEYS.USER, JSON.stringify({
        username: currentUser.username,
        userId: currentUser.userId
      }));
      
      return true;
    } catch (error) {
      console.error('💥 Login error details:', error);
      return false;
    }
  };

  const signup = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
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

  const logout = async () => {
    try {
      await signOut();
      
      // Clear all session data
      localStorage.removeItem(SESSION_KEYS.USER);
      localStorage.removeItem(SESSION_KEYS.IS_ADMIN);
      
      setUser(null);
      setIsAdmin(false);
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
