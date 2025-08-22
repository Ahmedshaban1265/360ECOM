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
  X
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { editingService } from '../services/EditingService';
import ImageSelectionModal from './ImageSelectionModal';
import { ImageItem } from './ShopifyImageLibrary';
import { ensureHex, lighten, darken, bestTextColor, contrastRatio } from '../utils/colorUtils';

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
  const [cssClasses, setCssClasses] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [padding, setPadding] = useState('');
  const [margin, setMargin] = useState('');
  const [background, setBackground] = useState('');
  const [border, setBorder] = useState('');
  const [borderRadius, setBorderRadius] = useState('');
  const [boxShadow, setBoxShadow] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [display, setDisplay] = useState('');
  const [justifyContent, setJustifyContent] = useState('');
  const [alignItems, setAlignItems] = useState('');
  const [gap, setGap] = useState('');
  const [gridTemplateColumns, setGridTemplateColumns] = useState('');
  const [gridGap, setGridGap] = useState('');
  const [showImageSelection, setShowImageSelection] = useState(false);
  
  const [elementData, setElementData] = useState<{
    id: string;
    type: string;
    pageId: string;
  } | null>(null);

  // Compute a small subset of computed styles for quick inspection
  const computedStylePreview = useMemo(() => {
    if (!element) return [] as { key: string; value: string }[];
    const cs = window.getComputedStyle(element);
    const keys = [
      'color','backgroundColor','fontSize','fontWeight','lineHeight','display','position','margin','padding','border','borderRadius','boxShadow','width','height'
    ];
    return keys.map(k => ({ key: k, value: (cs as any)[k] as string }));
  }, [element]);

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
    setCssClasses(element.className || '');
    
    if (element instanceof HTMLImageElement) {
      setImageSource(element.src || '');
      setImageAlt(element.alt || '');
    }
    
    if (element instanceof HTMLAnchorElement) {
      setLinkHref(element.getAttribute('href') || '');
    }

    // Load CSS values (use computed styles to reflect real styles)
    const computedStyle = window.getComputedStyle(element);
    setBackgroundColor(computedStyle.backgroundColor || element.style.backgroundColor || '');
    setTextColor(computedStyle.color || element.style.color || '');
    setFontSize(computedStyle.fontSize || element.style.fontSize || '');
    setPadding(computedStyle.padding || element.style.padding || '');
    setMargin(computedStyle.margin || element.style.margin || '');
    setBackground(computedStyle.background || (element as HTMLElement).style.background || '');
    setBorder(computedStyle.border || element.style.border || '');
    setBorderRadius(computedStyle.borderRadius || element.style.borderRadius || '');
    setBoxShadow(computedStyle.boxShadow || element.style.boxShadow || '');
    setWidth(computedStyle.width || element.style.width || '');
    setHeight(computedStyle.height || element.style.height || '');
    setDisplay(computedStyle.display || element.style.display || '');
    setJustifyContent(computedStyle.justifyContent || element.style.justifyContent || '');
    setAlignItems(computedStyle.alignItems || element.style.alignItems || '');
    setGap(computedStyle.gap || (element.style as any).gap || '');
    setGridTemplateColumns(computedStyle.gridTemplateColumns || (element.style as any).gridTemplateColumns || '');
    setGridGap((computedStyle as any).gridGap || (element.style as any).gridGap || '');
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
    if (element instanceof HTMLAnchorElement) {
      const currentHref = element.getAttribute('href') || '';
      if (linkHref !== currentHref) {
        editingService.saveElementEdit(
          pageId,
          id,
          type,
          'href',
          linkHref,
          currentHref
        );
        element.setAttribute('href', linkHref);
      }
    }

    // Save class changes
    if (cssClasses !== element.className) {
      editingService.saveElementEdit(
        pageId,
        id,
        type,
        'className',
        cssClasses,
        element.className || ''
      );
      element.className = cssClasses;
    }

    // Save style changes
    const saveStyle = (prop: string, value: string, current: string) => {
      if (value && value !== current) {
        editingService.saveElementEdit(pageId, id, type, `style.${prop}`, value, current);
        (element.style as any)[prop] = value;
      }
    };

    saveStyle('backgroundColor', backgroundColor, element.style.backgroundColor);
    saveStyle('color', textColor, element.style.color);
    saveStyle('fontSize', fontSize, element.style.fontSize);
    saveStyle('padding', padding, element.style.padding);
    saveStyle('margin', margin, element.style.margin);
    saveStyle('background', background, element.style.background);
    saveStyle('border', border, element.style.border);
    saveStyle('borderRadius', borderRadius, element.style.borderRadius);
    saveStyle('boxShadow', boxShadow, element.style.boxShadow);
    saveStyle('width', width, element.style.width);
    saveStyle('height', height, element.style.height);
    saveStyle('display', display, element.style.display);
    saveStyle('justifyContent', justifyContent, (element.style as any).justifyContent);
    saveStyle('alignItems', alignItems, (element.style as any).alignItems);
    saveStyle('gap', gap, (element.style as any).gap);
    saveStyle('gridTemplateColumns', gridTemplateColumns, (element.style as any).gridTemplateColumns);
    saveStyle('gridGap', gridGap, (element.style as any).gridGap);

    onSave();
  };

  const handleUndo = () => {
    if (!elementData) return;
    const { id, pageId } = elementData;
    editingService.clearPageEdits(pageId);
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
        <Tabs defaultValue="content">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="styles" className="text-xs">Styles</TabsTrigger>
            <TabsTrigger value="computed" className="text-xs">Computed</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-3">
            {(type === 'h1' || type === 'h2' || type === 'h3' || type === 'h4' || type === 'h5' || type === 'h6' || type === 'p' || type === 'button' || type === 'span') && (
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

            {/* CSS Classes */}
            <div className="space-y-2">
              <Label className="text-xs">CSS Classes</Label>
              <Input
                value={cssClasses}
                onChange={(e) => setCssClasses(e.target.value)}
                placeholder="e.g. text-lg font-semibold"
                className="text-xs"
              />
              {/* Tailwind suggestions (basic inline helper) */}
              <div className="flex flex-wrap gap-1">
                {['text-sm','text-base','text-lg','font-semibold','font-bold','p-2','p-4','m-2','rounded','rounded-lg','shadow','shadow-lg','bg-primary','text-primary'].map(s => (
                  <button
                    key={s}
                    type="button"
                    className="text-[10px] px-2 py-1 border rounded hover:bg-muted"
                    onClick={() => setCssClasses(prev => (prev ? `${prev} ${s}` : s))}
                  >{s}</button>
                ))}
              </div>
            </div>

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

          <TabsContent value="styles" className="space-y-4 mt-3">
            {/* Quick actions */}
            <div className="flex items-center gap-2 text-xs">
              <Button
                size="sm"
                variant="outline"
                className="h-6"
                onClick={() => {
                  if (!element || !elementData) return;
                  const prev = element.getAttribute('style') || '';
                  editingService.saveElementEdit(elementData.pageId, elementData.id, elementData.type, 'style', '', prev);
                  element.removeAttribute('style');
                  setBackgroundColor(''); setTextColor(''); setFontSize(''); setPadding(''); setMargin(''); setBackground(''); setBorder(''); setBorderRadius(''); setBoxShadow(''); setWidth(''); setHeight(''); setDisplay(''); setJustifyContent(''); setAlignItems(''); setGap(''); setGridTemplateColumns(''); setGridGap('');
                }}
              >Reset Inline Styles</Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6"
                onClick={() => {
                  if (!element || !elementData) return;
                  const prev = element.className || '';
                  editingService.saveElementEdit(elementData.pageId, elementData.id, elementData.type, 'className', '', prev);
                  element.className = '';
                  setCssClasses('');
                }}
              >Remove All Classes</Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Background</Label>
                <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-8" />
                {backgroundColor && (
                  <div className="flex items-center gap-2 text-xs">
                    <span>{ensureHex(backgroundColor) || backgroundColor}</span>
                    <Button size="sm" variant="outline" className="h-6 px-2"
                      onClick={() => navigator.clipboard.writeText(ensureHex(backgroundColor) || backgroundColor)}
                    >Copy HEX</Button>
                  </div>
                )}
                {backgroundColor && (
                  <div className="flex items-center gap-2">
                    {['0.1','0.2','0.3'].map((a) => (
                      <button key={'l'+a} className="h-6 text-[10px] px-2 rounded border"
                        style={{ backgroundColor: lighten(backgroundColor, parseFloat(a)), color: bestTextColor(lighten(backgroundColor, parseFloat(a))) }}
                        onClick={() => setBackgroundColor(lighten(backgroundColor, parseFloat(a)))}
                      >Lighten {Math.round(parseFloat(a)*100)}%</button>
                    ))}
                  </div>
                )}
                {backgroundColor && (
                  <div className="flex items-center gap-2">
                    {['0.1','0.2','0.3'].map((a) => (
                      <button key={'d'+a} className="h-6 text-[10px] px-2 rounded border"
                        style={{ backgroundColor: darken(backgroundColor, parseFloat(a)), color: bestTextColor(darken(backgroundColor, parseFloat(a))) }}
                        onClick={() => setBackgroundColor(darken(backgroundColor, parseFloat(a)))}
                      >Darken {Math.round(parseFloat(a)*100)}%</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Text Color</Label>
                <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8" />
                {textColor && (
                  <div className="flex items-center gap-2 text-xs">
                    <span>{ensureHex(textColor) || textColor}</span>
                    <Button size="sm" variant="outline" className="h-6 px-2"
                      onClick={() => navigator.clipboard.writeText(ensureHex(textColor) || textColor)}
                    >Copy HEX</Button>
                  </div>
                )}
                {(textColor || backgroundColor) && (
                  <div className="text-[10px] text-muted-foreground">
                    Contrast: {(() => {
                      const c = contrastRatio(textColor || '#000', backgroundColor || '#fff');
                      return c ? c.toFixed(2) + ' : 1' : 'n/a';
                    })()} (Aim for ≥ 4.5)
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Font Size</Label>
                <Input value={fontSize} onChange={(e) => setFontSize(e.target.value)} placeholder="16px, 1rem" className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Display</Label>
                <Input value={display} onChange={(e) => setDisplay(e.target.value)} placeholder="block, inline, flex, grid" className="text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Width</Label>
                <Input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g. 100%, 320px" className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Height</Label>
                <Input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. auto, 200px" className="text-xs" />
              </div>
            </div>

            {/* Flexbox layout controls */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Justify Content</Label>
                <Input value={justifyContent} onChange={(e) => setJustifyContent(e.target.value)} placeholder="flex-start, center, space-between" className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Align Items</Label>
                <Input value={alignItems} onChange={(e) => setAlignItems(e.target.value)} placeholder="stretch, center, flex-start" className="text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Gap</Label>
              <Input value={gap} onChange={(e) => setGap(e.target.value)} placeholder="e.g. 8px, 1rem" className="text-xs" />
            </div>

            {/* Grid layout controls */}
            <div className="space-y-1">
              <Label className="text-xs">Grid Template Columns</Label>
              <Input value={gridTemplateColumns} onChange={(e) => setGridTemplateColumns(e.target.value)} placeholder="e.g. repeat(3, 1fr)" className="text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Grid Gap</Label>
              <Input value={gridGap} onChange={(e) => setGridGap(e.target.value)} placeholder="e.g. 12px" className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Padding</Label>
              <Input value={padding} onChange={(e) => setPadding(e.target.value)} placeholder="e.g. 1rem 2rem" className="text-xs" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Margin</Label>
              <Input value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="e.g. 0 auto" className="text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Border</Label>
                <Input value={border} onChange={(e) => setBorder(e.target.value)} placeholder="e.g. 1px solid #e5e7eb" className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Radius</Label>
                <Input value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} placeholder="e.g. 8px" className="text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Shadow</Label>
              <Input value={boxShadow} onChange={(e) => setBoxShadow(e.target.value)} placeholder="e.g. 0 1px 2px rgba(0,0,0,.1)" className="text-xs" />
            </div>
          </TabsContent>

          <TabsContent value="computed" className="space-y-2 mt-3">
            <div className="text-xs text-muted-foreground">Computed Styles (read-only)</div>
            <div className="max-h-48 overflow-auto border rounded p-2">
              {computedStylePreview.map(({ key, value }) => (
                <div key={key} className="flex justify-between gap-2 py-0.5">
                  <span className="text-xs text-muted-foreground">{key}</span>
                  <span className="text-xs text-foreground truncate">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="flex-1 text-xs">
            <Save className="h-3 w-3 mr-1" />
            Save Changes
          </Button>
          <Button onClick={handleUndo} variant="outline" size="sm" className="text-xs">
            <Undo className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
