'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { sendPasswordRecovery } from './actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      setSuccessMessage('');
      return;
    }

    setRecoveryLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await sendPasswordRecovery(email);
      if (res.success) {
        setSuccessMessage(res.message || 'Recovery email sent successfully!');
      } else {
        setError(res.error || 'Failed to send recovery email.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF385C] rounded-xl text-white font-bold text-3xl mb-4 shadow-md">
            C
          </div>
          <h1 className="text-3xl font-bold text-[#111827]">Welcome Back</h1>
          <p className="text-[#6B7280] mt-2">Sign in to manage your property</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-[#E5E7EB]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-medium border border-green-100 animate-in fade-in slide-in-from-top-3 duration-300">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-[#B0B0B0] rounded-lg focus:ring-2 focus:ring-[#222222] focus:border-[#222222] transition-all outline-none text-[#222222]"
                  placeholder="host@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-[#374151]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={recoveryLoading}
                  className="text-xs font-semibold text-[#FF385C] hover:text-[#E31C5F] hover:underline disabled:opacity-50 transition-all outline-none"
                >
                  {recoveryLoading ? 'Sending...' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-white border border-[#B0B0B0] rounded-lg focus:ring-2 focus:ring-[#222222] focus:border-[#222222] transition-all outline-none text-[#222222]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF385C] hover:bg-[#E31C5F] text-white font-semibold py-4 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-[#6B7280]">
          Don't have an account? Contact support to get started.
        </p>
      </div>
    </div>
  );
}
