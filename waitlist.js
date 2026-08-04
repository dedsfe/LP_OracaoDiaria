// Captura de e-mail direto no Supabase, sem backend.
// A página segue estática: um POST na REST API e pronto.
(function () {
  const ENDPOINT = () => `${window.SUPABASE_URL}/rest/v1/waitlist`;

  async function subscribe(email) {
    const res = await fetch(ENDPOINT(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        user_agent: navigator.userAgent,
      }),
    });

    // 409 = e-mail já cadastrado. Pra quem se inscreve, isso é sucesso:
    // dizer "você já está na lista" é informação, não erro.
    if (res.ok || res.status === 409) return;

    throw new Error(`Supabase respondeu ${res.status}`);
  }

  function bind(form) {
    const input = form.querySelector(".waitlist__input");
    const button = form.querySelector(".button");
    const note = form.parentElement.querySelector(".waitlist__note");
    const noteDefault = note ? note.textContent : "";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!input.checkValidity()) return input.reportValidity();

      const original = button.textContent;
      button.disabled = true;
      button.textContent = "Entrando…";

      try {
        await subscribe(input.value);
        form.hidden = true;
        if (note) {
          note.textContent = "Pronto. Sua vaga está garantida — te aviso no lançamento.";
          note.classList.add("waitlist__note--done");
        }
        abrirModal();
      } catch (error) {
        console.error(error);
        button.disabled = false;
        button.textContent = original;
        if (note) {
          note.textContent = "Não consegui salvar agora. Tenta de novo em instantes?";
          note.classList.add("waitlist__note--error");
          setTimeout(() => {
            note.textContent = noteDefault;
            note.classList.remove("waitlist__note--error");
          }, 6000);
        }
      }
    });
  }

  // O modal de sucesso é onde se pede a indicação: é o pico de intenção,
  // e indicação é o que multiplica uma waitlist.
  const CONVITE =
    "Achei um app que bloqueia o celular de manhã até você orar. " +
    "Tá pra sair e dá pra entrar na lista: ";

  function abrirModal() {
    const modal = document.getElementById("success-modal");
    if (!modal) return;

    const link = window.location.origin + window.location.pathname;

    const whats = document.getElementById("share-whatsapp");
    if (whats) {
      whats.href =
        "https://wa.me/?text=" + encodeURIComponent(CONVITE + link);
    }

    const copiar = document.getElementById("share-copy");
    if (copiar) {
      copiar.onclick = async () => {
        try {
          await navigator.clipboard.writeText(link);
          copiar.textContent = "Link copiado ✓";
          setTimeout(() => (copiar.textContent = "Copiar link"), 2500);
        } catch {
          copiar.textContent = link;
        }
      };
    }

    const fechar = modal.querySelector(".modal__close");
    if (fechar) fechar.onclick = () => modal.close();

    // Clique no backdrop fecha: o <dialog> entrega o clique fora como se
    // fosse no próprio elemento.
    modal.onclick = (e) => {
      if (e.target === modal) modal.close();
    };

    modal.showModal();
  }

  document.querySelectorAll(".waitlist__form").forEach(bind);
})();
