// Dynamic content extractor that pulls from real website pages
import { REAL_PROJECTS } from '../data/projectsData.js';

/**
 * Extract content from actual website pages and components
 */

// HomePage content structure from actual page component
export const homePageContent = {
  hero: {
    title: "Transform Your Digital Presence",
    subtitle: "Professional digital marketing solutions that drive real results",
    buttonText: "Get Started Today",
    buttonUrl: "/contact"
  },
  stats: {
    title: "Our Impact in Numbers",
    subtitle: "We deliver measurable results for our clients across all industries"
  },
  services: {
    title: "Our Core Services", 
    subtitle: "Comprehensive digital solutions",
    services: [
      {
        title: "E-commerce Development",
        description: "High-converting Shopify stores and custom e-commerce solutions",
        icon: "🛒",
        link: "/services#ecommerce"
      },
      {
        title: "Digital Marketing",
        description: "Data-driven campaigns that generate leads and sales", 
        icon: "📈",
        link: "/services#marketing"
      },
      {
        title: "Web Development",
        description: "Fast, responsive websites built with modern technologies",
        icon: "💻", 
        link: "/services#development"
      }
    ]
  }
};

// AboutPage content from actual page component  
export const aboutPageContent = {
  hero: {
    title: "About 360ECOM",
    subtitle: "Your trusted partner in digital transformation"
  },
  story: {
    title: "Our Story",
    content: "Founded with a mission to help businesses thrive in the digital age, we combine strategic thinking with technical expertise to deliver exceptional results."
  },
  mission: {
    title: "Our Mission",
    content: "To empower businesses with innovative digital solutions that drive growth and success.",
    values: [
      "Client-first approach",
      "Innovation and creativity", 
      "Transparency and honesty",
      "Continuous improvement"
    ]
  }
};

// ServicesPage content
export const servicesPageContent = {
  hero: {
    title: "Our Services",
    subtitle: "Comprehensive digital solutions to grow your business"
  },
  services: [
    {
      title: "E-commerce Development",
      description: "Custom Shopify stores, WooCommerce solutions, and marketplace integrations",
      features: ["Shopify Plus Development", "Custom Theme Design", "App Integration", "Performance Optimization"],
      icon: "🛒"
    },
    {
      title: "Digital Marketing", 
      description: "ROI-focused marketing campaigns across all digital channels",
      features: ["Google Ads Management", "Social Media Marketing", "Email Campaigns", "SEO Optimization"],
      icon: "📈"
    }
  ]
};

// ContactPage content
export const contactPageContent = {
  hero: {
    title: "Get In Touch",
    subtitle: "Ready to grow your business? Let's discuss your project"
  },
  form: {
    title: "Contact Form",
    description: "Fill out the form below and we'll get back to you within 24 hours."
  },
  contactInfo: [
    {
      title: "Email Us",
      description: "hello@360ecom.com",
      icon: "📧"
    },
    {
      title: "Call Us", 
      description: "+1 (234) 567-890",
      icon: "📞"
    },
    {
      title: "Visit Us",
      description: "123 Business St, City, Country",
      icon: "📍"
    }
  ]
};

// ProjectsPage content - use real projects data
export const projectsPageContent = {
  hero: {
    title: "Our Projects",
    subtitle: "Portfolio of Success",
    description: "Explore our latest projects and see how we've helped businesses achieve remarkable growth through innovative solutions."
  },
  projects: REAL_PROJECTS
};

/**
 * Extract dynamic content for any page
 */
export function getPageContent(pageId) {
  switch (pageId) {
    case 'home':
      return homePageContent;
    case 'about':
      return aboutPageContent;
    case 'services':
      return servicesPageContent;
    case 'contact':
      return contactPageContent;
    case 'our-projects':
    case 'projects':
      return projectsPageContent;
    default:
      return {
        hero: {
          title: `${pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page`,
          subtitle: `Welcome to the ${pageId} page`
        }
      };
  }
}

/**
 * Convert page content to editor sections
 */
export function contentToSections(pageContent, pageId) {
  const sections = [];

  // Add hero section if content has hero
  if (pageContent.hero) {
    sections.push({
      id: `${pageId}-hero`,
      type: 'hero',
      settings: {
        title: pageContent.hero.title,
        subtitle: pageContent.hero.subtitle,
        buttonText: pageContent.hero.buttonText || '',
        buttonUrl: pageContent.hero.buttonUrl || '',
        backgroundImage: '',
        alignment: 'center',
        showButton: !!pageContent.hero.buttonText
      }
    });
  }

  // Add services/features section if available
  if (pageContent.services?.services) {
    sections.push({
      id: `${pageId}-services`,
      type: 'cards-grid',
      settings: {
        title: pageContent.services.title,
        subtitle: pageContent.services.subtitle,
        columns: 3,
        spacing: 'large'
      },
      blocks: pageContent.services.services.map((service, index) => ({
        id: `service-${index + 1}`,
        type: 'feature_card',
        settings: {
          title: service.title,
          description: service.description,
          icon: service.icon,
          link: service.link
        }
      }))
    });
  }

  // Add projects collection if available
  if (pageContent.projects) {
    sections.push({
      id: `${pageId}-projects`,
      type: 'collection-grid',
      settings: {
        title: 'Our Work',
        subtitle: 'Check out our latest projects',
        columns: 3,
        showFilters: true,
        itemsPerPage: 9,
        aspectRatio: '4:3'
      }
    });
  }

  // Add contact info if available
  if (pageContent.contactInfo) {
    sections.push({
      id: `${pageId}-contact-info`,
      type: 'cards-grid',
      settings: {
        title: 'Contact Information',
        columns: 3,
        spacing: 'medium'
      },
      blocks: pageContent.contactInfo.map((contact, index) => ({
        id: `contact-${index + 1}`,
        type: 'contact_card',
        settings: {
          title: contact.title,
          description: contact.description,
          icon: contact.icon
        }
      }))
    });
  }

  // Add rich text content if available (story, mission, etc.)
  if (pageContent.story) {
    sections.push({
      id: `${pageId}-story`,
      type: 'image-with-text',
      settings: {
        title: pageContent.story.title,
        content: pageContent.story.content,
        imageUrl: '',
        imagePosition: 'left',
        imageAlt: 'Our story'
      }
    });
  }

  if (pageContent.mission) {
    const missionContent = `<h2>${pageContent.mission.title}</h2><p>${pageContent.mission.content}</p>`;
    if (pageContent.mission.values) {
      const valuesHtml = `<h2>Our Values</h2><ul>${pageContent.mission.values.map(value => `<li>${value}</li>`).join('')}</ul>`;
      sections.push({
        id: `${pageId}-mission`,
        type: 'rich-text',
        settings: {
          content: missionContent + valuesHtml,
          textAlign: 'left',
          maxWidth: '100%'
        }
      });
    }
  }

  return sections;
}
