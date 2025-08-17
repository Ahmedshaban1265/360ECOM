import { SectionInstance, DeviceType, ThemeTokens } from '../../types';

interface RichTextRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

export default function RichTextRenderer({ 
  section, 
  isSelected, 
  deviceType, 
  themeTokens 
}: RichTextRendererProps) {
  const settings = section.settings;
  
  // Default values
  const content = settings.content || '<p>Add your content here...</p>';
  const textAlign = settings.textAlign || 'left';
  const maxWidth = settings.maxWidth || '800px';
  const backgroundColor = settings.backgroundColor || 'transparent';
  const padding = settings.padding || 'medium';

  // Padding mapping
  const paddingClasses = {
    none: '',
    small: 'py-4 md:py-6',
    medium: 'py-8 md:py-12',
    large: 'py-12 md:py-16'
  };

  // Responsive padding based on device
  const responsivePadding = deviceType === 'mobile' 
    ? 'px-4' 
    : deviceType === 'tablet' 
      ? 'px-6' 
      : 'px-8';

  // Background style
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor
  };

  // Content container style
  const contentStyle: React.CSSProperties = {
    maxWidth: maxWidth === '100%' ? undefined : maxWidth,
    textAlign: textAlign as any,
    color: themeTokens.colors.foreground,
    fontFamily: themeTokens.typography.bodyFont
  };

  return (
    <section
      className={`
        relative
        ${paddingClasses[padding as keyof typeof paddingClasses]}
        ${responsivePadding}
      `}
      style={backgroundStyle}
    >
      <div className="section-container">
        <div 
          className={`
            mx-auto prose prose-lg max-w-none
            ${deviceType === 'mobile' ? 'prose-sm' : ''}
            ${themeTokens.darkMode ? 'prose-invert' : ''}
          `}
          style={contentStyle}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: content }}
            className={`
              rich-text-content
              ${textAlign === 'center' ? 'text-center' : ''}
              ${textAlign === 'right' ? 'text-right' : ''}
              ${textAlign === 'justify' ? 'text-justify' : ''}
            `}
          />
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed" />
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Rich Text Section
          </div>
        </div>
      )}

      {/* Rich Text Styles */}
      <style jsx="true">{`
        .rich-text-content h1,
        .rich-text-content h2,
        .rich-text-content h3,
        .rich-text-content h4,
        .rich-text-content h5,
        .rich-text-content h6 {
          font-family: ${themeTokens.typography.headingFont};
          color: ${themeTokens.colors.foreground};
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .rich-text-content h1 {
          font-size: ${deviceType === 'mobile' ? '1.75rem' : '2.25rem'};
          font-weight: 700;
        }

        .rich-text-content h2 {
          font-size: ${deviceType === 'mobile' ? '1.5rem' : '1.875rem'};
          font-weight: 600;
        }

        .rich-text-content h3 {
          font-size: ${deviceType === 'mobile' ? '1.25rem' : '1.5rem'};
          font-weight: 600;
        }

        .rich-text-content p {
          margin-bottom: 1em;
          line-height: 1.7;
          color: ${themeTokens.colors.foreground};
        }

        .rich-text-content ul,
        .rich-text-content ol {
          margin: 1em 0;
          padding-left: 1.5em;
        }

        .rich-text-content li {
          margin-bottom: 0.5em;
          color: ${themeTokens.colors.foreground};
        }

        .rich-text-content blockquote {
          border-left: 4px solid ${themeTokens.colors.primary};
          margin: 1.5em 0;
          padding-left: 1em;
          font-style: italic;
          color: ${themeTokens.colors.muted};
        }

        .rich-text-content a {
          color: ${themeTokens.colors.primary};
          text-decoration: underline;
          transition: color 0.2s ease;
        }

        .rich-text-content a:hover {
          color: ${themeTokens.colors.secondary};
        }

        .rich-text-content strong {
          font-weight: 600;
          color: ${themeTokens.colors.foreground};
        }

        .rich-text-content em {
          font-style: italic;
        }

        .rich-text-content code {
          background-color: ${themeTokens.colors.surface};
          color: ${themeTokens.colors.foreground};
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .rich-text-content pre {
          background-color: ${themeTokens.colors.surface};
          color: ${themeTokens.colors.foreground};
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5em 0;
        }

        .rich-text-content pre code {
          background: none;
          padding: 0;
        }

        .rich-text-content hr {
          border: none;
          border-top: 1px solid ${themeTokens.colors.border};
          margin: 2em 0;
        }

        /* RTL Support */
        ${themeTokens.rtl ? `
          .rich-text-content {
            direction: rtl;
            text-align: right;
          }
          
          .rich-text-content ul,
          .rich-text-content ol {
            padding-right: 1.5em;
            padding-left: 0;
          }
          
          .rich-text-content blockquote {
            border-left: none;
            border-right: 4px solid ${themeTokens.colors.primary};
            padding-left: 0;
            padding-right: 1em;
          }
        ` : ''}

        /* Dark mode adjustments */
        ${themeTokens.darkMode ? `
          .rich-text-content {
            color: ${themeTokens.colors.foreground};
          }
        ` : ''}
      `}</style>
    </section>
  );
}
