import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlignJustify,
  Layers,
  Layout,
  Sparkles,
  Settings
} from 'lucide-react';
import { EditableElement } from '../services/ElementDiscoveryService';
import ImageLibrary from './ImageLibrary';
import { uploadMedia } from '../services/MediaService';

interface UniversalElementEditorProps {
  editableElement: EditableElement | null;
  onClose: () => void;
  onSave: () => void;
}

interface StyleValues {
  // Typography
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  textTransform: string;
  
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
  top: string;
  right: string;
  bottom: string;
  left: string;
  zIndex: string;
  
  // Flexbox/Grid
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  gap: string;
  
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

export default function UniversalElementEditor({ 
  editableElement, 
  onClose, 
  onSave 
}: UniversalElementEditorProps) {
  const [activeTab, setActiveTab] = useState('content');
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Content values
  const [textContent, setTextContent] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkHref, setLinkHref] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  // Style values
  const [styleValues, setStyleValues] = useState<StyleValues>({
    fontSize: '',
    fontFamily: '',
    fontWeight: '',
    fontStyle: '',
    textDecoration: '',
    lineHeight: '',
    letterSpacing: '',
    textAlign: '',
    textTransform: '',
    color: '',
    backgroundColor: '',
    padding: '',
    margin: '',
    width: '',
    height: '',
    display: '',
    position: '',
    top: '',
    right: '',
    bottom: '',
    left: '',
    zIndex: '',
    flexDirection: '',
    justifyContent: '',
    alignItems: '',
    gap: '',
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

  // Initialize values when element changes
  useEffect(() => {
    if (!editableElement) return;

    const { element, computedStyles } = editableElement;
    
    // Set content values
    setTextContent(element.textContent?.trim() || '');
    
    if (element instanceof HTMLImageElement) {
      setImageSource(element.src || '');
      setImageAlt(element.alt || '');
    }
    
    if (element instanceof HTMLAnchorElement) {
      setLinkHref(element.href || '');
    }
    
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      setPlaceholder(element.placeholder || '');
      setInputValue(element.value || '');
    }
    
    // Set style values from computed styles
    setStyleValues({
      fontSize: computedStyles.fontSize || '',
      fontFamily: computedStyles.fontFamily || '',
      fontWeight: computedStyles.fontWeight || '',
      fontStyle: computedStyles.fontStyle || '',
      textDecoration: computedStyles.textDecoration || '',
      lineHeight: computedStyles.lineHeight || '',
      letterSpacing: computedStyles.letterSpacing || '',
      textAlign: computedStyles.textAlign || '',
      textTransform: computedStyles.textTransform || '',
      color: computedStyles.color || '',
      backgroundColor: computedStyles.backgroundColor || '',
      padding: computedStyles.padding || '',
      margin: computedStyles.margin || '',
      width: computedStyles.width || '',
      height: computedStyles.height || '',
      display: computedStyles.display || '',
      position: computedStyles.position || '',
      top: computedStyles.top || '',
      right: computedStyles.right || '',
      bottom: computedStyles.bottom || '',
      left: computedStyles.left || '',
      zIndex: computedStyles.zIndex || '',
      flexDirection: computedStyles.flexDirection || '',
      justifyContent: computedStyles.justifyContent || '',
      alignItems: computedStyles.alignItems || '',
      gap: computedStyles.gap || '',
      border: computedStyles.border || '',
      borderRadius: computedStyles.borderRadius || '',
      borderWidth: computedStyles.borderWidth || '',
      borderStyle: computedStyles.borderStyle || '',
      borderColor: computedStyles.borderColor || '',
      boxShadow: computedStyles.boxShadow || '',
      opacity: computedStyles.opacity || '',
      transform: computedStyles.transform || '',
      background: computedStyles.background || '',
      backgroundImage: computedStyles.backgroundImage || '',
      backgroundSize: computedStyles.backgroundSize || '',
      backgroundPosition: computedStyles.backgroundPosition || '',
      backgroundRepeat: computedStyles.backgroundRepeat || ''
    });
  }, [editableElement]);

  const handleSave = () => {
    if (!editableElement) return;

    const { element } = editableElement;
    
    // Apply content changes
    if (element.textContent !== textContent) {
      element.textContent = textContent;
    }
    
    if (element instanceof HTMLImageElement) {
      if (element.src !== imageSource) element.src = imageSource;
      if (element.alt !== imageAlt) element.alt = imageAlt;
    }
    
    if (element instanceof HTMLAnchorElement && element.href !== linkHref) {
      element.href = linkHref;
    }
    
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      if (element.placeholder !== placeholder) element.placeholder = placeholder;
      if (element.value !== inputValue) element.value = inputValue;
    }
    
    // Apply style changes
    Object.entries(styleValues).forEach(([property, value]) => {
      if (value && value !== element.style[property as any]) {
        (element.style as any)[property] = value;
      }
    });

    onSave();
  };

