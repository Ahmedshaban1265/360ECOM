import { useState, useEffect, useRef } from 'react';
import { useSelectedTemplate, useDeviceType } from '../store/editorStore';
import { editingService } from '../services/EditingService';
import { elementDiscoveryService } from '../services/ElementDiscoveryService';

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
  const [editableElements, setEditableElements] = useState<ReturnType<typeof elementDiscoveryService.getAllElements>>([] as any);

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

      // Add click handlers directly to elements
      discoveredElements.forEach(editableElement => {
        const { element } = editableElement;
        
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
          e.preventDefault();
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
      className={`live-website-renderer ${getResponsiveClass()}`}
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

      {/* Responsive utilities overlay */}
      {deviceType !== 'desktop' && (
        <div className="responsive-utils">
          <div>Device: {deviceType}</div>
          <div>Width: {deviceType === 'mobile' ? '375px' : '768px'}</div>
          <div>Breakpoint: {deviceType === 'mobile' ? 'sm' : 'md'}</div>
        </div>
      )}

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

          /* Keep anchor tags clickable for editor selection; we prevent default in JS */

          /* Enhanced responsive behavior */
          .editor-responsive-mode {
            transform-origin: top left;
            overflow-x: hidden;
          }

          .editor-responsive-mode .container {
            max-width: 100% !important;
            margin: 0 auto !important;
          }

          .editor-responsive-mode .grid {
            display: grid !important;
          }

          /* Mobile-specific responsive utilities */
          .mobile-viewport .hidden-mobile,
          .mobile-viewport .md\\:block,
          .mobile-viewport .lg\\:block {
            display: none !important;
          }

          .mobile-viewport .block-mobile,
          .mobile-viewport .md\\:hidden,
          .mobile-viewport .lg\\:hidden {
            display: block !important;
          }

          /* Tablet-specific responsive utilities */
          .tablet-viewport .hidden-tablet,
          .tablet-viewport .lg\\:block {
            display: none !important;
          }

          .tablet-viewport .block-tablet,
          .tablet-viewport .lg\\:hidden {
            display: block !important;
          }

          /* Force responsive grid layouts */
          .mobile-viewport .grid-cols-1,
          .mobile-viewport .grid-cols-2,
          .mobile-viewport .grid-cols-3,
          .mobile-viewport .grid-cols-4 {
            grid-template-columns: 1fr !important;
          }

          .tablet-viewport .grid-cols-1 {
            grid-template-columns: 1fr !important;
          }

          .tablet-viewport .grid-cols-2,
          .tablet-viewport .grid-cols-3,
          .tablet-viewport .grid-cols-4 {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          /* Responsive spacing utilities */
          .mobile-viewport .p-4,
          .mobile-viewport .px-4,
          .mobile-viewport .py-4 {
            padding: 0.75rem !important;
          }

          .mobile-viewport .m-4,
          .mobile-viewport .mx-4,
          .mobile-viewport .my-4 {
            margin: 0.5rem !important;
          }

          .tablet-viewport .p-4,
          .tablet-viewport .px-4,
          .tablet-viewport .py-4 {
            padding: 1rem !important;
          }

          .tablet-viewport .m-4,
          .tablet-viewport .mx-4,
          .tablet-viewport .my-4 {
            margin: 0.75rem !important;
          }

          /* Responsive text sizing */
          .mobile-viewport .text-lg {
            font-size: 1rem !important;
          }

          .mobile-viewport .text-xl {
            font-size: 1.125rem !important;
          }

          .mobile-viewport .text-2xl {
            font-size: 1.25rem !important;
          }

          .mobile-viewport .text-3xl {
            font-size: 1.5rem !important;
          }

          .tablet-viewport .text-lg {
            font-size: 1.125rem !important;
          }

          .tablet-viewport .text-xl {
            font-size: 1.25rem !important;
          }

          .tablet-viewport .text-2xl {
            font-size: 1.5rem !important;
          }

          .tablet-viewport .text-3xl {
            font-size: 1.875rem !important;
          }

          /* Responsive navigation */
          .mobile-viewport nav {
            padding: 0.5rem 0.75rem !important;
          }

          .tablet-viewport nav {
            padding: 0.75rem 1rem !important;
          }

          /* Responsive images */
          .mobile-viewport img {
            max-width: 100% !important;
            height: auto !important;
          }

          .tablet-viewport img {
            max-width: 100% !important;
            height: auto !important;
          }

          /* Responsive buttons */
          .mobile-viewport button {
            padding: 0.5rem 1rem !important;
            font-size: 0.875rem !important;
          }

          .tablet-viewport button {
            padding: 0.75rem 1.5rem !important;
            font-size: 1rem !important;
          }

          /* Responsive forms */
          .mobile-viewport input,
          .mobile-viewport textarea,
          .mobile-viewport select {
            padding: 0.5rem !important;
            font-size: 0.875rem !important;
          }

          .tablet-viewport input,
          .tablet-viewport textarea,
          .tablet-viewport select {
            padding: 0.75rem !important;
            font-size: 1rem !important;
          }
        `
      }} />
    </div>
  );
}
