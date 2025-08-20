import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  Image, 
  Link, 
  Palette, 
  Layout, 
  Sparkles, 
  Settings,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit3
} from 'lucide-react';
import { EditableElement } from '../services/ElementDiscoveryService';
import UniversalElementEditor from './UniversalElementEditor';

interface EnhancedPropertiesPanelProps {
  selectedElement: EditableElement | null;
  onClose: () => void;
}

export default function EnhancedPropertiesPanel({ 
  selectedElement, 
  onClose 
}: EnhancedPropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('editor');
  const [showElementEditor, setShowElementEditor] = useState(false);

  if (!selectedElement) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Element Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click on any element in the preview to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const { type, tagName, id, className, textContent, src, alt, href, computedStyles } = selectedElement;

  const handleSave = () => {
    // The UniversalElementEditor handles saving
    setShowElementEditor(false);
  };

  const toggleVisibility = () => {
    const element = selectedElement.element;
    const isVisible = element.style.display !== 'none';
    element.style.display = isVisible ? 'none' : 'block';
  };

  const duplicateElement = () => {
    const element = selectedElement.element;
    const clone = element.cloneNode(true) as HTMLElement;
    const newId = `${id}-copy-${Date.now()}`;
    clone.id = newId;
    element.parentNode?.insertBefore(clone, element.nextSibling);
  };

  const deleteElement = () => {
    if (confirm('Are you sure you want to delete this element?')) {
      selectedElement.element.remove();
      onClose();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Element Properties</CardTitle>
            <Badge variant="outline" className="text-xs">
              {tagName.toUpperCase()}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {type}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="h-6 w-6 p-0"
              title="Toggle visibility"
            >
              {selectedElement.element.style.display !== 'none' ? 
                <Eye className="h-3 w-3" /> : 
                <EyeOff className="h-3 w-3" />
              }
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={duplicateElement}
              className="h-6 w-6 p-0"
              title="Duplicate element"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={deleteElement}
              className="h-6 w-6 p-0 text-destructive"
              title="Delete element"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
              title="Close"
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="text-xs">
              <Edit3 className="h-3 w-3 mr-1" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Info
            </TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-4">
            {showElementEditor ? (
              <UniversalElementEditor
                editableElement={selectedElement}
                onClose={() => setShowElementEditor(false)}
                onSave={handleSave}
              />
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <Button 
                    onClick={() => setShowElementEditor(true)}
                    className="w-full"
                  >
                    <Edit3 className="h-3 w-3 mr-2" />
                    Open Element Editor
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground text-center">
                  <p>Click the button above to open the full element editor</p>
                  <p className="text-xs mt-1">
                    Edit content, styles, layout, and effects for this element
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            {/* Element Information */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Element Information</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Tag:</span>
                  <div className="font-mono">{tagName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <div className="font-mono">{type}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <div className="font-mono">{id}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Classes:</span>
                  <div className="font-mono">{className || 'none'}</div>
                </div>
              </div>
            </div>

            <hr />

            {/* Content Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Content Preview</h4>
              
              {textContent && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Text Content:</span>
                  <div className="text-xs bg-muted p-2 rounded max-h-20 overflow-y-auto">
                    {textContent}
                  </div>
                </div>
              )}
              
              {src && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Image Source:</span>
                  <div className="text-xs font-mono break-all bg-muted p-2 rounded">
                    {src}
                  </div>
                </div>
              )}
              
              {alt && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Alt Text:</span>
                  <div className="text-xs bg-muted p-2 rounded">
                    {alt}
                  </div>
                </div>
              )}
              
              {href && (
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Link URL:</span>
                  <div className="text-xs font-mono break-all bg-muted p-2 rounded">
                    {href}
                  </div>
                </div>
              )}
            </div>

            <hr />

            {/* Computed Styles Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Key Styles</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Font Size:</span>
                  <div className="font-mono">{computedStyles.fontSize}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Color:</span>
                  <div className="font-mono">{computedStyles.color}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Background:</span>
                  <div className="font-mono">{computedStyles.backgroundColor}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Padding:</span>
                  <div className="font-mono">{computedStyles.padding}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Margin:</span>
                  <div className="font-mono">{computedStyles.margin}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Width:</span>
                  <div className="font-mono">{computedStyles.width}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Height:</span>
                  <div className="font-mono">{computedStyles.height}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Display:</span>
                  <div className="font-mono">{computedStyles.display}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
