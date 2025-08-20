import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Layers, 
  Settings, 
  FileText, 
  Image, 
  Palette,
  Eye,
  EyeOff,
  Edit3,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { SidebarTab } from '../types';
import { EditableElement, elementDiscoveryService } from '../services/ElementDiscoveryService';
import EnhancedPropertiesPanel from './EnhancedPropertiesPanel';
import ImageLibrary from './ImageLibrary';
import SectionsTree from './SectionsTree';
import PropertiesPanel from './PropertiesPanel';
import TemplateDropdown from './TemplateDropdown';
import { useEditorStore } from '../store/editorStore';

interface EnhancedUnifiedSidebarProps {
  activeTab: SidebarTab | null;
  onTabChange: (tab: SidebarTab | null) => void;
  selectedSection: string | null;
  selectedBlock: string | null;
  selectedElement: EditableElement | null;
  onElementSelect: (element: EditableElement | null) => void;
}

export default function EnhancedUnifiedSidebar({
  activeTab,
  onTabChange,
  selectedSection,
  selectedBlock,
  selectedElement,
  onElementSelect
}: EnhancedUnifiedSidebarProps) {
  const [elements, setElements] = useState<EditableElement[]>([]);
  const [filteredElements, setFilteredElements] = useState<EditableElement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showHidden, setShowHidden] = useState(false);
  const { selectedTemplate } = useEditorStore();

  // Discover elements when component mounts or template changes
  useEffect(() => {
    const discoverElements = () => {
      // Use the actual selected template ID
      const pageId = selectedTemplate || 'home';
      elementDiscoveryService.setPageId(pageId);
      const discoveredElements = elementDiscoveryService.discoverElements();
      setElements(discoveredElements);
      setFilteredElements(discoveredElements);
    };

    // Initial discovery with delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      discoverElements();
    }, 200);

    // Listen for element edit requests
    const handleElementEditRequest = (event: CustomEvent) => {
      console.log('EnhancedUnifiedSidebar: Received elementEditRequest event:', event.detail);
      const { editableElement } = event.detail;
      onElementSelect(editableElement);
      onTabChange('properties');
    };

    document.addEventListener('elementEditRequest', handleElementEditRequest as EventListener);

    // Enable element editing
    elementDiscoveryService.enableElementEditing();

    return () => {
      clearTimeout(timer);
      document.removeEventListener('elementEditRequest', handleElementEditRequest as EventListener);
      elementDiscoveryService.disableElementEditing();
    };
  }, [onElementSelect, onTabChange, selectedTemplate]);

  // Filter elements based on search and visibility
  useEffect(() => {
    let filtered = elements;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(element => 
        element.tagName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (element.textContent && element.textContent.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply visibility filter
    if (!showHidden) {
      filtered = filtered.filter(element => 
        element.element.style.display !== 'none'
      );
    }

    setFilteredElements(filtered);
  }, [elements, searchQuery, showHidden]);

  const handleElementClick = (element: EditableElement) => {
    onElementSelect(element);
    onTabChange('properties');
  };

  const toggleElementVisibility = (element: EditableElement) => {
    const isVisible = element.element.style.display !== 'none';
    element.element.style.display = isVisible ? 'none' : 'block';
    
    // Refresh the elements list
    const updatedElements = elementDiscoveryService.getAllElements();
    setElements(updatedElements);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sections':
        return <SectionsTree />;
      
      case 'properties':
        if (selectedElement) {
          return (
            <EnhancedPropertiesPanel
              selectedElement={selectedElement}
              onClose={() => onElementSelect(null)}
            />
          );
        } else if (selectedSection || selectedBlock) {
          return <PropertiesPanel />;
        } else {
          return (
            <div className="p-4 text-center text-muted-foreground">
              <Edit3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click on any element in the preview to edit it</p>
              <p className="text-xs mt-1">Every piece of the website is editable</p>
            </div>
          );
        }
      
      case 'templates':
        return <TemplateDropdown />;
      
      case 'media':
        return <ImageLibrary />;
      
      case 'elements':
        return (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border rounded-md bg-background"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-6 px-2"
                  >
                    <Grid3X3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-6 px-2"
                  >
                    <List className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  variant={showHidden ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowHidden(!showHidden)}
                  className="h-6 px-2"
                >
                  {showHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Elements List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Elements ({filteredElements.length})</span>
                <span>Click to edit</span>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-2">
                  {filteredElements.map((element) => (
                    <div
                      key={element.id}
                      className={`
                        p-2 border rounded-md cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50
                        ${selectedElement?.id === element.id ? 'border-primary bg-primary/10' : ''}
                      `}
                      onClick={() => handleElementClick(element)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {element.tagName}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleElementVisibility(element);
                          }}
                          className="h-4 w-4 p-0"
                        >
                          {element.element.style.display !== 'none' ? 
                            <Eye className="h-2 w-2" /> : 
                            <EyeOff className="h-2 w-2" />
                          }
                        </Button>
                      </div>
                      
                      <div className="text-xs font-medium truncate">
                        {element.type}
                      </div>
                      
                      {element.textContent && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {element.textContent}
                        </div>
                      )}
                      
                      {element.className && (
                        <div className="text-xs text-muted-foreground truncate">
                          .{element.className.split(' ')[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredElements.map((element) => (
                    <div
                      key={element.id}
                      className={`
                        p-2 border rounded-md cursor-pointer transition-all hover:border-primary/50 hover:bg-muted/50
                        ${selectedElement?.id === element.id ? 'border-primary bg-primary/10' : ''}
                      `}
                      onClick={() => handleElementClick(element)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {element.tagName}
                          </Badge>
                          <span className="text-xs font-medium">{element.type}</span>
                          {element.textContent && (
                            <span className="text-xs text-muted-foreground truncate max-w-32">
                              {element.textContent}
                            </span>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleElementVisibility(element);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {element.element.style.display !== 'none' ? 
                            <Eye className="h-3 w-3" /> : 
                            <EyeOff className="h-3 w-3" />
                          }
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredElements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Edit3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No elements found</p>
                  <p className="text-xs">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            <p className="text-sm">Select a tab to get started</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-border bg-background">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {([
          { id: 'sections', icon: Layers, label: 'Sections' },
          { id: 'properties', icon: Settings, label: 'Properties' },
          { id: 'elements', icon: Edit3, label: 'Elements' },
          { id: 'templates', icon: FileText, label: 'Templates' },
          { id: 'media', icon: Image, label: 'Media' }
        ] as const).map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant={activeTab === id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange(id)}
            className="flex-1 rounded-none h-10 text-xs"
          >
            <Icon className="h-3 w-3 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {renderTabContent()}
        </div>
      </ScrollArea>
    </div>
  );
}
