import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeType = 'system' | 'light' | 'dark';

type Ctx = {
  themeType: ThemeType;
  mode: 'light' | 'dark';
  toggleTheme: (next?: ThemeType) => void;
};

const ThemeContext = createContext<Ctx | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scheme = useColorScheme(); 
  const [themeType, setThemeType] = useState<ThemeType>('system');

  const mode: 'light' | 'dark' =
    themeType === 'system'
      ? (scheme === 'dark' ? 'dark' : 'light')
      : themeType === 'dark'
        ? 'dark'
        : 'light';

  const toggleTheme = useCallback((next?: ThemeType) => {
    if (next) {
      setThemeType(next);
    } else {
      setThemeType(prev => (prev === 'dark' ? 'light' : 'dark'));
    }
  }, []);

  const value = useMemo(() => ({ themeType, mode, toggleTheme }), [themeType, mode, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): Ctx => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider');
  return ctx;
};

export { ThemeContext };
