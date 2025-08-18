import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { ThemeProvider } from './context/ThemeContext';

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
