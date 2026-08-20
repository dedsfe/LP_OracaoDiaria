/**
 * Oração Diária — Interações da Biblioteca de Orações (oracoes.js)
 * Cópia acessível com fallback para mobile/safari e suporte ao fluxo de waitlist.
 */
(function () {
  'use strict';

  // 1. Função Segura de Cópia da Oração com Fallback
  window.copyPrayer = function (btn) {
    if (!btn) return;
    const card = btn.closest('.prayer-card');
    const textEl = card ? card.querySelector('.prayer-card__body') : document.getElementById('prayer-text');
    if (!textEl) return;
    const text = textEl.innerText.trim();

    function showFeedback() {
      const original = btn.dataset.originalText || btn.innerText;
      btn.dataset.originalText = original;
      btn.innerText = '✓ Copiada!';
      btn.style.color = 'var(--accent)';
      setTimeout(() => {
        btn.innerText = original;
        btn.style.color = '';
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(showFeedback)
        .catch(() => fallbackCopy(text, showFeedback));
    } else {
      fallbackCopy(text, showFeedback);
    }
  };

  function fallbackCopy(text, onSuccess) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      const ok = document.execCommand('copy');
      if (ok && onSuccess) onSuccess();
    } catch (e) {
      console.warn('Fallback copy error:', e);
    }
    document.body.removeChild(ta);
  }

  // 2. Vincula automaticamente todos os botões de cópia ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.prayer-card__copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => window.copyPrayer(btn));
    });
  });
})();
