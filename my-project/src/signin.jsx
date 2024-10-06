import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import axios from 'axios';

const SignIn = () => {
  const [isNewUser, setIsNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/user/parse/${searchTerm}`
      );
      const { message } = response.data;
      const userExists = message === "Found!";

      if (isNewUser) {
        if (userExists) {
          setError('An account with this username already exists. Please choose a different username.');
        } else {
          // Account creation successful
          navigate('/study');
        }
      } else {
        if (userExists) {
          // Login successful
          navigate('/study');
        } else {
          setError('No account found with this username. Please create an account.');
        }
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNewUser) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }
    handleSearch(username);
  };

  const toggleNewUser = () => {
    setIsNewUser(!isNewUser);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-6xl font-bold text-gray-800 text-center">Need help studying?</h1>
          <p className="mt-2 text-center text-xl text-gray-600">
            Sign in to save your progress and access your study materials anytime.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="username" className="sr-only">Username</label>
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm pl-10"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm pl-10"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {isNewUser && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm pl-10"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isNewUser ? "Create Account" : "Sign In")}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button onClick={toggleNewUser} className="font-medium text-orange-600 hover:text-orange-500">
            {isNewUser ? "Already have an account? Sign In" : "New user? Create account"}
          </button>
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-gray-600">
        Your files are secure and private. We don't share your study materials.
      </p>
    </div>
  );
};

export default SignIn;