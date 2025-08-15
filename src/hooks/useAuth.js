import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    
    // Check if session is still valid (24 hours)
    if (isAuth && loginTime) {
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (currentTime - parseInt(loginTime) < sessionDuration) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        logout();
      }
    }
    
    setIsLoading(false);
  };

  const login = () => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    localStorage.setItem('adminLoginTime', Date.now().toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };
};

export default useAuth;

