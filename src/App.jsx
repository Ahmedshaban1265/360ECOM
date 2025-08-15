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

// Admin
import AdminLogin from '@/pages/AdminLogin';
import AdminRoute from '@/components/AdminRoute';
import GrapesEditor from './components/GrapesEditor';

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation
        language={language}
        setLanguage={setLanguage}
        isDark={isDark}
        setIsDark={setIsDark}
      />

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

        {/* Admin login */}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>

      <Footer language={language} />

      {isAuthenticated && <EditButton />}

      {editMode && (
        <div className="fixed inset-0 bg-white z-[9999] overflow-auto">
          <GrapesEditor
            pageId={currentPage}
            data={draftPages[currentPage] || pages[currentPage] || { html: '', css: '' }}
            onSave={(newData) => updateDraftPage(currentPage, newData)}
          />
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
