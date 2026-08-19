import { MdDarkMode, MdLightMode, MdSettingsBrightness } from 'react-icons/md';
import { useThemeContext } from '../hooks/useThemeContext';

export function ThemeSwitcher() {
  const { theme, cycleTheme } = useThemeContext();

  return (
    <button
      onClick={cycleTheme}
      className="rounded-md border border-[var(--app-border)] p-1.5 text-[var(--app-fg)] hover:bg-[var(--app-bg)]"
      aria-label={`Theme mode: ${theme}. Click to cycle.`}
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <MdLightMode />}
      {theme === 'dark' && <MdDarkMode />}
      {theme === 'system' && <MdSettingsBrightness />}
    </button>
  );
}
