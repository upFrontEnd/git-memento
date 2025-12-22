/**
 * Génère dynamiquement toutes les sections à partir d’un dataset (JSON)
 * et les injecte dans un conteneur DOM.
 *
 * Ce pattern est réutilisable dans d’autres projets :
 * - `sectionsData` peut représenter des catégories, des chapitres, des cards, etc.
 * - la fonction ne dépend pas d’un framework : uniquement du DOM natif
 * - elle peut être utilisée :
 *   - côté navigateur (CSR / hydratation légère)
 *   - côté build (SSG) via un DOM virtuel (ex : happy-dom / jsdom)
 */
export function renderSections(container, sectionsData) {
  /**
   * Conteneur de rendu :
   * - si un conteneur est fourni, on rend dedans (cas le plus explicite, testable)
   * - sinon, fallback sur un noeud standard (#app) pour un usage simple
   */
  const target = container ?? document.querySelector('#app');
  if (!target) return;

  /**
   * Garde-fou de contrat :
   * on s’assure que la fonction reçoit bien une liste (tableau) de sections.
   * Cela évite des erreurs silencieuses (ex : JSON mal formé, objet au lieu de tableau, etc.)
   * et facilite le debug en CI/CD.
   */
  if (!Array.isArray(sectionsData)) {
    throw new Error('renderSections: sectionsData doit être un tableau (JSON).');
  }

  /**
   * Rendu "idempotent" :
   * on vide le conteneur avant d’injecter la nouvelle version.
   * Utile si :
   * - la fonction est rappelée (re-render)
   * - on change de dataset (filtrage/recherche)
   * - on veut garantir un état DOM propre
   */
  target.innerHTML = '';

  /**
   * Boucle principale :
   * pour chaque "section" (catégorie), on construit un bloc structuré et accessible.
   */
  sectionsData.forEach((section) => {
    // Section racine : élément sémantique (<section>) pour structurer le contenu
    const sectionEl = document.createElement('section');
    sectionEl.className = 'section';

    /**
     * Accessibilité :
     * aria-labelledby lie la section à son titre via un id unique.
     * Les lecteurs d’écran utilisent ce lien pour nommer la section.
     */
    sectionEl.setAttribute('aria-labelledby', `section-${section.id}`);

    // ------------------------------------------------------------
    // Header : icône + titre + bouton d’accordéon
    // ------------------------------------------------------------
    const header = document.createElement('div');
    header.className = 'section__header';

    /**
     * Icône décorative :
     * - <i> est utilisé ici comme support de classes FontAwesome
     * - aria-hidden="true" évite que l’icône soit lue inutilement
     */
    const icon = document.createElement('i');
    icon.className = `${section.icon} section__icon`;
    icon.setAttribute('aria-hidden', 'true');
    header.appendChild(icon);

    /**
     * Titre :
     * - id stable permettant :
     *   - d’être référencé par aria-labelledby
     *   - de supporter des deep-links (#section-id) si besoin
     */
    const h2 = document.createElement('h2');
    h2.className = 'section__title';
    h2.id = `section-${section.id}`;
    h2.textContent = section.title;
    header.appendChild(h2);

    /**
     * Bouton d’accordéon :
     * - aria-expanded reflète l’état (ouvert/fermé)
     * - aria-controls pointe vers l’élément contrôlé (contenu de la section)
     *
     * Important : ici l’état initial est "true" (ouvert).
     * La logique d’ouverture/fermeture est gérée ailleurs (ex : accordion.js).
     */
    const toggle = document.createElement('button');
    toggle.className = 'section__toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-controls', `section-${section.id}-content`);

    /**
     * Texte accessible (screen readers) :
     * - améliore la compréhension du bouton (l’icône seule ne suffit pas)
     * - "toggleLabel" permet un libellé plus explicite si nécessaire
     */
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = `Afficher / masquer la section ${section.toggleLabel || section.title}`;
    toggle.appendChild(sr);

    /**
     * Icône d’état (chevron) :
     * décoratif -> aria-hidden=true
     * La rotation/animation est généralement pilotée via CSS.
     */
    const toggleIcon = document.createElement('i');
    toggleIcon.className = 'fas fa-chevron-down section__toggle-icon';
    toggleIcon.setAttribute('aria-hidden', 'true');
    toggle.appendChild(toggleIcon);

    header.appendChild(toggle);

    // ------------------------------------------------------------
    // Contenu : liste des commandes (ou items)
    // ------------------------------------------------------------
    const commandsWrapper = document.createElement('div');
    commandsWrapper.className = 'commands';

    /**
     * Id attendu par aria-controls :
     * le bouton d’accordéon contrôle précisément ce bloc.
     */
    commandsWrapper.id = `section-${section.id}-content`;

    /**
     * Chaque "cmd" représente un item :
     * ici une commande Git, mais le pattern est le même pour :
     * - une carte produit
     * - un snippet de code
     * - un conseil / une procédure
     */
    section.commands.forEach((cmd) => {
      const article = document.createElement('article');
      article.className = 'command';

      // Bloc info : description + code
      const info = document.createElement('div');
      info.className = 'command__info';

      const p = document.createElement('p');
      p.className = 'command__description';
      p.textContent = cmd.description;
      info.appendChild(p);

      /**
       * Code :
       * - <code> pour une valeur technique
       * - textContent évite toute interprétation HTML (sécurité XSS)
       */
      const codeEl = document.createElement('code');
      codeEl.className = 'command__code';
      codeEl.textContent = cmd.code;
      info.appendChild(codeEl);

      article.appendChild(info);

      /**
       * Bouton "copier" :
       * - dataset.command stocke la valeur à copier
       * - la logique de copie (Clipboard API) est externalisée (copy.js)
       *
       * Ce pattern (data-*) est réutilisable :
       * - data-copy, data-value, data-url, etc.
       */
      const btn = document.createElement('button');
      btn.className = 'command__btn';
      btn.type = 'button';
      btn.dataset.command = cmd.code;
      btn.setAttribute('aria-label', 'Copier la commande Git.');

      // Icône décorative
      const btnIcon = document.createElement('i');
      btnIcon.className = 'fas fa-clipboard';
      btnIcon.setAttribute('aria-hidden', 'true');

      // Libellé visible
      const span = document.createElement('span');
      span.textContent = 'Copier';

      btn.appendChild(btnIcon);
      btn.appendChild(span);

      article.appendChild(btn);

      // Ajouter l’item au conteneur de commandes
      commandsWrapper.appendChild(article);
    });

    // Assembler la section (header + contenu)
    sectionEl.appendChild(header);
    sectionEl.appendChild(commandsWrapper);

    // Injecter la section dans le conteneur final
    target.appendChild(sectionEl);
  });
}
