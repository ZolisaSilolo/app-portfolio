import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp, AuthUser, fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth';
import amplifyconfig from '../amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      await checkAdminStatus(currentUser);
    } catch (error) {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async (_user: AuthUser) => {
    try {
      // Get the current session and extract JWT token
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      
      if (idToken) {
        const payload = idToken.payload;
        console.log('JWT payload:', payload);
        
        // Check for groups in the JWT token
        const groups = payload['cognito:groups'] as string[] || [];
        console.log('Groups from JWT:', groups);
        
        const isUserAdmin = groups.includes('Admins');
        console.log('Is admin:', isUserAdmin);
        setIsAdmin(isUserAdmin);
        return;
      }
      
      console.log('No ID token found');
      setIsAdmin(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', username);
      
      const signInResult = await signIn({ username, password });
      console.log('SignIn result:', signInResult);
      
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);
      
      setUser(currentUser);
      await checkAdminStatus(currentUser);
      return true;
    } catch (error) {
      console.error('Login error details:', error);
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
