import { Dimensions, ScaledSize } from 'react-native';

let { width, height }: ScaledSize = Dimensions.get('window');

Dimensions.addEventListener?.('change', ({ window }) => {
  width = window.width;
  height = window.height;
});

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scale = (size: number): number => {
  const scaleFactor = width / guidelineBaseWidth;
  return Math.round(size * scaleFactor);
};

export const verticalScale = (size: number): number => {
  const scaleFactor = height / guidelineBaseHeight;
  return Math.round(size * scaleFactor);
};

export const moderateScale = (size: number, factor = 0.5): number =>
  size + (scale(size) - size) * factor;

export const isTablet = (): boolean => {
  const aspectRatio = height / width;
  return aspectRatio < 1.6 && (width >= 768 || height >= 768);
};

export const responsivePadding = (base: number, factor = 1): number =>
  isTablet() ? base * 1.5 * factor : base * factor;

export const responsiveFontSize = (size: number, factor = 0.5): number =>
  moderateScale(size, factor);

export default {
  scale,
  verticalScale,
  moderateScale,
  isTablet,
  responsivePadding,
  responsiveFontSize,
  window: {
    get width() {
      return width;
    },
    get height() {
      return height;
    },
  },
};
