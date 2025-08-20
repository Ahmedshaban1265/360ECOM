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
import ResponsiveUtilities from './ResponsiveUtilities';
import ResponsiveTestingPanel from './ResponsiveTestingPanel';
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
  const [showDeviceInfo, setShowDeviceInfo] = useState(true);
  const [showResponsiveUtilities, setShowResponsiveUtilities] = useState(true);
  const [showResponsiveTestingPanel, setShowResponsiveTestingPanel] = useState(false);
  const [customWidth, setCustomWidth] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const deviceConfig = DEVICE_PRESETS[deviceType];

  // Apply real responsive behavior based on device type
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove any existing responsive classes
    root.classList.remove('real-responsive-mobile', 'real-responsive-tablet', 'real-responsive-desktop');
    
    // Add the appropriate responsive class
    switch (deviceType) {
      case 'mobile':
        root.classList.add('real-responsive-mobile');
        break;
      case 'tablet':
        root.classList.add('real-responsive-tablet');
        break;
      case 'desktop':
        root.classList.add('real-responsive-desktop');
        break;
    }

    // Set CSS custom properties for real breakpoints
    root.style.setProperty('--current-breakpoint', deviceConfig.realBreakpoint.toString());
    root.style.setProperty('--current-viewport-width', deviceConfig.width.toString());
    
    return () => {
      root.classList.remove('real-responsive-mobile', 'real-responsive-tablet', 'real-responsive-desktop');
      root.style.removeProperty('--current-breakpoint');
      root.style.removeProperty('--current-viewport-width');
    };
  }, [deviceType, deviceConfig]);

  // Handle device type changes
  const handleDeviceChange = (newDevice: string) => {
    setDeviceType(newDevice as any);
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
      // Prefer parent container for fullscreen to avoid scaled child overflow
      const container = canvasRef.current?.parentElement || canvasRef.current;
      container?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Test custom width for responsive behavior
  const testCustomWidth = () => {
    if (customWidth) {
      const root = document.documentElement;
      root.style.setProperty('--custom-test-width', customWidth);
      root.classList.add('custom-width-test');
    }
  };

  const resetCustomWidth = () => {
    const root = document.documentElement;
    root.classList.remove('custom-width-test');
    root.style.removeProperty('--custom-test-width');
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
      setSelectedElement(editableElement);
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

          {/* Device Info Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeviceInfo(!showDeviceInfo)}
            className="h-7 w-7 p-0"
            title="Toggle Device Info"
          >
            <Eye className="w-3 h-3" />
          </Button>

          {/* Responsive Utilities Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowResponsiveUtilities(!showResponsiveUtilities)}
            className="h-7 w-7 p-0"
            title="Toggle Responsive Utilities"
          >
            <Tablet className="w-3 h-3" />
          </Button>

          {/* Responsive Testing Panel Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResponsiveTestingPanel(!showResponsiveTestingPanel)}
            className="h-7 px-3 text-xs"
            title="Open Responsive Testing Panel"
          >
            Test
          </Button>
        </div>
      </div>

      {/* Device Info Bar */}
      {showDeviceInfo && deviceType !== 'desktop' && (
        <div className="px-3 py-2 bg-muted/30 border-b border-border text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span><strong>Device:</strong> {deviceConfig.name}</span>
              <span><strong>Viewport:</strong> {deviceConfig.viewport}</span>
              <span><strong>Breakpoint:</strong> {deviceConfig.breakpoint}</span>
              <span><strong>Real Width:</strong> {deviceConfig.realBreakpoint}px</span>
              <span><strong>Dimensions:</strong> {deviceConfig.width} × {deviceConfig.height}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                CSS: @media (max-width: {deviceConfig.realBreakpoint}px)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Width Testing */}
      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Test Custom Width:</span>
          <input
            type="text"
            placeholder="e.g., 500px, 50vw, 100%"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-blue-200 dark:border-blue-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={testCustomWidth}
            className="h-6 px-2 text-xs"
          >
            Test
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetCustomWidth}
            className="h-6 px-2 text-xs"
          >
            Reset
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

      {/* Responsive Utilities */}
      {showResponsiveUtilities && <ResponsiveUtilities />}

      {/* Responsive Testing Panel */}
      <ResponsiveTestingPanel
        isOpen={showResponsiveTestingPanel}
        onClose={() => setShowResponsiveTestingPanel(false)}
      />

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

          /* Custom width testing */
          .custom-width-test .live-website-renderer {
            width: var(--custom-test-width) !important;
            max-width: var(--custom-test-width) !important;
            margin: 0 auto !important;
            border: 2px dashed #3b82f6 !important;
          }

          /* Responsive utilities that work in editor */
          .responsive-utils {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-size: 12px;
            pointer-events: none;
          }
          
          /* Force responsive behavior in editor */
          .editor-responsive-mode .mobile-viewport {
            width: 375px !important;
            max-width: 375px !important;
            overflow-x: hidden !important;
          }
          
          .editor-responsive-mode .tablet-viewport {
            width: 768px !important;
            max-width: 768px !important;
            overflow-x: hidden !important;
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
