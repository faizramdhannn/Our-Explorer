'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/types';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

interface ThemeColors {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  earth: string;
  deep: string;
  text: string;
  muted: string;
  card: string;
  border: string;
  gradient: string;
  navBg: string;
}

const femaleColors: ThemeColors = {
  bg: '#FFF5F0',
  primary: '#F9A8D4',
  secondary: '#FDE68A',
  accent: '#A7F3D0',
  earth: '#D4A5A5',
  deep: '#9D6B6B',
  text: '#5C3D3D',
  muted: '#E8C4C4',
  card: '#FFF0F5',
  border: '#F0C0C0',
  gradient: 'linear-gradient(135deg, #FFF5F0 0%, #FDE8F0 50%, #FFF0E8 100%)',
  navBg: 'rgba(255, 240, 245, 0.95)',
};

const maleColors: ThemeColors = {
  bg: '#F0F7F0',
  primary: '#86EFAC',
  secondary: '#93C5FD',
  accent: '#FCD34D',
  earth: '#A5B4A5',
  deep: '#3D6B4F',
  text: '#2D4A3E',
  muted: '#C4D8C4',
  card: '#F0F5F0',
  border: '#B0D0B0',
  gradient: 'linear-gradient(135deg, #F0F7F0 0%, #E8F5E8 50%, #F0F5F0 100%)',
  navBg: 'rgba(240, 245, 240, 0.95)',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'female',
  toggleTheme: () => {},
  colors: femaleColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('female');

  useEffect(() => {
    const saved = localStorage.getItem('our-explorer-theme') as Theme;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'female' ? 'male' : 'female';
      localStorage.setItem('our-explorer-theme', next);
      return next;
    });
  };

  const colors = theme === 'female' ? femaleColors : maleColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
