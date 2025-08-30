import { useState, useEffect, useRef } from 'react';
import { useSelectedTemplate, useDeviceType, useEditorStore } from '../store/editorStore';
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
  const setSelectedTemplate = useEditorStore(state => state.setSelectedTemplate);
  const [language, setLanguage] = useState('en');
  const websiteRef = useRef<HTMLDivElement>(null);
  const [trackedElements, setTrackedElements] = useState<HTMLElement[]>([]);

  // Get the current page component
  const pageId = selectedTemplate || 'home';
  const PageComponent = PAGE_COMPONENTS[pageId as keyof typeof PAGE_COMPONENTS] || HomePage;

  // Apply editing overlays and click handling for all elements (always edit mode)
  useEffect(() => {
    if (!websiteRef.current) return;

    const root = websiteRef.current;

    // Select all potential elements except unsafe/irrelevant ones
    const nodeList = root.querySelectorAll('*') as NodeListOf<HTMLElement>;
    const elements = Array.from(nodeList).filter(el => !['HTML','HEAD','BODY','SCRIPT','STYLE','LINK','META'].includes(el.tagName));

    elements.forEach((element, index) => {
      // Assign stable id/type
      const tag = element.tagName.toLowerCase();
      const elementId = element.getAttribute('data-editor-id') || `${pageId}-${tag}-${index}`;
      element.setAttribute('data-editor-id', elementId);
      element.setAttribute('data-editor-type', tag);

      // Apply saved edits
      editingService.applyElementEdits(element, elementId, pageId);

      // Hover styles via class
      const handleMouseEnter = () => {
        element.classList.add('editor-hover');
      };
      const handleMouseLeave = () => {
        element.classList.remove('editor-hover');
      };

      const handleClick = (e: MouseEvent) => {
        const isLink = element instanceof HTMLAnchorElement || element.closest('a');
        const anchor = (element instanceof HTMLAnchorElement ? element : element.closest('a')) as HTMLAnchorElement | null;
        const forceNavigate = e.metaKey || e.ctrlKey;

        // Prevent bubbling so ancestors are not selected
        if (!forceNavigate) {
          e.preventDefault();
          e.stopPropagation();
        }

        if (isLink && anchor) {
          const hrefAttr = anchor.getAttribute('href') || '';
          const isExternal = /^(https?:)?\/\//.test(hrefAttr);
          const isInternalRoute = hrefAttr.startsWith('/') && !hrefAttr.startsWith('//');

          if (forceNavigate) {
            e.preventDefault();
            e.stopPropagation();
            if (isExternal) {
              window.open(hrefAttr, '_blank');
              return;
            }
            if (isInternalRoute) {
              const page = hrefAttr === '/' ? 'home' : hrefAttr.replace(/^\//, '');
              setSelectedTemplate(page);
              return;
            }
          } else {
            // Prevent navigation and open editor
            e.preventDefault();
            e.stopPropagation();
          }
        }

        if (!forceNavigate) {
          // Remove existing selection
          elements.forEach(el => el.classList.remove('editor-selected'));
          element.classList.add('editor-selected');
          const elementType = element.getAttribute('data-editor-type') || tag;
          (element as any)._editorData = { id: elementId, type: elementType, pageId };
          onElementClick?.(element, elementType);
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('click', handleClick);

      (element as any)._editorEventListeners = {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave,
        click: handleClick
      };
    });

    setTrackedElements(elements);

    return () => {
      elements.forEach(element => {
        const listeners = (element as any)._editorEventListeners;
        if (listeners) {
          element.removeEventListener('mouseenter', listeners.mouseenter);
          element.removeEventListener('mouseleave', listeners.mouseleave);
          element.removeEventListener('click', listeners.click);
          delete (element as any)._editorEventListeners;
        }
        element.classList.remove('editor-hover');
        element.classList.remove('editor-selected');
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

          .live-website-renderer [data-editor-id] { transition: outline-color 120ms ease, background-color 120ms ease; }
          .live-website-renderer .editor-hover { outline: 2px dashed #3b82f6; outline-offset: 2px; background-color: rgba(59,130,246,0.06); }
          .live-website-renderer .editor-selected { outline: 2px solid #3b82f6; outline-offset: 2px; background-color: rgba(59,130,246,0.08); }
          .live-website-renderer [data-editor-id].editor-hover::after {
            content: attr(data-editor-type);
            position: absolute;
            top: -20px;
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
        `
      }} />
    </div>
  );
}
