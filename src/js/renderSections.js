import sectionsData from '../data/commands.json';

/**
 * Génère dynamiquement toutes les sections dans <main>
 * en se basant sur le JSON.
 */
export function renderSections() {
  const main = document.querySelector('main');
  if (!main) return;

  // On nettoie le contenu existant de <main> (au cas où)
  main.innerHTML = '';

  sectionsData.forEach((section) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'section';
    sectionEl.setAttribute('aria-labelledby', `section-${section.id}`);

    // ----- Header ----- //
    const header = document.createElement('div');
    header.className = 'section__header';

    const icon = document.createElement('i');
    icon.className = `${section.icon} section__icon`;
    icon.setAttribute('aria-hidden', 'true');
    header.appendChild(icon);

    const h2 = document.createElement('h2');
    h2.className = 'section__title';
    h2.id = `section-${section.id}`;
    h2.textContent = section.title;
    header.appendChild(h2);

    const toggle = document.createElement('button');
    toggle.className = 'section__toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-controls', `section-${section.id}-content`);

    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = `Afficher / masquer la section ${section.toggleLabel || section.title}`;
    toggle.appendChild(sr);

    const toggleIcon = document.createElement('i');
    toggleIcon.className = 'fas fa-chevron-down section__toggle-icon';
    toggleIcon.setAttribute('aria-hidden', 'true');
    toggle.appendChild(toggleIcon);

    header.appendChild(toggle);

    // ----- Liste des commandes ----- //
    const commandsWrapper = document.createElement('div');
    commandsWrapper.className = 'commands';
    commandsWrapper.id = `section-${section.id}-content`;

    section.commands.forEach((cmd) => {
      const article = document.createElement('article');
      article.className = 'command';

      const info = document.createElement('div');
      info.className = 'command__info';

      const p = document.createElement('p');
      p.className = 'command__description';
      p.textContent = cmd.description;
      info.appendChild(p);

      const codeEl = document.createElement('code');
      codeEl.className = 'command__code';
      codeEl.textContent = cmd.code;
      info.appendChild(codeEl);

      article.appendChild(info);

      const btn = document.createElement('button');
      btn.className = 'command__btn';
      btn.type = 'button';
      btn.dataset.command = cmd.code;
      btn.setAttribute('aria-label', 'Copier la commande Git.');

      const btnIcon = document.createElement('i');
      btnIcon.className = 'fas fa-clipboard';
      btnIcon.setAttribute('aria-hidden', 'true');

      const span = document.createElement('span');
      span.textContent = 'Copier';

      btn.appendChild(btnIcon);
      btn.appendChild(span);

      article.appendChild(btn);
      commandsWrapper.appendChild(article);
    });

    sectionEl.appendChild(header);
    sectionEl.appendChild(commandsWrapper);
    main.appendChild(sectionEl);
  });
}
