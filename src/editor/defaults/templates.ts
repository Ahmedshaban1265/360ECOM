import { TemplateDocument, TemplateInfo, ThemeTokens } from '../types';

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  typography: {
    bodyFont: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
    arabicFont: 'Cairo, system-ui, sans-serif'
  },
  spacingScale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  radius: '8px',
  darkMode: false,
  rtl: false
};

export const TEMPLATE_LIST: TemplateInfo[] = [
  {
    id: 'home',
    name: 'Home Page',
    description: 'Main landing page with hero, features, and CTA sections',
    icon: '🏠',
    route: '/'
  },
  {
    id: 'about',
    name: 'About Page',
    description: 'Company information, team, and mission',
    icon: 'ℹ️',
    route: '/about'
  },
  {
    id: 'services',
    name: 'Services Page',
    description: 'Service offerings and packages',
    icon: '⚙️',
    route: '/services'
  },
  {
    id: 'contact',
    name: 'Contact Page',
    description: 'Contact form and company information',
    icon: '📞',
    route: '/contact'
  },
  {
    id: 'blog',
    name: 'Blog Page',
    description: 'Blog listing and article pages',
    icon: '📝',
    route: '/blog'
  },
  {
    id: 'product',
    name: 'Product Page',
    description: 'Product detail and showcase pages',
    icon: '📦',
    route: '/product'
  }
];

export const DEFAULT_HOME_TEMPLATE: TemplateDocument = {
  id: 'home',
  sections: [
    {
      id: 'hero-1',
      type: 'hero',
      settings: {
        title: 'Welcome to Our Amazing Service',
        subtitle: 'We help businesses grow with innovative digital solutions',
        buttonText: 'Get Started',
        buttonUrl: '/contact',
        backgroundImage: '',
        alignment: 'center',
        showButton: true
      }
    },
    {
      id: 'rich-text-1',
      type: 'rich-text',
      settings: {
        content: '<h2>About Our Company</h2><p>We are a leading digital agency focused on delivering exceptional results for our clients. Our team of experts combines creativity with technical excellence to create solutions that drive business growth.</p>',
        textAlign: 'center',
        maxWidth: '800px'
      }
    },
    {
      id: 'cards-1',
      type: 'cards-grid',
      settings: {
        title: 'Our Services',
        columns: 3,
        spacing: 'medium'
      },
      blocks: [
        {
          id: 'card-1',
          type: 'feature_card',
          settings: {
            title: 'Web Development',
            description: 'Custom websites and web applications built with modern technologies',
            icon: '💻',
            link: '/services/web-development'
          }
        },
        {
          id: 'card-2',
          type: 'feature_card',
          settings: {
            title: 'Digital Marketing',
            description: 'Data-driven marketing strategies to grow your online presence',
            icon: '📈',
            link: '/services/digital-marketing'
          }
        },
        {
          id: 'card-3',
          type: 'feature_card',
          settings: {
            title: 'Consulting',
            description: 'Strategic guidance to help your business leverage technology effectively',
            icon: '💡',
            link: '/services/consulting'
          }
        }
      ]
    },
    {
      id: 'cta-1',
      type: 'cta-banner',
      settings: {
        title: 'Ready to Get Started?',
        description: 'Let\'s discuss how we can help your business grow',
        buttonText: 'Contact Us Today',
        buttonUrl: '/contact',
        backgroundColor: 'primary',
        textColor: 'white'
      }
    }
  ],
  themeTokens: DEFAULT_THEME_TOKENS,
  locale: 'en',
  version: 1,
  updatedAt: new Date().toISOString()
};

export const DEFAULT_ABOUT_TEMPLATE: TemplateDocument = {
  id: 'about',
  sections: [
    {
      id: 'hero-about-1',
      type: 'hero',
      settings: {
        title: 'About Our Company',
        subtitle: 'Learn more about our mission, values, and the team behind our success',
        backgroundImage: '',
        alignment: 'left',
        showButton: false
      }
    },
    {
      id: 'image-text-1',
      type: 'image-with-text',
      settings: {
        title: 'Our Story',
        content: 'Founded in 2020, we\'ve been at the forefront of digital innovation, helping businesses transform and grow in the digital age.',
        imageUrl: '',
        imagePosition: 'left',
        imageAlt: 'Our team at work'
      }
    },
    {
      id: 'rich-text-about-1',
      type: 'rich-text',
      settings: {
        content: '<h2>Our Mission</h2><p>To empower businesses with cutting-edge digital solutions that drive growth, efficiency, and success in an ever-evolving marketplace.</p><h2>Our Values</h2><ul><li>Innovation and creativity</li><li>Client-focused approach</li><li>Quality and excellence</li><li>Continuous learning</li></ul>',
        textAlign: 'left',
        maxWidth: '100%'
      }
    }
  ],
  themeTokens: DEFAULT_THEME_TOKENS,
  locale: 'en',
  version: 1,
  updatedAt: new Date().toISOString()
};

export const DEFAULT_TEMPLATES: Record<string, TemplateDocument> = {
  home: DEFAULT_HOME_TEMPLATE,
  about: DEFAULT_ABOUT_TEMPLATE
};

// Initialize default templates in localStorage if they don't exist
export async function initializeDefaultTemplates(): Promise<void> {
  const { storageService } = await import('../services/StorageService');
  
  for (const [templateId, template] of Object.entries(DEFAULT_TEMPLATES)) {
    const existingDraft = await storageService.getDraft(templateId);
    const existingPublished = await storageService.getPublished(templateId);
    
    if (!existingDraft && !existingPublished) {
      await storageService.saveDraft(templateId, template);
      await storageService.publish(templateId, template);
    }
  }
  
  // Initialize global settings if they don't exist
  const existingGlobal = await storageService.getGlobalSettings();
  if (!existingGlobal) {
    await storageService.saveGlobalSettings(DEFAULT_THEME_TOKENS);
  }
}
