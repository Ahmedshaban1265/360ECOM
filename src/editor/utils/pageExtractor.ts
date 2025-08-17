import { TemplateDocument, SectionInstance } from '../types';
import { DEFAULT_THEME_TOKENS } from '../defaults/templates';
import { getPageContent, contentToSections } from './contentExtractor.js';

// Real page mappings to routes
export const REAL_PAGE_MAPPINGS: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  contact: '/contact',
  team: '/team',
  clients: '/clients',
  testimonials: '/testimonials',
  'case-studies': '/case-studies',
  'our-projects': '/our-projects',
  '360academy': '/360academy',
  booking: '/booking',
  results: '/results'
};

/**
 * Extract content structure from real page components and convert to editor sections
 */
export function extractPageContent(pageComponent: any, pageId: string): TemplateDocument {
  // Get dynamic content from the actual website pages
  const pageContent = getPageContent(pageId);
  
  // Convert page content to editor sections
  const sections: SectionInstance[] = contentToSections(pageContent, pageId);
  
  // Return the template document
  return {
    id: pageId,
    sections,
    themeTokens: DEFAULT_THEME_TOKENS,
    locale: 'en',
    version: 1,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Get list of available real pages
 */
export function getRealPagesList() {
  return [
    { id: 'home', name: 'Home Page', icon: '🏠', route: '/' },
    { id: 'about', name: 'About Page', icon: 'ℹ️', route: '/about' },
    { id: 'services', name: 'Services Page', icon: '⚙️', route: '/services' },
    { id: 'contact', name: 'Contact Page', icon: '📞', route: '/contact' },
    { id: 'team', name: 'Team Page', icon: '👥', route: '/team' },
    { id: 'clients', name: 'Clients Page', icon: '🏢', route: '/clients' },
    { id: 'testimonials', name: 'Testimonials Page', icon: '💬', route: '/testimonials' },
    { id: 'case-studies', name: 'Case Studies Page', icon: '📊', route: '/case-studies' },
    { id: 'our-projects', name: 'Projects Page', icon: '🚀', route: '/our-projects' },
    { id: '360academy', name: '360Academy Page', icon: '🎓', route: '/360academy' },
    { id: 'booking', name: 'Booking Page', icon: '📅', route: '/booking' },
    { id: 'results', name: 'Results Page', icon: '📈', route: '/results' }
  ];
}
