import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { ThemeProvider } from './context/ThemeContext';

// Ensure correct theme class is applied before React mounts to avoid light/dark mismatch
// Wrap in try/catch and ensure the block is not empty for linters
try {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(savedTheme);
} catch (e) {
  // no-op
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ContentProvider>
          <App />
        </ContentProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
