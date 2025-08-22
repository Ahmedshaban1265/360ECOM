import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { ThemeProvider } from './context/ThemeContext';

// Ensure correct theme class is applied before React mounts to avoid light/dark mismatch
(() => {
  try {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(savedTheme);
  } catch {}
})();

// In dev, import and run editor tests in the browser
if (import.meta.env.DEV) {
  import('./editor/test/editorTest.js').then(mod => {
    if (typeof mod.runEditorTests === 'function') {
      mod.runEditorTests();
    }
  });
}

// Also support running tests via URL param in preview/production
try {
  const params = new URLSearchParams(window.location.search);
  if (params.has('runEditorTests')) {
    import('./editor/test/editorTest.js').then(mod => {
      if (typeof mod.runEditorTests === 'function') {
        mod.runEditorTests();
      }
    });
  }
} catch {}

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
