import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightTheme, darkTheme } from './';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

type ThemeContextType = {
  theme: typeof lightTheme;
  themeType: ThemeType;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('light');
  const [theme, setTheme] = useState(lightTheme);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeType(savedTheme);
          setTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
        }
      } catch (error) {
        console.error('Error loading theme', error);
      }
    };

    loadTheme();
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = async () => {
    const newThemeType = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newThemeType);
    setTheme(newThemeType === 'dark' ? darkTheme : lightTheme);
    
    try {
      await AsyncStorage.setItem('theme', newThemeType);
    } catch (error) {
      console.error('Error saving theme', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeType, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
