import { useState } from 'react';
import { useDeviceType } from '../store/editorStore';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Icons
import {
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  EyeOff,
  Grid,
  List,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ResponsiveUtilitiesProps {
  onToggleGrid?: (show: boolean) => void;
  onToggleSpacing?: (show: boolean) => void;
  onToggleTypography?: (show: boolean) => void;
}

// Real responsive breakpoints from your actual code
const REAL_RESPONSIVE_BREAKPOINTS = {
  sm: 640,    // Small devices (landscape phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (desktops)
  xl: 1280,   // Extra large devices
  '2xl': 1536 // 2X large devices
};

export default function ResponsiveUtilities({
  onToggleGrid,
  onToggleSpacing,
  onToggleTypography
}: ResponsiveUtilitiesProps) {
  const deviceType = useDeviceType();
  const [showGrid, setShowGrid] = useState(false);
  const [showSpacing, setShowSpacing] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleGrid = () => {
    const newState = !showGrid;
    setShowGrid(newState);
    onToggleGrid?.(newState);
  };

  const handleToggleSpacing = () => {
    const newState = !showSpacing;
    setShowSpacing(newState);
    onToggleSpacing?.(newState);
  };

  const handleToggleTypography = () => {
    const newState = !showTypography;
    setShowTypography(newState);
    onToggleTypography?.(newState);
  };

  const getDeviceInfo = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          name: 'Mobile',
          width: '375px',
          breakpoint: 'sm',
          realWidth: REAL_RESPONSIVE_BREAKPOINTS.sm,
          icon: Smartphone,
          color: 'bg-blue-500'
        };
      case 'tablet':
        return {
          name: 'Tablet',
          width: '768px',
          breakpoint: 'md',
          realWidth: REAL_RESPONSIVE_BREAKPOINTS.md,
          icon: Tablet,
          color: 'bg-green-500'
        };
      default:
        return {
          name: 'Desktop',
          width: '100%',
          breakpoint: 'lg',
          realWidth: REAL_RESPONSIVE_BREAKPOINTS.lg,
          icon: Monitor,
          color: 'bg-gray-500'
        };
    }
  };

  const deviceInfo = getDeviceInfo();
  const Icon = deviceInfo.icon;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-background/95 backdrop-blur border border-border rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${deviceInfo.color} text-white rounded p-0.5`} />
            <div className="text-sm font-medium">
              <div>{deviceInfo.name}</div>
              <div className="text-xs text-muted-foreground">
                {deviceInfo.width} • {deviceInfo.breakpoint} • {deviceInfo.realWidth}px
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </Button>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="p-3 space-y-3">
            <Separator />
            
            {/* Responsive Testing Tools */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Testing Tools</div>
              
              <div className="flex flex-wrap gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showGrid ? "default" : "outline"}
                        size="sm"
                        onClick={handleToggleGrid}
                        className="h-6 px-2 text-xs"
                      >
                        <Grid className="w-3 h-3 mr-1" />
                        Grid
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle grid overlay</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showSpacing ? "default" : "outline"}
                        size="sm"
                        onClick={handleToggleSpacing}
                        className="h-6 px-2 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Spacing
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle spacing indicators</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showTypography ? "default" : "outline"}
                        size="sm"
                        onClick={handleToggleTypography}
                        className="h-6 px-2 text-xs"
                      >
                        <List className="w-3 h-3 mr-1" />
                        Typography
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Toggle typography info</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Responsive Utilities */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Utilities</div>
              
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.documentElement.classList.toggle('responsive-debug')}
                  className="h-6 px-2 text-xs"
                >
                  Debug
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-6 px-2 text-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Real CSS Media Query Info */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Real CSS Media Queries from Your Code</div>
              
              <div className="text-xs space-y-1">
                {deviceType === 'mobile' && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-blue-700 dark:text-blue-300">
                    <code>@media (max-width: {REAL_RESPONSIVE_BREAKPOINTS.sm}px)</code>
                    <div className="text-xs mt-1">Small devices, landscape phones</div>
                  </div>
                )}
                
                {deviceType === 'tablet' && (
                  <div className="bg-green-50 dark:bg-green-950 p-2 rounded text-green-700 dark:text-green-300">
                    <code>@media (max-width: {REAL_RESPONSIVE_BREAKPOINTS.md}px)</code>
                    <div className="text-xs mt-1">Medium devices, tablets</div>
                  </div>
                )}
                
                {deviceType === 'desktop' && (
                  <div className="bg-gray-50 dark:bg-gray-950 p-2 rounded text-gray-700 dark:text-gray-300">
                    <code>@media (min-width: {REAL_RESPONSIVE_BREAKPOINTS.lg}px)</code>
                    <div className="text-xs mt-1">Large devices, desktops</div>
                  </div>
                )}
              </div>
            </div>

            {/* Real Responsive Classes from Your Code */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Real Responsive Classes from Your Code</div>
              
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span>Current breakpoint:</span>
                  <Badge variant="outline" className="text-xs">
                    {deviceInfo.breakpoint}:{deviceInfo.realWidth}px
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Available breakpoints:</span>
                  <Badge variant="outline" className="text-xs">
                    sm:640px, md:768px, lg:1024px
                  </Badge>
                </div>
              </div>
            </div>

            {/* Real Responsive Examples */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Examples from Your Code</div>
              
              <div className="text-xs space-y-1">
                <div className="bg-muted/30 p-2 rounded">
                  <code className="text-xs">grid lg:grid-cols-2 gap-12</code>
                  <div className="text-xs mt-1 text-muted-foreground">2 columns on large screens</div>
                </div>
                
                <div className="bg-muted/30 p-2 rounded">
                  <code className="text-xs">text-4xl lg:text-5xl</code>
                  <div className="text-xs mt-1 text-muted-foreground">Smaller text on mobile</div>
                </div>
                
                <div className="bg-muted/30 p-2 rounded">
                  <code className="text-xs">flex flex-col sm:flex-row</code>
                  <div className="text-xs mt-1 text-muted-foreground">Column on mobile, row on small+</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive Debug Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .responsive-debug * {
            outline: 1px solid rgba(255, 0, 0, 0.2) !important;
          }
          
          .responsive-debug .container {
            outline: 2px solid rgba(0, 255, 0, 0.5) !important;
          }
          
          .responsive-debug .grid {
            outline: 2px solid rgba(0, 0, 255, 0.5) !important;
          }
          
          .responsive-debug [class*="p-"],
          .responsive-debug [class*="m-"] {
            outline: 2px solid rgba(255, 165, 0, 0.5) !important;
          }
          
          .responsive-debug [class*="text-"] {
            outline: 2px solid rgba(128, 0, 128, 0.5) !important;
          }
        `
      }} />
    </div>
  );
}
