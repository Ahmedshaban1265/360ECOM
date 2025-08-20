import { useState, useEffect, useRef } from 'react';
import { useSelectedTemplate, useDeviceType } from '../store/editorStore';
import { editingService } from '../services/EditingService';

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
  const [language, setLanguage] = useState('en');
  const [isDark, setIsDark] = useState(false);
  const websiteRef = useRef<HTMLDivElement>(null);
  const [editableElements, setEditableElements] = useState<HTMLElement[]>([]);

  // Get the current page component
  const pageId = selectedTemplate || 'home';
  const PageComponent = PAGE_COMPONENTS[pageId as keyof typeof PAGE_COMPONENTS] || HomePage;

  // Apply editing overlays and make elements clickable
  useEffect(() => {
    if (!websiteRef.current) return;

    const websiteElement = websiteRef.current;

    // Find all editable elements (headings, paragraphs, images, etc.)
    const editableSelectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'small', 'strong', 'em',
      'img', 'picture', 'source',
      'a', 'button', 'li', 'blockquote', 'figcaption',
      '[data-editable]',
      '.editable'
    ];

    const elements = websiteElement.querySelectorAll(editableSelectors.join(', ')) as NodeListOf<HTMLElement>;
    const editableElementsArray = Array.from(elements);

    // Add editing overlay and click handlers
    editableElementsArray.forEach((element, index) => {
      // Generate unique ID based on element content and position
      const elementId = `${pageId}-${element.tagName.toLowerCase()}-${index}`;
      element.setAttribute('data-editor-id', elementId);
      element.setAttribute('data-editor-type', element.tagName.toLowerCase());

      // Apply saved edits to this element
      editingService.applyElementEdits(element, elementId, pageId);
      
      // Add hover effect
      element.style.cursor = 'pointer';
      element.style.transition = 'all 0.2s ease';
      
      const handleMouseEnter = () => {
        element.style.outline = '2px dashed #3b82f6';
        element.style.outlineOffset = '2px';
        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      };

      const handleMouseLeave = () => {
        element.style.outline = 'none';
        element.style.backgroundColor = 'transparent';
      };

      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Remove previous selections
        editableElementsArray.forEach(el => {
          el.style.outline = 'none';
          el.style.backgroundColor = 'transparent';
        });
        
        // Highlight selected element
        element.style.outline = '2px solid #3b82f6';
        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        
        // Call the click handler
        if (onElementClick) {
          const elementType = element.getAttribute('data-editor-type') || 'unknown';
          const elementId = element.getAttribute('data-editor-id') || `unknown-${index}`;
          onElementClick(element, elementType);

          // Store reference to selected element for editing
          (element as any)._editorData = {
            id: elementId,
            type: elementType,
            pageId: pageId
          };
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('click', handleClick);

      // Store event listeners for cleanup
      (element as any)._editorEventListeners = {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
        click: handleClick
      };
    });

    setEditableElements(editableElementsArray);

    // Cleanup function
    return () => {
      editableElementsArray.forEach(element => {
        const listeners = (element as any)._editorEventListeners;
        if (listeners) {
          element.removeEventListener('mouseenter', listeners.mouseenter);
          element.removeEventListener('mouseleave', listeners.mouseleave);
          element.removeEventListener('click', listeners.click);
          delete (element as any)._editorEventListeners;
        }
        
        // Reset styles
        element.style.outline = 'none';
        element.style.backgroundColor = 'transparent';
        element.style.cursor = 'default';
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
        return 'mobile-viewport';
      case 'tablet':
        return 'tablet-viewport';
      default:
        return 'desktop-viewport';
    }
  };

  return (
    <div
      ref={websiteRef}
      className={`live-website-renderer ${getResponsiveClass()}`}
      style={getDeviceStyles()}
    >
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

      {/* Editing overlay styles */}
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

          .live-website-renderer a {
            pointer-events: none;
          }

          .live-website-renderer button {
            pointer-events: auto;
          }
        `
      }} />
    </div>
  );
}
