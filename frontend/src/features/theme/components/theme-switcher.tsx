import { MdDarkMode, MdLightMode, MdSettingsBrightness } from 'react-icons/md';
import { useThemeContext } from '../hooks/useThemeContext';

export function ThemeSwitcher() {
  const { theme, cycleTheme } = useThemeContext();
  const iconSize = 24;
  return (
    <button
      onClick={cycleTheme}
      className="rounded-md border border-[var(--app-border)] p-1.5 text-[var(--app-fg)] hover:bg-[var(--app-bg)]"
      aria-label={`Theme mode: ${theme}. Click to cycle.`}
      title={`Theme: ${theme}`}
    >
      {theme === 'light' && <MdLightMode size={iconSize} />}
      {theme === 'dark' && <MdDarkMode size={iconSize} />}
      {theme === 'system' && <MdSettingsBrightness size={iconSize} />}
    </button>
  );
}
