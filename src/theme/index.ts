import {
  MD3LightTheme as PaperMD3Light,
  MD3DarkTheme as PaperMD3Dark,
  type MD3Theme,
} from 'react-native-paper';

const common: Partial<MD3Theme> = {
  roundness: 12,
};

export const lightTheme: MD3Theme = {
  ...PaperMD3Light,
  ...common,
  colors: {
    ...PaperMD3Light.colors,
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
    background: '#F6F6F6',
    surface: '#FFFFFF',
    surfaceVariant: '#E7E0EC',
    outline: '#79747E',
    error: '#B3261E',
    onPrimary: '#FFFFFF',
    onSurface: '#1D1B20',
    onSurfaceVariant: '#49454F',
    elevation: {
      level0: 'transparent',
      level1: '#F2EDF6',
      level2: '#ECE6F0',
      level3: '#E6E0EB',
      level4: '#E0DAE5',
      level5: '#DBD4E0',
    },
  },
};

export const darkTheme: MD3Theme = {
  ...PaperMD3Dark,
  ...common,
  colors: {
    ...PaperMD3Dark.colors,
    primary: '#D0BCFF',
    secondary: '#CCC2DC',
    tertiary: '#EFB8C8',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#49454F',
    outline: '#938F99',
    error: '#CF6679',
    onPrimary: '#381E72',
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',
    elevation: {
      level0: 'transparent',
      level1: '#1F1B24',
      level2: '#24202A',
      level3: '#27222E',
      level4: '#2B2632',
      level5: '#2E2936',
    },
  },
};
