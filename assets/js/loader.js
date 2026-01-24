// assets/js/loader.js
// Подгружает partials по data-include и после этого запускает init скрипты.
// Работает без сборщиков.

async function loadPartials() {
    const nodes = Array.from(document.querySelectorAll('[data-include]'));
    if (!nodes.length) return;

    await Promise.all(nodes.map(async (el) => {
        const url = el.getAttribute('data-include');
        if (!url) return;
        if (el.dataset.loaded === 'true') return;

        try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`Include failed: ${url} (${res.status})`);
            const html = await res.text();
            el.innerHTML = html;
            el.dataset.loaded = 'true';
        } catch (err) {
            console.error('[loader] include error', url, err);
        }
    }));
}

function bootModules() {
    // Navigation
    try {
        if (window.Navigation) new window.Navigation();
        if (window.initNavigation) window.initNavigation();
    } catch (e) { console.error('[boot] navigation', e); }

    // Warning bar
    try {
        if (window.initWarningBar) window.initWarningBar();
    } catch (e) { console.error('[boot] warning-bar', e); }

    // Typography fixes (prevent hanging prepositions)
    try {
        if (window.typography && typeof window.typography.fixOrphans === 'function') {
            window.typography.fixOrphans();
        }
    } catch (e) { console.error('[boot] typography', e); }
}

async function initApp() {
    try {
        // If script runs in head, wait for DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
        }

        await loadPartials();
    } catch (e) {
        console.error('[loader] partials', e);
    } finally {
        bootModules();
    }
}

// Auto-init when file included
initApp();

// Expose for manual control if needed
try { window.loadPartials = loadPartials; } catch (e) { }
try { window.initApp = initApp; } catch (e) { }
