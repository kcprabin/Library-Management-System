import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../fetch';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [resetCode, setResetCode] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !resetCode) {
      setError('Email and reset code are required');
      return;
    }

    setCodeVerified(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!codeVerified) {
      setError('Please verify your reset code first');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        email,
        resetCode: Number(resetCode),
        newPassword
      });

      if (response.success) {
        navigate('/login');
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-12 font-display">
      <div className="pointer-events-none absolute -top-24 left-0 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-lg">
        <button
          onClick={() => navigate('/login')}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="text-lg">←</span>
          Back to Login
        </button>

        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-lg">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Reset Password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Verify your reset code, then set a new password.
            </p>
          </div>

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setCodeVerified(false);
                }}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Reset Code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => {
                  setResetCode(e.target.value);
                  setCodeVerified(false);
                }}
                placeholder="Enter code from email"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl border border-amber-200 bg-amber-50 py-3 text-sm font-semibold text-amber-700 transition-all hover:bg-amber-100"
            >
              {codeVerified ? 'Code Verified' : 'Verify Code'}
            </button>
          </form>

          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a new password"
                required
                disabled={!codeVerified}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={!codeVerified}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!codeVerified || loading}
              className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
                loading || !codeVerified ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loading ? 'Resetting...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
