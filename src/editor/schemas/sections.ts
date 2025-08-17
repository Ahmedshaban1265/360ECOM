import { SectionSchema, BlockSchema } from '../types';

// Block Schemas
export const FEATURE_CARD_BLOCK: BlockSchema = {
  type: 'feature_card',
  label: 'Feature Card',
  settings: [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      default: 'Feature Title'
    },
    {
      id: 'description',
      label: 'Description',
      type: 'richtext',
      default: 'Feature description goes here'
    },
    {
      id: 'icon',
      label: 'Icon',
      type: 'text',
      description: 'Emoji or icon class',
      default: '⭐'
    },
    {
      id: 'link',
      label: 'Link URL',
      type: 'url',
      placeholder: 'https://example.com'
    },
    {
      id: 'linkText',
      label: 'Link Text',
      type: 'text',
      default: 'Learn More'
    }
  ]
};

export const TESTIMONIAL_BLOCK: BlockSchema = {
  type: 'testimonial',
  label: 'Testimonial',
  settings: [
    {
      id: 'quote',
      label: 'Quote',
      type: 'richtext',
      required: true,
      default: 'This service exceeded our expectations!'
    },
    {
      id: 'author',
      label: 'Author Name',
      type: 'text',
      required: true,
      default: 'John Doe'
    },
    {
      id: 'position',
      label: 'Position/Company',
      type: 'text',
      default: 'CEO, Company Inc.'
    },
    {
      id: 'avatar',
      label: 'Author Photo',
      type: 'image'
    },
    {
      id: 'rating',
      label: 'Rating',
      type: 'range',
      min: 1,
      max: 5,
      step: 1,
      default: 5
    }
  ]
};

// Section Schemas
export const HERO_SECTION: SectionSchema = {
  type: 'hero',
  label: 'Hero Section',
  settings: [
    {
      id: 'title',
      label: 'Headline',
      type: 'text',
      required: true,
      default: 'Welcome to Our Service'
    },
    {
      id: 'subtitle',
      label: 'Subtitle',
      type: 'richtext',
      default: 'Discover amazing features and benefits'
    },
    {
      id: 'backgroundImage',
      label: 'Background Image',
      type: 'image'
    },
    {
      id: 'backgroundColor',
      label: 'Background Color',
      type: 'color',
      default: '#f8fafc'
    },
    {
      id: 'textColor',
      label: 'Text Color',
      type: 'color',
      default: '#0f172a'
    },
    {
      id: 'alignment',
      label: 'Text Alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
      ],
      default: 'center'
    },
    {
      id: 'showButton',
      label: 'Show Button',
      type: 'toggle',
      default: true
    },
    {
      id: 'buttonText',
      label: 'Button Text',
      type: 'text',
      default: 'Get Started'
    },
    {
      id: 'buttonUrl',
      label: 'Button URL',
      type: 'url',
      default: '/contact'
    },
    {
      id: 'height',
      label: 'Section Height',
      type: 'select',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Small (400px)', value: 'small' },
        { label: 'Medium (600px)', value: 'medium' },
        { label: 'Large (800px)', value: 'large' },
        { label: 'Full Screen', value: 'full' }
      ],
      default: 'medium'
    }
  ]
};

export const RICH_TEXT_SECTION: SectionSchema = {
  type: 'rich-text',
  label: 'Rich Text',
  settings: [
    {
      id: 'content',
      label: 'Content',
      type: 'richtext',
      required: true,
      default: '<p>Add your content here...</p>'
    },
    {
      id: 'textAlign',
      label: 'Text Alignment',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' }
      ],
      default: 'left'
    },
    {
      id: 'maxWidth',
      label: 'Max Width',
      type: 'select',
      options: [
        { label: 'Full Width', value: '100%' },
        { label: 'Large (1200px)', value: '1200px' },
        { label: 'Medium (800px)', value: '800px' },
        { label: 'Small (600px)', value: '600px' }
      ],
      default: '800px'
    },
    {
      id: 'backgroundColor',
      label: 'Background Color',
      type: 'color',
      default: 'transparent'
    },
    {
      id: 'padding',
      label: 'Padding',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' }
      ],
      default: 'medium'
    }
  ]
};

export const IMAGE_WITH_TEXT_SECTION: SectionSchema = {
  type: 'image-with-text',
  label: 'Image with Text',
  settings: [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      default: 'Section Title'
    },
    {
      id: 'content',
      label: 'Content',
      type: 'richtext',
      required: true,
      default: '<p>Add your content here...</p>'
    },
    {
      id: 'imageUrl',
      label: 'Image',
      type: 'image',
      required: true
    },
    {
      id: 'imageAlt',
      label: 'Image Alt Text',
      type: 'text',
      default: 'Image description'
    },
    {
      id: 'imagePosition',
      label: 'Image Position',
      type: 'select',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' }
      ],
      default: 'left'
    },
    {
      id: 'imageWidth',
      label: 'Image Width',
      type: 'range',
      min: 30,
      max: 70,
      step: 5,
      default: 50
    },
    {
      id: 'verticalAlignment',
      label: 'Vertical Alignment',
      type: 'select',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' }
      ],
      default: 'center'
    }
  ]
};

