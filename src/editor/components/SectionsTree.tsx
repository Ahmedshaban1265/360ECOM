import { useState, useCallback } from 'react';
import { useEditorStore, useCurrentTemplate, useSelectedSection, useSelectedBlock } from '../store/editorStore';
import { getSectionSchema, getBlockSchema } from '../schemas/sections';
import { SectionInstance, BlockInstance } from '../types';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Icons
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Copy, 
  MoveUp, 
  MoveDown,
  ChevronDown,
  ChevronRight,
  Layers,
  Settings,
  Image as ImageIcon,
  Type,
  Link,
  Square
} from 'lucide-react';

interface SectionsTreeProps {}

export default function SectionsTree({}: SectionsTreeProps) {
  const currentTemplate = useCurrentTemplate();
  const selectedSection = useSelectedSection();
  const selectedBlock = useSelectedBlock();
  
  const {
    setSelectedSection,
    setSelectedBlock,
    addSection,
    removeSection,
    duplicateSection,
    moveSectionUp,
    moveSectionDown,
    addBlock,
    removeBlock,
    duplicateBlock,
    moveBlockUp,
    moveBlockDown
  } = useEditorStore();

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [draggedItem, setDraggedItem] = useState<{
    type: 'section' | 'block';
    id: string;
    sectionId?: string;
  } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{
    type: 'section' | 'block';
    id: string;
    sectionId?: string;
    position: 'before' | 'after';
  } | null>(null);

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    setSelectedBlock(null);
  };

  const handleBlockSelect = (sectionId: string, blockId: string) => {
    setSelectedSection(sectionId);
    setSelectedBlock(blockId);
  };

  const handleAddSection = () => {
    const sectionTypes = ['hero', 'rich-text', 'cards', 'cta-banner', 'collection-grid'];
    const randomType = sectionTypes[Math.floor(Math.random() * sectionTypes.length)];
    addSection(randomType);
  };

  const handleAddBlock = (sectionId: string) => {
    const blockTypes = ['text', 'image', 'button', 'video'];
    const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    addBlock(sectionId, randomType);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, item: { type: 'section' | 'block'; id: string; sectionId?: string }) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent, targetItem: { type: 'section' | 'block'; id: string; sectionId?: string }) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const position = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
    
    setDragOverItem({
      ...targetItem,
      position
    });
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItem: { type: 'section' | 'block'; id: string; sectionId?: string }) => {
    e.preventDefault();
    
    if (!draggedItem || !dragOverItem || !currentTemplate) return;
    
    const { position } = dragOverItem;
    
    if (draggedItem.type === 'section' && targetItem.type === 'section') {
      // Reordering sections
      const sections = [...currentTemplate.sections];
      const draggedIndex = sections.findIndex(s => s.id === draggedItem.id);
      const targetIndex = sections.findIndex(s => s.id === targetItem.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedSection] = sections.splice(draggedIndex, 1);
        const newIndex = position === 'before' ? targetIndex : targetIndex + 1;
        sections.splice(newIndex, 0, draggedSection);
        
        // Update the template with new order
        const { updateSectionOrder } = useEditorStore.getState();
        if (updateSectionOrder) {
          updateSectionOrder(sections.map(s => s.id));
        }
      }
    } else if (draggedItem.type === 'block' && targetItem.type === 'block' && draggedItem.sectionId === targetItem.sectionId) {
      // Reordering blocks within the same section
      const section = currentTemplate.sections.find(s => s.id === draggedItem.sectionId);
      if (section && section.blocks) {
        const blocks = [...section.blocks];
        const draggedIndex = blocks.findIndex(b => b.id === draggedItem.id);
        const targetIndex = blocks.findIndex(b => b.id === targetItem.id);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedBlock] = blocks.splice(draggedIndex, 1);
          const newIndex = position === 'before' ? targetIndex : targetIndex + 1;
          blocks.splice(newIndex, 0, draggedBlock);
          
          // Update the section with new block order
          const { updateBlockOrder } = useEditorStore.getState();
          if (updateBlockOrder) {
            updateBlockOrder(draggedItem.sectionId!, blocks.map(b => b.id));
          }
        }
      }
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const getSectionIcon = (sectionType: string) => {
    switch (sectionType) {
      case 'hero': return <Square className="w-4 h-4" />;
      case 'rich-text': return <Type className="w-4 h-4" />;
      case 'cards': return <Layers className="w-4 h-4" />;
      case 'cta-banner': return <Settings className="w-4 h-4" />;
      case 'collection-grid': return <ImageIcon className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getBlockIcon = (blockType: string) => {
    switch (blockType) {
      case 'text': return <Type className="w-3 h-3" />;
      case 'image': return <ImageIcon className="w-3 h-3" />;
      case 'button': return <Square className="w-3 h-3" />;
      case 'video': return <Square className="w-3 h-3" />;
      default: return <Square className="w-3 h-3" />;
    }
  };

  if (!currentTemplate) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <Layers className="w-8 h-8 mx-auto mb-2" />
        <p>No template loaded</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border bg-background/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm">Sections</h2>
          <Button
            size="sm"
            onClick={handleAddSection}
            className="h-6 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Section
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {currentTemplate.sections.length} sections
        </p>
      </div>

      {/* Sections List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {currentTemplate.sections.map((section, sectionIndex) => {
            const sectionSchema = getSectionSchema(section.type);
            const isExpanded = expandedSections.has(section.id);
            const isSelected = selectedSection === section.id;
            const isDragOver = dragOverItem?.type === 'section' && dragOverItem.id === section.id;
            
            return (
              <div key={section.id} className="space-y-1">
                {/* Section Item */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, { type: 'section', id: section.id })}
                  onDragOver={(e) => handleDragOver(e, { type: 'section', id: section.id })}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, { type: 'section', id: section.id })}
                  className={`
                    relative group cursor-pointer rounded-md border transition-all
                    ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                    ${isDragOver ? 'ring-2 ring-primary ring-opacity-50' : ''}
                    ${draggedItem?.id === section.id ? 'opacity-50' : ''}
                  `}
                >
                  {/* Drag Overlay Indicators */}
                  {isDragOver && (
                    <>
                      {dragOverItem?.position === 'before' && (
                        <div className="absolute -top-1 left-0 right-0 h-1 bg-primary rounded-full" />
                      )}
                      {dragOverItem?.position === 'after' && (
                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
                      )}
                    </>
                  )}

                  <div className="p-2">
                    <div className="flex items-center gap-2">
                      {/* Drag Handle */}
                      <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                        <GripVertical className="w-3 h-3" />
                      </div>

                      {/* Section Info */}
                      <div 
                        className="flex-1 flex items-center gap-2"
                        onClick={() => handleSectionSelect(section.id)}
                      >
                        <div className="text-muted-foreground">
                          {getSectionIcon(section.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {sectionSchema?.label || section.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {section.blocks?.length || 0} blocks
                          </div>
                        </div>
                      </div>

                      {/* Section Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionExpanded(section.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSection(section.id);
                          }}
                          className="h-6 w-6 p-0"
                          title="Duplicate section"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSectionUp(section.id);
                          }}
                          disabled={sectionIndex === 0}
                          className="h-6 w-6 p-0"
                          title="Move up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveSectionDown(section.id);
                          }}
                          disabled={sectionIndex === currentTemplate.sections.length - 1}
                          className="h-6 w-6 p-0"
                          title="Move down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this section?')) {
                              removeSection(section.id);
                            }
                          }}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          title="Delete section"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blocks List */}
                {isExpanded && section.blocks && section.blocks.length > 0 && (
                  <div className="ml-6 space-y-1">
                    {section.blocks.map((block, blockIndex) => {
                      const blockSchema = getBlockSchema(block.type);
                      const isBlockSelected = selectedSection === section.id && selectedBlock === block.id;
                      const isBlockDragOver = dragOverItem?.type === 'block' && dragOverItem.id === block.id;
                      
                      return (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, { type: 'block', id: block.id, sectionId: section.id })}
                          onDragOver={(e) => handleDragOver(e, { type: 'block', id: block.id, sectionId: section.id })}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, { type: 'block', id: block.id, sectionId: section.id })}
                          className={`
                            relative group cursor-pointer rounded-md border transition-all
                            ${isBlockSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                            ${isBlockDragOver ? 'ring-2 ring-primary ring-opacity-50' : ''}
                            ${draggedItem?.id === block.id ? 'opacity-50' : ''}
                          `}
                        >
                          {/* Drag Overlay Indicators */}
                          {isBlockDragOver && (
                            <>
                              {dragOverItem?.position === 'before' && (
                                <div className="absolute -top-1 left-0 right-0 h-1 bg-primary rounded-full" />
                              )}
                              {dragOverItem?.position === 'after' && (
                                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary rounded-full" />
                              )}
                            </>
                          )}

                          <div className="p-2">
                            <div className="flex items-center gap-2">
                              {/* Drag Handle */}
                              <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
                                <GripVertical className="w-2 h-2" />
                              </div>

                              {/* Block Info */}
                              <div 
                                className="flex-1 flex items-center gap-2"
                                onClick={() => handleBlockSelect(section.id, block.id)}
                              >
                                <div className="text-muted-foreground">
                                  {getBlockIcon(block.type)}
                                </div>
                                <div className="text-sm truncate">
                                  {blockSchema?.label || block.type}
                                </div>
                              </div>

                              {/* Block Actions */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateBlock(section.id, block.id);
                                  }}
                                  className="h-5 w-5 p-0"
                                  title="Duplicate block"
                                >
                                  <Copy className="w-2 h-2" />
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveBlockUp(section.id, block.id);
                                  }}
                                  disabled={blockIndex === 0}
                                  className="h-5 w-5 p-0"
                                  title="Move up"
                                >
                                  <MoveUp className="w-2 h-2" />
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveBlockDown(section.id, block.id);
                                  }}
                                  disabled={blockIndex === section.blocks!.length - 1}
                                  className="h-5 w-5 p-0"
                                  title="Move down"
                                >
                                  <MoveDown className="w-2 h-2" />
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this block?')) {
                                      removeBlock(section.id, block.id);
                                    }
                                  }}
                                  className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                                  title="Delete block"
                                >
                                  <Trash2 className="w-2 h-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Block Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddBlock(section.id)}
                      className="w-full h-8 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Block
                    </Button>
                  </div>
                )}

                {/* Add Block Button (when section is collapsed) */}
                {!isExpanded && (
                  <div className="ml-6">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddBlock(section.id)}
                      className="w-full h-8 text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Block
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Empty State */}
      {currentTemplate.sections.length === 0 && (
        <div className="p-4 text-center text-muted-foreground">
          <Layers className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">No sections yet</p>
          <p className="text-xs">Add your first section to get started</p>
        </div>
      )}
    </div>
  );
}
