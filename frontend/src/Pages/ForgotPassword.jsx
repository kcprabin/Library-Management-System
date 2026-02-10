import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../fetch';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        navigate('/reset-password', { state: { email } });
      } else {
        setError(response.message || 'Failed to send reset code');
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 px-4 py-12 font-display">
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md">
        <button
          onClick={() => navigate('/login')}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="text-lg">←</span>
          Back to Login
        </button>

        <div className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6L3 9m9 5 9-5"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900">Forgot Password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email to receive a reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
                loading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Use the code from your email to reset your password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