export const CARDS_GRID_SECTION: SectionSchema = {
  type: 'cards-grid',
  label: 'Cards Grid',
  settings: [
    {
      id: 'title',
      label: 'Section Title',
      type: 'text',
      default: 'Our Features'
    },
    {
      id: 'subtitle',
      label: 'Section Subtitle',
      type: 'richtext',
      default: 'Discover what makes us special'
    },
    {
      id: 'columns',
      label: 'Columns',
      type: 'select',
      options: [
        { label: '1 Column', value: 1 },
        { label: '2 Columns', value: 2 },
        { label: '3 Columns', value: 3 },
        { label: '4 Columns', value: 4 }
      ],
      default: 3
    },
    {
      id: 'spacing',
      label: 'Card Spacing',
      type: 'select',
      options: [
        { label: 'Tight', value: 'tight' },
        { label: 'Medium', value: 'medium' },
        { label: 'Loose', value: 'loose' }
      ],
      default: 'medium'
    },
    {
      id: 'cardStyle',
      label: 'Card Style',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Shadow', value: 'shadow' },
        { label: 'Minimal', value: 'minimal' }
      ],
      default: 'default'
    }
  ],
  blocks: [FEATURE_CARD_BLOCK],
  maxBlocks: 12,
  presets: [
    {
      name: '3 Feature Cards',
      settings: {
        title: 'Our Services',
        columns: 3,
        spacing: 'medium'
      }
    }
  ]
};

export const CTA_BANNER_SECTION: SectionSchema = {
  type: 'cta-banner',
  label: 'Call to Action Banner',
  settings: [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      default: 'Ready to Get Started?'
    },
    {
      id: 'description',
      label: 'Description',
      type: 'richtext',
      default: 'Join thousands of satisfied customers'
    },
    {
      id: 'buttonText',
      label: 'Button Text',
      type: 'text',
      required: true,
      default: 'Get Started'
    },
    {
      id: 'buttonUrl',
      label: 'Button URL',
      type: 'url',
      required: true,
      default: '/contact'
    },
    {
      id: 'backgroundColor',
      label: 'Background Color',
      type: 'color',
      default: '#2563eb'
    },
    {
      id: 'textColor',
      label: 'Text Color',
      type: 'color',
      default: '#ffffff'
    },
    {
      id: 'buttonStyle',
      label: 'Button Style',
      type: 'select',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
        { label: 'Ghost', value: 'ghost' }
      ],
      default: 'primary'
    }
  ]
};

export const COLLECTION_GRID_SECTION: SectionSchema = {
  type: 'collection-grid',
  label: 'Collection Grid',
  settings: [
    {
      id: 'title',
      label: 'Section Title',
      type: 'text',
      default: 'Our Work'
    },
    {
      id: 'subtitle',
      label: 'Section Subtitle',
      type: 'richtext',
      default: 'Check out our latest projects'
    },
    {
      id: 'columns',
      label: 'Columns',
      type: 'select',
      options: [
        { label: '2 Columns', value: 2 },
        { label: '3 Columns', value: 3 },
        { label: '4 Columns', value: 4 }
      ],
      default: 3
    },
    {
      id: 'showFilters',
      label: 'Show Category Filters',
      type: 'toggle',
      default: true
    },
    {
      id: 'itemsPerPage',
      label: 'Items per Page',
      type: 'number',
      min: 6,
      max: 24,
      default: 9
    },
    {
      id: 'aspectRatio',
      label: 'Image Aspect Ratio',
      type: 'select',
      options: [
        { label: 'Square (1:1)', value: '1:1' },
        { label: 'Landscape (4:3)', value: '4:3' },
        { label: 'Wide (16:9)', value: '16:9' },
        { label: 'Portrait (3:4)', value: '3:4' }
      ],
      default: '4:3'
    }
  ]
};

// Section Registry
export const SECTION_SCHEMAS: Record<string, SectionSchema> = {
  hero: HERO_SECTION,
  'rich-text': RICH_TEXT_SECTION,
  'image-with-text': IMAGE_WITH_TEXT_SECTION,
  'cards-grid': CARDS_GRID_SECTION,
  'cta-banner': CTA_BANNER_SECTION,
  'collection-grid': COLLECTION_GRID_SECTION
};

// Block Registry
export const BLOCK_SCHEMAS: Record<string, BlockSchema> = {
  feature_card: FEATURE_CARD_BLOCK,
  testimonial: TESTIMONIAL_BLOCK
};

// Helper function to get section schema
export function getSectionSchema(type: string): SectionSchema | null {
  return SECTION_SCHEMAS[type] || null;
}

// Helper function to get block schema
export function getBlockSchema(type: string): BlockSchema | null {
  return BLOCK_SCHEMAS[type] || null;
}

// Get all available section types for add menu
export function getAvailableSections(): { type: string; label: string; description?: string }[] {
  return Object.entries(SECTION_SCHEMAS).map(([type, schema]) => ({
    type,
    label: schema.label,
    description: `Add a ${schema.label.toLowerCase()} to your page`
  }));
}
