import { SectionInstance, DeviceType, ThemeTokens } from '../../types';
import { REAL_PROJECTS, PROJECT_CATEGORIES } from '../../data/projectsData.js';

interface CollectionGridRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

interface CollectionItemProps {
  item: typeof REAL_PROJECTS[0];
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
  const categories = PROJECT_CATEGORIES;

  // Show limited items based on itemsPerPage setting
  const displayItems = REAL_PROJECTS.slice(0, itemsPerPage);

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
        {REAL_PROJECTS.length > itemsPerPage && (
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
