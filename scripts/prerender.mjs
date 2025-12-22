// scripts/prerender.mjs
// ------------------------------------------------------------
// Objectif général
// ------------------------------------------------------------
// Ce script met en place un "SSG" (Static Site Generation) simple :
// 1) on build le projet (Vite génère dist/index.html + assets)
// 2) on génère ensuite le HTML du contenu à partir de vos données (JSON)
// 3) on injecte ce HTML dans dist/index.html à la place d’un placeholder
//
// Avantage : le HTML final est présent dès le chargement (SEO/perf),
// tout en conservant le JS côté client pour l’interactivité.
//
// ------------------------------------------------------------
// Pourquoi l’extension .mjs ?
// ------------------------------------------------------------
// .mjs indique explicitement un fichier JavaScript en ES Modules (ESM).
// Concrètement :
// - on utilise `import ... from` (au lieu de require)
// - Node exécute ce fichier en mode ESM même si le projet n’a pas "type":"module"
// - `__dirname` n’existe pas en ESM : on le reconstruit via fileURLToPath()
// C’est pratique pour les scripts de build, car ça évite les ambiguïtés CommonJS/ESM.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Window } from 'happy-dom';

// Données de contenu (ici : commandes Git). Dans un autre projet, ce pourrait être
// des produits, des articles, une FAQ, etc.
import sectionsData from '../src/data/commands.json';

// Renderer "source unique" : il sait construire le DOM à partir des données.
// L’idée est de réutiliser exactement la même logique côté build et côté navigateur.
import { renderSections } from '../src/js/renderSections.js';

// ------------------------------------------------------------
// Reconstituer __dirname en ESM
// ------------------------------------------------------------
// En ESM, on ne dispose pas de __filename/__dirname comme en CommonJS.
// On utilise l’URL du module (import.meta.url) puis on la convertit en chemin local.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Racine du projet (un niveau au-dessus de /scripts)
const root = path.resolve(__dirname, '..');

async function main() {
  // Chemin du fichier HTML généré par le build (Vite)
  const distIndexPath = path.resolve(root, 'dist/index.html');

  // Lire le HTML "template" généré par Vite
  const distIndex = await fs.readFile(distIndexPath, 'utf-8');

  // Vérifier la présence du placeholder : c’est le point d’injection.
  // Dans un autre contexte, tu peux changer le placeholder (ex: <!--ssg-outlet-->)
  // tant que le script et index.html sont cohérents.
  if (!distIndex.includes('<!--app-html-->')) {
    throw new Error(
      'Placeholder "<!--app-html-->" introuvable dans dist/index.html. Vérifie index.html (racine).'
    );
  }

  // ------------------------------------------------------------
  // 1) Créer un DOM virtuel (sans navigateur)
  // ------------------------------------------------------------
  // happy-dom fournit une implémentation de window/document utilisable en Node.
  // Cela permet d’exécuter du code DOM (createElement, appendChild, etc.)
  // dans un script de build.
  const window = new Window();
  const { document } = window;

  // ------------------------------------------------------------
  // 2) Exposer des globals DOM attendus par le renderer
  // ------------------------------------------------------------
  // Beaucoup de renderers DOM utilisent implicitement `document` global.
  // Pour pouvoir réutiliser le même renderer qu’en navigateur, on assigne
  // window/document dans globalThis.
  //
  // Dans un autre projet, ajoute ici toute API globale DOM requise
  // (ex: CustomEvent, navigator, etc.) selon le code exécuté au build.
  globalThis.window = window;
  globalThis.document = document;
  globalThis.Node = window.Node;
  globalThis.HTMLElement = window.HTMLElement;

  // ------------------------------------------------------------
  // 3) Créer le conteneur de rendu et exécuter le renderer
  // ------------------------------------------------------------
  // On reproduit la structure minimale attendue : un conteneur "app".
  // Le renderer y injecte les sections/commandes en créant des éléments DOM.
  const app = document.createElement('div');
  app.id = 'app';

  // Réutilisation du renderer existant :
  // - 1er argument : le conteneur DOM de sortie
  // - 2e argument : les données structurées (JSON)
  renderSections(app, sectionsData);

  // ------------------------------------------------------------
  // 4) Extraire le HTML rendu et l’injecter dans dist/index.html
  // ------------------------------------------------------------
  // On récupère le contenu HTML produit (string). C’est ce qui deviendra
  // le HTML "pré-rendu" livré par Netlify/CDN.
  const appHtml = app.innerHTML;

  // Sanity check : un build qui injecte une page vide est souvent un symptôme
  // (JSON vide, renderer qui a crash silencieusement, changement de schéma, etc.)
  if (!appHtml || appHtml.trim().length === 0) {
    throw new Error('Prerender: HTML vide. Vérifie src/data/commands.json et renderSections().');
  }

  // Injection : on remplace le placeholder par le HTML rendu.
  // Note : `replace` ne remplace que la première occurrence. C’est voulu :
  // il ne doit y avoir qu’un seul point d’injection.
  const out = distIndex.replace('<!--app-html-->', appHtml);

  // Écrire le fichier final (celui qui sera servi en production)
  await fs.writeFile(distIndexPath, out, 'utf-8');

  console.log('Prerender OK (happy-dom): dist/index.html injecté.');
}

// Point d’entrée : exécute le script, puis force un exit code non-zéro en cas d’erreur.
// Important en CI/CD (Netlify) : un exit code != 0 doit faire échouer le build.
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
