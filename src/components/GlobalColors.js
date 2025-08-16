// Global color constants for the new blue theme
export const BRAND_COLORS = {
  // Primary blue gradients (replacing emerald-based gradients)
  PRIMARY_GRADIENT: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
  PRIMARY_GRADIENT_HOVER: "hover:from-blue-700 hover:via-blue-800 hover:to-blue-900",
  
  // Text gradients
  TEXT_GRADIENT: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent",
  
  // Accent colors
  PRIMARY_BLUE: "blue-600",
  PRIMARY_BLUE_HOVER: "hover:bg-blue-600",
  PRIMARY_BLUE_TEXT: "text-blue-600",
  PRIMARY_BLUE_BORDER: "border-blue-600",
  
  // Light variations
  LIGHT_BLUE_BG: "bg-blue-50",
  LIGHT_BLUE_BG_DARK: "dark:bg-blue-900/20",
  
  // Badge gradients
  BADGE_GRADIENT: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
  
  // Social/icon gradients
  ICON_GRADIENT: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
};

// Helper function to get gradient classes
export const getGradientClasses = (type = 'primary') => {
  const gradients = {
    primary: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800",
    hover: "hover:from-blue-700 hover:via-blue-800 hover:to-blue-900",
    reverse: "bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600",
    text: "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent"
  };
  
  return gradients[type] || gradients.primary;
};
