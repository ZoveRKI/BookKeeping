import { useEffect, useState } from 'react';
import { applyTheme, readStoredTheme, saveTheme, THEME_STORAGE_KEY } from '../../theme';
import './atomsCSS/ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(readStoredTheme);
  const isDark = theme === 'dark';
  const label = isDark ? '切换到浅色模式' : '切换到深色模式';

  useEffect(() => {
    const syncTheme = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
      const nextTheme = readStoredTheme();
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };
    window.addEventListener('storage', syncTheme);
    return () => window.removeEventListener('storage', syncTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    saveTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </>
        ) : (
          <path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z" />
        )}
      </svg>
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default ThemeToggle;
