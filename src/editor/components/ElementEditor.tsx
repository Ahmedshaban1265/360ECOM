import { useState, useEffect, useMemo } from 'react';
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
  Copy,
  SquareStack,
  EyeOff,
  Eye,
  X
} from 'lucide-react';
import { editingService } from '../services/EditingService';
import ImageLibrary from './ImageLibrary';
import { uploadMedia } from '../services/MediaService';
import { saveDraftElementEdits } from '../services/EditsFirestoreService';
import { getRealPagesList } from '../utils/pageExtractor';

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
  const [fontWeight, setFontWeight] = useState('');
  const [lineHeight, setLineHeight] = useState('');
  const [letterSpacing, setLetterSpacing] = useState('');
  const [textTransform, setTextTransform] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [display, setDisplay] = useState('');
  const [gap, setGap] = useState('');
  const [border, setBorder] = useState('');
  const [borderRadius, setBorderRadius] = useState('');
  const [boxShadow, setBoxShadow] = useState('');
  const [position, setPosition] = useState('');
  const [top, setTop] = useState('');
  const [right, setRight] = useState('');
  const [bottom, setBottom] = useState('');
  const [left, setLeft] = useState('');
  const [zIndex, setZIndex] = useState('');
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [uploadPct, setUploadPct] = useState<number>(0);
  
  const [elementData, setElementData] = useState<{
    id: string;
    type: string;
    pageId: string;
  } | null>(null);

  const pagesList = useMemo(() => getRealPagesList(), []);

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
    setFontWeight(computedStyle.fontWeight || element.style.fontWeight || '');
    setLineHeight(computedStyle.lineHeight || element.style.lineHeight || '');
    setLetterSpacing(computedStyle.letterSpacing || element.style.letterSpacing || '');
    setTextTransform(computedStyle.textTransform || (element as HTMLElement).style.textTransform || '');
    setWidth(computedStyle.width || (element as HTMLElement).style.width || '');
    setHeight(computedStyle.height || (element as HTMLElement).style.height || '');
    setDisplay(computedStyle.display || (element as HTMLElement).style.display || '');
    setGap((computedStyle as any).gap || (element as HTMLElement).style.gap || '');
    setBorder(computedStyle.border || (element as HTMLElement).style.border || '');
    setBorderRadius(computedStyle.borderRadius || (element as HTMLElement).style.borderRadius || '');
    setBoxShadow(computedStyle.boxShadow || (element as HTMLElement).style.boxShadow || '');
    setPosition(computedStyle.position || (element as HTMLElement).style.position || '');
    setTop(computedStyle.top || (element as HTMLElement).style.top || '');
    setRight(computedStyle.right || (element as HTMLElement).style.right || '');
    setBottom(computedStyle.bottom || (element as HTMLElement).style.bottom || '');
    setLeft(computedStyle.left || (element as HTMLElement).style.left || '');
    setZIndex(computedStyle.zIndex || (element as HTMLElement).style.zIndex || '');
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

    // Typography
    if (fontWeight && fontWeight !== element.style.fontWeight) {
      editingService.saveElementEdit(pageId, id, type, 'style.fontWeight', fontWeight, element.style.fontWeight);
      element.style.fontWeight = fontWeight;
    }
    if (lineHeight && lineHeight !== element.style.lineHeight) {
      editingService.saveElementEdit(pageId, id, type, 'style.lineHeight', lineHeight, element.style.lineHeight);
      element.style.lineHeight = lineHeight;
    }
    if (letterSpacing && letterSpacing !== element.style.letterSpacing) {
      editingService.saveElementEdit(pageId, id, type, 'style.letterSpacing', letterSpacing, element.style.letterSpacing);
      element.style.letterSpacing = letterSpacing;
    }
    if (textTransform && textTransform !== (element as HTMLElement).style.textTransform) {
      editingService.saveElementEdit(pageId, id, type, 'style.textTransform', textTransform, (element as HTMLElement).style.textTransform);
      (element as HTMLElement).style.textTransform = textTransform as any;
    }

    // Layout
    if (width && width !== (element as HTMLElement).style.width) {
      editingService.saveElementEdit(pageId, id, type, 'style.width', width, (element as HTMLElement).style.width);
      (element as HTMLElement).style.width = width;
    }
    if (height && height !== (element as HTMLElement).style.height) {
      editingService.saveElementEdit(pageId, id, type, 'style.height', height, (element as HTMLElement).style.height);
      (element as HTMLElement).style.height = height;
    }
    if (display && display !== (element as HTMLElement).style.display) {
      editingService.saveElementEdit(pageId, id, type, 'style.display', display, (element as HTMLElement).style.display);
      (element as HTMLElement).style.display = display as any;
    }
    if (gap && gap !== (element as HTMLElement).style.gap) {
      editingService.saveElementEdit(pageId, id, type, 'style.gap', gap, (element as HTMLElement).style.gap);
      (element as HTMLElement).style.gap = gap as any;
    }

    // Border & Shadow
    if (border && border !== (element as HTMLElement).style.border) {
      editingService.saveElementEdit(pageId, id, type, 'style.border', border, (element as HTMLElement).style.border);
      (element as HTMLElement).style.border = border as any;
    }
    if (borderRadius && borderRadius !== (element as HTMLElement).style.borderRadius) {
      editingService.saveElementEdit(pageId, id, type, 'style.borderRadius', borderRadius, (element as HTMLElement).style.borderRadius);
      (element as HTMLElement).style.borderRadius = borderRadius as any;
    }
    if (boxShadow && boxShadow !== (element as HTMLElement).style.boxShadow) {
      editingService.saveElementEdit(pageId, id, type, 'style.boxShadow', boxShadow, (element as HTMLElement).style.boxShadow);
      (element as HTMLElement).style.boxShadow = boxShadow as any;
    }

    // Positioning
    if (position && position !== (element as HTMLElement).style.position) {
      editingService.saveElementEdit(pageId, id, type, 'style.position', position, (element as HTMLElement).style.position);
      (element as HTMLElement).style.position = position as any;
    }
    if (top && top !== (element as HTMLElement).style.top) {
      editingService.saveElementEdit(pageId, id, type, 'style.top', top, (element as HTMLElement).style.top);
      (element as HTMLElement).style.top = top as any;
    }
    if (right && right !== (element as HTMLElement).style.right) {
      editingService.saveElementEdit(pageId, id, type, 'style.right', right, (element as HTMLElement).style.right);
      (element as HTMLElement).style.right = right as any;
    }
    if (bottom && bottom !== (element as HTMLElement).style.bottom) {
      editingService.saveElementEdit(pageId, id, type, 'style.bottom', bottom, (element as HTMLElement).style.bottom);
      (element as HTMLElement).style.bottom = bottom as any;
    }
    if (left && left !== (element as HTMLElement).style.left) {
      editingService.saveElementEdit(pageId, id, type, 'style.left', left, (element as HTMLElement).style.left);
      (element as HTMLElement).style.left = left as any;
    }
    if (zIndex && zIndex !== (element as HTMLElement).style.zIndex) {
      editingService.saveElementEdit(pageId, id, type, 'style.zIndex', zIndex, (element as HTMLElement).style.zIndex);
      (element as HTMLElement).style.zIndex = zIndex as any;
    }

    // Persist draft edits to Firestore
    try {
      const pageEdits = editingService.getPageEdits(pageId);
      if (pageEdits && pageEdits.edits.length > 0) {
        void saveDraftElementEdits(pageId, pageEdits.edits as any);
      }
    } catch (e) {
      console.warn('Failed to save draft element edits to Firestore', e);
    }

    onSave();
  };

  const handleUndo = () => {
    if (!elementData) return;
    
    const { pageId } = elementData;
    
    // Clear all edits for this element's page
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
            <div className="space-y-1">
              <Input
                value={linkHref}
                onChange={(e) => setLinkHref(e.target.value)}
                placeholder="https://example.com or internal route"
                className="text-xs"
                list="internal-routes"
              />
              <datalist id="internal-routes">
                {pagesList.map((p) => (
                  <option key={p.id} value={p.route || `/${p.id}`}>{p.name}</option>
                ))}
              </datalist>
            </div>
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

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Font Weight</Label>
              <Input
                value={fontWeight}
                onChange={(e) => setFontWeight(e.target.value)}
                placeholder="400, 700, bold"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Line Height</Label>
              <Input
                value={lineHeight}
                onChange={(e) => setLineHeight(e.target.value)}
                placeholder="1.5, 24px"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Letter Spacing</Label>
              <Input
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(e.target.value)}
                placeholder="0.5px"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Text Transform</Label>
              <Input
                value={textTransform}
                onChange={(e) => setTextTransform(e.target.value)}
                placeholder="none | uppercase | lowercase | capitalize"
                className="text-xs"
              />
            </div>
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

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Width</Label>
              <Input
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="e.g. 100%, 300px"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Height</Label>
              <Input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. auto, 200px"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Display</Label>
              <Input
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                placeholder="block | inline | flex | grid"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Gap (flex/grid)</Label>
              <Input
                value={gap}
                onChange={(e) => setGap(e.target.value)}
                placeholder="e.g. 8px, 1rem"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Border</Label>
              <Input
                value={border}
                onChange={(e) => setBorder(e.target.value)}
                placeholder="1px solid #e5e7eb"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Border Radius</Label>
              <Input
                value={borderRadius}
                onChange={(e) => setBorderRadius(e.target.value)}
                placeholder="8px"
                className="text-xs"
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-xs">Box Shadow</Label>
              <Input
                value={boxShadow}
                onChange={(e) => setBoxShadow(e.target.value)}
                placeholder="0 1px 3px rgba(0,0,0,0.1)"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Position</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="static | relative | absolute | fixed | sticky"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">z-index</Label>
              <Input
                value={zIndex}
                onChange={(e) => setZIndex(e.target.value)}
                placeholder="auto | 10"
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Top</Label>
              <Input value={top} onChange={(e) => setTop(e.target.value)} placeholder="e.g. 0, 10px" className="text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Right</Label>
              <Input value={right} onChange={(e) => setRight(e.target.value)} placeholder="e.g. 0, 10px" className="text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bottom</Label>
              <Input value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder="e.g. 0, 10px" className="text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Left</Label>
              <Input value={left} onChange={(e) => setLeft(e.target.value)} placeholder="e.g. 0, 10px" className="text-xs" />
            </div>
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

        {/* Element Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => {
              if (!element || !elementData) return;
              const clone = element.cloneNode(true) as HTMLElement;
              element.parentElement?.insertBefore(clone, element.nextSibling);
              const parent = element.parentElement;
              if (parent) {
                const parentId = `${elementData.pageId}-${parent.tagName.toLowerCase()}-parent-${Date.now()}`;
                editingService.saveElementEdit(
                  elementData.pageId,
                  parentId,
                  parent.tagName.toLowerCase(),
                  'innerHTML',
                  parent.innerHTML,
                  parent.innerHTML
                );
              }
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Copy className="h-3 w-3 mr-1" /> Duplicate
          </Button>

          <Button
            onClick={() => {
              if (!element || !elementData) return;
              if (element.parentElement && element.parentElement.classList.contains('editor-wrapper')) {
                const wrapper = element.parentElement;
                wrapper.replaceWith(element);
              } else {
                const wrapper = document.createElement('div');
                wrapper.className = 'editor-wrapper';
                element.replaceWith(wrapper);
                wrapper.appendChild(element);
              }
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <SquareStack className="h-3 w-3 mr-1" /> Wrap/Unwrap
          </Button>

          <Button
            onClick={() => {
              if (!element || !elementData) return;
              const isHidden = (element as HTMLElement).style.display === 'none';
              const newDisplay = isHidden ? '' : 'none';
              editingService.saveElementEdit(
                elementData.pageId,
                elementData.id,
                elementData.type,
                'style.display',
                newDisplay,
                (element as HTMLElement).style.display
              );
              (element as HTMLElement).style.display = newDisplay;
            }}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {(element as HTMLElement).style.display === 'none' ? (
              <Eye className="h-3 w-3 mr-1" />
            ) : (
              <EyeOff className="h-3 w-3 mr-1" />
            )}
            Toggle Visibility
          </Button>

          {/* Save / Undo */}
          <div className="col-span-2 flex gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
}