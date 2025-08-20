import React from 'react';
import { cn } from '@/lib/utils';

/**
 * ArabicText Component
 * 
 * A utility component that automatically applies Arabic styling including:
 * - Cairo font family
 * - RTL direction
 * - Right text alignment
 * - Proper spacing and typography
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Text content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - HTML element type (default: 'div')
 * @param {Object} props.props - Additional props to pass to the element
 */
const ArabicText = ({ 
  children, 
  className = '', 
  as: Component = 'div',
  ...props 
}) => {
  return (
    <Component
      lang="ar"
      dir="rtl"
      className={cn(
        'arabic-text',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * BilingualText Component
 * 
 * A component for displaying both Arabic and English text with proper switching
 * 
 * @param {Object} props
 * @param {string} props.arabic - Arabic text content
 * @param {string} props.english - English text content
 * @param {string} props.language - Current language ('ar' | 'en')
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.as - HTML element type (default: 'div')
 */
export const BilingualText = ({ 
  arabic, 
  english, 
  language = 'en', 
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const isArabic = language === 'ar';
  
  return (
    <Component
      lang={language}
      dir={isArabic ? 'rtl' : 'ltr'}
      className={cn(
        isArabic && 'arabic-text',
        className
      )}
      {...props}
    >
      {isArabic ? arabic : english}
    </Component>
  );
};

/**
 * ArabicHeading Component
 * 
 * Specialized component for Arabic headings with optimized typography
 */
export const ArabicHeading = ({ 
  children, 
  level = 1, 
  className = '',
  ...props 
}) => {
  const HeadingComponent = `h${level}`;
  
  return (
    <HeadingComponent
      lang="ar"
      dir="rtl"
      className={cn(
        'arabic-text font-semibold',
        {
          'text-4xl md:text-5xl lg:text-6xl': level === 1,
          'text-3xl md:text-4xl lg:text-5xl': level === 2,
          'text-2xl md:text-3xl lg:text-4xl': level === 3,
          'text-xl md:text-2xl': level === 4,
          'text-lg md:text-xl': level === 5,
          'text-base md:text-lg': level === 6,
        },
        className
      )}
      {...props}
    >
      {children}
    </HeadingComponent>
  );
};

/**
 * ArabicParagraph Component
 * 
 * Specialized component for Arabic paragraphs with optimized line height and spacing
 */
export const ArabicParagraph = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <p
      lang="ar"
      dir="rtl"
      className={cn(
        'arabic-text leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export default ArabicText;
