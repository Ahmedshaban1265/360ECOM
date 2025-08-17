import { SectionInstance, DeviceType, ThemeTokens } from '../../types';

interface CtaBannerRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

export default function CtaBannerRenderer({ 
  section, 
  isSelected, 
  deviceType, 
  themeTokens 
}: CtaBannerRendererProps) {
  const settings = section.settings;
  
  // Default values
  const title = settings.title || 'Ready to Get Started?';
  const description = settings.description || 'Join thousands of satisfied customers';
  const buttonText = settings.buttonText || 'Get Started';
  const buttonUrl = settings.buttonUrl || '#';
  const backgroundColor = settings.backgroundColor || themeTokens.colors.primary;
  const textColor = settings.textColor || '#ffffff';
  const buttonStyle = settings.buttonStyle || 'primary';

  // Responsive padding
  const paddingClass = deviceType === 'mobile' 
    ? 'px-4 py-8' 
    : deviceType === 'tablet' 
      ? 'px-6 py-12' 
      : 'px-8 py-16';

  // Button style classes
  const getButtonClasses = () => {
    const baseClasses = `
      inline-flex items-center justify-center
      px-6 py-3 md:px-8 md:py-4
      font-semibold rounded-lg
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${deviceType === 'mobile' ? 'text-sm px-4 py-2' : 'text-base'}
    `;

    switch (buttonStyle) {
      case 'secondary':
        return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/90`;
      case 'outline':
        return `${baseClasses} bg-transparent border-2 border-current text-current hover:bg-current hover:text-background`;
      case 'ghost':
        return `${baseClasses} bg-transparent text-current hover:bg-white/10`;
      default: // primary
        return `${baseClasses} bg-white text-foreground hover:bg-white/90`;
    }
  };

  // Background style
  const backgroundStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor
  };

  return (
    <section
      className={`relative ${paddingClass}`}
      style={backgroundStyle}
    >
      <div className="section-container">
        <div 
          className={`
            text-center max-w-4xl mx-auto
            ${deviceType === 'mobile' ? 'space-y-4' : 'space-y-6'}
          `}
        >
          {/* Title */}
          <h2 
            className={`
              font-bold
              ${deviceType === 'mobile' ? 'text-xl' : 'text-2xl md:text-3xl lg:text-4xl'}
            `}
            style={{ 
              fontFamily: themeTokens.typography.headingFont,
              color: textColor
            }}
          >
            {title}
          </h2>

          {/* Description */}
          {description && (
            <div 
              className={`
                opacity-90
                ${deviceType === 'mobile' ? 'text-sm' : 'text-lg md:text-xl'}
              `}
              style={{ color: textColor }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {/* CTA Button */}
          <div className={deviceType === 'mobile' ? 'pt-2' : 'pt-4'}>
            <a
              href={buttonUrl}
              className={getButtonClasses()}
              style={{
                ...(buttonStyle === 'primary' && {
                  backgroundColor: '#ffffff',
                  color: backgroundColor
                }),
                ...(buttonStyle === 'secondary' && {
                  backgroundColor: themeTokens.colors.secondary,
                  color: '#ffffff'
                }),
                ...(buttonStyle === 'outline' && {
                  borderColor: textColor,
                  color: textColor
                }),
                ...(buttonStyle === 'ghost' && {
                  color: textColor
                })
              }}
            >
              {buttonText}
            </a>
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-white/20 border-2 border-white border-dashed" />
          <div className="absolute top-2 left-2 bg-white text-foreground text-xs px-2 py-1 rounded">
            CTA Banner Section
          </div>
        </div>
      )}
    </section>
  );
}
