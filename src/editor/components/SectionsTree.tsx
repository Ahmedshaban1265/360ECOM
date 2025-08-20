import { useState } from 'react';
import { useEditorStore, useCurrentTemplate, useSelectedSection, useSelectedBlock } from '../store/editorStore';
import { getSectionSchema, getBlockSchema, getAvailableSections } from '../schemas/sections';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Icons
import { 
  Plus, 
  MoreVertical, 
  ChevronDown, 
  ChevronRight,
  Copy, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Grip,
  Eye,
  EyeOff
} from 'lucide-react';

interface SectionItemProps {
  sectionId: string;
  index: number;
  total: number;
}

function SectionItem({ sectionId, index, total }: SectionItemProps) {
  const currentTemplate = useCurrentTemplate();
  const selectedSection = useSelectedSection();
  const selectedBlock = useSelectedBlock();
  
  const {
    setSelectedSection,
    setSelectedBlock,
    removeSection,
    duplicateSection,
    moveSectionUp,
    moveSectionDown,
    addBlock,
    removeBlock,
    duplicateBlock,
    moveBlockUp,
    moveBlockDown,
    reorderBlocks
  } = useEditorStore();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const section = currentTemplate?.sections.find(s => s.id === sectionId);
  if (!section) return null;

  const schema = getSectionSchema(section.type);
  const blocks = section.blocks || [];
  const isSelected = selectedSection === sectionId;
  const hasBlocks = blocks.length > 0;

  const handleSectionSelect = () => {
    setSelectedSection(sectionId);
    setSelectedBlock(null);
  };

  const handleBlockSelect = (blockId: string) => {
    setSelectedSection(sectionId);
    setSelectedBlock(blockId);
  };

  const handleAddBlock = (blockType: string) => {
    addBlock(sectionId, blockType);
  };

  const getAvailableBlocks = () => {
    return schema?.blocks || [];
  };

  return (
    <div className={`border rounded-lg ${isSelected ? 'ring-2 ring-primary ring-offset-1' : 'border-border'}`}>
      {/* Section Header */}
      <div
        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors ${
          isSelected ? 'bg-accent' : ''
        }`}
        onClick={handleSectionSelect}
      >
        <div className="flex items-center gap-2 flex-1">
          <Grip className="w-4 h-4 text-muted-foreground cursor-grab" />
          
          {hasBlocks && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-0.5 hover:bg-background rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {schema?.label || section.type}
              </span>
              <Badge variant="outline" className="text-xs">
                {section.type}
              </Badge>
            </div>
            {hasBlocks && (
              <div className="text-xs text-muted-foreground">
                {blocks.length} block{blocks.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Add Block Button */}
          {schema?.blocks && schema.blocks.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {getAvailableBlocks().map((blockSchema) => (
                  <DropdownMenuItem
                    key={blockSchema.type}
                    onClick={() => handleAddBlock(blockSchema.type)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {blockSchema.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Section Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => duplicateSection(sectionId)}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => moveSectionUp(sectionId)}
                disabled={index === 0}
              >
                <MoveUp className="w-4 h-4 mr-2" />
                Move Up
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => moveSectionDown(sectionId)}
                disabled={index === total - 1}
              >
                <MoveDown className="w-4 h-4 mr-2" />
                Move Down
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => setShowDeleteConfirm(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Blocks */}
      {hasBlocks && (
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <DragDropContext
              onDragEnd={(result) => {
                const { destination, source, draggableId, type } = result;
                if (!destination) return;
                if (destination.droppableId === source.droppableId && destination.index === source.index) return;
                if (type === 'BLOCK') {
                  const blockIds = blocks.map(b => b.id);
                  blockIds.splice(source.index, 1);
                  blockIds.splice(destination.index, 0, draggableId);
                  reorderBlocks(sectionId, blockIds);
                }
              }}
            >
              <Droppable droppableId={`blocks-${sectionId}`} type="BLOCK">
                {(provided) => (
                  <div className="border-t border-border" ref={provided.innerRef} {...provided.droppableProps}>
                    {blocks.map((block, blockIndex) => {
                      const blockSchema = getBlockSchema(block.type);
                      const isBlockSelected = selectedBlock === block.id;

                      return (
                        <Draggable key={block.id} draggableId={block.id} index={blockIndex}>
                          {(dragProvided) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`flex items-center justify-between p-2 pl-8 border-b border-border last:border-b-0 cursor-pointer hover:bg-accent/30 transition-colors ${
                                isBlockSelected ? 'bg-accent/50' : ''
                              }`}
                              onClick={() => handleBlockSelect(block.id)}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <Grip className="w-3 h-3 text-muted-foreground cursor-grab" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                      {blockSchema?.label || block.type}
                                    </span>
                                    <Badge variant="secondary" className="text-xs">
                                      {block.type}
                                    </Badge>
                                  </div>
                                  {block.settings.title && (
                                    <div className="text-xs text-muted-foreground truncate max-w-32">
                                      {block.settings.title}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => duplicateBlock(sectionId, block.id)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem
                                    onClick={() => moveBlockUp(sectionId, block.id)}
                                    disabled={blockIndex === 0}
                                  >
                                    <MoveUp className="w-4 h-4 mr-2" />
                                    Move Up
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuItem
                                    onClick={() => moveBlockDown(sectionId, block.id)}
                                    disabled={blockIndex === blocks.length - 1}
                                  >
                                    <MoveDown className="w-4 h-4 mr-2" />
                                    Move Down
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator />
                                  
                                  <DropdownMenuItem
                                    onClick={() => removeBlock(sectionId, block.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this section? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removeSection(sectionId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function SectionsTree() {
  const currentTemplate = useCurrentTemplate();
  const { addSection, reorderSections } = useEditorStore();

  if (!currentTemplate) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-2">
          <EyeOff className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">No template selected</p>
        </div>
      </div>
    );
  }

  const sections = currentTemplate.sections;
  const availableSections = getAvailableSections();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border bg-background/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm text-foreground">Sections</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="default" className="h-7 w-7 p-0 rounded-full">
                <Plus className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-2">
                <h3 className="font-medium text-sm mb-2">Add Section</h3>
                {availableSections.map((section) => (
                  <DropdownMenuItem
                    key={section.type}
                    onClick={() => addSection(section.type)}
                    className="cursor-pointer rounded-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center mt-0.5">
                        <Plus className="w-3 h-3 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{section.label}</div>
                        {section.description && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {section.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {sections.length} section{sections.length !== 1 ? 's' : ''}
          </p>
          {sections.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              Template: {currentTemplate?.id}
            </Badge>
          )}
        </div>
      </div>

      {/* Sections List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {sections.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Eye className="w-8 h-8 text-muted-foreground mx-auto" />
              <div>
                <p className="text-sm font-medium">No sections yet</p>
                <p className="text-xs text-muted-foreground">
                  Add your first section to get started
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  {availableSections.map((section) => (
                    <DropdownMenuItem
                      key={section.type}
                      onClick={() => addSection(section.type)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      <div>
                        <div className="font-medium">{section.label}</div>
                        {section.description && (
                          <div className="text-xs text-muted-foreground">
                            {section.description}
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <DragDropContext
              onDragEnd={(result: DropResult) => {
                const { destination, source, draggableId, type } = result;
                if (!destination) return;
                if (destination.droppableId === source.droppableId && destination.index === source.index) return;
                if (type === 'SECTION') {
                  const newOrder = Array.from(sections.map(s => s.id));
                  newOrder.splice(source.index, 1);
                  newOrder.splice(destination.index, 0, draggableId);
                  reorderSections(newOrder);
                }
              }}
            >
              <Droppable droppableId="sections" type="SECTION">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                    {sections.map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(dragProvided) => (
                          <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                            <SectionItem
                              sectionId={section.id}
                              index={index}
                              total={sections.length}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