  const handleImageSelect = (image: any) => {
    setImageSource(image.url);
    setShowImageLibrary(false);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadProgress(1);
      const result = await uploadMedia(file, 'theme-media', (pct) => setUploadProgress(pct));
      setImageSource(result.url);
      setUploadProgress(0);
    } catch (err) {
      console.error('Upload failed', err);
      setUploadProgress(0);
    }
  };

  const updateStyleValue = (property: keyof StyleValues, value: string) => {
    setStyleValues(prev => ({ ...prev, [property]: value }));
  };

  if (!editableElement) {
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

  const { type, tagName, id } = editableElement;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Edit {tagName.toUpperCase()}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {id}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="text-xs">
              <Type className="h-3 w-3 mr-1" />
              Content
            </TabsTrigger>
            <TabsTrigger value="styles" className="text-xs">
              <Palette className="h-3 w-3 mr-1" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="layout" className="text-xs">
              <Layout className="h-3 w-3 mr-1" />
              Layout
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Effects
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            {/* Text Content */}
            {(type === 'text' || type === 'container' || type === 'button') && (
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  Text Content
                </Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text content..."
                  className="text-xs min-h-[80px]"
                />
              </div>
            )}

            {/* Image Content */}
            {type === 'image' && (
              <div className="space-y-3">
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
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs" 
                      onClick={() => setShowImageLibrary(true)}
                    >
                      Choose from Library
                    </Button>
                    <label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }} 
                      />
                      <Button size="sm" variant="outline" className="text-xs">
                        Upload
                      </Button>
                    </label>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="w-full h-2 bg-muted rounded overflow-hidden">
                      <div className="h-2 bg-primary" style={{ width: `${uploadProgress}%` }} />
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
                    <ImageLibrary onSelect={handleImageSelect} />
                  </div>
                )}
              </div>
            )}

            {/* Link Content */}
            {type === 'link' && (
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

            {/* Input Content */}
            {(type === 'input' || type === 'textarea') && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">Placeholder</Label>
                  <Input
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    placeholder="Enter placeholder text..."
                    className="text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Default Value</Label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter default value..."
                    className="text-xs"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Styles Tab */}
          <TabsContent value="styles" className="space-y-4">
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
                    value={styleValues.fontSize}
                    onChange={(e) => updateStyleValue('fontSize', e.target.value)}
                    placeholder="16px"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Font Family</Label>
                  <Input
                    value={styleValues.fontFamily}
                    onChange={(e) => updateStyleValue('fontFamily', e.target.value)}
                    placeholder="Arial, sans-serif"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Font Weight</Label>
                  <select
                    value={styleValues.fontWeight}
                    onChange={(e) => updateStyleValue('fontWeight', e.target.value)}
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
                    value={styleValues.lineHeight}
                    onChange={(e) => updateStyleValue('lineHeight', e.target.value)}
                    placeholder="1.5"
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Letter Spacing</Label>
                  <Input
                    value={styleValues.letterSpacing}
                    onChange={(e) => updateStyleValue('letterSpacing', e.target.value)}
                    placeholder="0px"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Text Transform</Label>
                  <select
                    value={styleValues.textTransform}
                    onChange={(e) => updateStyleValue('textTransform', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Text transform"
                  >
                    <option value="none">None</option>
                    <option value="capitalize">Capitalize</option>
                    <option value="uppercase">Uppercase</option>
                    <option value="lowercase">Lowercase</option>
                  </select>
                </div>
              </div>

              {/* Text Formatting */}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={styleValues.fontStyle === 'italic' ? 'default' : 'outline'}
                  onClick={() => updateStyleValue('fontStyle', styleValues.fontStyle === 'italic' ? 'normal' : 'italic')}
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={styleValues.fontWeight === 'bold' ? 'default' : 'outline'}
                  onClick={() => updateStyleValue('fontWeight', styleValues.fontWeight === 'bold' ? 'normal' : 'bold')}
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={styleValues.textDecoration.includes('underline') ? 'default' : 'outline'}
                  onClick={() => updateStyleValue('textDecoration', styleValues.textDecoration.includes('underline') 
                    ? styleValues.textDecoration.replace('underline', '').trim() 
                    : styleValues.textDecoration + ' underline')}
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
                    variant={styleValues.textAlign === align ? 'default' : 'outline'}
                    onClick={() => updateStyleValue('textAlign', align)}
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
                      value={styleValues.color}
                      onChange={(e) => updateStyleValue('color', e.target.value)}
                      className="w-12 h-8 p-1 border-2"
                    />
                    <Input
                      value={styleValues.color}
                      onChange={(e) => updateStyleValue('color', e.target.value)}
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
                      value={styleValues.backgroundColor}
                      onChange={(e) => updateStyleValue('backgroundColor', e.target.value)}
                      className="w-12 h-8 p-1 border-2"
                    />
                    <Input
                      value={styleValues.backgroundColor}
                      onChange={(e) => updateStyleValue('backgroundColor', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4">
            {/* Spacing */}
            <div className="space-y-3">
              <Label className="text-xs font-medium flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Spacing
              </Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Padding</Label>
                  <Input
                    value={styleValues.padding}
                    onChange={(e) => updateStyleValue('padding', e.target.value)}
                    placeholder="16px"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Margin</Label>
                  <Input
                    value={styleValues.margin}
                    onChange={(e) => updateStyleValue('margin', e.target.value)}
                    placeholder="0px"
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
                    value={styleValues.width}
                    onChange={(e) => updateStyleValue('width', e.target.value)}
                    placeholder="auto"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Height</Label>
                  <Input
                    value={styleValues.height}
                    onChange={(e) => updateStyleValue('height', e.target.value)}
                    placeholder="auto"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Flexbox */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Flexbox</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Flex Direction</Label>
                  <select
                    value={styleValues.flexDirection}
                    onChange={(e) => updateStyleValue('flexDirection', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                    aria-label="Flex direction"
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Justify Content</Label>
                  <select
                    value={styleValues.justifyContent}
                    onChange={(e) => updateStyleValue('justifyContent', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                  >
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="space-between">Space Between</option>
                    <option value="space-around">Space Around</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Align Items</Label>
                  <select
                    value={styleValues.alignItems}
                    onChange={(e) => updateStyleValue('alignItems', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                  >
                    <option value="stretch">Stretch</option>
                    <option value="flex-start">Start</option>
                    <option value="center">Center</option>
                    <option value="flex-end">End</option>
                    <option value="baseline">Baseline</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Gap</Label>
                  <Input
                    value={styleValues.gap}
                    onChange={(e) => updateStyleValue('gap', e.target.value)}
                    placeholder="8px"
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-4">
            {/* Borders */}
            <div className="space-y-3">
              <Label className="text-xs font-medium">Borders</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Border Width</Label>
                  <Input
                    value={styleValues.borderWidth}
                    onChange={(e) => updateStyleValue('borderWidth', e.target.value)}
                    placeholder="1px"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Border Style</Label>
                  <select
                    value={styleValues.borderStyle}
                    onChange={(e) => updateStyleValue('borderStyle', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                    <option value="double">Double</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Border Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={styleValues.borderColor}
                      onChange={(e) => updateStyleValue('borderColor', e.target.value)}
                      className="w-12 h-8 p-1 border-2"
                    />
                    <Input
                      value={styleValues.borderColor}
                      onChange={(e) => updateStyleValue('borderColor', e.target.value)}
                      placeholder="#000000"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Border Radius</Label>
                  <Input
                    value={styleValues.borderRadius}
                    onChange={(e) => updateStyleValue('borderRadius', e.target.value)}
                    placeholder="4px"
                    className="text-xs"
                  />
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
                  value={styleValues.boxShadow}
                  onChange={(e) => updateStyleValue('boxShadow', e.target.value)}
                  placeholder="0 2px 4px rgba(0,0,0,0.1)"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Opacity</Label>
                  <Input
                    value={styleValues.opacity}
                    onChange={(e) => updateStyleValue('opacity', e.target.value)}
                    placeholder="1"
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Transform</Label>
                  <Input
                    value={styleValues.transform}
                    onChange={(e) => updateStyleValue('transform', e.target.value)}
                    placeholder="scale(1)"
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
                  value={styleValues.backgroundImage}
                  onChange={(e) => updateStyleValue('backgroundImage', e.target.value)}
                  placeholder="url('image.jpg')"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Background Size</Label>
                  <select
                    value={styleValues.backgroundSize}
                    onChange={(e) => updateStyleValue('backgroundSize', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
                  >
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Background Position</Label>
                  <select
                    value={styleValues.backgroundPosition}
                    onChange={(e) => updateStyleValue('backgroundPosition', e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 bg-background"
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
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Undo className="h-3 w-3 mr-1" />
              Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-3 w-3 mr-1" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
