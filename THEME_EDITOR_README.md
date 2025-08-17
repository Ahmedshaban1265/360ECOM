# Admin Theme Editor Documentation

## Overview

This theme editor is a comprehensive, Shopify-inspired visual page builder that allows admin users to create and edit website templates with a live preview. It features a three-panel layout with drag-and-drop functionality, schema-driven settings, and real-time preview capabilities.

## Features

### ✅ Core Features Implemented

- **🔐 Authentication Guard**: Fully protected admin route at `/admin/editor`
- **📱 Responsive Preview**: Live preview with Desktop/Tablet/Mobile device toggles
- **🎨 Visual Editor**: Three-panel layout (Templates, Sections Tree, Properties)
- **🔧 Schema-Driven Settings**: Type-safe field types with validation
- **🌐 Internationalization**: English/Arabic support with RTL layout
- **🌙 Dark/Light Mode**: Complete theme system with CSS variables
- **↩️ Undo/Redo**: Full history management (50 steps)
- **💾 Draft/Publish Workflow**: localStorage-based persistence
- **📥📤 Import/Export**: JSON-based template exchange
- **🎯 Drag & Drop**: Reorder sections and blocks (planned)

### 🏗️ Section Library

**Implemented Sections:**
- **Hero**: Full-width banner with title, subtitle, and CTA
- **Rich Text**: Formatted content with typography controls
- **Image with Text**: Side-by-side layout with responsive positioning
- **Cards Grid**: Feature cards with icons and descriptions
- **CTA Banner**: Call-to-action section with background options
- **Collection Grid**: Portfolio/gallery with filtering (demo data)

**Supported Field Types:**
- `text`, `richtext`, `number`, `range`, `select`, `toggle`
- `color`, `image`, `url`, `list`, `repeater`

## Getting Started

### 1. Access the Editor

1. Navigate to `/admin-login`
2. Login with credentials: `admin` / `AhmadShaban1265@`
3. Once authenticated, visit `/admin/editor`

### 2. Editor Interface

**Left Panel - Templates**
- Browse available page templates (Home, About, Services, etc.)
- View template status (Draft, Published, Modified)
- Switch between templates

**Center Panel - Sections Tree**  
- View page structure as a hierarchical tree
- Add, remove, duplicate, and reorder sections
- Expand sections to manage blocks
- Drag and drop support (UI ready)

**Right Panel - Properties**
- Edit settings for selected section or block
- Schema-driven form fields with validation
- Global theme settings

**Top Toolbar**
- Device preview toggles (Desktop/Tablet/Mobile)
- Undo/Redo actions
- Save Draft / Publish buttons
- Language toggle (EN/AR)
- Dark mode toggle
- Import/Export tools

### 3. Basic Workflow

1. **Select a Template**: Choose from the left panel
2. **Add Sections**: Use the "Add" button in the sections panel
3. **Configure Settings**: Select sections/blocks to edit properties
4. **Preview Changes**: See live updates in the preview canvas
5. **Save Work**: Use "Save Draft" to preserve changes
6. **Publish**: Make changes live with "Publish"

## Architecture

### 📁 File Structure

```
src/editor/
├── components/           # UI components for editor
│   ├── EditorToolbar.tsx    # Top toolbar with actions
│   ├── LeftNavTemplates.tsx # Template browser
│   ├── SectionsTree.tsx     # Section management
│   ├── PropertiesPanel.tsx  # Settings panel
│   └── PreviewCanvas.tsx    # Live preview
├── defaults/            # Default templates and data
│   └── templates.ts         # Template definitions
├── renderers/           # Preview rendering system
│   ├── ThemeRenderer.tsx    # Main theme engine
│   └── sections/            # Section-specific renderers
├── routes/              # Route components
│   └── AdminEditor.tsx      # Main editor route
├── schemas/             # Section and block schemas
│   └── sections.ts          # Schema definitions
├── services/            # Data persistence layer
│   ├── StorageService.ts    # Storage abstraction
│   └── LocalStorageDriver.ts # localStorage implementation
├── store/               # State management
│   └── editorStore.ts       # Zustand store
└── types/               # TypeScript definitions
    └── index.ts             # Core interfaces
```

### 🧠 State Management

The editor uses **Zustand** for state management with the following key features:

- **Template Management**: Load, save, publish templates
- **Selection State**: Track selected sections and blocks  
- **Device/Appearance**: Responsive preview and theme settings
- **History**: Undo/redo functionality with action tracking
- **Real-time Updates**: Debounced auto-save for performance

### 💾 Data Persistence

**Current: LocalStorage Driver**
- Keys: `theme_draft_v1:*`, `theme_published_v1:*`, `theme_global_v1`
- Automatic versioning and timestamps
- Error handling and recovery

**Future: Firebase Driver (Interface Ready)**
- Seamless driver switching via `StorageService.setDriver()`
- Same interface, different implementation
- Ready for cloud storage migration

## Extending the Editor

### Adding New Section Types

1. **Define Schema** (`src/editor/schemas/sections.ts`):

```typescript
export const CUSTOM_SECTION: SectionSchema = {
  type: 'custom-section',
  label: 'Custom Section',
  settings: [
    {
      id: 'title',
      label: 'Section Title',
      type: 'text',
      required: true,
      default: 'Default Title'
    },
    // Add more fields...
  ],
  blocks: [], // Optional: define block types
  presets: [] // Optional: pre-configured variants
};

// Register in SECTION_SCHEMAS
export const SECTION_SCHEMAS = {
  // ... existing schemas
  'custom-section': CUSTOM_SECTION
};
```

2. **Create Renderer** (`src/editor/renderers/sections/CustomSectionRenderer.tsx`):

