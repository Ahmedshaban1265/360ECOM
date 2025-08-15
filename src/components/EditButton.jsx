// src/components/EditButton.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, ChevronLeft, ChevronRight, LogOut, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContent } from '@/context/ContentContext';

export default function EditButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { editMode, setEditMode, startEditing, publishPage } = useContent();

  const pages = [
    { key: 'home', name: 'Home Page', path: '/' },
    { key: 'services', name: 'Services Page', path: '/services' },
    { key: 'about', name: 'About Page', path: '/about' },
    { key: 'clients', name: 'Clients Page', path: '/clients' },
    { key: 'case-studies', name: 'Case Studies', path: '/case-studies' },
    { key: 'projects', name: 'Projects Page', path: '/our-projects' },
    { key: 'testimonials', name: 'Testimonials', path: '/testimonials' },
    { key: 'contact', name: 'Contact Page', path: '/contact' }
  ];

  // ✅ الدخول التلقائي لو URL فيه ?edit=true
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editParam = urlParams.get('edit');

    if (editParam === 'true' && isAuthenticated) {
      const currentPageKey = pages.find(p => p.path === location.pathname)?.key;
      if (currentPageKey) {
        startEditing(currentPageKey);
        setEditMode(true);
        setIsExpanded(true); // فتح المينيو تلقائيًا
      }
    }
  }, [location.search, isAuthenticated, location.pathname]);

  const handleEditToggle = () => {
    if (!isAuthenticated) {
      navigate('/admin-login');
      return;
    }

    const currentPageKey = pages.find(p => p.path === location.pathname)?.key;

    if (!editMode) {
      if (currentPageKey) startEditing(currentPageKey);
      setEditMode(true);
      setIsExpanded(true); // فتح المينيو مباشرة
      const url = new URL(window.location);
      url.searchParams.set('edit', 'true');
      window.history.replaceState({}, '', url);
    } else {
      setEditMode(false);
      setIsExpanded(false);
      const url = new URL(window.location);
      url.searchParams.delete('edit');
      window.history.replaceState({}, '', url);
    }
  };

  const handlePageChange = (page) => {
    startEditing(page.key);
    navigate(page.path + '?edit=true');
    setShowPageSelector(false);
    setIsExpanded(true); // يفضل المينيو مفتوح
  };

  const handleLogout = () => {
    logout();
    setEditMode(false);
    setIsExpanded(false);
    navigate('/');
  };

  const handleSave = () => {
    const currentPageKey = pages.find(p => p.path === location.pathname)?.key;
    if (currentPageKey) {
      publishPage(currentPageKey);
      console.log('Changes saved for', currentPageKey);
    }
  };

  if (!isAuthenticated && !editMode && !location.search.includes('edit=true')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && editMode && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute bottom-16 right-0 bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[280px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-semibold text-gray-800">Edit Website</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 h-auto"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Page to Edit
                </label>
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setShowPageSelector(!showPageSelector)}
                    className="w-full justify-between text-left"
                  >
                    {pages.find(p => p.path === location.pathname)?.name || 'Select Page'}
                    <ChevronLeft className={`w-4 h-4 transition-transform ${showPageSelector ? 'rotate-90' : ''}`} />
                  </Button>

                  <AnimatePresence>
                    {showPageSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10"
                      >
                        {pages.map((page) => (
                          <button
                            key={page.key}
                            onClick={() => handlePageChange(page)}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors ${
                              location.pathname === page.path ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                            }`}
                          >
                            {page.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={() => setEditMode(false)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Edit Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                onClick={editMode ? () => setIsExpanded(!isExpanded) : handleEditToggle}
                className={`rounded-full w-14 h-14 shadow-2xl transition-all duration-300 ${
                  editMode 
                    ? 'bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {editMode ? (
                  isExpanded ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />
                ) : (
                  <Edit3 className="w-6 h-6" />
                )}
              </Button>

              {editMode && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-900 text-white px-3 py-1 rounded-md text-sm">
            {editMode ? 'Close Edit Menu' : 'Enter Edit Mode'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
