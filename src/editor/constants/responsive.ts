export const REAL_RESPONSIVE_BREAKPOINTS = {
  sm: 640,    // Small devices (landscape phones)
  md: 768,    // Medium devices (tablets)
  lg: 1024,   // Large devices (desktops)
  xl: 1280,   // Extra large devices
  '2xl': 1536 // 2X large devices
} as const;

export type BreakpointKey = keyof typeof REAL_RESPONSIVE_BREAKPOINTS;