import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import EditButton from '@/components/EditButton';
import { useAuth } from './context/AuthContext';
import { useContent } from './context/ContentContext';

// UI Components
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// Pages
import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import AboutPage from '@/pages/AboutPage';
import ClientsPage from '@/pages/ClientsPage';
import TeamPage from '@/pages/TeamPage';
import ResultsPage from '@/pages/ResultsPage';
import TestimonialsPage from '@/pages/TestimonialsPage';
import ContactPage from '@/pages/ContactPage';
import CaseStudiesPage from '@/pages/CaseStudiesPage';
import ProjectsPage from '@/pages/ProjectsPage';
import BookingPage from '@/pages/BookingPage';
// import ArabicExample from '@/pages/ArabicExample';
import AcademyPage from '@/pages/AcademyPage';

// Admin
import AdminLogin from '@/pages/AdminLogin';
import AdminRoute from '@/components/AdminRoute';
import AdminEditor from '@/editor/routes/AdminEditor';

function useCurrentPage(setCurrentPage) {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
    setCurrentPage(path);
  }, [location, setCurrentPage]);
}

function AppContent() {
  const [language, setLanguage] = useState('en');
  const [isDark, setIsDark] = useState(true);
  const location = useLocation();

  const { isAuthenticated } = useAuth();
  const {
    editMode,
    currentPage,
    setCurrentPage,
    pages,
    draftPages,
    updateDraftPage
  } = useContent();

  useCurrentPage(setCurrentPage);

  // Check if we're in the theme editor
  const isInThemeEditor = location.pathname === '/admin/editor';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hide navigation in theme editor */}
      {!isInThemeEditor && (
        <Navigation
          language={language}
          setLanguage={setLanguage}
          isDark={isDark}
          setIsDark={setIsDark}
        />
      )}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage language={language} />} />
        <Route path="/services" element={<ServicesPage language={language} />} />
        <Route path="/about" element={<AboutPage language={language} />} />
        <Route path="/clients" element={<ClientsPage language={language} />} />
        <Route path="/team" element={<TeamPage language={language} />} />
        <Route path="/results" element={<ResultsPage language={language} />} />
        <Route path="/testimonials" element={<TestimonialsPage language={language} />} />
        <Route path="/contact" element={<ContactPage language={language} />} />
        <Route path="/case-studies" element={<CaseStudiesPage language={language} />} />
        <Route path="/our-projects" element={<ProjectsPage language={language} />} />
        <Route path="/360academy" element={<AcademyPage language={language} />} />
        <Route path="/booking" element={<BookingPage language={language} />} />
        {/* <Route path="/arabic-example" element={<ArabicExample />} /> */}

        {/* Admin login */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Theme Editor */}
        <Route path="/admin/editor" element={<AdminEditor />} />
      </Routes>

      {/* Hide footer in theme editor */}
      {!isInThemeEditor && <Footer language={language} />}

      {isAuthenticated && <EditButton />}

      {editMode && (
        <div className="fixed inset-0 bg-white z-[9999] overflow-auto">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Legacy Edit Mode</h2>
            <p className="text-muted-foreground mb-4">
              This edit mode has been replaced with the new Theme Editor.
            </p>
            <a
              href="/admin/editor"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Open Theme Editor
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      {/* Admin Protected Routes could be wrapped here */}
      <AppContent />
    </Router>
  );
}
