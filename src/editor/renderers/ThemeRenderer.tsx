import { TemplateDocument, DeviceType, SectionInstance } from '../types';
import { useSelectedSection, useSelectedBlock } from '../store/editorStore';

// Section Renderers
import HeroRenderer from './sections/HeroRenderer';
import RichTextRenderer from './sections/RichTextRenderer';
import ImageWithTextRenderer from './sections/ImageWithTextRenderer';
import CardsGridRenderer from './sections/CardsGridRenderer';
import CtaBannerRenderer from './sections/CtaBannerRenderer';
import CollectionGridRenderer from './sections/CollectionGridRenderer';

interface ThemeRendererProps {
  template: TemplateDocument;
  deviceType: DeviceType;
  onSectionClick?: (sectionId: string) => void;
  onBlockClick?: (sectionId: string, blockId: string) => void;
}

interface SectionRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  selectedBlockId?: string;
  deviceType: DeviceType;
  themeTokens: TemplateDocument['themeTokens'];
  onSectionClick?: (sectionId: string) => void;
  onBlockClick?: (sectionId: string, blockId: string) => void;
}

function SectionRenderer({ 
  section, 
  isSelected, 
  selectedBlockId,
  deviceType, 
  themeTokens,
  onSectionClick,
  onBlockClick
}: SectionRendererProps) {
  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSectionClick?.(section.id);
  };

  const handleBlockClick = (blockId: string) => {
    onBlockClick?.(section.id, blockId);
  };

  // Section container with selection state
  const sectionClass = `
    relative transition-all duration-200
    ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
    ${onSectionClick ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:ring-offset-background' : ''}
  `.trim();

  // Common props for all renderers
  const rendererProps = {
    section,
    isSelected,
    selectedBlockId,
    deviceType,
    themeTokens,
    onBlockClick: handleBlockClick
  };

  let RendererComponent;
  
  switch (section.type) {
    case 'hero':
      RendererComponent = HeroRenderer;
      break;
    case 'rich-text':
      RendererComponent = RichTextRenderer;
      break;
    case 'image-with-text':
      RendererComponent = ImageWithTextRenderer;
      break;
    case 'cards-grid':
      RendererComponent = CardsGridRenderer;
      break;
    case 'cta-banner':
      RendererComponent = CtaBannerRenderer;
      break;
    case 'collection-grid':
      RendererComponent = CollectionGridRenderer;
      break;
    default:
      // Fallback renderer for unknown section types
      RendererComponent = ({ section }: any) => (
        <div className="p-8 bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center">
          <p className="text-muted-foreground">
            Unknown section type: <code className="text-xs bg-muted px-1 py-0.5 rounded">{section.type}</code>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This section type doesn't have a renderer implemented yet.
          </p>
        </div>
      );
      break;
  }

  return (
    <div 
      className={sectionClass}
      onClick={handleSectionClick}
      data-section-id={section.id}
      data-section-type={section.type}
    >
      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute -top-6 left-0 z-10">
          <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-t-md">
            {section.type} section
          </div>
        </div>
      )}
      
      <RendererComponent {...rendererProps} />
    </div>
  );
}

export function ThemeRenderer({ 
  template, 
  deviceType, 
  onSectionClick, 
  onBlockClick 
}: ThemeRendererProps) {
  const selectedSectionId = useSelectedSection();
  const selectedBlockId = useSelectedBlock();

  // Apply theme CSS variables
  const themeStyle = {
    '--theme-primary': template.themeTokens.colors.primary,
    '--theme-secondary': template.themeTokens.colors.secondary,
    '--theme-accent': template.themeTokens.colors.accent,
    '--theme-background': template.themeTokens.colors.background,
    '--theme-surface': template.themeTokens.colors.surface,
    '--theme-foreground': template.themeTokens.colors.foreground,
    '--theme-muted': template.themeTokens.colors.muted,
    '--theme-border': template.themeTokens.colors.border,
    '--theme-body-font': template.themeTokens.typography.bodyFont,
    '--theme-heading-font': template.themeTokens.typography.headingFont,
    '--theme-arabic-font': template.themeTokens.typography.arabicFont,
    '--theme-radius': template.themeTokens.radius,
    fontFamily: template.themeTokens.typography.bodyFont,
    direction: template.themeTokens.rtl ? 'rtl' : 'ltr'
  } as React.CSSProperties;

  // Device-specific container classes
  const containerClass = `
    theme-preview w-full h-full
    ${template.themeTokens.darkMode ? 'dark' : ''}
    ${template.themeTokens.rtl ? 'rtl' : 'ltr'}
    ${deviceType === 'mobile' ? 'mobile-preview' : ''}
    ${deviceType === 'tablet' ? 'tablet-preview' : ''}
  `.trim();

  return (
    <div 
      className={containerClass}
      style={themeStyle}
      dir={template.themeTokens.rtl ? 'rtl' : 'ltr'}
    >
      {/* Background */}
      <div 
        className="min-h-full"
        style={{ 
          backgroundColor: template.themeTokens.colors.background,
          color: template.themeTokens.colors.foreground
        }}
      >
        {template.sections.length === 0 ? (
          // Empty state
          <div className="flex items-center justify-center min-h-96 p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">No sections added</h3>
                <p className="text-muted-foreground">
                  Add sections to your template to start building your page
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Render sections
          template.sections.map((section, index) => (
            <SectionRenderer
              key={section.id}
              section={section}
              isSelected={selectedSectionId === section.id}
              selectedBlockId={selectedSectionId === section.id ? selectedBlockId || undefined : undefined}
              deviceType={deviceType}
              themeTokens={template.themeTokens}
              onSectionClick={onSectionClick}
              onBlockClick={onBlockClick}
            />
          ))
        )}
      </div>

      {/* Theme-specific styles */}
      <style jsx>{`
        .theme-preview {
          /* Custom CSS properties that can be used by section renderers */
          --section-padding: ${deviceType === 'mobile' ? '1rem' : deviceType === 'tablet' ? '1.5rem' : '2rem'};
          --container-max-width: ${deviceType === 'mobile' ? '100%' : deviceType === 'tablet' ? '768px' : '1200px'};
        }

        .theme-preview .section-container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding-left: var(--section-padding);
          padding-right: var(--section-padding);
        }

        /* Dark mode styles */
        .theme-preview.dark {
          color-scheme: dark;
        }

        /* RTL styles */
        .theme-preview.rtl {
          text-align: right;
        }

        .theme-preview.rtl .section-container {
          direction: rtl;
        }

        /* Device-specific styles */
        .mobile-preview {
          font-size: 14px;
        }

        .tablet-preview {
          font-size: 15px;
        }

        /* Selection states */
        .theme-preview [data-section-id] {
          position: relative;
        }

        .theme-preview [data-block-id] {
          position: relative;
        }

        /* Responsive utilities */
        @media (max-width: 768px) {
          .theme-preview .hide-mobile {
            display: none;
          }
        }

        @media (max-width: 1024px) {
          .theme-preview .hide-tablet {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default ThemeRenderer;
