import React, { createContext, useContext, useEffect, useState } from 'react';
import { applyTheme, getMode, THEME_KEY, type ThemeMode } from '..';

interface IThemeContext {
  theme: ThemeMode;
  cycleTheme: () => void;
}

const ThemeContext = createContext<IThemeContext | undefined>(undefined);
const storedTheme = getMode();

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>(storedTheme);

  useEffect(() => {
    const mode = getMode();
    setTheme(mode);
    applyTheme(mode);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);

    if (theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);

  function cycleTheme() {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
