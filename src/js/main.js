// src/js/main.js
import '../scss/style.scss';

import sectionsData from '../data/commands.json';

import { renderSections } from './renderSections.js';
import { setupCopyButtons } from './copy.js';
import { setupThemeToggle } from './theme.js';
import { setupAccordions } from './accordion.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  if (!app) return;

  // Si le HTML a été pré-rendu (SSG), #app contient déjà des éléments
  if (app.childElementCount === 0) {
    renderSections(app, sectionsData);
  }

  setupCopyButtons();
  setupThemeToggle();
  setupAccordions();
});
