export function setupAccordions() {
    const sections = document.querySelectorAll('.section');
  
    sections.forEach((section) => {
      const toggle = section.querySelector('.section__toggle');
      const content = section.querySelector('.commands');
  
      if (!toggle || !content) return;
  
      // État initial : ouvert, sauf si section--collapsed est déjà dans le HTML
      let isOpen = !section.classList.contains('section--collapsed');
      toggle.setAttribute('aria-expanded', String(isOpen));
  
      toggle.addEventListener('click', () => {
        isOpen = !isOpen;
  
        section.classList.toggle('section--collapsed', !isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }
  