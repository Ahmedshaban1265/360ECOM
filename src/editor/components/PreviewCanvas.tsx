import { useState, useEffect, useRef } from 'react';
import { useEditorStore, useCurrentTemplate, useDeviceType } from '../store/editorStore';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Icons
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Maximize,
  Eye,
  Smartphone as MobileIcon,
  Tablet as TabletIcon,
  Monitor as DesktopIcon
} from 'lucide-react';

// Preview Renderers
import { ThemeRenderer } from '../renderers/ThemeRenderer';
import LiveWebsiteRenderer from './LiveWebsiteRenderer';
import { elementDiscoveryService } from '../services/ElementDiscoveryService';

// Real responsive breakpoints from your actual code
const REAL_RESPONSIVE_BREAKPOINTS = {
  sm: 640,    // Small devices (landscape phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (desktops)
  xl: 1280,   // Extra large devices
  '2xl': 1536 // 2X large devices
};

const DEVICE_PRESETS = {
  desktop: { 
    name: 'Desktop', 
    width: '100%', 
    height: '100%',
    icon: DesktopIcon,
    maxWidth: 'none',
    viewport: '100%',
    breakpoint: 'lg',
    realBreakpoint: REAL_RESPONSIVE_BREAKPOINTS.lg
  },
  tablet: { 
    name: 'Tablet', 
    width: 768, 
    height: 1024,
    icon: TabletIcon,
    maxWidth: '768px',
    viewport: '768px',
    breakpoint: 'md',
    realBreakpoint: REAL_RESPONSIVE_BREAKPOINTS.md
  },
  mobile: { 
    name: 'Mobile', 
    width: 375, 
    height: 667,
    icon: MobileIcon,
    maxWidth: '375px',
    viewport: '375px',
    breakpoint: 'sm',
    realBreakpoint: REAL_RESPONSIVE_BREAKPOINTS.sm
  }
};

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PreviewCanvas() {
  const currentTemplate = useCurrentTemplate();
  const deviceType = useDeviceType();
  const {
    setDeviceType,
    setSelectedSection,
    setSelectedBlock,
    setSelectedElement,
    openSidebarTab
  } = useEditorStore();
  
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const deviceConfig = DEVICE_PRESETS[deviceType];

  // No global document mutations for preview sizing; handled locally in the canvas

  // Handle device type changes
  const handleDeviceChange = (newDevice: string) => {
    setDeviceType(newDevice as typeof deviceType);
    // Reset zoom when changing devices
    setZoom(1);
  };

  // Handle zoom changes
  const handleZoomIn = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      setZoom(ZOOM_LEVELS[currentIndex + 1]);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = ZOOM_LEVELS.indexOf(zoom);
    if (currentIndex > 0) {
      setZoom(ZOOM_LEVELS[currentIndex - 1]);
    }
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Calculate canvas dimensions and styles for different devices
  const getCanvasStyle = () => {
    const style: React.CSSProperties = {
      transform: `scale(${zoom})`,
      transformOrigin: 'top left',
      transition: 'transform 0.2s ease-out'
    };

    if (deviceType === 'desktop') {
      style.width = '100%';
      style.height = '100%';
      style.minHeight = '600px';
      style.backgroundColor = 'hsl(var(--background))';
    } else {
      // Mobile and tablet get device frames
      style.width = `${deviceConfig.width}px`;
      style.height = `${deviceConfig.height}px`;
      style.border = deviceType === 'mobile' ? '8px solid #1f2937' : '12px solid #374151';
      style.borderRadius = deviceType === 'mobile' ? '32px' : '24px';
      style.overflow = 'hidden';
      style.backgroundColor = 'hsl(var(--background))';
      style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      style.position = 'relative';
    }

    return style;
  };

  // Calculate container dimensions for proper centering
  const getContainerStyle = () => {
    if (deviceType === 'desktop') {
      return {
        height: '100%',
        width: '100%'
      };
    }

    const scaledWidth = deviceConfig.width * zoom;
    const scaledHeight = deviceConfig.height * zoom;

    return {
      width: `${scaledWidth + (deviceType === 'mobile' ? 16 : 24)}px`, // Add border width
      height: `${scaledHeight + (deviceType === 'mobile' ? 16 : 24)}px`,
      margin: '0 auto',
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedBlock(null);
    // Auto-open properties panel when section is selected
    openSidebarTab('properties');
  };

  const handleBlockClick = (sectionId: string, blockId: string) => {
    setSelectedSection(sectionId);
    setSelectedBlock(blockId);
    // Auto-open properties panel when block is selected
    openSidebarTab('properties');
  };

  const handleElementClick = (element: HTMLElement, elementType: string) => {
    console.log('PreviewCanvas: handleElementClick called with:', { element, elementType });
    
    // Use ElementDiscoveryService to get the proper EditableElement
    const editableElement = elementDiscoveryService.getElementByElement(element);
    
    if (editableElement) {
      console.log('PreviewCanvas: Found editable element:', editableElement);
      // Set the selected element in the store for the properties panel
      setSelectedElement(editableElement.element);
      // Clear section/block selection since we're now editing individual elements
      setSelectedSection(null);
      setSelectedBlock(null);
      // Auto-open properties panel when element is selected
      openSidebarTab('properties');
    } else {
      console.warn('PreviewCanvas: Could not find editable element for:', element);
    }
  };

  if (!currentTemplate) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <Eye className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold text-lg">No Template Selected</h3>
            <p className="text-muted-foreground">
              Choose a template from the left panel to start editing
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-sm">Preview</h3>
          <Badge variant="outline" className="text-xs">
            {currentTemplate.id}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {Object.entries(DEVICE_PRESETS).map(([device, config]) => {
              const Icon = config.icon;
              const isActive = deviceType === device;
              
              return (
                <Button
                  key={device}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleDeviceChange(device)}
                  className="h-7 w-7 p-0"
                  title={`${config.name} (${config.viewport}) - ${config.breakpoint}:${config.realBreakpoint}px`}
                >
                  <Icon className="w-3 h-3" />
                </Button>
              );
            })}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= ZOOM_LEVELS[0]}
              className="h-7 w-7 p-0"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>

            <Select value={zoom.toString()} onValueChange={(value) => setZoom(parseFloat(value))}>
              <SelectTrigger className="w-16 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZOOM_LEVELS.map((level) => (
                  <SelectItem key={level} value={level.toString()}>
                    {Math.round(level * 100)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
              className="h-7 w-7 p-0"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              className="h-7 w-7 p-0"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-7 w-7 p-0"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-muted/5">
        <div className="p-4 h-full" style={getContainerStyle()}>
          <div
            ref={canvasRef}
            style={getCanvasStyle()}
            className="relative overflow-hidden"
          >
            {/* Device frame decorations for mobile */}
            {deviceType === 'mobile' && (
              <>
                {/* Home indicator for iPhone-like frame */}
                <div 
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-black rounded-full z-50"
                />
                {/* Notch for iPhone-like frame */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-50"
                />
              </>
            )}

            {/* Device frame decorations for tablet */}
            {deviceType === 'tablet' && (
              <>
                {/* Camera for iPad-like frame */}
                <div 
                  className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full z-50"
                />
              </>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                <LiveWebsiteRenderer
                  onElementClick={handleElementClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real responsive design styles based on your actual code */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Real responsive breakpoints from your actual code */
          .real-responsive-mobile {
            /* Forces mobile breakpoint behavior */
            --current-breakpoint: 640px;
            --current-viewport-width: 375px;
          }
          
          .real-responsive-tablet {
            /* Forces tablet breakpoint behavior */
            --current-breakpoint: 768px;
            --current-viewport-width: 768px;
          }
          
          .real-responsive-desktop {
            /* Forces desktop breakpoint behavior */
            --current-breakpoint: 1024px;
            --current-viewport-width: 100%;
          }

          /* Real responsive behavior based on your actual CSS classes */
          .real-responsive-mobile .container {
            max-width: 100% !important;
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
          
          .real-responsive-mobile .grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          
          .real-responsive-mobile .lg\\:grid-cols-2,
          .real-responsive-mobile .lg\\:grid-cols-3,
          .real-responsive-mobile .lg\\:grid-cols-4,
          .real-responsive-mobile .lg\\:grid-cols-5 {
            grid-template-columns: 1fr !important;
          }
          
          .real-responsive-mobile .md\\:grid-cols-2,
          .real-responsive-mobile .md\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
          
          .real-responsive-mobile .text-4xl,
          .real-responsive-mobile .text-5xl,
          .real-responsive-mobile .text-6xl,
          .real-responsive-mobile .text-7xl {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
          }
          
          .real-responsive-mobile .lg\\:text-5xl,
          .real-responsive-mobile .lg\\:text-6xl,
          .real-responsive-mobile .lg\\:text-7xl {
            font-size: 1.25rem !important;
            line-height: 1.75rem !important;
          }
          
          .real-responsive-mobile .md\\:text-6xl {
            font-size: 1.5rem !important;
            line-height: 2rem !important;
          }
          
          .real-responsive-mobile .flex-row {
            flex-direction: column !important;
          }
          
          .real-responsive-mobile .sm\\:flex-row {
            flex-direction: column !important;
          }
          
          .real-responsive-mobile .md\\:flex-row {
            flex-direction: column !important;
          }

          /* Tablet responsive behavior */
          .real-responsive-tablet .container {
            max-width: 768px !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .real-responsive-tablet .grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
          }
          
          .real-responsive-tablet .lg\\:grid-cols-4,
          .real-responsive-tablet .lg\\:grid-cols-5 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .real-responsive-tablet .md\\:grid-cols-3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          
          .real-responsive-tablet .text-4xl,
          .real-responsive-tablet .text-5xl {
            font-size: 2rem !important;
            line-height: 2.5rem !important;
          }
          
          .real-responsive-tablet .lg\\:text-7xl {
            font-size: 3rem !important;
            line-height: 3.5rem !important;
          }
          
          .real-responsive-tablet .md\\:text-6xl {
            font-size: 2.5rem !important;
            line-height: 3rem !important;
          }

          /* Desktop responsive behavior */
          .real-responsive-desktop .container {
            max-width: 1200px !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          
          .real-responsive-desktop .grid {
            gap: 1.5rem !important;
          }
          
          .real-responsive-desktop .text-4xl {
            font-size: 2.25rem !important;
            line-height: 2.5rem !important;
          }
          
          .real-responsive-desktop .text-5xl {
            font-size: 3rem !important;
            line-height: 3.5rem !important;
          }
          
          .real-responsive-desktop .text-6xl {
            font-size: 3.75rem !important;
            line-height: 4rem !important;
          }
          
          .real-responsive-desktop .text-7xl {
            font-size: 4.5rem !important;
            line-height: 5rem !important;
          }

          /* Ensure proper scaling */
          .editor-responsive-mode * {
            box-sizing: border-box !important;
          }

          /* Ensure element interactions work in responsive mode */
          .editor-responsive-mode [data-editable="true"] {
            cursor: pointer !important;
            position: relative !important;
            z-index: 1 !important;
          }

          .editor-responsive-mode [data-editable="true"]:hover {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
            background-color: rgba(59, 130, 246, 0.1) !important;
          }

          /* Prevent responsive CSS from interfering with element selection */
          .real-responsive-mobile [data-editable="true"],
          .real-responsive-tablet [data-editable="true"],
          .real-responsive-desktop [data-editable="true"] {
            cursor: pointer !important;
            position: relative !important;
            z-index: 1 !important;
          }
        `
      }} />
    </div>
  );
}