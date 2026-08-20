/**
 * FAQ Conversa — a dúvida entra em bolha, o "•••" pisca, a resposta aparece.
 *
 * Uma bolha por vez: os turnos que entram na tela vão para uma fila e são
 * animados em sequência, na ordem do documento. Se todos aparecessem juntos,
 * o efeito viraria "lista que faz fade", não conversa.
 */
(function () {
  "use strict";

  const BUBBLE_SETTLE = 320; // bolha assenta antes do "•••"
  const TYPING_DURATION = 560;
  const TURN_GAP = 260; // respiro antes da próxima pergunta

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function init() {
    const turns = Array.from(document.querySelectorAll(".chat__turn"));
    if (!turns.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      turns.forEach((t) => t.classList.add("is-in", "is-answered"));
      return;
    }

    const order = new Map(turns.map((turn, i) => [turn, i]));
    const queue = [];
    let running = false;

    async function drain() {
      if (running) return;
      running = true;

      while (queue.length) {
        // Reordena a cada passo: rolar pra cima não pode inverter a conversa.
        queue.sort((a, b) => order.get(a) - order.get(b));
        const turn = queue.shift();

        turn.classList.add("is-in");
        await wait(BUBBLE_SETTLE);

        turn.classList.add("is-typing");
        await wait(TYPING_DURATION);

        turn.classList.remove("is-typing");
        turn.classList.add("is-answered");
        await wait(TURN_GAP);
      }

      running = false;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          queue.push(entry.target);
        });
        drain();
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.25 }
    );

    turns.forEach((turn) => observer.observe(turn));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
