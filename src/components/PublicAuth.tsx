import React, { useState } from 'react';
import { Lock, Eye, EyeOff, User, Mail, MessageCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface PublicAuthProps {
  title: string;
  description: string;
  onSuccess?: () => void;
}

const PublicAuth: React.FC<PublicAuthProps> = ({ title, description, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);
  const { login, signup, confirmSignup, forgotPassword, resetPassword } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    const success = await login(username, password);
    
    if (success) {
      onSuccess?.();
    } else {
      setError('Invalid credentials');
    }
    
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const success = await signup(username, password, email);
    
    if (success) {
      setNeedsConfirmation(true);
    } else {
      setError('Signup failed. Please try again.');
    }
    
    setLoading(false);
  };

  const handleConfirmation = async () => {
    if (!confirmationCode.trim()) {
      setError('Please enter confirmation code');
      return;
    }

    setLoading(true);
    setError('');

    const success = await confirmSignup(username, confirmationCode);
    
    if (success) {
      // Auto-login after confirmation
      await login(username, password);
      onSuccess?.();
    } else {
      setError('Invalid confirmation code');
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!username.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    const success = await forgotPassword(username);
    
    if (success) {
      setNeedsPasswordReset(true);
    } else {
      setError('Failed to send reset code');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!confirmationCode.trim() || !newPassword.trim()) {
      setError('Please enter both code and new password');
      return;
    }

    setLoading(true);
    setError('');

    const success = await resetPassword(username, confirmationCode, newPassword);
    
    if (success) {
      // Auto-login after password reset
      await login(username, newPassword);
      onSuccess?.();
    } else {
      setError('Invalid code or password reset failed');
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (needsPasswordReset) {
        handleResetPassword();
      } else if (needsConfirmation) {
        handleConfirmation();
      } else if (isForgotPassword) {
        handleForgotPassword();
      } else if (isLogin) {
        handleLogin();
      } else {
        handleSignup();
      }
    }
  };

  if (needsPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold matrix-text">Reset Password</h1>
            <p className="text-cyan-300 mt-2">Enter the code sent to {username}</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Reset Code"
              className="w-full px-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
            />
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="New Password"
                className="w-full pr-12 px-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400/70 hover:text-green-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <button
              onClick={handleResetPassword}
              disabled={loading || !confirmationCode.trim() || !newPassword.trim()}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Reset Password'
              )}
            </button>
            
            <button
              onClick={() => {
                setNeedsPasswordReset(false);
                setIsForgotPassword(false);
                setError('');
              }}
              className="w-full py-2 text-green-400 hover:text-green-300 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (needsConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6">
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold matrix-text">Check Your Email</h1>
            <p className="text-cyan-300 mt-2">Enter the confirmation code sent to {email}</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Confirmation Code"
              className="w-full px-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none text-center"
            />
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <button
              onClick={handleConfirmation}
              disabled={loading || !confirmationCode.trim()}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Confirm Account'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6">
          <div className="text-center mb-6">
            <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold matrix-text">Forgot Password</h1>
            <p className="text-cyan-300 mt-2">Enter your email to receive a reset code</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/70 w-4 h-4" />
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            
            <button
              onClick={handleForgotPassword}
              disabled={loading || !username.trim()}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Send Reset Code'
              )}
            </button>
            
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setError('');
              }}
              className="w-full py-2 text-green-400 hover:text-green-300 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6">
        <div className="text-center mb-6">
          <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold matrix-text">{title}</h1>
          <p className="text-cyan-300 mt-2">{description}</p>
        </div>
        
        <div className="flex mb-6 bg-black/30 rounded-lg p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin ? 'bg-green-600 text-white' : 'text-green-400 hover:text-green-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin ? 'bg-green-600 text-white' : 'text-green-400 hover:text-green-300'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/70 w-4 h-4" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/70 w-4 h-4" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
              />
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/70 w-4 h-4" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Password"
              className="w-full pl-10 pr-12 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400/70 hover:text-green-400"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          
          <button
            onClick={isLogin ? handleLogin : handleSignup}
            disabled={loading || !username.trim() || !password.trim() || (!isLogin && !email.trim())}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
          
          {isLogin && (
            <button
              onClick={() => setIsForgotPassword(true)}
              className="w-full py-2 text-green-400 hover:text-green-300 transition-colors text-sm"
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicAuth;
