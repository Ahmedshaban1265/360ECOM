import { SectionInstance, DeviceType, ThemeTokens } from '../../types';

interface ImageWithTextRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

export default function ImageWithTextRenderer({ 
  section, 
  isSelected, 
  deviceType, 
  themeTokens 
}: ImageWithTextRendererProps) {
  const settings = section.settings;
  
  // Default values
  const title = settings.title || 'Section Title';
  const content = settings.content || '<p>Add your content here...</p>';
  const imageUrl = settings.imageUrl || '';
  const imageAlt = settings.imageAlt || 'Image description';
  const imagePosition = settings.imagePosition || 'left';
  const imageWidth = parseInt(settings.imageWidth) || 50;
  const verticalAlignment = settings.verticalAlignment || 'center';

  // Responsive padding
  const paddingClass = deviceType === 'mobile' 
    ? 'px-4 py-8' 
    : deviceType === 'tablet' 
      ? 'px-6 py-12' 
      : 'px-8 py-16';

  // Image width classes
  const imageWidthClass = `w-full ${deviceType !== 'mobile' ? `lg:w-[${imageWidth}%]` : ''}`;
  const textWidthClass = `w-full ${deviceType !== 'mobile' ? `lg:w-[${100 - imageWidth}%]` : ''}`;

  // Alignment classes
  const alignmentClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end'
  };

  // Layout order based on position and RTL
  const shouldReverse = (imagePosition === 'right' && !themeTokens.rtl) || 
                       (imagePosition === 'left' && themeTokens.rtl);

  return (
    <section className={`relative ${paddingClass}`}>
      <div className="section-container">
        <div 
          className={`
            flex flex-col gap-8
            ${deviceType !== 'mobile' ? `lg:flex-row lg:gap-12 ${shouldReverse ? 'lg:flex-row-reverse' : ''}` : ''}
            ${alignmentClasses[verticalAlignment as keyof typeof alignmentClasses]}
          `}
        >
          {/* Image */}
          <div className={imageWidthClass}>
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ borderRadius: themeTokens.radius }}
                />
              </div>
            ) : (
              /* Placeholder */
              <div 
                className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/20"
                style={{ borderRadius: themeTokens.radius }}
              >
                <div className="text-center">
                  <span className="text-4xl mb-2 block">🖼️</span>
                  <p className="text-muted-foreground text-sm">Add an image</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`${textWidthClass} flex flex-col justify-center`}>
            {/* Title */}
            {title && (
              <h2 
                className={`
                  font-bold mb-6
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

            {/* Content */}
            <div 
              className={`
                prose max-w-none
                ${deviceType === 'mobile' ? 'prose-sm' : 'prose-lg'}
                ${themeTokens.darkMode ? 'prose-invert' : ''}
              `}
              style={{ 
                color: themeTokens.colors.foreground,
                fontFamily: themeTokens.typography.bodyFont
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: content }}
                className="rich-text-content"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed" />
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Image with Text Section
          </div>
        </div>
      )}

      {/* Add dynamic styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .rich-text-content-${section.id} h1,
          .rich-text-content-${section.id} h2,
          .rich-text-content-${section.id} h3,
          .rich-text-content-${section.id} h4,
          .rich-text-content-${section.id} h5,
          .rich-text-content-${section.id} h6 {
            font-family: ${themeTokens.typography.headingFont};
            color: ${themeTokens.colors.foreground};
          }

          .rich-text-content-${section.id} p {
            color: ${themeTokens.colors.foreground};
            line-height: 1.7;
            margin-bottom: 1em;
          }

          .rich-text-content-${section.id} ul,
          .rich-text-content-${section.id} ol {
            color: ${themeTokens.colors.foreground};
          }

          .rich-text-content-${section.id} a {
            color: ${themeTokens.colors.primary};
            text-decoration: underline;
          }

          .rich-text-content-${section.id} a:hover {
            color: ${themeTokens.colors.secondary};
          }

          .rich-text-content-${section.id} strong {
            color: ${themeTokens.colors.foreground};
            font-weight: 600;
          }

          .rich-text-content-${section.id} blockquote {
            border-left: ${themeTokens.rtl ? 'none' : '4px solid ' + themeTokens.colors.primary};
            border-right: ${themeTokens.rtl ? '4px solid ' + themeTokens.colors.primary : 'none'};
            margin: 1.5em 0;
            padding-left: ${themeTokens.rtl ? '0' : '1em'};
            padding-right: ${themeTokens.rtl ? '1em' : '0'};
            font-style: italic;
            color: ${themeTokens.colors.muted};
          }

          ${themeTokens.rtl ? `
            .rich-text-content-${section.id} {
              direction: rtl;
              text-align: right;
            }
          ` : ''}
        `
      }} />
    </section>
  );
}
