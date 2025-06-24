import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

// Modern vibrant palette
const paletteColors = {
  deepNavy: '#1a223f',
  electricBlue: '#3a86ff',
  aquaMint: '#36f1cd',
  neonPink: '#ff4d6d',
  lemonYellow: '#ffe066',
  white: '#ffffff',
  charcoal: '#232946',
  darkGlass: 'rgba(26,34,63,0.65)',
  lightGlass: 'rgba(255,255,255,0.45)',
  glassBorder: 'rgba(255,255,255,0.18)',
  glassShadow: '0 8px 32px 0 rgba(58, 134, 255, 0.18)',
  gradient: 'linear-gradient(135deg, #3a86ff, #36f1cd, #ffe066, #ff4d6d)'
};

const glassmorphic = (mode) => ({
  background: mode === 'dark' ? paletteColors.darkGlass : paletteColors.lightGlass,
  boxShadow: paletteColors.glassShadow,
  backdropFilter: 'blur(18px) saturate(180%)',
  borderRadius: '24px',
  border: `1.5px solid ${paletteColors.glassBorder}`,
  overflow: 'hidden',
  position: 'relative'
});

const themeOptions = (mode) => ({
  palette: {
    mode,
    primary: { main: paletteColors.electricBlue },
    secondary: { main: paletteColors.aquaMint },
    accent: { main: paletteColors.neonPink },
    warning: { main: paletteColors.lemonYellow },
    background: {
      default: mode === 'dark' ? paletteColors.deepNavy : paletteColors.white,
      paper: mode === 'dark' ? 'rgba(26,34,63,0.85)' : paletteColors.white,
      glass: mode === 'dark' ? paletteColors.darkGlass : paletteColors.lightGlass
    },
    error: { main: paletteColors.neonPink },
    info: { main: paletteColors.electricBlue },
    success: { main: paletteColors.aquaMint },
    text: {
      primary: mode === 'dark' ? paletteColors.white : paletteColors.charcoal,
      secondary: mode === 'dark' ? paletteColors.aquaMint : paletteColors.electricBlue,
    },
    custom: paletteColors,
    gradient: paletteColors.gradient,
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightBold: 700,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background: mode === 'dark' ? paletteColors.darkGlass : paletteColors.lightGlass,
          backdropFilter: 'blur(18px) saturate(180%)',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
        }
      }
    }
  },
  glassmorphic: glassmorphic(mode)
});

const ThemeContext = createContext();

export function useThemeMode() {
  return useContext(ThemeContext);
}

export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved) {
      setMode(saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const theme = useMemo(() => createTheme(themeOptions(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}