const THEME_KEY = "git-memento-theme";
const DARK = "dark";
const LIGHT = "light";

function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === LIGHT || stored === DARK ? stored : null;
}

function getSystemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? DARK : LIGHT;
}

function getPreferredTheme() {
  return getStoredTheme() ?? getSystemTheme();
}

function ensureThemeColorMeta() {
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  return meta;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function updateToggleIcon(toggle, theme) {
  const icon = toggle.querySelector(".theme-toggle__icon");
  if (icon) icon.textContent = theme === DARK ? "☀️" : "🌙";
}

function updateA11yState(toggle, theme) {
  // aria-pressed = "true" quand le mode sombre est actif (toggle on/off)
  toggle.setAttribute("aria-pressed", String(theme === DARK));
}

function updateThemeColor(theme) {
  // Ajuste ces valeurs à ta DA si besoin
  const meta = ensureThemeColorMeta();
  meta.setAttribute("content", theme === DARK ? "#0b0b0b" : "#ffffff");
}

function setTheme(toggle, theme, { persist = false } = {}) {
  applyTheme(theme);
  updateToggleIcon(toggle, theme);
  updateA11yState(toggle, theme);
  updateThemeColor(theme);

  if (persist) localStorage.setItem(THEME_KEY, theme);
}

export function setupThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  // Init
  setTheme(toggle, getPreferredTheme());

  // Click utilisateur => persist
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || LIGHT;
    const next = current === LIGHT ? DARK : LIGHT;
    setTheme(toggle, next, { persist: true });
  });

  // Suivre l’OS uniquement si l’utilisateur n’a pas choisi explicitement
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  media?.addEventListener?.("change", () => {
    if (getStoredTheme() !== null) return; // l’utilisateur a “forcé” un thème
    setTheme(toggle, getSystemTheme());
  });
}
