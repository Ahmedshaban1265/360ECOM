import { useState, useEffect, useRef } from 'react';
import { useSelectedTemplate, useDeviceType } from '../store/editorStore';
import { editingService } from '../services/EditingService';
import { buildCssPathFromRoot, findSelectableElement } from '../utils/domPath';

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
  const selectedElRef = useRef<HTMLElement | null>(null);

  // Get the current page component
  const pageId = selectedTemplate || 'home';
  const PageComponent = PAGE_COMPONENTS[pageId as keyof typeof PAGE_COMPONENTS] || HomePage;

  // Apply saved edits to entire root and attach delegated listeners for selection
  useEffect(() => {
    const root = websiteRef.current;
    if (!root) return;

    // Apply all saved edits using path-based targeting
    editingService.applyAllEditsToRoot(root, pageId);

    // Delegated hover/selection handlers
    const handleMouseOver = (evt: MouseEvent) => {
      const target = evt.target as Element | null;
      const el = findSelectableElement(target, root);
      if (!el) return;
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.12s ease';
      el.style.outline = '2px dashed #3b82f6';
      el.style.outlineOffset = '2px';
    };

    const handleMouseOut = (evt: MouseEvent) => {
      const target = evt.target as HTMLElement | null;
      if (!target) return;
      // Avoid clearing outline for the currently selected element
      if (selectedElRef.current && target === selectedElRef.current) return;
      target.style.outline = 'none';
      target.style.outlineOffset = '0px';
    };

    const handleClick = (evt: MouseEvent) => {
      // Prevent navigation but allow button interactions to be captured logically
      evt.preventDefault();
      evt.stopPropagation();
      const target = evt.target as Element | null;
      const el = findSelectableElement(target, root);
      if (!el) return;

      // Clear previous selection styles
      if (selectedElRef.current && selectedElRef.current !== el) {
        selectedElRef.current.style.outline = 'none';
        selectedElRef.current.style.backgroundColor = 'transparent';
      }

      // Compute and attach metadata
      const path = buildCssPathFromRoot(root, el);
      const type = el.tagName.toLowerCase();
      const idAttr = (el as HTMLElement).getAttribute('data-editor-id') || undefined;
      (el as any)._editorData = {
        path,
        type,
        pageId,
        id: idAttr
      };

      // Visual selection
      el.style.outline = '2px solid #3b82f6';
      el.style.backgroundColor = 'rgba(59, 130, 246, 0.08)';
      selectedElRef.current = el as HTMLElement;

      if (onElementClick) {
        onElementClick(el as HTMLElement, type);
      }
    };

    root.addEventListener('mouseover', handleMouseOver, true);
    root.addEventListener('mouseout', handleMouseOut, true);
    root.addEventListener('click', handleClick, true);

    return () => {
      root.removeEventListener('mouseover', handleMouseOver, true);
      root.removeEventListener('mouseout', handleMouseOut, true);
      root.removeEventListener('click', handleClick, true);
      if (selectedElRef.current) {
        selectedElRef.current.style.outline = 'none';
        selectedElRef.current.style.backgroundColor = 'transparent';
        selectedElRef.current = null;
      }
    };
  }, [selectedTemplate, onElementClick, pageId]);

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
          
          .live-website-renderer a { text-decoration: inherit; }
        `
      }} />
    </div>
  );
}
