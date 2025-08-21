import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Undo, 
  Type, 
  Image, 
  Link, 
  Palette,
  X,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { editingService } from '../services/EditingService';
import ImageLibrary from './ImageLibrary';
import { uploadMedia } from '../services/MediaService';

interface ElementEditorProps {
  element: HTMLElement | null;
  onClose: () => void;
  onSave: () => void;
}

interface ComputedStyles {
  // Typography
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  
  // Colors
  color: string;
  backgroundColor: string;
  
  // Spacing
  padding: string;
  margin: string;
  
  // Layout
  width: string;
  height: string;
  display: string;
  position: string;
  
  // Borders
  border: string;
  borderRadius: string;
  borderWidth: string;
  borderStyle: string;
  borderColor: string;
  
  // Effects
  boxShadow: string;
  opacity: string;
  transform: string;
  
  // Background
  background: string;
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
}

export default function ElementEditor({ element, onClose, onSave }: ElementEditorProps) {
  const [textContent, setTextContent] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkHref, setLinkHref] = useState('');
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [uploadPct, setUploadPct] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'content' | 'styles' | 'layout' | 'effects'>('content');
  
  const [elementData, setElementData] = useState<{
    id: string;
    type: string;
    pageId: string;
  } | null>(null);

  const [computedStyles, setComputedStyles] = useState<ComputedStyles>({
    fontSize: '',
    fontFamily: '',
    fontWeight: '',
    fontStyle: '',
    textDecoration: '',
    lineHeight: '',
    letterSpacing: '',
    textAlign: '',
    color: '',
    backgroundColor: '',
    padding: '',
    margin: '',
    width: '',
    height: '',
    display: '',
    position: '',
    border: '',
    borderRadius: '',
    borderWidth: '',
    borderStyle: '',
    borderColor: '',
    boxShadow: '',
    opacity: '',
    transform: '',
    background: '',
    backgroundImage: '',
    backgroundSize: '',
    backgroundPosition: '',
    backgroundRepeat: ''
  });

  // Load element data when element changes
  useEffect(() => {
    if (!element) {
      setElementData(null);
      return;
    }

    const data = (element as any)._editorData;
    setElementData(data);

    // Load current values
    setTextContent(element.textContent || '');
    
    if (element instanceof HTMLImageElement) {
      setImageSource(element.src || '');
      setImageAlt(element.alt || '');
    }
    
    if (element instanceof HTMLAnchorElement) {
      setLinkHref(element.href || '');
    }

    // Load computed styles
    const computed = window.getComputedStyle(element);
    setComputedStyles({
      fontSize: computed.fontSize || '',
      fontFamily: computed.fontFamily || '',
      fontWeight: computed.fontWeight || '',
      fontStyle: computed.fontStyle || '',
      textDecoration: computed.textDecoration || '',
      lineHeight: computed.lineHeight || '',
      letterSpacing: computed.letterSpacing || '',
      textAlign: computed.textAlign || '',
      color: computed.color || '',
      backgroundColor: computed.backgroundColor || '',
      padding: computed.padding || '',
      margin: computed.margin || '',
      width: computed.width || '',
      height: computed.height || '',
      display: computed.display || '',
      position: computed.position || '',
      border: computed.border || '',
      borderRadius: computed.borderRadius || '',
      borderWidth: computed.borderWidth || '',
      borderStyle: computed.borderStyle || '',
      borderColor: computed.borderColor || '',
      boxShadow: computed.boxShadow || '',
      opacity: computed.opacity || '',
      transform: computed.transform || '',
      background: computed.background || '',
      backgroundImage: computed.backgroundImage || '',
      backgroundSize: computed.backgroundSize || '',
      backgroundPosition: computed.backgroundPosition || '',
      backgroundRepeat: computed.backgroundRepeat || ''
    });
  }, [element]);

  const handleSave = () => {
    if (!element || !elementData) return;

    const { id, type, pageId } = elementData;

    // Save text content changes
    if (textContent !== element.textContent) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'textContent',
        textContent,
        element.textContent || ''
      );
      element.textContent = textContent;
    }

    // Save image changes
    if (element instanceof HTMLImageElement) {
      if (imageSource !== element.src) {
        editingService.saveElementEdit(
          pageId,
          id,
          type,
          'src',
          imageSource,
          element.src
        );
        element.src = imageSource;
      }
      
      if (imageAlt !== element.alt) {
        editingService.saveElementEdit(
          pageId,
          id,
          type,
          'alt',
          imageAlt,
          element.alt
        );
        element.alt = imageAlt;
      }
    }

    // Save link changes
    if (element instanceof HTMLAnchorElement && linkHref !== element.href) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'href',
        linkHref,
        element.href
      );
      element.href = linkHref;
    }

    // Save style changes
    Object.entries(computedStyles).forEach(([property, value]) => {
      if (value && value !== element.style[property as any]) {
        editingService.saveElementEdit(
          pageId,
          id,
          type,
          `style.${property}`,
          value,
          element.style[property as any] || ''
        );
        (element.style as any)[property] = value;
      }
    });

    onSave();
  };

  const handleUndo = () => {
    if (!elementData) return;
    
    const { id, pageId } = elementData;
    
    // Clear all edits for this element
    editingService.clearPageEdits(pageId);
    
    // Reload the page to reset the element
    window.location.reload();
  };

  const duplicateElement = () => {
    if (!element || !elementData) return;
    
    const clone = element.cloneNode(true) as HTMLElement;
    // Generate new ID for the clone
    const newId = `${elementData.id}-copy-${Date.now()}`;
    clone.id = newId;
    
    // Insert after the original element
    element.parentNode?.insertBefore(clone, element.nextSibling);
    
    // Save the duplication
    editingService.saveElementEdit(
      elementData.pageId,
      newId,
      elementData.type,
      'duplicate',
      true,
      false
    );
  };

  const deleteElement = () => {
    if (!element || !elementData) return;
    
    if (confirm('Are you sure you want to delete this element?')) {
      editingService.saveElementEdit(
        elementData.pageId,
        elementData.id,
        elementData.type,
        'deleted',
        true,
        false
      );
      element.remove();
      onClose();
    }
  };

  const toggleVisibility = () => {
    if (!element) return;
    
    const isVisible = element.style.display !== 'none';
    const newDisplay = isVisible ? 'none' : 'block';
    
    element.style.display = newDisplay;
    
    if (elementData) {
      editingService.saveElementEdit(
        elementData.pageId,
        elementData.id,
        elementData.type,
        'style.display',
        newDisplay,
        isVisible ? 'block' : 'none'
      );
    }
  };

  if (!element || !elementData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-sm">Element Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Click on an element in the preview to edit it
          </p>
        </CardContent>
      </Card>
    );
  }

  const { type } = elementData;
  const isVisible = element.style.display !== 'none';

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Edit {type.toUpperCase()}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {elementData.id}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVisibility}
              className="h-6 w-6 p-0"
              title={isVisible ? 'Hide element' : 'Show element'}
            >
              {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
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
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b">
          {(['content', 'styles', 'layout', 'effects'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* Text Content Editor */}
            {(type === 'h1' || type === 'h2' || type === 'h3' || type === 'h4' || type === 'h5' || type === 'h6' || type === 'p' || type === 'button') && (
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  Text Content
                </Label>
                {type === 'p' ? (
                  <Textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter text content..."
                    className="text-xs"
                    rows={3}
                  />
                ) : (
                  <Input
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter text content..."
                    className="text-xs"
                  />
                )}
              </div>
            )}

            {/* Image Editor */}
            {type === 'img' && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Image Source
                  </Label>
                  <Input
                    value={imageSource}
                    onChange={(e) => setImageSource(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="text-xs"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowImageLibrary(true)}>
                      Choose from Library
                    </Button>
                    <label>
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setUploadPct(1);
                          const result = await uploadMedia(file, 'theme-media', (pct) => setUploadPct(pct));
                          setImageSource(result.url);
                          setUploadPct(0);
                        } catch (err) {
                          console.error('Upload failed', err);
                          setUploadPct(0);
                        }
                      }} />
                      <Button size="sm" variant="outline" className="text-xs">Upload</Button>
                    </label>
                  </div>
                  {uploadPct > 0 && (
                    <div className="w-full h-2 bg-muted rounded overflow-hidden">
                      <div className="h-2 bg-primary" style={{ width: `${uploadPct}%` }} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Alt Text</Label>
                  <Input
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Image description..."
                    className="text-xs"
                  />
                </div>
                {showImageLibrary && (
                  <div className="border rounded-md p-2 max-h-64 overflow-hidden">
                    <ImageLibrary onSelect={(img) => { setImageSource(img.url); setShowImageLibrary(false); }} />
                  </div>
                )}
              </>
            )}

            {/* Link Editor */}
            {type === 'a' && (
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Link className="h-3 w-3" />
                  Link URL
                </Label>
                <Input
                  value={linkHref}
                  onChange={(e) => setLinkHref(e.target.value)}
                  placeholder="https://example.com"
                  className="text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* Styles Tab */}
        {activeTab === 'styles' && (
          <div className="space-y-4">
            {/* Typography */}
            <div className="space-y-3">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Type className="h-3 w-3" />
                Typography
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Font Size</Label>
                  <Input
                    value={computedStyles.fontSize}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, fontSize: e.target.value }))}
                    placeholder="16px"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Font Family</Label>
                  <Input
                    value={computedStyles.fontFamily}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, fontFamily: e.target.value }))}
                    placeholder="Arial, sans-serif"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Font Weight</Label>
                  <select
                    value={computedStyles.fontWeight}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, fontWeight: e.target.value }))}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Font weight"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                    <option value="600">600</option>
                    <option value="700">700</option>
                    <option value="800">800</option>
                    <option value="900">900</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Line Height</Label>
                  <Input
                    value={computedStyles.lineHeight}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, lineHeight: e.target.value }))}
                    placeholder="1.5"
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Text Formatting */}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={computedStyles.fontStyle === 'italic' ? 'default' : 'outline'}
                  onClick={() => setComputedStyles(prev => ({ 
                    ...prev, 
                    fontStyle: prev.fontStyle === 'italic' ? 'normal' : 'italic' 
                  }))}
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={computedStyles.fontWeight === 'bold' ? 'default' : 'outline'}
                  onClick={() => setComputedStyles(prev => ({ 
                    ...prev, 
                    fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' 
                  }))}
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={computedStyles.textDecoration.includes('underline') ? 'default' : 'outline'}
                  onClick={() => setComputedStyles(prev => ({ 
                    ...prev, 
                    textDecoration: prev.textDecoration.includes('underline') 
                      ? prev.textDecoration.replace('underline', '').trim() 
                      : prev.textDecoration + ' underline' 
                  }))}
                  className="h-8 w-8 p-0"
                >
                  <Underline className="h-3 w-3" />
                </Button>
              </div>

              {/* Text Alignment */}
              <div className="flex gap-1">
                {(['left', 'center', 'right', 'justify'] as const).map((align) => (
                  <Button
                    key={align}
                    size="sm"
                    variant={computedStyles.textAlign === align ? 'default' : 'outline'}
                    onClick={() => setComputedStyles(prev => ({ ...prev, textAlign: align }))}
                    className="h-8 w-8 p-0"
                    title={`Align ${align}`}
                  >
                    {align === 'left' && <AlignLeft className="h-3 w-3" />}
                    {align === 'center' && <AlignCenter className="h-3 w-3" />}
                    {align === 'right' && <AlignRight className="h-3 w-3" />}
                    {align === 'justify' && <AlignJustify className="h-3 w-3" />}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Colors */}
            <div className="space-y-3">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Palette className="h-3 w-3" />
                Colors
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Text Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={computedStyles.color}
                      onChange={(e) => setComputedStyles(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-8 p-1 border-2"
                    />
                    <Input
                      value={computedStyles.color}
                      onChange={(e) => setComputedStyles(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#000000"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={computedStyles.backgroundColor}
                      onChange={(e) => setComputedStyles(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-8 p-1 border-2"
                    />
                    <Input
                      value={computedStyles.backgroundColor}
                      onChange={(e) => setComputedStyles(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#ffffff"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Spacing */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Spacing</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Padding</Label>
                  <Input
                    value={computedStyles.padding}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, padding: e.target.value }))}
                    placeholder="16px"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Margin</Label>
                  <Input
                    value={computedStyles.margin}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, margin: e.target.value }))}
                    placeholder="0"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Dimensions */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Dimensions</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Width</Label>
                  <Input
                    value={computedStyles.width}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, width: e.target.value }))}
                    placeholder="auto"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Height</Label>
                  <Input
                    value={computedStyles.height}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, height: e.target.value }))}
                    placeholder="auto"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Display</Label>
                  <select
                    value={computedStyles.display}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, display: e.target.value }))}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Display property"
                  >
                    <option value="block">Block</option>
                    <option value="inline">Inline</option>
                    <option value="inline-block">Inline Block</option>
                    <option value="flex">Flex</option>
                    <option value="grid">Grid</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Position</Label>
                  <select
                    value={computedStyles.position}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Position property"
                  >
                    <option value="static">Static</option>
                    <option value="relative">Relative</option>
                    <option value="absolute">Absolute</option>
                    <option value="fixed">Fixed</option>
                    <option value="sticky">Sticky</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            {/* Borders */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Borders</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Border Width</Label>
                  <Input
                    value={computedStyles.borderWidth}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, borderWidth: e.target.value }))}
                    placeholder="1px"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Border Radius</Label>
                  <Input
                    value={computedStyles.borderRadius}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, borderRadius: e.target.value }))}
                    placeholder="4px"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Border Style</Label>
                  <select
                    value={computedStyles.borderStyle}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, borderStyle: e.target.value }))}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Border style"
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="double">Double</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Border Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={computedStyles.borderColor}
                      onChange={(e) => setComputedStyles(prev => ({ ...prev, borderColor: e.target.value }))}
                      className="w-12 h-8 p-1 border-2"
                    />
                    <Input
                      value={computedStyles.borderColor}
                      onChange={(e) => setComputedStyles(prev => ({ ...prev, borderColor: e.target.value }))}
                      placeholder="#000000"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Shadows & Effects */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Shadows & Effects</Label>
              
              <div className="space-y-2">
                <Label className="text-xs">Box Shadow</Label>
                <Input
                  value={computedStyles.boxShadow}
                  onChange={(e) => setComputedStyles(prev => ({ ...prev, boxShadow: e.target.value }))}
                  placeholder="0 2px 4px rgba(0,0,0,0.1)"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Opacity</Label>
                  <Slider
                    value={[parseFloat(computedStyles.opacity) || 1]}
                    onValueChange={(values) => setComputedStyles(prev => ({ ...prev, opacity: values[0].toString() }))}
                    min={0}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {Math.round((parseFloat(computedStyles.opacity) || 1) * 100)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Transform</Label>
                  <Input
                    value={computedStyles.transform}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, transform: e.target.value }))}
                    placeholder="scale(1.1)"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Background */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Background</Label>
              
              <div className="space-y-2">
                <Label className="text-xs">Background Image</Label>
                <Input
                  value={computedStyles.backgroundImage}
                  onChange={(e) => setComputedStyles(prev => ({ ...prev, backgroundImage: e.target.value }))}
                  placeholder="url('image.jpg')"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Background Size</Label>
                  <select
                    value={computedStyles.backgroundSize}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, backgroundSize: e.target.value }))}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Background size"
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="auto">Auto</option>
                    <option value="100%">100%</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Background Position</Label>
                  <select
                    value={computedStyles.backgroundPosition}
                    onChange={(e) => setComputedStyles(prev => ({ ...prev, backgroundPosition: e.target.value }))}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Background position"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            size="sm"
            className="flex-1 text-xs"
          >
            <Save className="h-3 w-3 mr-1" />
            Save Changes
          </Button>
          <Button
            onClick={handleUndo}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Undo className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
