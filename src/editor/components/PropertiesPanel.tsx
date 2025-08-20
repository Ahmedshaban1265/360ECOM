import { useState, useEffect, useRef } from 'react';
import { useEditorStore, useCurrentTemplate, useSelectedSection, useSelectedBlock } from '../store/editorStore';
import { getSectionSchema, getBlockSchema } from '../schemas/sections';
import { FieldBase, SectionInstance, BlockInstance } from '../types';
import { uploadMedia } from '../services/MediaService';
import ElementEditor from './ElementEditor';
import ImageLibrary from './ImageLibrary';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Icons
import { 
  Settings, 
  Palette, 
  Type, 
  Layout,
  Info,
  AlertCircle,
  Droplets,
  Copy,
  Check
} from 'lucide-react';

// Color Palette Presets
const COLOR_PRESETS = {
  primary: ['#000000', '#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'],
  accent: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#1e293b', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
  success: ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
  warning: ['#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'],
  danger: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
  neutral: ['#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937']
};

interface FieldRendererProps {
  field: FieldBase;
  value: any;
  onChange: (value: any) => void;
}

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const [localValue, setLocalValue] = useState(value ?? field.default ?? '');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value ?? field.default ?? '');
  }, [value, field.default]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Validation
  const validateValue = (val: any) => {
    if (field.required && (!val || val === '')) {
      setIsValid(false);
      setErrorMessage(`${field.label} is required`);
      return false;
    }

    if (field.validation?.pattern && typeof val === 'string') {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(val)) {
        setIsValid(false);
        setErrorMessage(field.validation.message || 'Invalid format');
        return false;
      }
    }

    if (field.type === 'number' || field.type === 'range') {
      const num = parseFloat(val);
      if (isNaN(num)) {
        setIsValid(false);
        setErrorMessage('Must be a valid number');
        return false;
      }
      if (field.min !== undefined && num < field.min) {
        setIsValid(false);
        setErrorMessage(`Must be at least ${field.min}`);
        return false;
      }
      if (field.max !== undefined && num > field.max) {
        setIsValid(false);
        setErrorMessage(`Must be at most ${field.max}`);
        return false;
      }
    }

    setIsValid(true);
    setErrorMessage('');
    return true;
  };

  // Handle value change with debouncing for text inputs
  const handleChange = (newValue: any) => {
    setLocalValue(newValue);

    if (validateValue(newValue)) {
      // Clear existing timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Debounce text inputs, immediate for others
      if (field.type === 'text' || field.type === 'richtext') {
        debounceRef.current = setTimeout(() => {
          onChange(newValue);
        }, 300);
      } else {
        onChange(newValue);
      }
    }
  };

  // Color picker component with palette
  const ColorPicker = ({ value, onChange }: { value: string; onChange: (color: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [customColor, setCustomColor] = useState(value);

    const handleColorChange = (color: string) => {
      setCustomColor(color);
      onChange(color);
      setIsOpen(false);
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(value);
        // Could add toast notification here
      } catch (e) {
        console.error('Failed to copy color', e);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-12 h-8 p-1 border-2"
                style={{ backgroundColor: value }}
                onClick={() => setIsOpen(true)}
              >
                <Droplets className="h-4 w-4 text-white drop-shadow-lg" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Custom Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-8 p-1 border-2"
                    />
                    <Input
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleColorChange(customColor)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color Presets</Label>
                  {Object.entries(COLOR_PRESETS).map(([category, colors]) => (
                    <div key={category} className="space-y-1">
                      <div className="text-xs text-muted-foreground capitalize">{category}</div>
                      <div className="flex gap-1 flex-wrap">
                        {colors.map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="#000000"
            className="flex-1"
          />
          
          <Button
            size="sm"
            variant="ghost"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  // Render based on field type
  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-2">
          <Input
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={!isValid ? 'border-destructive' : ''}
          />
          {!isValid && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errorMessage}
            </p>
          )}
        </div>
      );

    case 'richtext':
      return (
        <div className="space-y-2">
          <Textarea
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder}
            className={`min-h-20 ${!isValid ? 'border-destructive' : ''}`}
          />
          {!isValid && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errorMessage}
            </p>
          )}
        </div>
      );

    case 'number':
      return (
        <div className="space-y-2">
          <Input
            type="number"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            min={field.min}
            max={field.max}
            step={field.step}
            className={!isValid ? 'border-destructive' : ''}
          />
          {!isValid && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errorMessage}
            </p>
          )}
        </div>
      );

    case 'range':
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {field.min || 0}
            </span>
            <span className="text-sm font-medium">{localValue}</span>
            <span className="text-sm text-muted-foreground">
              {field.max || 100}
            </span>
          </div>
          <Slider
            value={[localValue]}
            onValueChange={(values) => handleChange(values[0])}
            min={field.min || 0}
            max={field.max || 100}
            step={field.step || 1}
            className="w-full"
          />
        </div>
      );

    case 'select':
      return (
        <Select value={localValue} onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'toggle':
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={localValue}
            onCheckedChange={handleChange}
          />
          <span className="text-sm text-muted-foreground">
            {localValue ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      );

    case 'color':
      return (
        <ColorPicker value={localValue} onChange={handleChange} />
      );

    case 'url':
      return (
        <div className="space-y-2">
          <Input
            type="url"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.placeholder || 'https://example.com'}
            className={!isValid ? 'border-destructive' : ''}
          />
          {!isValid && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errorMessage}
            </p>
          )}
        </div>
      );

    case 'image':
      return (
        <div className="space-y-2">
          <Input
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Image URL or upload"
            className={!isValid ? 'border-destructive' : ''}
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowImageLibrary(true)}
              className="text-xs"
            >
              Choose from Library
            </Button>
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const result = await uploadMedia(file, 'theme-media');
                    handleChange(result.url);
                  } catch (err) {
                    console.error('Upload failed', err);
                  }
                }}
              />
              <Button size="sm" variant="outline" className="text-xs">
                Upload
              </Button>
            </label>
          </div>
          
          {showImageLibrary && (
            <div className="border rounded-md p-2 max-h-64 overflow-hidden">
              <ImageLibrary 
                onSelect={(img) => {
                  handleChange(img.url);
                  setShowImageLibrary(false);
                }}
                showUploadButton={false}
                showSearch={true}
                showFolders={false}
                compact={true}
              />
            </div>
          )}
          
          {localValue && (
            <div className="mt-2">
              <img
                src={localValue}
                alt="Preview"
                className="w-full h-20 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      );

    default:
      return (
        <Input
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
        />
      );
  }
}

