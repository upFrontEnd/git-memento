import '../scss/style.scss';

import { setupCopyButtons } from './copy.js';
import { setupThemeToggle } from './theme.js';
import { setupAccordions } from './accordion.js';

document.addEventListener('DOMContentLoaded', () => {
  setupCopyButtons();
  setupThemeToggle();
  setupAccordions();
});
