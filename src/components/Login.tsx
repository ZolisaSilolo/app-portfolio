import React, { useState } from 'react';
import { Lock, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  title: string;
  description: string;
  onSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ title, description, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="matrix-card p-8 rounded-2xl max-w-md w-full mx-6">
        <div className="text-center mb-6">
          <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold matrix-text">{title}</h1>
          <p className="text-cyan-300 mt-2">{description}</p>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400/70 w-4 h-4" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Username or Email"
              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-green-400/30 rounded-lg text-green-300 placeholder-green-400/50 focus:border-green-400 focus:outline-none"
            />
          </div>

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
            onClick={handleLogin}
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