interface SettingsFormProps {
  title: string;
  fields: FieldBase[];
  values: Record<string, any>;
  onChange: (settings: Record<string, any>) => void;
}

function SettingsForm({ title, fields, values, onChange }: SettingsFormProps) {
  const handleFieldChange = (fieldId: string, value: any) => {
    onChange({
      ...values,
      [fieldId]: value
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.id} className="text-sm font-medium">
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </Label>
              {field.description && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  title={field.description}
                >
                  <Info className="w-3 h-3" />
                </Button>
              )}
            </div>
            <FieldRenderer
              field={field}
              value={values[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
            {field.description && (
              <p className="text-xs text-muted-foreground">
                {field.description}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function PropertiesPanel() {
  const currentTemplate = useCurrentTemplate();
  const selectedSection = useSelectedSection();
  const selectedBlock = useSelectedBlock();
  const selectedElement = useEditorStore(state => state.selectedElement);

  const {
    updateSectionSettings,
    updateBlockSettings,
    updateThemeTokens,
    setSelectedElement
  } = useEditorStore();

  const section = currentTemplate?.sections.find(s => s.id === selectedSection);
  const block = selectedBlock && section?.blocks?.find(b => b.id === selectedBlock);

  const sectionSchema = section ? getSectionSchema(section.type) : null;
  const blockSchema = block ? getBlockSchema(block.type) : null;

  const handleSectionSettingsChange = (settings: Record<string, any>) => {
    if (selectedSection) {
      updateSectionSettings(selectedSection, settings);
    }
  };

  const handleBlockSettingsChange = (settings: Record<string, any>) => {
    if (selectedSection && selectedBlock) {
      updateBlockSettings(selectedSection, selectedBlock, settings);
    }
  };

  const handleThemeSettingsChange = (settings: Record<string, any>) => {
    updateThemeTokens(settings);
  };

  // Show element editor if an element is selected
  if (selectedElement) {
    return (
      <div className="h-full p-4">
        <ElementEditor
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
          onSave={() => {
            // Element editor handles saving via EditingService
            console.log('Element saved');
          }}
        />
      </div>
    );
  }

  // No selection state
  if (!selectedSection && !selectedBlock) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-3 border-b border-border bg-background/50">
          <h2 className="font-semibold text-sm text-foreground">Properties</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Select a section or block to edit
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <Settings className="w-8 h-8 text-muted-foreground mx-auto" />
            <div>
              <p className="text-sm font-medium">No Selection</p>
              <p className="text-xs text-muted-foreground">
                Click on a section or block to view its properties
              </p>
            </div>
          </div>
        </div>

        {/* Global Theme Settings Tab */}
        <div className="p-4 border-t border-border">
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="global" className="text-xs">
                Theme Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="global" className="mt-4">
              {currentTemplate && (
                <SettingsForm
                  title="Global Theme"
                  fields={[
                    {
                      id: 'colors.primary',
                      label: 'Primary Color',
                      type: 'color',
                      default: '#2563eb'
                    },
                    {
                      id: 'colors.secondary',
                      label: 'Secondary Color',
                      type: 'color',
                      default: '#7c3aed'
                    },
                    {
                      id: 'colors.background',
                      label: 'Background Color',
                      type: 'color',
                      default: '#ffffff'
                    },
                    {
                      id: 'colors.text',
                      label: 'Text Color',
                      type: 'color',
                      default: '#000000'
                    },
                    {
                      id: 'typography.bodyFont',
                      label: 'Body Font',
                      type: 'select',
                      options: [
                        { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
                        { label: 'Roboto', value: 'Roboto, system-ui, sans-serif' },
                        { label: 'Open Sans', value: 'Open Sans, system-ui, sans-serif' },
                        { label: 'Cairo (Arabic)', value: 'Cairo, system-ui, sans-serif' }
                      ],
                      default: 'Inter, system-ui, sans-serif'
                    },
                    {
                      id: 'typography.headingFont',
                      label: 'Heading Font',
                      type: 'select',
                      options: [
                        { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
                        { label: 'Roboto', value: 'Roboto, system-ui, sans-serif' },
                        { label: 'Open Sans', value: 'Open Sans, system-ui, sans-serif' },
                        { label: 'Cairo (Arabic)', value: 'Cairo, system-ui, sans-serif' }
                      ],
                      default: 'Inter, system-ui, sans-serif'
                    },
                    {
                      id: 'spacingScale',
                      label: 'Spacing Scale',
                      type: 'range',
                      min: 4,
                      max: 16,
                      step: 2,
                      default: 8
                    },
                    {
                      id: 'radius',
                      label: 'Border Radius',
                      type: 'select',
                      options: [
                        { label: 'None', value: '0px' },
                        { label: 'Small', value: '4px' },
                        { label: 'Medium', value: '8px' },
                        { label: 'Large', value: '12px' },
                        { label: 'Extra Large', value: '16px' }
                      ],
                      default: '8px'
                    },
                    {
                      id: 'darkMode',
                      label: 'Dark Mode',
                      type: 'toggle',
                      default: false
                    },
                    {
                      id: 'rtl',
                      label: 'Right-to-Left',
                      type: 'toggle',
                      default: false
                    }
                  ]}
                  values={currentTemplate.themeTokens}
                  onChange={handleThemeSettingsChange}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border bg-background/50">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-sm text-foreground">Properties</h2>
          {(selectedSection || selectedBlock) && (
            <Badge variant="outline" className="text-xs">
              {selectedBlock ? 'Block' : 'Section'}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {selectedBlock ? `${blockSchema?.label || 'Unknown Block'}` :
           selectedSection ? `${sectionSchema?.label || 'Unknown Section'}` :
           'No selection'}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Block Settings (if block is selected) */}
          {selectedBlock && block && blockSchema && (
            <SettingsForm
              title={`${blockSchema.label} Settings`}
              fields={blockSchema.settings}
              values={block.settings}
              onChange={handleBlockSettingsChange}
            />
          )}

          {/* Section Settings */}
          {selectedSection && section && sectionSchema && (
            <SettingsForm
              title={`${sectionSchema.label} Settings`}
              fields={sectionSchema.settings}
              values={section.settings}
              onChange={handleSectionSettingsChange}
            />
          )}

          {/* Global Theme Settings */}
          {currentTemplate && (
            <SettingsForm
              title="Theme Settings"
              fields={[
                {
                  id: 'colors.primary',
                  label: 'Primary Color',
                  type: 'color',
                  default: '#2563eb'
                },
                {
                  id: 'colors.secondary',
                  label: 'Secondary Color',
                  type: 'color',
                  default: '#7c3aed'
                },
                {
                  id: 'colors.background',
                  label: 'Background Color',
                  type: 'color',
                  default: '#ffffff'
                },
                {
                  id: 'colors.text',
                  label: 'Text Color',
                  type: 'color',
                  default: '#000000'
                },
                {
                  id: 'typography.bodyFont',
                  label: 'Body Font',
                  type: 'select',
                  options: [
                    { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
                    { label: 'Roboto', value: 'Roboto, system-ui, sans-serif' },
                    { label: 'Open Sans', value: 'Open Sans, system-ui, sans-serif' },
                    { label: 'Cairo (Arabic)', value: 'Cairo, system-ui, sans-serif' }
                  ],
                  default: 'Inter, system-ui, sans-serif'
                },
                {
                  id: 'typography.headingFont',
                  label: 'Heading Font',
                  type: 'select',
                  options: [
                    { label: 'Inter', value: 'Inter, system-ui, sans-serif' },
                    { label: 'Roboto', value: 'Roboto, system-ui, sans-serif' },
                    { label: 'Open Sans', value: 'Open Sans, system-ui, sans-serif' },
                    { label: 'Cairo (Arabic)', value: 'Cairo, system-ui, sans-serif' }
                  ],
                  default: 'Inter, system-ui, sans-serif'
                },
                {
                  id: 'spacingScale',
                  label: 'Spacing Scale',
                  type: 'range',
                  min: 4,
                  max: 16,
                  step: 2,
                  default: 8
                },
                {
                  id: 'radius',
                  label: 'Border Radius',
                  type: 'select',
                  options: [
                    { label: 'None', value: '0px' },
                    { label: 'Small', value: '4px' },
                    { label: 'Medium', value: '8px' },
                    { label: 'Large', value: '12px' },
                    { label: 'Extra Large', value: '16px' }
                  ],
                  default: '8px'
                },
                {
                  id: 'darkMode',
                  label: 'Dark Mode',
                  type: 'toggle',
                  default: false
                },
                {
                  id: 'rtl',
                  label: 'Right-to-Left',
                  type: 'toggle',
                  default: false
                }
              ]}
              values={currentTemplate.themeTokens}
              onChange={handleThemeSettingsChange}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
