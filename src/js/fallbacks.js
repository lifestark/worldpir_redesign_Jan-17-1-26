// Minimal fallback module — only triggers settings re-apply if available.
export function init() {
    try {
        if (typeof window.applySiteSettings === 'function') {
            try { window.applySiteSettings(); } catch (e) { }
            // run again after small delay to handle late DOM insertions
            window.addEventListener('load', () => setTimeout(() => { try { window.applySiteSettings(); } catch (e) { } }, 120));
        }
    } catch (e) { /* ignore */ }
}
