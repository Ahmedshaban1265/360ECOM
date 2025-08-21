import { useState, useEffect, useRef } from 'react';
import { useSelectedTemplate, useDeviceType } from '../store/editorStore';
import { editingService } from '../services/EditingService';
import { elementDiscoveryService } from '../services/ElementDiscoveryService';
import type { EditableElement } from '../services/ElementDiscoveryService';
import { useTheme } from '@/context/ThemeContext';

// Import actual website pages
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
import AcademyPage from '@/pages/AcademyPage';

// Import Navigation and Footer for full website experience
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface LiveWebsiteRendererProps {
  onElementClick?: (element: HTMLElement, elementType: string) => void;
}

const PAGE_COMPONENTS = {
  'home': HomePage,
  'services': ServicesPage,
  'about': AboutPage,
  'clients': ClientsPage,
  'team': TeamPage,
  'results': ResultsPage,
  'testimonials': TestimonialsPage,
  'contact': ContactPage,
  'case-studies': CaseStudiesPage,
  'our-projects': ProjectsPage,
  'booking': BookingPage,
  '360academy': AcademyPage
};

export default function LiveWebsiteRenderer({ onElementClick }: LiveWebsiteRendererProps) {
  const selectedTemplate = useSelectedTemplate();
  const deviceType = useDeviceType();
  const { theme } = useTheme();
  const [language, setLanguage] = useState('en');
  const [isDark, setIsDark] = useState(false);
  const websiteRef = useRef<HTMLDivElement>(null);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);

  // Get the current page component
  const pageId = selectedTemplate || 'home';
  const PageComponent = PAGE_COMPONENTS[pageId as keyof typeof PAGE_COMPONENTS] || HomePage;

  // Apply editing overlays and make elements clickable
  useEffect(() => {
    if (!websiteRef.current) return;

    const websiteElement = websiteRef.current;
    const pageId = selectedTemplate || 'home';

    // Use ElementDiscoveryService to discover elements
    const timer = setTimeout(() => {
      console.log('LiveWebsiteRenderer: Starting element discovery after delay');
      elementDiscoveryService.setPageId(pageId);
      
      // Discover elements but handle clicks manually for now
      const discoveredElements = elementDiscoveryService.discoverElements();
      setEditableElements(discoveredElements);

      // Apply any saved edits and add click handlers directly to elements
      discoveredElements.forEach(editableElement => {
        const { element } = editableElement;
        // Apply persisted edits for this element
        try {
          editingService.applyElementEdits(element, editableElement.id, pageId);
        } catch (err) {
          console.warn('Failed to apply edits for element', editableElement.id, err);
        }
        
        // Add visual indicators
        element.style.cursor = 'pointer';
        element.setAttribute('data-editable', 'true');
        
        // Add hover effect
        element.addEventListener('mouseenter', () => {
          element.style.outline = '2px solid #3b82f6';
          element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('mouseleave', () => {
          element.style.outline = '';
          element.style.outlineOffset = '';
        });

        // Add click handler
        element.addEventListener('click', (e) => {
          // Prevent navigation for anchor tags (and their children) inside the editor
          const target = e.target as HTMLElement;
          const anchor = target && target.closest ? target.closest('a') : null;
          if (anchor) {
            e.preventDefault();
          }
          e.stopPropagation();
          console.log('LiveWebsiteRenderer: Element clicked:', editableElement);
          if (onElementClick) {
            onElementClick(element, editableElement.type);
          }
        });
      });
    }, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      // Clean up event listeners
      const elements = elementDiscoveryService.getAllElements();
      elements.forEach(editableElement => {
        const { element } = editableElement;
        element.style.cursor = '';
        element.removeAttribute('data-editable');
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    };
  }, [selectedTemplate, onElementClick]);

  // Device-specific styling
  const getDeviceStyles = () => {
    const baseStyles: React.CSSProperties = {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      backgroundColor: 'hsl(var(--background))',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    };

    // For mobile and tablet, we don't need additional styling here
    // as the frame is handled by the PreviewCanvas component
    return baseStyles;
  };

  // Get responsive class based on device type
  const getResponsiveClass = () => {
    switch (deviceType) {
      case 'mobile':
        return 'mobile-viewport editor-responsive-mode';
      case 'tablet':
        return 'tablet-viewport editor-responsive-mode';
      default:
        return 'desktop-viewport';
    }
  };

  // Get viewport meta content based on device type
  const getViewportMeta = () => {
    switch (deviceType) {
      case 'mobile':
        return 'width=375, initial-scale=1, user-scalable=no';
      case 'tablet':
        return 'width=768, initial-scale=1, user-scalable=no';
      default:
        return 'width=device-width, initial-scale=1';
    }
  };

  return (
    <div
      ref={websiteRef}
      className={`live-website-renderer ${getResponsiveClass()} ${theme === 'dark' ? 'dark' : ''}`}
      style={getDeviceStyles()}
    >
      {/* Dynamic viewport meta tag for responsive behavior */}
      <div style={{ display: 'none' }}>
        <meta name="viewport" content={getViewportMeta()} />
      </div>

      {/* Render the actual website with navigation and footer */}
      <div className="min-h-full bg-background text-foreground">
        {/* Navigation */}
        <Navigation
          language={language}
          setLanguage={setLanguage}
          isDark={isDark}
          setIsDark={setIsDark}
        />

        {/* Main Page Content */}
        <main className="website-content">
          <PageComponent language={language} />
        </main>

        {/* Footer */}
        <Footer language={language} />
      </div>

      {/* Enhanced editing overlay styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .live-website-renderer {
            position: relative;
            height: 100%;
            overflow: hidden;
          }

          .live-website-renderer [data-editor-id]:hover {
            position: relative;
          }

          .live-website-renderer [data-editor-id]:hover::after {
            content: attr(data-editor-type);
            position: absolute;
            top: -25px;
            left: 0;
            background: #3b82f6;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            text-transform: uppercase;
            z-index: 1000;
            pointer-events: none;
          }

          /* Allow clicking anchors for editor; prevent navigation via JS */
          .live-website-renderer a { pointer-events: auto; }
          .live-website-renderer button { pointer-events: auto; }

          /* Enhanced responsive behavior */
          .editor-responsive-mode {
            transform-origin: top left;
            overflow-x: hidden;
          }

          .editor-responsive-mode .container {
            max-width: 100% !important;
            margin: 0 auto !important;
          }

          .editor-responsive-mode .grid { display: grid !important; }
        `
      }} />
    </div>
  );
}