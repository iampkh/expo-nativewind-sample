/**
 * Icon Module Type Definitions
 * 
 * Centralized type definitions for the icon system
 * Re-exports types from Icon and AnimatedIcon components
 */

export type { IconName, IconProps } from './Icon';
export type { AnimatedIconProps } from './AnimatedIcon';

// Animation types for easy reference
export type IconAnimationType = 
  | "rotate" 
  | "bounce" 
  | "pulse" 
  | "fade" 
  | "scale" 
  | "shake";

// Common icon sizes for consistency
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
  xxl: 64,
} as const;

export type IconSize = keyof typeof ICON_SIZES | number;

// Helper type for icon registry
export type IconRegistry = Record<string, (props: any) => React.JSX.Element | null>;

// Props for custom SVG icons
export type CustomIconProps = {
  width?: number;
  height?: number;
  size?: number;
  fill?: string;
  color?: string;
};