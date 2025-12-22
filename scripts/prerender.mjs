// scripts/prerender.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Window } from 'happy-dom';

import sectionsData from '../src/data/commands.json';
import { renderSections } from '../src/js/renderSections.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function main() {
  const distIndexPath = path.resolve(root, 'dist/index.html');

  const distIndex = await fs.readFile(distIndexPath, 'utf-8');

  if (!distIndex.includes('<!--app-html-->')) {
    throw new Error(
      'Placeholder "<!--app-html-->" introuvable dans dist/index.html. Vérifie index.html (racine).'
    );
  }

  // 1) Crée un DOM virtuel
  const window = new Window();
  const { document } = window;

  // 2) Expose les globals nécessaires à ton renderer (qui utilise "document.createElement")
  globalThis.window = window;
  globalThis.document = document;
  globalThis.Node = window.Node;
  globalThis.HTMLElement = window.HTMLElement;

  // 3) Crée le conteneur et réutilise ton renderer DOM existant
  const app = document.createElement('div');
  app.id = 'app';

  renderSections(app, sectionsData);

  // 4) Injecte le HTML généré dans dist/index.html
  const appHtml = app.innerHTML;

  if (!appHtml || appHtml.trim().length === 0) {
    throw new Error('Prerender: HTML vide. Vérifie src/data/commands.json et renderSections().');
  }  

  const out = distIndex.replace('<!--app-html-->', appHtml);

  await fs.writeFile(distIndexPath, out, 'utf-8');

  console.log('Prerender OK (happy-dom): dist/index.html injecté.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
