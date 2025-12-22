export function setupCopyButtons() {
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
          btn.setAttribute('aria-label', 'La commande a été copiée.');
  
          if (label) label.textContent = 'Copié !';
  
          setTimeout(() => {
            btn.classList.remove('command__btn--copied');
            commandCard?.classList.remove('command--copied');
            btn.setAttribute('aria-label', 'Copier la commande Git.');
  
            if (label) label.textContent = originalText;
          }, 1500);
        } catch (err) {
          console.error('Erreur lors de la copie :', err);
        }
      });
    });
  }
  