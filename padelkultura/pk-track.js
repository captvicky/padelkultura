/*
 * pk-track.js — pelacak klik CTA WhatsApp untuk Google Analytics 4.
 * Mengirim event GA4 "wa_cta_click" dengan parameter:
 *   link_url, link_text, page_path, page_title.
 * Tidak mengubah navigasi dan tidak pernah melempar error.
 */
(function () {
    'use strict';

    var WA_MARKERS = ['wa.me/', 'api.whatsapp.com', 'whatsapp://'];

    function isWhatsApp(href) {
        for (var i = 0; i < WA_MARKERS.length; i++) {
            if (href.indexOf(WA_MARKERS[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    function cleanText(text) {
        return (text || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    }

    function handler(event) {
        try {
            var target = event.target;
            if (!target || typeof target.closest !== 'function') {
                return;
            }
            var link = target.closest('a[href]');
            if (!link) {
                return;
            }
            var href = link.href || '';
            if (!isWhatsApp(href)) {
                return;
            }
            if (typeof window.gtag !== 'function') {
                return;
            }
            window.gtag('event', 'wa_cta_click', {
                link_url: href,
                link_text: cleanText(link.textContent),
                page_path: window.location.pathname,
                page_title: document.title
            });
        } catch (err) {
            /* diabaikan: pelacakan tidak boleh mengganggu pengunjung */
        }
    }

    document.addEventListener('click', handler, true);
})();
