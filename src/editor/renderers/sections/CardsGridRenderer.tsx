import { SectionInstance, DeviceType, ThemeTokens, BlockInstance } from '../../types';

interface CardsGridRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  selectedBlockId?: string;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

interface FeatureCardProps {
  block: BlockInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  cardStyle: string;
  onClick?: () => void;
}

function FeatureCard({ 
  block, 
  isSelected, 
  deviceType, 
  themeTokens, 
  cardStyle,
  onClick 
}: FeatureCardProps) {
  const settings = block.settings;
  
  const title = settings.title || 'Feature Title';
  const description = settings.description || 'Feature description goes here';
  const icon = settings.icon || '⭐';
  const link = settings.link;
  const linkText = settings.linkText || 'Learn More';

  // Card style classes
  const cardStyleClasses = {
    default: 'bg-background border border-border hover:shadow-md',
    bordered: 'bg-background border-2 border-border hover:border-primary',
    shadow: 'bg-background shadow-lg hover:shadow-xl border-0',
    minimal: 'bg-transparent border-0 hover:bg-surface'
  };

  const cardClass = `
    relative p-6 rounded-lg transition-all duration-200 cursor-pointer
    ${cardStyleClasses[cardStyle as keyof typeof cardStyleClasses]}
    ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
    ${deviceType === 'mobile' ? 'p-4' : ''}
  `;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div 
      className={cardClass}
      onClick={handleClick}
      data-block-id={block.id}
    >
      {/* Icon */}
      {icon && (
        <div className="mb-4">
          <span className={`text-3xl ${deviceType === 'mobile' ? 'text-2xl' : ''}`}>
            {icon}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 
        className={`
          font-semibold mb-3
          ${deviceType === 'mobile' ? 'text-lg' : 'text-xl'}
        `}
        style={{ 
          fontFamily: themeTokens.typography.headingFont,
          color: themeTokens.colors.foreground
        }}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <div 
          className={`
            text-muted-foreground mb-4 leading-relaxed
            ${deviceType === 'mobile' ? 'text-sm' : 'text-base'}
          `}
          style={{ color: themeTokens.colors.muted }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {/* Link */}
      {link && linkText && (
        <div className="mt-auto">
          <a
            href={link}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors"
            style={{ color: themeTokens.colors.primary }}
            onClick={(e) => e.stopPropagation()}
          >
            {linkText}
            <svg 
              className="w-4 h-4 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={themeTokens.rtl ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} 
              />
            </svg>
          </a>
        </div>
      )}

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 z-10">
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-t-md">
            Feature Card
          </div>
        </div>
      )}
    </div>
  );
}

export default function CardsGridRenderer({ 
  section, 
  isSelected, 
  selectedBlockId,
  deviceType, 
  themeTokens,
  onBlockClick 
}: CardsGridRendererProps) {
  const settings = section.settings;
  const blocks = section.blocks || [];
  
  // Default values
  const title = settings.title || 'Our Features';
  const subtitle = settings.subtitle || 'Discover what makes us special';
  const columns = parseInt(settings.columns) || 3;
  const spacing = settings.spacing || 'medium';
  const cardStyle = settings.cardStyle || 'default';

  // Spacing classes
  const spacingClasses = {
    tight: 'gap-4',
    medium: 'gap-6',
    loose: 'gap-8'
  };

  // Column classes based on device and column count
  const getColumnClasses = () => {
    if (deviceType === 'mobile') {
      return 'grid-cols-1';
    }
    if (deviceType === 'tablet') {
      return columns > 2 ? 'grid-cols-2' : `grid-cols-${Math.min(columns, 2)}`;
    }
    return `grid-cols-1 md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`;
  };

  // Responsive padding
  const paddingClass = deviceType === 'mobile' 
    ? 'px-4 py-8' 
    : deviceType === 'tablet' 
      ? 'px-6 py-12' 
      : 'px-8 py-16';

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

        {/* Cards Grid */}
        {blocks.length > 0 ? (
          <div 
            className={`
              grid ${getColumnClasses()} ${spacingClasses[spacing as keyof typeof spacingClasses]}
            `}
          >
            {blocks.map((block) => (
              <FeatureCard
                key={block.id}
                block={block}
                isSelected={selectedBlockId === block.id}
                deviceType={deviceType}
                themeTokens={themeTokens}
                cardStyle={cardStyle}
                onClick={() => onBlockClick?.(block.id)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">No cards added</h3>
            <p className="text-muted-foreground">
              Add feature cards to showcase your content
            </p>
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed" />
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Cards Grid Section
          </div>
        </div>
      )}
    </section>
  );
}
