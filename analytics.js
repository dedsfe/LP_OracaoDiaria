/**
 * Open Analytics — Advanced Web Tracker (Oração Diária Landing Page)
 * Captura: Dispositivo, SO, Navegador, Origem Inteligente (Instagram, TikTok, Google, X, WhatsApp),
 * Parâmetros UTM, Idioma, Resolução, Timezone e Visualização de Seções por Scroll.
 */

(function () {
  'use strict';

  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;

  // 1. Identificador Anônimo Persistente
  let anonId = localStorage.getItem("od_anon_id");
  if (!anonId) {
    anonId = "web_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem("od_anon_id", anonId);
  }

  // 2. Detecção de Dispositivo e Sistema Operacional
  const ua = navigator.userAgent;
  let deviceType = "desktop";
  if (/iPad|Tablet|PlayBook/i.test(ua)) deviceType = "tablet";
  else if (/Mobile|iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) deviceType = "mobile";

  let os = "Outro";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Macintosh|Mac OS X/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Outro";
  if (/CriOS|Chrome/i.test(ua) && !/Edge|OPR|Edg/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) browser = "Safari";
  else if (/Firefox|FxiOS/i.test(ua)) browser = "Firefox";
  else if (/Edg|Edge/i.test(ua)) browser = "Edge";

  // 3. Detecção Inteligente de Origem / Referrer
  const ref = document.referrer.toLowerCase();
  let channel = "Direto";
  let referrerDomain = "direto";

  if (ref.includes("instagram.com")) {
    channel = "Instagram";
    referrerDomain = "instagram.com";
  } else if (ref.includes("tiktok.com")) {
    channel = "TikTok";
    referrerDomain = "tiktok.com";
  } else if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com")) {
    channel = "X (Twitter)";
    referrerDomain = "x.com";
  } else if (ref.includes("whatsapp.com") || ref.includes("wa.me")) {
    channel = "WhatsApp";
    referrerDomain = "whatsapp.com";
  } else if (ref.includes("google.com") || ref.includes("google.com.br")) {
    channel = "Google Search";
    referrerDomain = "google.com";
  } else if (ref.includes("youtube.com") || ref.includes("youtu.be")) {
    channel = "YouTube";
    referrerDomain = "youtube.com";
  } else if (ref && !ref.includes(window.location.hostname)) {
    try {
      const u = new URL(document.referrer);
      channel = u.hostname.replace('www.', '');
      referrerDomain = u.hostname;
    } catch (e) {
      channel = "Externo";
    }
  }

  // 4. Parâmetros UTM de Campanha
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmContent = urlParams.get('utm_content');

  // Se houver utm_source, sobrescreve o canal
  if (utmSource) {
    channel = utmSource;
  }

  // 5. Idioma e Fuso Horário
  const language = navigator.language || "pt-BR";
  let timezone = "America/Sao_Paulo";
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {}

  // País aproximado pelo Fuso / Idioma
  let country = "Brasil 🇧🇷";
  if (timezone.includes("Sao_Paulo") || timezone.includes("Fortaleza") || timezone.includes("Manaus") || language.toLowerCase().includes("pt-br")) {
    country = "Brasil 🇧🇷";
  } else if (timezone.includes("Lisbon") || timezone.includes("Portugal")) {
    country = "Portugal 🇵🇹";
  } else if (timezone.includes("America/") || timezone.includes("US/")) {
    country = "Estados Unidos 🇺🇸";
  }

  // 6. Função de Envio de Evento para o Supabase
  function track(eventName, properties = {}) {
    const payload = {
      app_id: "oracao-diaria-web",
      anon_id: anonId,
      event: eventName,
      step: properties.section || window.location.pathname + window.location.hash,
      platform: "web",
      properties: {
        channel: channel,
        referrer_domain: referrerDomain,
        referrer_raw: document.referrer || null,
        device_type: deviceType,
        os: os,
        browser: browser,
        screen: `${window.innerWidth}x${window.innerHeight}`,
        language: language,
        timezone: timezone,
        country: country,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        ...properties
      }
    };

    fetch(`${window.SUPABASE_URL}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    }).catch(() => {});
  }

  // 7. Dispara Visualização de Página Imediata
  track("web_pageview", {
    path: window.location.pathname + window.location.hash,
    title: document.title
  });

  // 8. Rastreamento de Rolagem por Seção (#proposito, #como-funciona, #waitlist)
  const trackedSections = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id && !trackedSections.has(entry.target.id)) {
        trackedSections.add(entry.target.id);
        track("web_section_view", {
          section: `#${entry.target.id}`
        });
      }
    });
  }, { threshold: 0.4 });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("section[id], footer[id], div[id='waitlist']").forEach(el => {
      observer.observe(el);
    });
  });

  window.odTrack = track;
})();
