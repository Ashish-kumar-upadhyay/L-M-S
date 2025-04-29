import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiUser, FiMail, FiUserPlus } from 'react-icons/fi';
import { authAPI } from '../utils/api';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useContext(AuthContext);

  // Check for success message from registration
  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccess(location.state.message);
      // Clear state after displaying message
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    dispatch({ type: "LOGIN_START" });
    
    try {
      const response = await authAPI.login(formData);
      
      if (response.data) {
        dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard@member');
      } else {
        setError('Invalid response from server');
        dispatch({ type: "LOGIN_FAILURE" });
      }
    } catch (err: any) {
      dispatch({ type: "LOGIN_FAILURE" });
      if (err.response) {
        setError(err.response.data.message || 'Invalid email or password');
      } else if (err.request) {
        setError('Unable to connect to server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10190D] to-[#1a2c15] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-300">Sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative animate-shake" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300/20 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9534B] focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-300 ${
                  isLoading 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#E9534B] hover:bg-[#d4483f] hover:shadow-lg hover:shadow-[#E9534B]/50 transform hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 mt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">New to Library?</h3>
            <p className="text-gray-300 mb-4">Create an account to get started</p>
            <button
              onClick={handleCreateAccount}
              className="group relative w-full flex items-center justify-center py-3 px-4 border border-[#E9534B] text-sm font-medium rounded-lg text-white hover:bg-[#E9534B] transition-all duration-300 hover:shadow-lg hover:shadow-[#E9534B]/30 transform hover:-translate-y-0.5"
            >
              <FiUserPlus className="w-5 h-5 mr-2" />
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 