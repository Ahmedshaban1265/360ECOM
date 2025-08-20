import { useState, useEffect } from 'react';
import { useDeviceType } from '../store/editorStore';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Icons
import {
  Smartphone,
  Tablet,
  Monitor,
  Grid3X3,
  Rows3,
  Columns3,
  Type,
  Ruler,
  Eye,
  EyeOff,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';

interface ResponsiveTestingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Real responsive breakpoints from your actual code
const REAL_RESPONSIVE_BREAKPOINTS = {
  sm: 640,    // Small devices (landscape phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (desktops)
  xl: 1280,   // Extra large devices
  '2xl': 1536 // 2X large devices
};

export default function ResponsiveTestingPanel({ isOpen, onClose }: ResponsiveTestingPanelProps) {
  const deviceType = useDeviceType();
  const [showGrid, setShowGrid] = useState(false);
  const [showSpacing, setShowSpacing] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [showBreakpoints, setShowBreakpoints] = useState(false);
  const [gridColumns, setGridColumns] = useState(12);
  const [gridGap, setGridGap] = useState(16);
  const [customWidth, setCustomWidth] = useState('');
  const [copied, setCopied] = useState('');

  // Apply responsive testing styles
  useEffect(() => {
    const root = document.documentElement;
    
    if (showGrid) {
      root.classList.add('responsive-grid-overlay');
      root.style.setProperty('--grid-columns', gridColumns.toString());
      root.style.setProperty('--grid-gap', `${gridGap}px`);
    } else {
      root.classList.remove('responsive-grid-overlay');
    }

    if (showSpacing) {
      root.classList.add('responsive-spacing-overlay');
    } else {
      root.classList.remove('responsive-spacing-overlay');
    }

    if (showTypography) {
      root.classList.add('responsive-typography-overlay');
    } else {
      root.classList.remove('responsive-typography-overlay');
    }

    if (showBreakpoints) {
      root.classList.add('responsive-breakpoints-overlay');
    } else {
      root.classList.remove('responsive-breakpoints-overlay');
    }

    return () => {
      root.classList.remove(
        'responsive-grid-overlay',
        'responsive-spacing-overlay',
        'responsive-typography-overlay',
        'responsive-breakpoints-overlay'
      );
    };
  }, [showGrid, showSpacing, showTypography, showBreakpoints, gridColumns, gridGap]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getDeviceInfo = () => {
    switch (deviceType) {
      case 'mobile':
        return {
          name: 'Mobile',
          width: '375px',
          breakpoint: 'sm',
          maxWidth: '640px',
          icon: Smartphone,
          color: 'bg-blue-500',
          mediaQuery: `@media (max-width: ${REAL_RESPONSIVE_BREAKPOINTS.sm}px)`
        };
      case 'tablet':
        return {
          name: 'Tablet',
          width: '768px',
          breakpoint: 'md',
          maxWidth: '1024px',
          icon: Tablet,
          color: 'bg-green-500',
          mediaQuery: `@media (max-width: ${REAL_RESPONSIVE_BREAKPOINTS.md}px)`
        };
      default:
        return {
          name: 'Desktop',
          width: '100%',
          breakpoint: 'lg',
          maxWidth: '∞',
          icon: Monitor,
          color: 'bg-gray-500',
          mediaQuery: `@media (min-width: ${REAL_RESPONSIVE_BREAKPOINTS.lg}px)`
        };
    }
  };

  const deviceInfo = getDeviceInfo();
  const Icon = deviceInfo.icon;

  // Real responsive utilities from your actual code
  const responsiveUtilities = [
    {
      name: 'Container Responsive',
      class: 'container',
      description: 'Responsive container with max-width and padding'
    },
    {
      name: 'Grid Responsive',
      class: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      description: 'Responsive grid that adapts to breakpoints'
    },
    {
      name: 'Text Responsive',
      class: 'text-4xl md:text-6xl lg:text-7xl',
      description: 'Text that scales with device size'
    },
    {
      name: 'Flex Responsive',
      class: 'flex-col sm:flex-row md:flex-row',
      description: 'Flex direction that changes with breakpoints'
    },
    {
      name: 'Spacing Responsive',
      class: 'px-4 md:px-6 lg:px-8',
      description: 'Padding that adapts to device size'
    },
    {
      name: 'Visibility Responsive',
      class: 'hidden md:block lg:block',
      description: 'Elements that show/hide at breakpoints'
    }
  ];

  // Real responsive classes from your actual code
  const responsiveClasses = [
    { name: 'Container', class: 'container mx-auto px-4', description: 'Responsive container with auto margins and padding' },
    { name: 'Grid System', class: 'grid lg:grid-cols-2 gap-12', description: '2-column grid on large screens, 1-column on small' },
    { name: 'Text Scaling', class: 'text-4xl lg:text-5xl', description: 'Large text on desktop, smaller on mobile' },
    { name: 'Flex Direction', class: 'flex flex-col sm:flex-row', description: 'Column on mobile, row on small screens and up' },
    { name: 'Grid Columns', class: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4', description: 'Progressive grid columns' },
    { name: 'Spacing', class: 'px-4 md:px-6 lg:px-8', description: 'Progressive padding increase' },
    { name: 'Typography', class: 'text-4xl md:text-6xl lg:text-7xl', description: 'Progressive text size increase' }
  ];

  // Real breakpoint information
  const breakpointInfo = [
    { name: 'Small (sm)', width: '640px', description: 'Landscape phones and up', classes: 'sm:flex-row, sm:text-lg' },
    { name: 'Medium (md)', width: '768px', description: 'Tablets and up', classes: 'md:grid-cols-3, md:text-6xl' },
    { name: 'Large (lg)', width: '1024px', description: 'Desktops and up', classes: 'lg:grid-cols-4, lg:text-7xl' },
    { name: 'Extra Large (xl)', width: '1280px', description: 'Large desktops', classes: 'xl:container, xl:px-8' },
    { name: '2X Large (2xl)', width: '1536px', description: 'Extra large desktops', classes: '2xl:max-w-7xl' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${deviceInfo.color} text-white rounded p-0.5`} />
            <div>
              <h2 className="text-lg font-semibold">Real Responsive Testing Panel</h2>
              <p className="text-sm text-muted-foreground">
                {deviceInfo.name} • {deviceInfo.width} • {deviceInfo.breakpoint} • {deviceInfo.maxWidth}
              </p>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Testing Tools */}
            <div className="space-y-6">
              {/* Visual Overlays */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visual Overlays
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="grid-toggle" className="flex items-center gap-2">
                      <Grid3X3 className="w-4 h-4" />
                      Grid Overlay
                    </Label>
                    <Switch
                      id="grid-toggle"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                  
                  {showGrid && (
                    <div className="pl-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Columns:</Label>
                        <Select value={gridColumns.toString()} onValueChange={(value) => setGridColumns(parseInt(value))}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 6, 8, 12, 16].map(col => (
                              <SelectItem key={col} value={col.toString()}>{col}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Gap:</Label>
                        <Select value={gridGap.toString()} onValueChange={(value) => setGridGap(parseInt(value))}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[8, 16, 24, 32, 48, 64].map(gap => (
                              <SelectItem key={gap} value={gap.toString()}>{gap}px</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="spacing-toggle" className="flex items-center gap-2">
                      <Ruler className="w-4 h-4" />
                      Spacing Indicators
                    </Label>
                    <Switch
                      id="spacing-toggle"
                      checked={showSpacing}
                      onCheckedChange={setShowSpacing}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="typography-toggle" className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      Typography Info
                    </Label>
                    <Switch
                      id="typography-toggle"
                      checked={showTypography}
                      onCheckedChange={setShowTypography}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="breakpoints-toggle" className="flex items-center gap-2">
                      <Columns3 className="w-4 h-4" />
                      Breakpoint Lines
                    </Label>
                    <Switch
                      id="breakpoints-toggle"
                      checked={showBreakpoints}
                      onCheckedChange={setShowBreakpoints}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Custom Width Testing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Custom Width Testing</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="e.g., 500px, 50vw, 100%"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (customWidth) {
                          document.documentElement.style.setProperty('--custom-test-width', customWidth);
                          document.documentElement.classList.add('custom-width-test');
                        }
                      }}
                    >
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        document.documentElement.classList.remove('custom-width-test');
                        document.documentElement.style.removeProperty('--custom-test-width');
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Test custom viewport widths to see how your design responds
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Information & Utilities */}
            <div className="space-y-6">
              {/* Device Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Device Information</h3>
                
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Device Type:</span>
                    <Badge variant="secondary">{deviceInfo.name}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Viewport Width:</span>
                    <Badge variant="outline">{deviceInfo.width}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Breakpoint:</span>
                    <Badge variant="outline">{deviceInfo.breakpoint}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Max Width:</span>
                    <Badge variant="outline">{deviceInfo.maxWidth}</Badge>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">CSS Media Query:</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(deviceInfo.mediaQuery, 'media-query')}
                      className="h-6 px-2"
                    >
                      {copied === 'media-query' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <code className="text-xs text-primary bg-primary/20 px-2 py-1 rounded">
                    {deviceInfo.mediaQuery}
                  </code>
                </div>
              </div>

              <Separator />

              {/* Real Breakpoint Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Real Breakpoints from Your Code</h3>
                
                <div className="space-y-2">
                  {breakpointInfo.map((breakpoint) => (
                    <div key={breakpoint.name} className="bg-muted/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{breakpoint.name}</span>
                        <Badge variant="outline">{breakpoint.width}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{breakpoint.description}</p>
                      <code className="text-xs bg-muted/50 px-2 py-1 rounded">{breakpoint.classes}</code>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Responsive Utilities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Real Responsive Utilities</h3>
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="utilities">
                    <AccordionTrigger className="text-sm">Available Utility Classes from Your Code</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {responsiveUtilities.map((utility) => (
                          <div key={utility.class} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div>
                              <div className="font-mono text-xs">{utility.class}</div>
                              <div className="text-xs text-muted-foreground">{utility.description}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(utility.class, utility.class)}
                              className="h-6 px-2"
                            >
                              {copied === utility.class ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.documentElement.classList.toggle('responsive-debug')}
                    className="h-8 text-xs"
                  >
                    Toggle Debug Mode
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="h-8 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reload
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const html = document.documentElement;
                      html.classList.toggle('show-responsive-classes');
                    }}
                    className="h-8 text-xs"
                  >
                    Show Classes
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const html = document.documentElement;
                      html.classList.toggle('show-responsive-breakpoints');
                    }}
                    className="h-8 text-xs"
                  >
                    Show Breakpoints
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Testing Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Grid Overlay */
          .responsive-grid-overlay::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
            background-size: calc(100% / var(--grid-columns)) var(--grid-gap);
            pointer-events: none;
            z-index: 9998;
          }

          /* Spacing Overlay */
          .responsive-spacing-overlay [class*="p-"],
          .responsive-spacing-overlay [class*="m-"] {
            position: relative;
          }

          .responsive-spacing-overlay [class*="p-"]::after,
          .responsive-spacing-overlay [class*="m-"]::after {
            content: attr(class);
            position: absolute;
            top: -20px;
            left: 0;
            background: rgba(255, 165, 0, 0.9);
            color: white;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            z-index: 9999;
            pointer-events: none;
          }

          /* Typography Overlay */
          .responsive-typography-overlay [class*="text-"] {
            position: relative;
          }

          .responsive-typography-overlay [class*="text-"]::after {
            content: attr(class);
            position: absolute;
            top: -20px;
            right: 0;
            background: rgba(128, 0, 128, 0.9);
            color: white;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            z-index: 9999;
            pointer-events: none;
          }

          /* Breakpoints Overlay - Real breakpoints from your code */
          .responsive-breakpoints-overlay::after {
            content: '640px (sm) | 768px (md) | 1024px (lg) | 1280px (xl) | 1536px (2xl)';
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            z-index: 9999;
            pointer-events: none;
          }

          /* Custom Width Testing */
          .custom-width-test {
            --custom-test-width: 500px;
          }

          .custom-width-test .live-website-renderer {
            width: var(--custom-test-width) !important;
            max-width: var(--custom-test-width) !important;
            margin: 0 auto !important;
            border: 2px dashed #3b82f6 !important;
          }

          /* Responsive Debug Mode */
          .responsive-debug * {
            outline: 1px solid rgba(255, 0, 0, 0.2) !important;
          }

          .responsive-debug .container {
            outline: 2px solid rgba(0, 255, 0, 0.5) !important;
          }

          .responsive-debug .grid {
            outline: 2px solid rgba(0, 0, 255, 0.5) !important;
          }

          /* Show Responsive Classes */
          .show-responsive-classes [class*="sm:"],
          .show-responsive-classes [class*="md:"],
          .show-responsive-classes [class*="lg:"],
          .show-responsive-classes [class*="xl:"],
          .show-responsive-classes [class*="2xl:"] {
            position: relative;
          }

          .show-responsive-classes [class*="sm:"]::before,
          .show-responsive-classes [class*="md:"]::before,
          .show-responsive-classes [class*="lg:"]::before,
          .show-responsive-classes [class*="xl:"]::before,
          .show-responsive-classes [class*="2xl:"]::before {
            content: attr(class);
            position: absolute;
            top: -25px;
            left: 0;
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            z-index: 9999;
            pointer-events: none;
          }

          /* Show Responsive Breakpoints */
          .show-responsive-breakpoints .container::before {
            content: 'Container: ' attr(class);
            position: absolute;
            top: -30px;
            left: 0;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            z-index: 9999;
            pointer-events: none;
          }
        `
      }} />
    </div>
  );
}
