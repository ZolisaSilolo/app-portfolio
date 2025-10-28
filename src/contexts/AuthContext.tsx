import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp, resetPassword, confirmResetPassword, AuthUser, fetchUserAttributes } from 'aws-amplify/auth';
import { sessionService } from '../services/sessionService';
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
  forgotPassword: (username: string) => Promise<boolean>;
  resetPassword: (username: string, code: string, newPassword: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 AuthProvider mounted, checking auth state...');
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log('🔍 Checking auth state...');
      
      // First try to validate existing DynamoDB session
      const sessionData = await sessionService.validateSession();
      if (sessionData) {
        console.log('✅ Valid DynamoDB session found:', sessionData);
        
        // Try to get Cognito user to sync
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          setIsAdmin(sessionData.isAdmin);
          
          // Update session activity
          await sessionService.updateSession({ lastActivity: new Date().toISOString() });
          
          console.log('🔄 Synced Cognito + DynamoDB session');
          return;
        } catch (cognitoError) {
          console.log('⚠️ Cognito session expired, but DynamoDB session valid');
          // DynamoDB session exists but Cognito expired - could re-authenticate or clear session
        }
      }
      
      // Fallback to Cognito-only session check
      const currentUser = await getCurrentUser();
      console.log('✅ Cognito user found:', currentUser);
      
      setUser(currentUser);
      await checkAdminStatus(currentUser);
      
      // Create DynamoDB session for existing Cognito session
      const attributes = await fetchUserAttributes();
      const email = attributes.email || '';
      const adminStatus = email === 'zolisasilolo@gmail.com';
      
      await sessionService.createSession(currentUser.userId, email, adminStatus);
      console.log('🆕 Created DynamoDB session for existing Cognito user');
      
    } catch (error) {
      console.log('❌ No valid session found:', error);
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
      
      const attributes = await fetchUserAttributes();
      const email = attributes.email;
      const isUserAdmin = email === 'zolisasilolo@gmail.com';
      
      console.log('📧 User email:', email);
      console.log('🛡️ Is admin:', isUserAdmin);
      
      setIsAdmin(isUserAdmin);
      
    } catch (error) {
      console.error('💥 Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Attempting login for:', username);
      
      const signInResult = await signIn({ username, password });
      console.log('✅ Cognito SignIn successful:', signInResult);
      
      const currentUser = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      const email = attributes.email || username;
      const adminStatus = email === 'zolisasilolo@gmail.com';
      
      setUser(currentUser);
      setIsAdmin(adminStatus);
      
      // Create DynamoDB session
      await sessionService.createSession(currentUser.userId, email, adminStatus);
      
      // Log analytics
      await sessionService.logAnalytics({
        eventType: 'login',
        userId: currentUser.userId,
        metadata: { isAdmin: adminStatus, loginMethod: 'cognito' }
      });
      
      console.log('✅ Complete login with DynamoDB session created');
      return true;
    } catch (error) {
      console.error('💥 Login error:', error);
      return false;
    }
  };

  const signup = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      console.log('📝 Attempting signup for:', { username, email });
      
      const signUpResult = await signUp({
        username,
        password,
        options: {
          userAttributes: { email }
        }
      });
      
      console.log('✅ Signup result:', signUpResult);
      
      // Check if user is auto-confirmed (no email verification needed)
      if (signUpResult.isSignUpComplete) {
        console.log('🎉 User auto-confirmed, logging in...');
        // Auto-login after successful signup
        return await login(username, password);
      }
      
      // Log analytics for signup (non-blocking)
      try {
        await sessionService.logAnalytics({
          eventType: 'signup_attempt',
          userId: username,
          metadata: { email }
        });
      } catch (analyticsError) {
        console.warn('⚠️ Analytics logging failed during signup:', analyticsError);
      }
      
      return true;
    } catch (error) {
      console.error('💥 Signup error details:', error);
      return false;
    }
  };

  const confirmSignup = async (username: string, code: string): Promise<boolean> => {
    try {
      await confirmSignUp({ username, confirmationCode: code });
      
      // Log analytics for successful signup (non-blocking)
      try {
        await sessionService.logAnalytics({
          eventType: 'signup_confirmed',
          userId: username
        });
      } catch (analyticsError) {
        console.warn('⚠️ Analytics logging failed during confirmation:', analyticsError);
      }
      
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
      // Log analytics before logout
      if (user) {
        await sessionService.logAnalytics({
          eventType: 'logout',
          userId: user.userId
        });
      }
      
      // Delete DynamoDB session
      await sessionService.deleteSession();
      
      // Sign out from Cognito
      await signOut();
      
      setUser(null);
      setIsAdmin(false);
      
      console.log('✅ Complete logout from both Cognito and DynamoDB');
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
