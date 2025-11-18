import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { Clock } from 'lucide-react';

export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-blue-900/20"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-2xl">
            <Clock className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          {isSignIn ? (
            <SignInForm onToggleForm={() => setIsSignIn(false)} />
          ) : (
            <SignUpForm onToggleForm={() => setIsSignIn(true)} />
          )}
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Track your time. Analyze your habits. Improve your life.</p>
        </div>
      </div>
    </div>
  );
}
