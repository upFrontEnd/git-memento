import '../scss/style.scss';

function setupCopyButtons() {
  const commands = document.querySelectorAll('.command');
  const buttons = document.querySelectorAll('.command__btn');



  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const command = btn.dataset.command;
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);

        const label = btn.querySelector('span');
        const originalText = label?.textContent ?? 'Copier';

        const commandCard = btn.closest('.command');

        btn.classList.add('command__btn--copied');
        commandCard?.classList.add('command--copied');

        if (label) label.textContent = 'Copié !';

        setTimeout(() => {
          btn.classList.remove('command__btn--copied');
          commandCard?.classList.remove('command--copied');

          if (label) label.textContent = originalText;
        }, 1500);
      } catch (err) {
        console.error('Erreur lors de la copie :', err);
      }
    });
  });
}

// --- THEME MANAGEMENT --- //

const THEME_KEY = 'git-memento-theme';

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;

  // fallback : préférences système
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function setupThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  // init icône / état
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

function updateToggleIcon(toggle, theme) {
  const icon = toggle.querySelector('.theme-toggle__icon');
  if (!icon) return;
  icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
  setupCopyButtons();
  setupThemeToggle();
});
