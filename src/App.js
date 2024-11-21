import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Registration from './Pages/Registration';

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

// Authentication Context Provider
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [toast, setToast] = useState({ 
    message: '', 
    type: '', 
    visible: false 
  });

  useEffect(() => {
    // Check if user is logged in when component mounts
    const checkAuthStatus = () => {
      const loggedInUser = localStorage.getItem('loggedInUser');
      setIsAuthenticated(!!loggedInUser);
      setIsInitializing(false);
    };
    
    checkAuthStatus();
  }, []);

  // Show toast notification
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Login method to set authentication
  const login = (userData) => {
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    setIsAuthenticated(true);
    showToast('Login Successful', 'success');
  };

  // Logout method to remove authentication
  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setIsAuthenticated(false);
    showToast('Logged Out Successfully', 'success');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      isInitializing,
      showToast // Expose showToast method
    }}>
      {children}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        visible={toast.visible} 
      />
    </AuthContext.Provider>
  );
};

// Authentication Context
const AuthContext = React.createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  isInitializing: true,
  showToast: () => {}
});

// Custom hook to use authentication context
const useAuth = () => React.useContext(AuthContext);

// Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/Login" state={{ from: location }} replace />
  );
};

// Authentication-Required Route Component
const AuthRequiredRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  // Show loading spinner while checking authentication
  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// Login Page with Automatic Redirection
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleLogin = (userData) => {
    // Perform login logic
    login(userData);

    // Redirect to the page the user was trying to access, or home page
    const origin = location.state?.from?.pathname || '/';
    navigate(origin);
  };

  return <Login onLogin={handleLogin} />;
};

// Modified App Component with Protected Routes
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication Required Routes */}
          <Route element={<AuthRequiredRoute />}>
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Registration" element={<Registration />} />
          </Route>
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            {/* Add more protected routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Export the useAuth hook for use in other components
export { useAuth };