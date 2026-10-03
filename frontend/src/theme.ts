export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'bookkeeping-theme';

export const readStoredTheme = (): Theme => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};

export const saveTheme = (theme: Theme) => {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The current tab can still switch themes when browser storage is unavailable.
  }
};
