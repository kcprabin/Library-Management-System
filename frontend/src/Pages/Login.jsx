import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

axios.defaults.withCredentials = true;

const BACKEND = import.meta.env.VITE_BACKEND || "http://localhost:8000";

const Login = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [loginType, setLoginType] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Auto-login check
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const response = await axios.get(
          `${BACKEND}/api/v1/library/rememberme`,
          { withCredentials: true }
        );

        if (response.data.success) {
          if (response.data.role === 'admin') navigate('/admin-dashboard');
           if (response.data.role === 'student') navigate('/student-dashboard');
        } 
      } catch (err) {
        console.error('Auto login failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAutoLogin();
  }, []);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        `${BACKEND}/api/v1/library/login`,
        { email, password, role: loginType },
        { withCredentials: true }
      );

      if (response.data.success) {
        login(response.data.user);


        if (loginType === 'admin') navigate('/admin-dashboard');
        else navigate('/student-dashboard');

      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  if (loading) return <p className="text-center mt-10">Checking login...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Library Management</h1>
          <p className="text-gray-500 text-sm">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Login Type Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            {['student', 'admin'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setLoginType(type)}
                className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
                  loginType === type
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} Login
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {loginType === 'admin' ? 'Admin Email' : 'Student Email'}
              </label>
              <input
                type="email"
                placeholder={loginType === 'admin' ? 'admin@library.com' : 'student@university.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-gray-700 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] text-white ${
                loginType === 'admin'
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              Sign In as {loginType === 'admin' ? 'Admin' : 'Student'}
            </button>
          </div>

          {/* Sign Up Link */}
          {loginType === 'student' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </button>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
