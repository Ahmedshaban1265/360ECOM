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
  Eye
} from 'lucide-react';

// Preview Renderers
import { ThemeRenderer } from '../renderers/ThemeRenderer';

const DEVICE_PRESETS = {
  desktop: { 
    name: 'Desktop', 
    width: '100%', 
    height: '100%',
    icon: Monitor,
    maxWidth: 'none'
  },
  tablet: { 
    name: 'Tablet', 
    width: 768, 
    height: 1024,
    icon: Tablet,
    maxWidth: '768px'
  },
  mobile: { 
    name: 'Mobile', 
    width: 375, 
    height: 667,
    icon: Smartphone,
    maxWidth: '375px'
  }
};

const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

export default function PreviewCanvas() {
  const currentTemplate = useCurrentTemplate();
  const deviceType = useDeviceType();
  const { setDeviceType, setSelectedSection, setSelectedBlock } = useEditorStore();
  
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const deviceConfig = DEVICE_PRESETS[deviceType];

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

  // Calculate canvas dimensions
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
    } else {
      style.width = `${deviceConfig.width}px`;
      style.height = `${deviceConfig.height}px`;
      style.border = '1px solid hsl(var(--border))';
      style.borderRadius = '12px';
      style.overflow = 'hidden';
      style.backgroundColor = 'hsl(var(--background))';
    }

    return style;
  };

  // Calculate container dimensions for proper centering
  const getContainerStyle = () => {
    if (deviceType === 'desktop') {
      return {};
    }

    const scaledWidth = deviceConfig.width * zoom;
    const scaledHeight = deviceConfig.height * zoom;

    return {
      width: `${scaledWidth}px`,
      height: `${scaledHeight}px`,
      margin: '0 auto',
      position: 'relative' as const
    };
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedBlock(null);
  };

  const handleBlockClick = (sectionId: string, blockId: string) => {
    setSelectedSection(sectionId);
    setSelectedBlock(blockId);
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
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-4">
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
                  className="h-8 w-8 p-0"
                  title={config.name}
                >
                  <Icon className="w-4 h-4" />
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
              className="h-8 w-8 p-0"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <Select value={zoom.toString()} onValueChange={(value) => setZoom(parseFloat(value))}>
              <SelectTrigger className="w-20 h-8 text-xs">
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
              className="h-8 w-8 p-0"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomReset}
              className="h-8 w-8 p-0"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Device Info */}
          {deviceType !== 'desktop' && (
            <Badge variant="secondary" className="text-xs">
              {deviceConfig.width} × {deviceConfig.height}
            </Badge>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-muted/10">
        <div className="p-8" style={getContainerStyle()}>
          <div
            ref={canvasRef}
            style={getCanvasStyle()}
            className="bg-background shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ThemeRenderer
                template={currentTemplate}
                deviceType={deviceType}
                onSectionClick={handleSectionClick}
                onBlockClick={handleBlockClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
