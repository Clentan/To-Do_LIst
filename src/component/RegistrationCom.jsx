import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegistrationCom({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ 
    message: '', 
    type: '', 
    visible: false 
  });

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Firstname and Lastname validation
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required';
    }
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Enhanced Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must: be 8+ chars, include uppercase, lowercase, number, special char';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   

    if (validateForm()) {
      setIsLoading(true);

      // Simulate server registration with timeout
      setTimeout(() => {
        // Store user data in localStorage
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        
        // Check if email already exists
        const existingUser = users.find(user => user.email === formData.email);
        if (existingUser) {
          setErrors(prev => ({
            ...prev,
            email: 'Email already registered'
          }));
          setIsLoading(false);
          showToast('Registration failed', 'error');
          return;
        }

        // Create new user object (excluding confirm password)
        const newUser = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password
        };

        // Add new user and save to localStorage
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users));

        // Set logged in user in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));

        // Show success toast
        showToast('Registration Successful', 'success');
        setFormData("")

        // Call registration success callback
        if (onRegistrationSuccess) {
          onRegistrationSuccess(newUser);
        }

        setIsLoading(false);
      }, 3000);
    }
  };

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 relative">
      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        visible={toast.visible} 
      />

      <form onSubmit={handleSubmit} className="form w-96 p-8 bg-gray-800 rounded-lg">
        <p className="title text-2xl text-white font-bold mb-4">Register</p>
        <p className="message text-gray-400 mb-6">Register now and get full access to our app.</p>
        
        <div className="flex gap-4 mb-4">
          <label className="flex-1">
            <input 
              name="firstname"
              className={`input w-full p-2 rounded bg-gray-700 text-white ${errors.firstname ? 'border-red-500' : ''}`}
              type="text" 
              value={formData.firstname}
              onChange={handleChange}
              required 
            />
            <span className="text-gray-400">Firstname</span>
            {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
          </label>
          
          <label className="flex-1">
            <input 
              name="lastname"
              className={`input w-full p-2 rounded bg-gray-700 text-white ${errors.lastname ? 'border-red-500' : ''}`}
              type="text"
              value={formData.lastname}
              onChange={handleChange}
              required 
            />
            <span className="text-gray-400">Lastname</span>
            {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
          </label>
        </div>
        
        <label className="block mb-4">
          <input 
            name="email"
            className={`input w-full p-2 rounded bg-gray-700 text-white ${errors.email ? 'border-red-500' : ''}`}
            type="email"
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <span className="text-gray-400">Email</span>
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </label>
        
        <label className="block mb-4">
          <input 
            name="password"
            className={`input w-full p-2 rounded bg-gray-700 text-white ${errors.password ? 'border-red-500' : ''}`}
            type="password"
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <span className="text-gray-400">Password</span>
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </label>
        
        <label className="block mb-4">
          <input 
            name="confirmPassword"
            className={`input w-full p-2 rounded bg-gray-700 text-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
          />
          <span className="text-gray-400">Confirm password</span>
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
        </label>
        
        <button 
          className="submit w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition relative" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
              Registering...
            </div>
          ) : (
            'Submit'
          )}
        </button>
        
        <p className="signin text-gray-400 mt-4 text-center">
          Already have an account? <span className="text-blue-400 cursor-pointer">Registered!!</span>
        </p>
      </form>
    </div>
  );
}