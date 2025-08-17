import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore, useHistoryState, useIsDirty } from '../store/editorStore';
import { DeviceType } from '../types';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Icons
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo, 
  Redo, 
  Save, 
  Upload, 
  Download, 
  Settings, 
  Moon, 
  Sun, 
  Languages,
  ArrowLeft,
  Eye,
  ChevronDown
} from 'lucide-react';

const DEVICE_CONFIGS = {
  desktop: { icon: Monitor, label: 'Desktop', width: '100%' },
  tablet: { icon: Tablet, label: 'Tablet', width: '768px' },
  mobile: { icon: Smartphone, label: 'Mobile', width: '375px' }
};

export default function EditorToolbar() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const {
    selectedTemplate,
    deviceType,
    isDarkMode,
    isRTL,
    locale,
    lastSaved,
    setDeviceType,
    setDarkMode,
    setRTL,
    setLocale,
    saveTemplate,
    publishTemplate,
    resetToPublished,
    undo,
    redo,
    exportTemplate,
    importTemplate
  } = useEditorStore();

  const isDirty = useIsDirty();
  const { canUndo, canRedo } = useHistoryState();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTemplate();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishTemplate();
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportTemplate();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate}-template.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result as string;
        await importTemplate(data);
      } catch (error) {
        console.error('Import failed:', error);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const formatLastSaved = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Side - Navigation & Template Info */}
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Editor</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Return to website</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-sm">Theme Editor</h1>
            {selectedTemplate && (
              <>
                <Badge variant="outline" className="text-xs">
                  {selectedTemplate}
                </Badge>
                {isDirty && (
                  <Badge variant="secondary" className="text-xs">
                    Unsaved
                  </Badge>
                )}
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Last saved: {formatLastSaved(lastSaved)}
          </div>
        </div>

        {/* Center - Device Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {Object.entries(DEVICE_CONFIGS).map(([device, config]) => {
            const Icon = config.icon;
            const isActive = deviceType === device;
            
            return (
              <Tooltip key={device}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceType(device as DeviceType)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{config.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-8 w-8 p-0"
                >
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-8 w-8 p-0"
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Language Toggle */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    <Languages className="w-4 h-4" />
                    <span className="text-xs uppercase">{locale}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Change language</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setLocale('en')}
                className={locale === 'en' ? 'bg-accent' : ''}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLocale('ar')}
                className={locale === 'ar' ? 'bg-accent' : ''}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!isDarkMode)}
                className="h-8 w-8 p-0"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle {isDarkMode ? 'light' : 'dark'} mode</TooltipContent>
          </Tooltip>

          {/* Import/Export */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>More options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Template
              </DropdownMenuItem>
              <label className="block">
                <DropdownMenuItem asChild>
                  <div className="flex items-center cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Template
                  </div>
                </DropdownMenuItem>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <DropdownMenuItem onClick={resetToPublished}>
                <Eye className="w-4 h-4 mr-2" />
                Reset to Published
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6" />

          {/* Save & Publish */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
