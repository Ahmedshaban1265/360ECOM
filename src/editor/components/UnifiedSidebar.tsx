import { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { SidebarTab } from '../types';
import SectionsTree from './SectionsTree';
import PropertiesPanel from './PropertiesPanel';
import LeftNavTemplates from './LeftNavTemplates';
import ShopifyImageLibrary, { ImageItem } from './ShopifyImageLibrary';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

// Icons
import {
  Layers,
  Settings,
  Layout,
  FolderOpen,
  Image as ImageIcon,
  ChevronLeft,
  X
} from 'lucide-react';

// Media Panel Component
function MediaPanel() {
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  const handleImageSelect = (images: ImageItem[]) => {
    if (images.length > 0) {
      // Copy the first image URL to clipboard for easy pasting
      const imageUrl = images[0].url;
      navigator.clipboard.writeText(imageUrl).then(() => {
        console.log('Image URL copied to clipboard:', imageUrl);
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
      });
    }
    setShowImageLibrary(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium mb-4">Media Library</h3>
        <div className="space-y-2">
          <Button
            onClick={() => setShowImageLibrary(true)}
            className="w-full"
            variant="outline"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Browse & Upload Images
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Select images to copy URL to clipboard
          </p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="text-center text-sm text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="mb-2">Quick Access to Your Images</p>
          <p className="text-xs">
            • Upload new images
          </p>
          <p className="text-xs">
            • Browse existing media
          </p>
          <p className="text-xs">
            • Search and filter
          </p>
          <p className="text-xs mb-3">
            • Copy URLs instantly
          </p>
          <Button
            onClick={() => setShowImageLibrary(true)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            Open Media Library
          </Button>
        </div>
      </ScrollArea>

      <ShopifyImageLibrary
        open={showImageLibrary}
        onOpenChange={setShowImageLibrary}
        onSelect={handleImageSelect}
        multiple={false}
      />
    </div>
  );
}

interface SidebarTabConfig {
  id: SidebarTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const SIDEBAR_TABS: SidebarTabConfig[] = [
  {
    id: 'sections',
    label: 'Sections',
    icon: Layers,
    component: SectionsTree
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Settings,
    component: PropertiesPanel
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: Layout,
    component: LeftNavTemplates
  },
  {
    id: 'media',
    label: 'Media',
    icon: ImageIcon,
    component: () => <MediaPanel />
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: FolderOpen,
    component: () => (
      <div className="p-4 text-center">
        <FolderOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Pages management coming soon</p>
      </div>
    )
  }
];

interface UnifiedSidebarProps {
  isOpen: boolean;
  activeTab: SidebarTab | null;
  onToggle: () => void;
  onTabChange: (tab: SidebarTab | null) => void;
}

export default function UnifiedSidebar({ 
  isOpen, 
  activeTab, 
  onToggle, 
  onTabChange 
}: UnifiedSidebarProps) {
  const selectedSection = useEditorStore(state => state.selectedSection);
  const selectedBlock = useEditorStore(state => state.selectedBlock);
  const isDirty = useEditorStore(state => state.isDirty);

  const handleTabClick = (tabId: SidebarTab) => {
    if (activeTab === tabId && isOpen) {
      // Close sidebar if same tab is clicked
      onTabChange(null);
    } else {
      // Open sidebar with new tab
      onTabChange(tabId);
    }
  };

  const ActiveComponent = activeTab ? SIDEBAR_TABS.find(tab => tab.id === activeTab)?.component : null;

  return (
    <TooltipProvider>
      <div className="flex h-full">
        {/* Tab Navigation */}
        <div className="w-12 bg-muted border-r border-border flex flex-col">
          {/* Logo/Brand Area */}
          <div className="h-14 flex items-center justify-center border-b border-border">
            <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
              <Layout className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>

          {/* Tab Buttons */}
          <div className="flex-1 py-2">
            {SIDEBAR_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Tooltip key={tab.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="w-8 h-8 p-0 mx-2 mb-1 relative"
                      onClick={() => handleTabClick(tab.id)}
                    >
                      <Icon className="w-4 h-4" />
                      {/* Activity indicators */}
                      {tab.id === 'sections' && (selectedSection || selectedBlock) && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                      )}
                      {tab.id === 'properties' && isDirty && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {tab.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Collapse Toggle */}
          <div className="p-2 border-t border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={onToggle}
                >
                  <ChevronLeft className={`w-4 h-4 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Sliding Panel */}
        <div 
          className={`
            bg-background border-r border-border transition-all duration-300 ease-in-out overflow-hidden
            ${isOpen && activeTab ? 'w-80' : 'w-0'}
          `}
        >
          {isOpen && activeTab && ActiveComponent && (
            <div className="w-80 h-full flex flex-col">
              {/* Panel Header */}
              <div className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/50">
                <div className="flex items-center gap-2">
                  {(() => {
                    const tab = SIDEBAR_TABS.find(t => t.id === activeTab);
                    const Icon = tab?.icon;
                    return Icon ? <Icon className="w-4 h-4" /> : null;
                  })()}
                  <h2 className="font-semibold text-sm">
                    {SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
                  </h2>
                  {activeTab === 'properties' && (selectedSection || selectedBlock) && (
                    <Badge variant="outline" className="text-xs">
                      {selectedBlock ? 'Block' : 'Section'}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onTabChange(null)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <ActiveComponent />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
