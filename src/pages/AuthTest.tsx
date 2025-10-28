import React, { useState } from 'react';
import { signIn, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const AuthTest = () => {
  const [result, setResult] = useState<string>('');

  const testAuth = async () => {
    try {
      setResult('Testing authentication...\n');
      
      // Test login
      const signInResult = await signIn({ 
        username: 'zolisasilolo@gmail.com', 
        password: 'ZolisaAdmin2025!' 
      });
      setResult(prev => prev + `✅ SignIn successful: ${JSON.stringify(signInResult, null, 2)}\n\n`);
      
      // Get current user
      const user = await getCurrentUser();
      setResult(prev => prev + `✅ Current user: ${JSON.stringify(user, null, 2)}\n\n`);
      
      // Get session and JWT
      const session = await fetchAuthSession();
      setResult(prev => prev + `✅ Session: ${JSON.stringify(session.tokens?.idToken?.payload, null, 2)}\n\n`);
      
      // Check groups
      const groups = session.tokens?.idToken?.payload['cognito:groups'] || [];
      setResult(prev => prev + `✅ Groups: ${JSON.stringify(groups)}\n`);
      setResult(prev => prev + `✅ Is Admin: ${groups.includes('Admins')}\n`);
      
    } catch (error) {
      setResult(prev => prev + `❌ Error: ${JSON.stringify(error, null, 2)}\n`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
      <button 
        onClick={testAuth}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        Test Authentication
      </button>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
        {result}
      </pre>
    </div>
  );
};

export default AuthTest;
