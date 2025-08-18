import { Platform, StatusBar } from 'react-native';
import {
  responsiveFontSize,
  scale,
  verticalScale,
  moderateScale,
  isTablet,
} from '../utils/responsive';

const spacing = {
  xxs: scale(2),
  xs: scale(4),
  s: scale(8),
  m: scale(12),
  l: scale(16),
  xl: scale(24),
  xxl: scale(32),
  xxxl: scale(48),
} as const;

const borderRadius = {
  s: scale(4),
  m: scale(8),
  l: scale(12),
  xl: scale(16),
  xxl: scale(24),
  round: scale(999),
} as const;

const iconSizes = {
  xs: scale(16),
  s: scale(20),
  m: scale(24),
  l: scale(28),
  xl: scale(32),
  xxl: scale(48),
} as const;

const fontSizes = {
  caption: responsiveFontSize(12),
  body: responsiveFontSize(14),
  subheader: responsiveFontSize(16),
  title: responsiveFontSize(18),
  header: responsiveFontSize(20),
  largeHeader: responsiveFontSize(24),
  xlHeader: responsiveFontSize(28),
  xxlHeader: responsiveFontSize(32),
} as const;

const buttonSizes = {
  small: {
    height: verticalScale(36),
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.m,
  },
  medium: {
    height: verticalScale(48),
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.m,
  },
  large: {
    height: verticalScale(56),
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.l,
  },
} as const;

const inputSizes = {
  small: {
    height: verticalScale(40),
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.m,
  },
  medium: {
    height: verticalScale(48),
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.m,
  },
  large: {
    height: verticalScale(56),
    paddingHorizontal: spacing.l,
    borderRadius: borderRadius.m,
  },
} as const;

const cardStyles = {
  standard: {
    borderRadius: borderRadius.l,
    padding: spacing.l,
    margin: spacing.s,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  elevated: {
    borderRadius: borderRadius.l,
    padding: spacing.l,
    margin: spacing.s,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
} as const;

const containerStyles = {
  screen: {
    flex: 1,
    paddingHorizontal: spacing.l,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
  },
  content: { flex: 1, padding: spacing.l },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
} as const;

const textStyles = {
  title: { fontSize: fontSizes.title, fontWeight: 'bold', marginBottom: spacing.s },
  subtitle: { fontSize: fontSizes.subheader, opacity: 0.8, marginBottom: spacing.xs },
  body: { fontSize: fontSizes.body, lineHeight: fontSizes.body * 1.5 },
  caption: { fontSize: fontSizes.caption, opacity: 0.7 },
  button: { fontSize: fontSizes.body, fontWeight: '600' },
} as const;

export const responsiveStyles = {
  spacing,
  borderRadius,
  iconSizes,
  fontSizes,
  buttonSizes,
  inputSizes,
  cardStyles,
  containerStyles,
  textStyles,
  isTablet,
  scale,
  verticalScale,
  moderateScale,
  responsiveFontSize,
} as const;

export type ResponsiveStyles = typeof responsiveStyles;
