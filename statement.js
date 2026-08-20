/**
 * Scroll-Driven Text Highlight Animation — Seção 2 (Manifesto)
 * 
 * Conforme o usuário rola a página, cada palavra, badge, logo e emoji
 * transita progressivamente de uma opacidade baixa (0.18) para a cor sólida normal (1.0),
 * criando o efeito de leitura e iluminação de texto padrão Apple.
 */
(function () {
  'use strict';

  function initStatementReveal() {
    const title = document.querySelector('.statement__title');
    if (!title) return;

    // Processa recursivamente nós de texto e wrappers
    function processNode(node, target) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) {
          target.appendChild(document.createTextNode(text));
          return;
        }
        const tokens = text.split(/(\s+)/);
        tokens.forEach(tok => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) {
            target.appendChild(document.createTextNode(tok));
          } else {
            const span = document.createElement('span');
            span.className = 'statement__word';
            span.textContent = tok;
            target.appendChild(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Apenas contêineres de texto longo como serif/handwritten são expandidos
        if (
          node.classList.contains('statement__serif') ||
          node.classList.contains('statement__handwritten')
        ) {
          const clone = node.cloneNode(false);
          Array.from(node.childNodes).forEach(child => processNode(child, clone));
          target.appendChild(clone);
        } else {
          // Badges, highlights e stacks tornam-se tokens atômicos animados
          node.classList.add('statement__word');
          target.appendChild(node);
        }
      }
    }

    const fragment = document.createDocumentFragment();
    Array.from(title.childNodes).forEach(child => processNode(child, fragment));
    title.innerHTML = '';
    title.appendChild(fragment);

    const words = title.querySelectorAll('.statement__word');
    const total = words.length;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }

    function update() {
      const rect = title.getBoundingClientRect();
      const vh = window.innerHeight;

      // A revelação só começa quando o topo do título passa da metade da tela —
      // antes disso o bloco ainda está entrando e acender ali parece adiantado.
      // A duração acompanha a altura real do texto, então ler e acender andam
      // no mesmo ritmo em qualquer tamanho de tela.
      const startY = vh * 0.58;
      const span = rect.height + vh * 0.2;
      const globalProgress = Math.max(0, Math.min(1, (startY - rect.top) / span));

      // Cada palavra leva WORD_RANGE do progresso total, e o início da última é
      // recuado para que ela termine exatamente em 1 — antes ela parava em 0.6
      // e ficava cinza pra sempre.
      const WORD_RANGE = 0.18;
      words.forEach((el, index) => {
        const wordStart = (index / Math.max(1, total - 1)) * (1 - WORD_RANGE);

        const p = Math.max(0, Math.min(1, (globalProgress - wordStart) / WORD_RANGE));
        
        // Opacidade de 0.18 (inativa) até 1.0 (revelada)
        const opacity = 0.18 + 0.82 * p;
        el.style.setProperty('--word-opacity', opacity.toFixed(3));
        el.style.setProperty('--word-p', p.toFixed(3));
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatementReveal);
  } else {
    initStatementReveal();
  }
})();
