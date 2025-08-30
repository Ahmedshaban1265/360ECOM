import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Undo, 
  Type, 
  Image, 
  Link, 
  Palette,
  X
} from 'lucide-react';
import { editingService } from '../services/EditingService';
import ImageSelectionModal from './ImageSelectionModal';
import { ImageItem } from './ShopifyImageLibrary';

interface ElementEditorProps {
  element: HTMLElement | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ElementEditor({ element, onClose, onSave }: ElementEditorProps) {
  const [textContent, setTextContent] = useState('');
  const [imageSource, setImageSource] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [linkHref, setLinkHref] = useState('');
  const [attributes, setAttributes] = useState<Array<{ name: string; value: string }>>([]);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [padding, setPadding] = useState('');
  const [margin, setMargin] = useState('');
  const [background, setBackground] = useState('');
  const [showImageSelection, setShowImageSelection] = useState(false);
  
  const [elementData, setElementData] = useState<{
    id: string;
    type: string;
    pageId: string;
  } | null>(null);

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

    // Load attributes (excluding internal editor attrs)
    const attrs = Array.from(element.attributes)
      .filter(attr => !attr.name.startsWith('data-editor-'))
      .map(attr => ({ name: attr.name, value: attr.value }));
    setAttributes(attrs);
    
    if (element instanceof HTMLImageElement) {
      setImageSource(element.src || '');
      setImageAlt(element.alt || '');
    }
    
    if (element instanceof HTMLAnchorElement) {
      setLinkHref(element.href || '');
    }

    // Load CSS values (use computed styles to reflect real styles)
    const computedStyle = window.getComputedStyle(element);
    const toHexColor = (value: string) => {
      if (!value) return '';
      const rgbMatch = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (rgbMatch) {
        const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1], 10)));
        const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2], 10)));
        const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3], 10)));
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }
      // already hex or named color; pass through for now
      return value;
    };
    setBackgroundColor(toHexColor(computedStyle.backgroundColor || element.style.backgroundColor || ''));
    setTextColor(toHexColor(computedStyle.color || element.style.color || ''));
    setFontSize(computedStyle.fontSize || element.style.fontSize || '');
    setPadding(computedStyle.padding || element.style.padding || '');
    setMargin(computedStyle.margin || element.style.margin || '');
    setBackground(computedStyle.background || (element as HTMLElement).style.background || '');
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

    // Save attribute changes (generic)
    const existingAttrs = new Map<string, string>();
    Array.from(element.attributes).forEach(attr => {
      if (!attr.name.startsWith('data-editor-')) {
        existingAttrs.set(attr.name, attr.value);
      }
    });
    attributes.forEach(({ name, value }) => {
      const prev = existingAttrs.get(name) || '';
      if (value !== prev) {
        editingService.saveElementEdit(
          pageId,
          id,
          type,
          `attr.${name}`,
          value,
          prev
        );
        try {
          if (value === '') {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value);
          }
        } catch {}
      }
      existingAttrs.delete(name);
    });
    // Removed attributes
    existingAttrs.forEach((prev, name) => {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        `attr.${name}`,
        '',
        prev
      );
      element.removeAttribute(name);
    });

    // Save style changes
    if (backgroundColor && backgroundColor !== element.style.backgroundColor) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'style.backgroundColor',
        backgroundColor,
        element.style.backgroundColor
      );
      element.style.backgroundColor = backgroundColor;
    }

    if (textColor && textColor !== element.style.color) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'style.color',
        textColor,
        element.style.color
      );
      element.style.color = textColor;
    }

    if (fontSize && fontSize !== element.style.fontSize) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'style.fontSize',
        fontSize,
        element.style.fontSize
      );
      element.style.fontSize = fontSize;
    }

    if (padding && padding !== element.style.padding) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'style.padding',
        padding,
        element.style.padding
      );
      element.style.padding = padding;
    }

    if (margin && margin !== element.style.margin) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'style.margin',
        margin,
        element.style.margin
      );
      element.style.margin = margin;
    }

    if (background && background !== element.style.background) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'style.background',
        background,
        element.style.background
      );
      element.style.background = background;
    }

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
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="styles" className="text-xs">Styles</TabsTrigger>
            <TabsTrigger value="attributes" className="text-xs">Attributes</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-4">
            {!(type === 'img') && (
              <div className="space-y-2">
                <Label className="text-xs flex items-center gap-1">
                  <Type className="h-3 w-3" />
                  Text Content
                </Label>
                <Textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter text content..."
                  className="text-xs"
                  rows={3}
                />
              </div>
            )}

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
                  <Button size="sm" variant="outline" className="text-xs w-full" onClick={() => setShowImageSelection(true)}>
                    Select Image
                  </Button>
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
                <ImageSelectionModal
                  open={showImageSelection}
                  onOpenChange={setShowImageSelection}
                  onSelect={(image) => {
                    setImageSource(image.url);
                  }}
                />
              </>
            )}

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
          </TabsContent>

          <TabsContent value="styles" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label className="text-xs flex items-center gap-1">
                <Palette className="h-3 w-3" />
                Styling
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Background</Label>
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Text Color</Label>
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Font Size</Label>
                <Input
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  placeholder="16px, 1rem, etc."
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Padding</Label>
                <Input
                  value={padding}
                  onChange={(e) => setPadding(e.target.value)}
                  placeholder="e.g. 1rem 2rem"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Margin</Label>
                <Input
                  value={margin}
                  onChange={(e) => setMargin(e.target.value)}
                  placeholder="e.g. 0 auto"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Background (CSS)</Label>
                <Input
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="e.g. #fff or url(...) center/cover"
                  className="text-xs"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-xs">Attributes</Label>
              <div className="space-y-2">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2">
                    <Input
                      value={attr.name}
                      onChange={(e) => {
                        const next = [...attributes];
                        next[idx] = { ...attr, name: e.target.value };
                        setAttributes(next);
                      }}
                      placeholder="name (e.g. id, class, data-foo)"
                      className="col-span-2 text-xs"
                    />
                    <Input
                      value={attr.value}
                      onChange={(e) => {
                        const next = [...attributes];
                        next[idx] = { ...attr, value: e.target.value };
                        setAttributes(next);
                      }}
                      placeholder="value"
                      className="col-span-3 text-xs"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => setAttributes([...attributes, { name: '', value: '' }])}
                  >
                    Add attribute
                  </Button>
                  {attributes.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => setAttributes(attributes.filter(a => a.name))}
                    >
                      Clean empty
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
