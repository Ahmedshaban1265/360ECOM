import { SectionInstance, DeviceType, ThemeTokens } from '../../types';

interface HeroRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

export default function HeroRenderer({ 
  section, 
  isSelected, 
  deviceType, 
  themeTokens 
}: HeroRendererProps) {
  const settings = section.settings;
  
  // Default values
  const title = settings.title || 'Welcome to Our Service';
  const subtitle = settings.subtitle || 'Discover amazing features and benefits';
  const buttonText = settings.buttonText || 'Get Started';
  const buttonUrl = settings.buttonUrl || '#';
  const showButton = settings.showButton !== false;
  const alignment = settings.alignment || 'center';
  const height = settings.height || 'medium';
  const backgroundImage = settings.backgroundImage;
  const backgroundColor = settings.backgroundColor || themeTokens.colors.background;
  const textColor = settings.textColor || themeTokens.colors.foreground;

  // Height mapping
  const heightClasses = {
    auto: 'py-12 md:py-16 lg:py-20',
    small: 'h-96 md:h-[400px]',
    medium: 'h-[500px] md:h-[600px]',
    large: 'h-[600px] md:h-[800px]',
    full: 'h-screen'
  };

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  // Responsive padding based on device
  const paddingClass = deviceType === 'mobile' 
    ? 'px-4 py-8' 
    : deviceType === 'tablet' 
      ? 'px-6 py-12' 
      : 'px-8 py-16';

  // Background styles
  const backgroundStyle: React.CSSProperties = {
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  // Text color style
  const textStyle: React.CSSProperties = {
    color: textColor
  };

  return (
    <section
      className={`
        relative overflow-hidden
        ${heightClasses[height as keyof typeof heightClasses]}
        ${height === 'auto' ? '' : 'flex'}
      `}
      style={backgroundStyle}
    >
      {/* Background Overlay (if background image exists) */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-black/40"
          style={{ backgroundColor: `${backgroundColor}CC` }}
        />
      )}

      {/* Content Container */}
      <div 
        className={`
          section-container relative z-10
          ${height === 'auto' ? '' : 'flex w-full'}
          ${alignmentClasses[alignment as keyof typeof alignmentClasses]}
          ${paddingClass}
        `}
      >
        <div 
          className={`
            max-w-4xl
            ${alignment === 'center' ? 'mx-auto' : ''}
            ${deviceType === 'mobile' ? 'space-y-4' : 'space-y-6'}
          `}
          style={textStyle}
        >
          {/* Title */}
          <h1 
            className={`
              font-bold tracking-tight
              ${deviceType === 'mobile' 
                ? 'text-2xl sm:text-3xl' 
                : deviceType === 'tablet'
                  ? 'text-3xl md:text-4xl'
                  : 'text-4xl md:text-5xl lg:text-6xl'
              }
            `}
            style={{ 
              fontFamily: themeTokens.typography.headingFont,
              color: textColor
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <div 
              className={`
                text-lg opacity-90
                ${deviceType === 'mobile' 
                  ? 'text-base' 
                  : deviceType === 'tablet'
                    ? 'text-lg'
                    : 'text-xl'
                }
              `}
              style={{ color: textColor }}
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {/* CTA Button */}
          {showButton && buttonText && (
            <div className={deviceType === 'mobile' ? 'pt-2' : 'pt-4'}>
              <a
                href={buttonUrl}
                className={`
                  inline-flex items-center justify-center
                  px-6 py-3 md:px-8 md:py-4
                  bg-primary text-primary-foreground
                  font-semibold rounded-lg
                  transition-all duration-200
                  hover:bg-primary/90 hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${deviceType === 'mobile' ? 'text-sm px-4 py-2' : 'text-base'}
                `}
                style={{
                  backgroundColor: themeTokens.colors.primary,
                  color: '#ffffff'
                }}
              >
                {buttonText}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed" />
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Hero Section
          </div>
        </div>
      )}
    </section>
  );
}
