/**
 * Meta Pixel — Oração Diária (BM Monique Pereira / pixel "Oração Diária - Site").
 * PageView em toda página + Lead quando clica num link da App Store,
 * que é o evento que as campanhas de Facebook otimizam.
 */

(function () {
  'use strict';

  var PIXEL_ID = '1856273675390211';

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  // Delegação: pega também links da App Store criados depois do carregamento.
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest("a[href*='apps.apple.com']");
    if (!link) return;
    // O app é só iOS: Lead conta só iPhone/iPad, pra campanha aprender a achar dono de iPhone.
    var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isIOS) {
      fbq('trackCustom', 'AppStoreClickNaoIOS');
      return;
    }
    fbq('track', 'Lead', {
      content_name: 'app_store_click',
      cta_location: link.dataset.ctaLocation || 'navigation'
    });
  }, true);
})();
