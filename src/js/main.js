// src/js/main.js
import '../scss/style.scss';

import { renderSections } from './renderSections.js';
import { setupCopyButtons } from './copy.js';
import { setupThemeToggle } from './theme.js';
import { setupAccordions } from './accordion.js';


document.addEventListener('DOMContentLoaded', () => {
  renderSections();
  setupCopyButtons();
  setupThemeToggle();
  setupAccordions();
});
