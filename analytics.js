// Tracker de Analytics leve para a Landing Page (oracaodiaria.space)
(function () {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;

  let anonId = localStorage.getItem("od_anon_id");
  if (!anonId) {
    anonId = "web_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem("od_anon_id", anonId);
  }

  const referrer = document.referrer || "Direct / none";

  fetch(`${window.SUPABASE_URL}/rest/v1/analytics_events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: window.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      app_id: "oracao-diaria-web",
      anon_id: anonId,
      event: "web_pageview",
      step: "/",
      platform: "web",
      properties: {
        referrer: referrer,
        path: window.location.pathname + window.location.hash,
        screen: `${window.innerWidth}x${window.innerHeight}`
      }
    })
  }).catch(() => {});
})();
