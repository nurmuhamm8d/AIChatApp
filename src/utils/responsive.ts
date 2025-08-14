import { Dimensions, ScaledSize } from 'react-native';

// Screen dimensions
const { width, height }: ScaledSize = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth: number = 350;
const guidelineBaseHeight: number = 680;

/**
 * Scale a size based on the screen width
 * @param size - The size to scale
 * @returns The scaled size
 */
export const scale = (size: number): number => {
  const scaleFactor: number = width / guidelineBaseWidth;
  return Math.round(size * scaleFactor);
};

/**
 * Scale a size based on the screen height
 * @param size - The size to scale
 * @returns The scaled size
 */
export const verticalScale = (size: number): number => {
  const scaleFactor: number = height / guidelineBaseHeight;
  return Math.round(size * scaleFactor);
};

/**
 * Scale a size based on the screen's diagonal
 * @param size - The size to scale
 * @param factor - The factor to use for scaling (default: 0.5)
 * @returns The scaled size
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Check if the device is a tablet based on screen dimensions
 * @returns boolean indicating if the device is a tablet
 */
export const isTablet = (): boolean => {
  const aspectRatio: number = height / width;
  return aspectRatio < 1.6 && (width >= 768 || height >= 768);
};

/**
 * Get responsive padding based on device type
 * @param base - Base padding value
 * @param factor - Scaling factor (default: 1)
 * @returns Responsive padding value
 */
export const responsivePadding = (base: number, factor: number = 1): number => {
  return isTablet() ? base * 1.5 * factor : base * factor;
};

/**
 * Get responsive font size based on device type and screen size
 * @param size - Base font size
 * @param factor - Scaling factor (default: 0.5)
 * @returns Responsive font size
 */
export const responsiveFontSize = (size: number, factor: number = 0.5): number => {
  return moderateScale(size, factor);
};

export default {
  scale,
  verticalScale,
  moderateScale,
  isTablet,
  responsivePadding,
  responsiveFontSize,
  window: {
    width,
    height,
  },
};
