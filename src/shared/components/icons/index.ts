/**
 * Icon Module - Centralized Icon System
 * 
 * This module provides a unified interface for all icons in the application.
 * It supports Expo vector icons (Ionicons, MaterialIcons, etc.) and custom SVGs.
 * 
 * Benefits:
 * - Single import point for all icon components
 * - Easy to switch between different icon libraries
 * - Consistent API across the entire application
 * - Support for animations and custom styling
 * - Future-proof: easy to add new icon libraries or custom SVGs
 * 
 * Usage Examples:
 * 
 * Basic Icon:
 * import { Icon } from '@/src/shared/components/icons';
 * <Icon name="home" size={24} color="#000" />
 * 
 * Animated Icon:
 * import { AnimatedIcon } from '@/src/shared/components/icons';
 * <AnimatedIcon name="heart" size={32} color="red" animation="bounce" />
 * 
 * With predefined sizes:
 * import { Icon, ICON_SIZES } from '@/src/shared/components/icons';
 * <Icon name="settings" size={ICON_SIZES.lg} color="#666" />
 */

// Main components
export { Icon } from './Icon';
export { AnimatedIcon } from './AnimatedIcon';

// Type definitions
export type {
  IconName,
  IconProps,
  AnimatedIconProps,
  IconAnimationType,
  IconSize,
  IconRegistry,
  CustomIconProps,
} from './types';

// Constants
export { ICON_SIZES } from './types';

// Default export for convenience
export { Icon as default } from './Icon';