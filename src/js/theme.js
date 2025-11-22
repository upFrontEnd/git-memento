// src/js/theme.js

const THEME_KEY = 'git-memento-theme';

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function updateToggleIcon(toggle, theme) {
  const icon = toggle.querySelector('.theme-toggle__icon');
  if (!icon) return;
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

export function setupThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  const current = getPreferredTheme();
  applyTheme(current);
  updateToggleIcon(toggle, current);

  toggle.addEventListener('click', () => {
    const currentTheme =
      document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

    applyTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    updateToggleIcon(toggle, nextTheme);
  });
}
