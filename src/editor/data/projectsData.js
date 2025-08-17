// Real project data extracted from website pages
import projectEcommerce from '../../assets/project-ecommerce-1.png'
import projectMobile from '../../assets/project-mobile-app-2.png'
import projectDashboard from '../../assets/project-dashboard-3.png'

export const REAL_PROJECTS = [
  {
    id: 1,
    title: 'Luxury Fashion E-commerce',
    category: 'E-commerce',
    image: projectEcommerce,
    description: 'A premium e-commerce platform for luxury fashion brands with advanced filtering, wishlist functionality, and seamless checkout experience.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    duration: '4 months',
    teamSize: '5 developers',
    results: [
      '300% increase in conversion rate',
      '50% reduction in cart abandonment',
      '2M+ monthly active users'
    ],
    client: 'Fashion Forward Inc.',
    year: '2024',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'Food Delivery Mobile App',
    category: 'Mobile Apps', 
    image: projectMobile,
    description: 'A comprehensive food delivery application with real-time tracking, multiple payment options, and restaurant management system.',
    technologies: ['React Native', 'Firebase', 'Google Maps API', 'Stripe', 'Node.js'],
    duration: '6 months',
    teamSize: '7 developers',
    results: [
      '1M+ downloads in first month',
      '4.8/5 app store rating',
      '40% faster delivery times'
    ],
    client: 'QuickBite Solutions',
    year: '2024',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'Business Analytics Dashboard',
    category: 'Dashboards',
    image: projectDashboard,
    description: 'A comprehensive business intelligence dashboard with real-time analytics, custom reporting, and data visualization tools.',
    technologies: ['React', 'D3.js', 'Python', 'PostgreSQL', 'Docker'],
    duration: '3 months',
    teamSize: '4 developers',
    results: [
      '60% faster decision making',
      'Real-time data insights',
      'Custom reporting system'
    ],
    client: 'DataTech Corp',
    year: '2024',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'FashionForward Sales Growth',
    category: 'E-commerce',
    image: projectEcommerce,
    description: 'Transformed struggling fashion retailer into market leader with 300% sales increase through strategic e-commerce optimization.',
    technologies: ['Shopify Plus', 'React', 'Google Analytics', 'Facebook Ads'],
    duration: '6 months',
    teamSize: '6 developers',
    results: [
      '300% sales increase',
      '45% conversion rate improvement',
      '200% traffic growth'
    ],
    client: 'FashionForward',
    year: '2024',
    status: 'Completed'
  },
  {
    id: 5,
    title: 'TechStart Growth Engine',
    category: 'Web Development',
    image: projectDashboard,
    description: 'Built comprehensive digital presence and lead generation system that transformed startup into industry leader.',
    technologies: ['React', 'Next.js', 'HubSpot', 'Google Ads'],
    duration: '8 months',
    teamSize: '5 developers',
    results: [
      '450% lead increase',
      '320% traffic growth',
      '280% conversion improvement'
    ],
    client: 'TechStart Inc.',
    year: '2023',
    status: 'Completed'
  },
  {
    id: 6,
    title: 'HealthPlus Mobile Success',
    category: 'Mobile Apps',
    image: projectMobile,
    description: 'Revolutionary healthcare mobile app with telemedicine features, achieving 100K+ downloads and 4.9/5 rating.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Stripe'],
    duration: '10 months',
    teamSize: '8 developers',
    results: [
      '100K+ app downloads',
      '4.9/5 app store rating',
      '88% user retention rate'
    ],
    client: 'HealthPlus',
    year: '2023',
    status: 'Completed'
  }
];

// Get unique categories from real projects
export const PROJECT_CATEGORIES = ['All', ...Array.from(new Set(REAL_PROJECTS.map(project => project.category)))];