```typescript
interface CustomSectionRendererProps {
  section: SectionInstance;
  isSelected: boolean;
  deviceType: DeviceType;
  themeTokens: ThemeTokens;
  onBlockClick?: (blockId: string) => void;
}

export default function CustomSectionRenderer({ 
  section, 
  isSelected, 
  deviceType, 
  themeTokens 
}: CustomSectionRendererProps) {
  const settings = section.settings;
  const title = settings.title || 'Default Title';

  return (
    <section className="py-8">
      <div className="section-container">
        <h2>{title}</h2>
        {/* Your custom content */}
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary border-dashed" />
        </div>
      )}
    </section>
  );
}
```

3. **Register in ThemeRenderer** (`src/editor/renderers/ThemeRenderer.tsx`):

```typescript
// Add import
import CustomSectionRenderer from './sections/CustomSectionRenderer';

// Add case in SectionRenderer switch
case 'custom-section':
  RendererComponent = CustomSectionRenderer;
  break;
```

### Adding New Field Types

1. **Extend FieldBase interface** (`src/editor/types/index.ts`):

```typescript
export interface FieldBase {
  // ... existing properties
  type: 
    | 'text' | 'richtext' | 'select' | 'number' | 'range'
    | 'color' | 'image' | 'url' | 'toggle' | 'list' | 'repeater'
    | 'custom-field'; // Add your new type
}
```

2. **Implement renderer** (`src/editor/components/PropertiesPanel.tsx`):

```typescript
// Add case in FieldRenderer switch
case 'custom-field':
  return (
    <div className="space-y-2">
      {/* Your custom field UI */}
    </div>
  );
```

### Switching to Firebase

```typescript
// Create FirebaseDriver implementing StorageDriver interface
import { FirebaseDriver } from './services/FirebaseDriver';

// Switch driver
storageService.setDriver(new FirebaseDriver({
  // Firebase config
}));
```

## Development Guidelines

### 🎨 UI/UX Standards

- **Consistent Spacing**: Use Tailwind spacing scale
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation
- **Loading States**: Show progress for async operations
- **Error Handling**: User-friendly error messages

### 🔧 Performance

- **Debounced Updates**: Text inputs use 300ms debounce
- **Optimized Renders**: Zustand selectors prevent unnecessary re-renders
- **Lazy Loading**: Components load only when needed
- **Memory Management**: History limited to 50 entries

### 🧪 Testing Strategy

**Unit Tests** (Recommended):
- Schema validation functions
- Storage service operations
- State management actions

**Integration Tests**:
- Template loading/saving workflows
- Section CRUD operations
- Import/export functionality

**E2E Tests**:
- Complete editor workflows
- Cross-device responsiveness
- Authentication flows

## API Reference

### Core Hooks

```typescript
// State management hooks
const { loadTemplate, saveTemplate, publishTemplate } = useEditorStore();
const selectedTemplate = useSelectedTemplate();
const currentTemplate = useCurrentTemplate();
const isDirty = useIsDirty();
const { canUndo, canRedo } = useHistoryState();

// Selection hooks
const selectedSection = useSelectedSection();
const selectedBlock = useSelectedBlock();
const deviceType = useDeviceType();
```

### Storage Service

```typescript
// Template operations
await storageService.getDraft('home');
await storageService.saveDraft('home', template);
await storageService.publish('home', template);

// Global settings
await storageService.getGlobalSettings();
await storageService.saveGlobalSettings(tokens);

// Import/Export
const json = await storageService.exportTemplate('home');
const template = await storageService.importTemplate(json);
```

## Customization

### Theme Tokens

The editor supports comprehensive theming through CSS variables:

```css
:root {
  --theme-primary: #2563eb;
  --theme-secondary: #7c3aed;
  --theme-background: #ffffff;
  --theme-foreground: #0f172a;
  --theme-body-font: 'Inter, system-ui, sans-serif';
  --theme-heading-font: 'Inter, system-ui, sans-serif';
  --theme-arabic-font: 'Cairo, system-ui, sans-serif';
  --theme-radius: 8px;
}
```

### Device Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### RTL Support

The editor automatically handles RTL layouts when Arabic is selected:

- Text direction and alignment
- Layout mirroring
- Icon positioning
- Form field organization

## Troubleshooting

### Common Issues

**Template not loading**
- Check browser console for errors
- Verify localStorage isn't full
- Try refreshing the page

**Preview not updating**
- Ensure template is selected
- Check for JavaScript errors
- Verify section schemas are valid

**Authentication problems**
- Clear localStorage: `localStorage.clear()`
- Check admin credentials
- Verify session hasn't expired

**Performance issues**
- Limit number of sections per template
- Optimize images in content
- Check browser memory usage

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('theme-editor-debug', 'true');
```

## Future Enhancements

### Planned Features

- **🎯 Advanced Drag & Drop**: Visual section reordering
- **���� Visual CSS Editor**: Inline style editing
- **📱 Mobile-First Editing**: Mobile-optimized editor interface
- **🔌 Plugin System**: Third-party integrations
- **⚡ Real-time Collaboration**: Multi-user editing
- **🏗️ Component Library**: Reusable design components
- **📊 Analytics Integration**: Usage tracking and insights

### Integration Opportunities

- **Headless CMS**: Strapi, Contentful, Sanity
- **Media Management**: Cloudinary, ImageKit
- **Form Builders**: Formspree, Netlify Forms
- **Analytics**: Google Analytics, Mixpanel
- **A/B Testing**: Optimizely, VWO

## Support

For issues, questions, or feature requests:

1. Check this documentation first
2. Review the TypeScript interfaces for API details
3. Examine existing section implementations for patterns
4. Test changes in development environment

The theme editor is designed to be maintainable, extensible, and user-friendly. Happy building! 🚀
