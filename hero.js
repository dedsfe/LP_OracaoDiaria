/* Hero — "o barulho não atravessa".
   Os ícones vêm da esquerda, sobem em direção ao telefone e passam por trás
   dele. Alguns pixels depois da borda direita eles perdem a gravidade, caem e
   se empilham no fundo da hero: o monte do que não passou.

   Tudo (inclusive o telefone) é desenhado no canvas — é o que dá o z-order
   exato: voo atrás do aparelho, queda na frente. */
(function () {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const hero = canvas.closest(".hero");
  const content = hero.querySelector(".hero__content");
  const cta = hero.querySelector(".hero__cta");

  const ICONS = [
    "instagram", "whatsapp", "tiktok", "youtube", "x",
    "messenger", "gmail", "netflix", "facebook", "spotify",
  ];

  const GRAVITY = 1500;      // px/s² — pesado de propósito: cai como pedra
  const DROP_MIN = 14;       // px depois da borda do telefone até soltar
  const DROP_MAX = 96;       // varia por ícone: solta tudo no mesmo x vira torre
  const MAX_PILE = 14;       // além disso a pilha vira bagunça
  const SPAWN_EVERY = 820;   // ms
  const REST_BEFORE_DUST = 3000; // ms parado antes de virar pó
  const DUST_STEP = 3;       // px de CSS por partícula

  let dpr = 1, W = 0, H = 0, floorY = 0, corridorTop = 0;
  let phone = null;          // {x, y, w, h, r} em px de CSS
  let iconSize = 64;
  const sprites = {};        // nome -> canvas já com squircle e sombra
  const bodies = [];
  const dust = [];            // partículas soltas
  const dustData = {};        // pixels do ícone morto, lidos uma vez por sprite
  let phoneImg = null;
  let queue = [];
  let lastSpawn = 0;
  let piled = 0;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  const ICON_COLORS = {
    instagram: "rgba(225, 48, 108, 0.38)",
    whatsapp: "rgba(37, 211, 102, 0.38)",
    tiktok: "rgba(0, 242, 234, 0.32)",
    youtube: "rgba(255, 0, 0, 0.35)",
    x: "rgba(0, 0, 0, 0.22)",
    messenger: "rgba(0, 132, 255, 0.38)",
    gmail: "rgba(234, 67, 53, 0.35)",
    netflix: "rgba(229, 9, 20, 0.38)",
    facebook: "rgba(24, 119, 242, 0.38)",
    spotify: "rgba(30, 215, 96, 0.38)",
  };

  /* Sprites prontos (squircle + sombra com glow sutil) desenhados uma vez só. Redesenhar a
     sombra a cada frame, com 14 ícones na tela, derruba o mobile.
     Cada ícone tem duas versões: vivo (colorido com blur suave) e morto — cinza com cadeado,
     que é o que emerge do outro lado do aparelho. */
  function buildSprite(name, img, dead) {
    const pad = Math.round(iconSize * 0.4);
    const s = document.createElement("canvas");
    s.width = (iconSize + pad * 2) * dpr;
    s.height = (iconSize + pad * 2) * dpr;
    const c = s.getContext("2d");
    c.scale(dpr, dpr);

    const glowColor = ICON_COLORS[name] || "rgba(18, 20, 28, 0.2)";
    c.shadowColor = dead ? "rgba(18, 20, 28, 0.12)" : glowColor;
    c.shadowBlur = dead ? iconSize * 0.24 : iconSize * 0.32;
    c.shadowOffsetY = dead ? iconSize * 0.08 : iconSize * 0.04;
    c.save();
    roundRect(c, pad, pad, iconSize, iconSize, iconSize * 0.2237);
    c.fill();          // a sombra sai do preenchimento, não da imagem
    c.clip();
    c.shadowColor = "transparent";
    c.drawImage(img, pad, pad, iconSize, iconSize);
    c.restore();

    if (dead) {
      /* Dessaturação limpa e nítida: transforma em escala de cinza sem borrar nada */
      const d = c.getImageData(0, 0, s.width, s.height);
      const px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i + 3] === 0) continue;
        const l = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) * 0.85;
        px[i] = px[i + 1] = px[i + 2] = l;
      }
      c.putImageData(d, 0, 0);

      // Emoji de cadeado 🔒 nativo da Apple, 100% nítido e limpo por cima do ícone cinza
      c.save();
      c.font = Math.round(iconSize * 0.48) + "px -apple-system, 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText("🔒", pad + iconSize / 2, pad + iconSize / 2 + iconSize * 0.02);
      c.restore();
    }

    s._pad = pad;
    sprites[dead ? name + ":dead" : name] = s;
  }

  let formRight = 0;
  let formBottom = 0;

  function layout() {
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    const r = hero.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    floorY = H - 12;

    const wide = W >= 900;
    iconSize = wide ? 60 : 44;

    const formEl = content.querySelector(".waitlist__form");
    if (formEl) {
      const fb = formEl.getBoundingClientRect();
      formRight = fb.right - r.left;
      formBottom = fb.bottom - r.top;
    } else {
      const cb = content.getBoundingClientRect();
      formRight = cb.right - r.left;
      formBottom = cb.bottom - r.top;
    }

    if (wide) {
      const ph = Math.min(H * 0.82, 650);
      const pw = ph * (750 / 1548);
      // Alinhado bem à direita no container largo (1140px)
      const containerLeft = Math.max(0, (W - Math.min(W, 1140)) / 2);
      const containerRight = containerLeft + Math.min(W, 1140);
      const targetX = containerRight - pw - 40;
      phone = {
        w: pw,
        h: ph,
        x: Math.min(W - pw - 30, Math.max(W * 0.58, targetX)),
        y: H * 0.5 - ph / 2,
      };
      corridorTop = formBottom + 24;
    } else {
      const cb = content.getBoundingClientRect().bottom - r.top;
      const spaceBelow = H - cb;
      // Altura proporcional e com folga segura para o piso do canvas (floorY)
      const ph = Math.min(380, Math.max(240, spaceBelow - 84));
      const pw = ph * (750 / 1548);
      phone = {
        w: pw,
        h: ph,
        x: Math.round(W * 0.5 - pw / 2),
        y: Math.round(cb + 20),
      };
      corridorTop = phone.y + phone.h * 0.15;
    }
    phone.r = phone.w * 0.145;

    Object.keys(sprites).forEach((k) => delete sprites[k]);
    loadedImgs.forEach((img, name) => {
      buildSprite(name, img, false);
      buildSprite(name, img, true);
    });
  }

  function spawn() {
    if (!queue.length) {
      queue = ICONS.slice().sort(() => Math.random() - 0.5);
    }
    const name = queue.pop();
    if (!sprites[name]) return;

    const wide = W >= 900;
    // Ponto onde atinge o telefone: bem mais alto (entre 25% e 55% da altura do telefone)
    const yEnter = rand(phone.y + phone.h * 0.22, phone.y + phone.h * 0.52);
    // Nasce abaixo do formulário de e-mail e botão
    const yStart = wide
      ? Math.min(floorY - iconSize - 12, formBottom + rand(28, 65))
      : phone.y + rand(16, phone.h * 0.35);

    const maxDrop = wide
      ? DROP_MAX
      : Math.min(DROP_MAX, Math.max(16, W - (phone.x + phone.w) - iconSize - 10));

    bodies.push({
      name,
      state: "fly",
      x: -iconSize - rand(0, 140),
      y: yStart,
      x0: -iconSize,
      yStart,
      yEnter,
      vx: rand(210, 265),
      vy: 0,
      phase: Math.random() * Math.PI * 2,
      drop: rand(DROP_MIN, Math.max(DROP_MIN + 4, maxDrop)),
      scale: 0.55,
    });
  }

  function step(dt, t) {
    for (const b of bodies) {
      if (b.state === "fly") {
        b.x += b.vx * dt;
        
        // Curva inteligente:
        // Enquanto está à esquerda do botão (x < formRight): viaja baixo/reto
        // Assim que ultrapassa o botão (x >= formRight): sobe rápido e suave em direção ao meio do telefone
        const wide = W >= 900;
        let p = 0;
        if (wide && formRight > 0) {
          if (b.x <= formRight) {
            p = 0;
          } else {
            p = Math.max(0, Math.min(1, (b.x - formRight) / Math.max(1, phone.x - formRight)));
          }
        } else {
          p = Math.max(0, Math.min(1, (b.x - b.x0) / (phone.x - b.x0)));
        }

        b.y = b.yStart + (b.yEnter - b.yStart) * easeInOut(p);
        b.y += Math.sin(t * 1.8 + b.phase) * 3.5;
        b.scale = 0.55 + 0.45 * easeInOut(p);

        if (b.x + iconSize > phone.x + phone.w) b.dead = true;

        if (b.x >= phone.x + phone.w + b.drop) {
          // Perde a gravidade aqui: mantém o embalo, ganha peso.
          b.state = "fall";
          b.scale = 1;
          b.vy = 0;
          b.vx *= 0.85;
        }
      } else if (b.state === "fall") {
        b.vy += GRAVITY * dt;
        b.vx *= 0.985;
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.y + iconSize >= floorY) {
          b.y = floorY - iconSize;
          b.vy *= -0.16;
          b.vx *= 0.6;
          if (Math.abs(b.vy) < 55) { b.vy = 0; if (!b.rest) b.restAt = nowMs; b.rest = true; }
        }
        if (b.x < 0) { b.x = 0; b.vx *= -0.4; }
        if (b.x + iconSize > W) { b.x = W - iconSize; b.vx *= -0.4; }
      }
    }

    // Empilhamento: separa pelo eixo de menor penetração. O corpo que já está
    // em repouso vira chão pro de cima, senão a pilha afunda sozinha.
    const solid = bodies.filter((b) => b.state === "fall");
    for (let it = 0; it < 4; it++) {
      for (let i = 0; i < solid.length; i++) {
        for (let j = i + 1; j < solid.length; j++) {
          const a = solid[i], c = solid[j];
          const dx = a.x - c.x, dy = a.y - c.y;
          const ox = iconSize - Math.abs(dx);
          const oy = iconSize - Math.abs(dy);
          if (ox <= 0 || oy <= 0) continue;

          if (ox < oy) {
            const push = (dx < 0 ? -ox : ox) / 2;
            a.x += push; c.x -= push;
            a.vx *= 0.5; c.vx *= 0.5;
          } else {
            const upper = dy < 0 ? a : c;
            const lower = upper === a ? c : a;
            if (lower.rest) {
              upper.y = lower.y - iconSize;
            } else {
              upper.y -= oy / 2;
              lower.y += oy / 2;
            }
            if (upper.vy > 0) upper.vy = 0;
            upper.vx *= 0.55;
            if (Math.abs(upper.vy) < 55) { if (!upper.rest) upper.restAt = nowMs; upper.rest = true; }
          }
        }
      }
    }

    piled = solid.length;
  }

  /* Desintegração: o ícone é amostrado em blocos de DUST_STEP px e cada bloco
     vira uma partícula que sobe e some. A varredura vai da esquerda pra
     direita, no mesmo sentido do vento — é o que faz parecer que o ícone está
     sendo levado, e não simplesmente apagado. */
  function readDust(name) {
    if (dustData[name]) return dustData[name];
    const s = sprites[name + ":dead"];
    if (!s) return null;
    const pad = s._pad;
    const px = s.getContext("2d").getImageData(
      pad * dpr, pad * dpr, Math.round(iconSize * dpr), Math.round(iconSize * dpr)
    );
    dustData[name] = px;
    return px;
  }

  function explode(b) {
    const px = readDust(b.name);
    if (!px) return;
    const w = px.width;
    const d = px.data;

    for (let y = 0; y < iconSize; y += DUST_STEP) {
      for (let x = 0; x < iconSize; x += DUST_STEP) {
        const sx = Math.round(x * dpr), sy = Math.round(y * dpr);
        const i = (sy * w + sx) * 4;
        const a = d[i + 3];
        if (a < 24) continue;
        const k = x / iconSize;
        dust.push({
          x: b.x + x, y: b.y + y,
          c: "rgba(" + d[i] + "," + d[i + 1] + "," + d[i + 2] + ",",
          a: a / 255,
          vx: 26 + k * 34 + Math.random() * 46,
          vy: -18 - Math.random() * 54,
          size: DUST_STEP,
          phase: Math.random() * 6.28,
          t: 0,
          delay: k * 0.5 + Math.random() * 0.14,
          life: 0.85 + Math.random() * 0.55,
        });
      }
    }

    // O buraco na pilha precisa ser sentido: quem estava por cima desaba.
    for (const o of bodies) {
      if (o === b || !o.rest) continue;
      if (o.y < b.y && Math.abs(o.x - b.x) < iconSize) { o.rest = false; o.restAt = 0; }
    }
  }

  function stepDust(dt) {
    for (let i = dust.length - 1; i >= 0; i--) {
      const p = dust[i];
      p.t += dt;
      if (p.t < p.delay) continue;
      const k = (p.t - p.delay) / p.life;
      if (k >= 1) { dust.splice(i, 1); continue; }
      p.vy -= 22 * dt;                 // poeira não cai: sobe e se dissolve
      p.x += (p.vx + Math.sin(p.t * 7 + p.phase) * 14) * dt;
      p.y += p.vy * dt;
    }
  }

  function drawDust() {
    for (const p of dust) {
      if (p.t < p.delay) continue;
      const k = (p.t - p.delay) / p.life;
      ctx.fillStyle = p.c + (p.a * (1 - k)).toFixed(3) + ")";
      const sz = p.size * (1 - k * 0.65);
      ctx.fillRect(p.x, p.y, sz, sz);
    }
  }

  function drawIcon(b) {
    const s = sprites[b.dead ? b.name + ":dead" : b.name];
    if (!s) return;
    const pad = s._pad;
    const size = iconSize * b.scale;
    const p = pad * b.scale;
    const cx = b.x + iconSize / 2;
    const cy = b.y + iconSize / 2;
    ctx.drawImage(s, cx - size / 2 - p, cy - size / 2 - p, size + p * 2, size + p * 2);
  }

  function drawPhone() {
    if (!phoneImg) return;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(phoneImg, phone.x, phone.y, phone.w, phone.h);
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    for (const b of bodies) if (b.state === "fly") drawIcon(b);
    drawPhone();
    for (const b of bodies) if (b.state === "fall") drawIcon(b);
    drawDust();
  }

  let last = 0, nowMs = 0;
  function frame(now) {
    nowMs = now;
    const t = now / 1000;
    const dt = Math.min((now - last) / 1000, 1 / 30) || 0;
    last = now;

    if (piled < MAX_PILE && now - lastSpawn > SPAWN_EVERY) {
      lastSpawn = now;
      spawn();
    }
    for (let i = bodies.length - 1; i >= 0; i--) {
      const b = bodies[i];
      if (b.rest && b.restAt && now - b.restAt > REST_BEFORE_DUST) {
        explode(b);
        bodies.splice(i, 1);
      }
    }

    step(dt, t);
    stepDust(dt);
    render();
    requestAnimationFrame(frame);
  }

  /* ---- carga ---- */
  const loadedImgs = new Map();
  let pending = ICONS.length + 1;

  function ready() {
    if (--pending > 0) return;
    layout();
    if (reduced) {
      // Sem movimento: o telefone e a pilha já formada, parados.
      ICONS.slice(0, 8).forEach((name, i) => {
        bodies.push({
          name, state: "fall", rest: true, dead: true, scale: 1, vx: 0, vy: 0,
          x: phone.x + phone.w + DROP_MIN + (i % 4) * iconSize * 1.04 - iconSize,
          y: floorY - iconSize * (1 + Math.floor(i / 4)),
        });
      });
      render();
      return;
    }
    requestAnimationFrame(frame);
  }

  ICONS.forEach((name) => {
    const img = new Image();
    img.onload = () => { loadedImgs.set(name, img); ready(); };
    img.onerror = ready;
    img.src = "icons/" + name + ".png";
  });

  const pi = new Image();
  pi.onload = () => { phoneImg = pi; ready(); };
  // WebP tem ~3% do peso do PNG; o PNG fica só de rede de segurança.
  pi.onerror = () => {
    if (pi.dataset.fallback) return ready();
    pi.dataset.fallback = "1";
    pi.src = "app-screen.png";
  };
  pi.src = "app-screen.webp";

  let rt;
  function handleResize() {
    clearTimeout(rt);
    rt = setTimeout(() => {
      bodies.length = 0;
      dust.length = 0;
      Object.keys(dustData).forEach((k) => delete dustData[k]);
      piled = 0;
      layout();
      if (reduced) render();
    }, 120);
  }

  addEventListener("resize", handleResize, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      layout();
      if (reduced) render();
    });
  }

  if (window.ResizeObserver && content) {
    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) render();
    });
    ro.observe(content);
  }
})();
