import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginCom({ onLoginSuccess }) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [toast, setToast] = useState({ 
    message: '', 
    type: '', 
    visible: false 
  });

  // Toast Component
  const Toast = ({ message, type, visible }) => {
    if (!visible) return null;

    const bgColor = type === 'success' 
      ? 'bg-green-500' 
      : 'bg-red-500';

    return (
      <div className={`fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center z-50 animate-bounce`}>
        {type === 'success' 
          ? <CheckCircle2 className="mr-2" /> 
          : <AlertCircle className="mr-2" />
        }
        {message}
      </div>
    );
  };

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setErrors({});
    setRegistrationRequired(false);

    // Validation
    const newErrors = {};
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    // Check if there are any validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Retrieve registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Find user by email
    const user = registeredUsers.find(u => u.email === loginData.email);

    // Validate user credentials
    if (!user) {
      // No user found - suggest registration
      setRegistrationRequired(true);
      return;
    }

    // Check password
    if (user.password !== loginData.password) {
      setErrors({
        password: 'Incorrect password'
      });
      return;
    }

    // Successful login
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    
    // Show success toast
    showToast('Login Successful', 'success');
    
    // Delay to show toast before page refresh
    setTimeout(() => {
      // Call login success callback
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      // Refresh the page
      window.location.reload();
    }, 1500);
  };

  // Forgot password handler
  const handleForgotPassword = () => {
    alert('Forgot Password functionality to be implemented');
  };

  // If registration is required, render a message with a link to register
  if (registrationRequired) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-white">
        <div className="bg-gray-800 p-8 rounded-xl text-center">
          <h2 className="text-white text-xl mb-4">No account found</h2>
          <p className="text-gray-300 mb-6">You need to register before logging in.</p>
          <button 
            onClick={() => {
              // Call onRegistrationRequired if provided
              if (onLoginSuccess && onLoginSuccess.onRegistrationRequired) {
                onLoginSuccess.onRegistrationRequired();
              }
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-white">
      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        visible={toast.visible} 
      />

      <div className="bg-gradient-to-r from-white to-black rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-sm mx-auto bg-gray-900 p-6 rounded-lg">
          <p className="text-center text-white text-xl mb-6">Login</p>
          
          <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-xl shadow-inner">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"
              />
            </svg>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              className={`input-field w-full bg-transparent text-gray-300 p-3 rounded-lg focus:outline-none ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Email"
              required
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <div className="flex items-center gap-2 bg-gray-800 p-3 rounded-xl shadow-inner">
            <svg
              viewBox="0 0 16 16"
              fill="currentColor"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
              />
            </svg>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className={`input-field w-full bg-transparent text-gray-300 p-3 rounded-lg focus:outline-none ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Password"
              required
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <div className="flex justify-between gap-4 mt-6">
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
          
          <button 
            type="button"
            onClick={handleForgotPassword}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Forgot Password
          </button>
        </form>
      </div>
    </div>
  );
}