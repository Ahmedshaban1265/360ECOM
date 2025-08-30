import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => null,
  isDarkMode: true,
  toggleTheme: () => null
});

export function ThemeProvider({ children, ...props }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Always start editor in dark mode by default; honor saved preference only if present
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme || 'dark');
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    setTheme,
    isDarkMode: theme === 'dark',
    toggleTheme
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
