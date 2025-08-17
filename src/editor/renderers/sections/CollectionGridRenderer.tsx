import { SectionInstance, DeviceType, ThemeTokens } from '../../types';

interface CollectionGridRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

// Sample collection items for preview
const SAMPLE_ITEMS = [
  {
    id: 1,
    title: 'Modern Web Design',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    description: 'A clean and modern website design with focus on user experience.'
  },
  {
    id: 2,
    title: 'Mobile App UI',
    category: 'Mobile Design',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    description: 'Intuitive mobile application interface design for iOS and Android.'
  },
  {
    id: 3,
    title: 'Brand Identity',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
    description: 'Complete brand identity package including logo and visual guidelines.'
  },
  {
    id: 4,
    title: 'E-commerce Platform',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    description: 'Full-featured e-commerce website with payment integration.'
  },
  {
    id: 5,
    title: 'Digital Marketing',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=300&fit=crop',
    description: 'Comprehensive digital marketing campaign with social media strategy.'
  },
  {
    id: 6,
    title: 'Data Visualization',
    category: 'Analytics',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    description: 'Interactive dashboard for business analytics and reporting.'
  }
];

interface CollectionItemProps {
  item: typeof SAMPLE_ITEMS[0];
  aspectRatio: string;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
}

function CollectionItem({ item, aspectRatio, deviceType, themeTokens }: CollectionItemProps) {
  // Aspect ratio classes
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:4': 'aspect-[3/4]'
  };

  return (
    <div className="group cursor-pointer">
      {/* Image */}
      <div 
        className={`
          relative overflow-hidden rounded-lg mb-4
          ${aspectRatioClasses[aspectRatio as keyof typeof aspectRatioClasses]}
        `}
        style={{ borderRadius: themeTokens.radius }}
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Category */}
        <div 
          className="text-xs font-medium opacity-75"
          style={{ color: themeTokens.colors.primary }}
        >
          {item.category}
        </div>

        {/* Title */}
        <h3 
          className={`
            font-semibold group-hover:text-primary transition-colors
            ${deviceType === 'mobile' ? 'text-base' : 'text-lg'}
          `}
          style={{ 
            fontFamily: themeTokens.typography.headingFont,
            color: themeTokens.colors.foreground
          }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p 
          className={`
            text-muted-foreground
            ${deviceType === 'mobile' ? 'text-xs' : 'text-sm'}
          `}
          style={{ color: themeTokens.colors.muted }}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

export default function CollectionGridRenderer({ 
  section, 
  isSelected, 
  deviceType, 
  themeTokens 
}: CollectionGridRendererProps) {
  const settings = section.settings;
  
  // Default values
  const title = settings.title || 'Our Work';
  const subtitle = settings.subtitle || 'Check out our latest projects';
  const columns = parseInt(settings.columns) || 3;
  const showFilters = settings.showFilters !== false;
  const itemsPerPage = parseInt(settings.itemsPerPage) || 9;
  const aspectRatio = settings.aspectRatio || '4:3';

  // Responsive padding
  const paddingClass = deviceType === 'mobile' 
    ? 'px-4 py-8' 
    : deviceType === 'tablet' 
      ? 'px-6 py-12' 
      : 'px-8 py-16';

  // Column classes based on device
  const getColumnClasses = () => {
    if (deviceType === 'mobile') {
      return 'grid-cols-1';
    }
    if (deviceType === 'tablet') {
      return columns > 2 ? 'grid-cols-2' : `grid-cols-${Math.min(columns, 2)}`;
    }
    return `grid-cols-1 md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`;
  };

  // Get unique categories for filters
  const categories = ['All', ...Array.from(new Set(SAMPLE_ITEMS.map(item => item.category)))];

  // Show limited items based on itemsPerPage setting
  const displayItems = SAMPLE_ITEMS.slice(0, itemsPerPage);

  return (
    <section className={`relative ${paddingClass}`}>
      <div className="section-container">
        {/* Header */}
        {(title || subtitle) && (
          <div 
            className={`
              text-center mb-8 md:mb-12
              ${deviceType === 'mobile' ? 'mb-6' : ''}
            `}
          >
            {title && (
              <h2 
                className={`
                  font-bold mb-4
                  ${deviceType === 'mobile' ? 'text-xl' : 'text-2xl md:text-3xl'}
                `}
                style={{ 
                  fontFamily: themeTokens.typography.headingFont,
                  color: themeTokens.colors.foreground
                }}
              >
                {title}
              </h2>
            )}
            
            {subtitle && (
              <div 
                className={`
                  text-muted-foreground max-w-2xl mx-auto
                  ${deviceType === 'mobile' ? 'text-sm' : 'text-lg'}
                `}
                style={{ color: themeTokens.colors.muted }}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category, index) => (
              <button
                key={category}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${index === 0 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-surface text-foreground hover:bg-accent'
                  }
                `}
                style={{
                  ...(index === 0 && {
                    backgroundColor: themeTokens.colors.primary,
                    color: '#ffffff'
                  }),
                  ...(index !== 0 && {
                    backgroundColor: themeTokens.colors.surface,
                    color: themeTokens.colors.foreground
                  })
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        <div 
          className={`
            grid gap-6 md:gap-8
            ${getColumnClasses()}
          `}
        >
          {displayItems.map((item) => (
            <CollectionItem
              key={item.id}
              item={item}
              aspectRatio={aspectRatio}
              deviceType={deviceType}
              themeTokens={themeTokens}
            />
          ))}
        </div>

        {/* Load More Button (if there are more items) */}
        {SAMPLE_ITEMS.length > itemsPerPage && (
          <div className="text-center mt-8 md:mt-12">
            <button
              className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              style={{
                backgroundColor: themeTokens.colors.primary,
                color: '#ffffff'
              }}
            >
              Load More Projects
            </button>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed" />
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Collection Grid Section
          </div>
        </div>
      )}
    </section>
  );
}
