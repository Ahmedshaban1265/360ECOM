// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = () => {
    const isAuth = localStorage.getItem('isAdminAuthenticated') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');

    if (isAuth && loginTime) {
      const currentTime = Date.now();
      const sessionDuration = 24 * 60 * 60 * 1000;

      if (currentTime - parseInt(loginTime, 10) < sessionDuration) {
        setIsAuthenticated(true);
      } else {
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
