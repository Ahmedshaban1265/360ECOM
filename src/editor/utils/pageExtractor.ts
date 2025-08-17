import { TemplateDocument, SectionInstance } from '../types';
import { DEFAULT_THEME_TOKENS } from '../defaults/templates';

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
  const sections: SectionInstance[] = [];
  
  // For now, create a basic structure that can be edited
  // This would be expanded to actually parse the React component structure
  
  switch (pageId) {
    case 'home':
      sections.push(
        {
          id: 'hero-home',
          type: 'hero',
          settings: {
            title: 'Transform Your Digital Presence',
            subtitle: 'Professional digital marketing solutions that drive real results',
            buttonText: 'Get Started Today',
            buttonUrl: '/contact',
            backgroundImage: '',
            alignment: 'center',
            showButton: true
          }
        },
        {
          id: 'stats-section',
          type: 'rich-text',
          settings: {
            content: '<h2>Our Impact in Numbers</h2><p>We deliver measurable results for our clients across all industries.</p>',
            textAlign: 'center',
            maxWidth: '800px'
          }
        },
        {
          id: 'services-preview',
          type: 'cards-grid',
          settings: {
            title: 'Our Core Services',
            subtitle: 'Comprehensive digital solutions',
            columns: 3,
            spacing: 'large'
          },
          blocks: [
            {
              id: 'service-1',
              type: 'feature_card',
              settings: {
                title: 'E-commerce Development',
                description: 'High-converting Shopify stores and custom e-commerce solutions',
                icon: '🛒',
                link: '/services#ecommerce'
              }
            },
            {
              id: 'service-2', 
              type: 'feature_card',
              settings: {
                title: 'Digital Marketing',
                description: 'Data-driven campaigns that generate leads and sales',
                icon: '📈',
                link: '/services#marketing'
              }
            },
            {
              id: 'service-3',
              type: 'feature_card',
              settings: {
                title: 'Web Development',
                description: 'Fast, responsive websites built with modern technologies',
                icon: '💻',
                link: '/services#development'
              }
            }
          ]
        }
      );
      break;
      
    case 'about':
      sections.push(
        {
          id: 'about-hero',
          type: 'hero',
          settings: {
            title: 'About 360ECOM',
            subtitle: 'Your trusted partner in digital transformation',
            backgroundImage: '',
            alignment: 'left',
            showButton: false
          }
        },
        {
          id: 'company-story',
          type: 'image-with-text',
          settings: {
            title: 'Our Story',
            content: 'Founded with a mission to help businesses thrive in the digital age, we combine strategic thinking with technical expertise to deliver exceptional results.',
            imageUrl: '',
            imagePosition: 'left',
            imageAlt: 'Our team at work'
          }
        },
        {
          id: 'values-mission',
          type: 'rich-text',
          settings: {
            content: '<h2>Our Mission</h2><p>To empower businesses with innovative digital solutions that drive growth and success.</p><h2>Our Values</h2><ul><li>Client-first approach</li><li>Innovation and creativity</li><li>Transparency and honesty</li><li>Continuous improvement</li></ul>',
            textAlign: 'left',
            maxWidth: '100%'
          }
        }
      );
      break;
      
    case 'services':
      sections.push(
        {
          id: 'services-hero',
          type: 'hero',
          settings: {
            title: 'Our Services',
            subtitle: 'Comprehensive digital solutions to grow your business',
            backgroundImage: '',
            alignment: 'center',
            showButton: false
          }
        },
        {
          id: 'services-grid',
          type: 'cards-grid',
          settings: {
            title: 'What We Offer',
            columns: 2,
            spacing: 'large'
          },
          blocks: [
            {
              id: 'ecommerce-service',
              type: 'service_card',
              settings: {
                title: 'E-commerce Development',
                description: 'Custom Shopify stores, WooCommerce solutions, and marketplace integrations',
                features: ['Shopify Plus Development', 'Custom Theme Design', 'App Integration', 'Performance Optimization'],
                icon: '🛒'
              }
            },
            {
              id: 'marketing-service',
              type: 'service_card', 
              settings: {
                title: 'Digital Marketing',
                description: 'ROI-focused marketing campaigns across all digital channels',
                features: ['Google Ads Management', 'Social Media Marketing', 'Email Campaigns', 'SEO Optimization'],
                icon: '📈'
              }
            }
          ]
        }
      );
      break;
      
    case 'contact':
      sections.push(
        {
          id: 'contact-hero',
          type: 'hero',
          settings: {
            title: 'Get In Touch',
            subtitle: 'Ready to grow your business? Let\'s discuss your project',
            backgroundImage: '',
            alignment: 'center',
            showButton: false
          }
        },
        {
          id: 'contact-form',
          type: 'rich-text',
          settings: {
            content: '<h2>Contact Form</h2><p>Fill out the form below and we\'ll get back to you within 24 hours.</p>',
            textAlign: 'center',
            maxWidth: '600px'
          }
        },
        {
          id: 'contact-info',
          type: 'cards-grid',
          settings: {
            title: 'Contact Information',
            columns: 3,
            spacing: 'medium'
          },
          blocks: [
            {
              id: 'email-contact',
              type: 'contact_card',
              settings: {
                title: 'Email Us',
                description: 'hello@360ecom.com',
                icon: '📧'
              }
            },
            {
              id: 'phone-contact',
              type: 'contact_card',
              settings: {
                title: 'Call Us',
                description: '+1 (234) 567-890',
                icon: '📞'
              }
            },
            {
              id: 'office-contact',
              type: 'contact_card',
              settings: {
                title: 'Visit Us',
                description: '123 Business St, City, Country',
                icon: '📍'
              }
            }
          ]
        }
      );
      break;
      
    default:
      // Generic template for other pages
      sections.push(
        {
          id: `${pageId}-hero`,
          type: 'hero',
          settings: {
            title: `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page`,
            subtitle: `Content for the ${pageId} page`,
            backgroundImage: '',
            alignment: 'center',
            showButton: false
          }
        },
        {
          id: `${pageId}-content`,
          type: 'rich-text',
          settings: {
            content: `<h2>Page Content</h2><p>This is the main content area for the ${pageId} page. You can edit this content using the theme editor.</p>`,
            textAlign: 'left',
            maxWidth: '100%'
          }
        }
      );
  }

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
