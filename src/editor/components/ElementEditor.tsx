import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [padding, setPadding] = useState('');
  const [margin, setMargin] = useState('');
  const [background, setBackground] = useState('');
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [uploadPct, setUploadPct] = useState<number>(0);
  
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
    
    if (element instanceof HTMLImageElement) {
      setImageSource(element.src || '');
      setImageAlt(element.alt || '');
    }
    
    if (element instanceof HTMLAnchorElement) {
      setLinkHref(element.href || '');
    }

    // Load CSS values (use computed styles to reflect real styles)
    const computedStyle = window.getComputedStyle(element);
    setBackgroundColor(computedStyle.backgroundColor || element.style.backgroundColor || '');
    setTextColor(computedStyle.color || element.style.color || '');
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
              <div className="border rounded-md p-2">
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

        <Separator />

        {/* Styling Options */}
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
