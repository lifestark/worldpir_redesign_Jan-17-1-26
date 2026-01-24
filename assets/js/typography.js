// assets/js/typography.js
// Типографические правки: запрет висящих предлогов — заменяем обычный пробел
// после коротких предлогов на неразрывный пробел.

(function () {
    const PREPOSITIONS = [
        'в', 'во', 'к', 'ко', 'с', 'со', 'у', 'о', 'об', 'от', 'из', 'на', 'по', 'за', 'до',
        'для', 'без', 'при', 'над', 'под', 'про', 'через'
    ];

    const selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', '.section__title',
        '.animators__title', '.filter-group__title', '.nav__title--line',
        '.card__title', '.btn__text', '.nav__address', '.nav__phone'
    ];

    const re = new RegExp('\\b(' + PREPOSITIONS.join('|') + ')\\s+', 'gi');

    function replaceInTextNode(node) {
        if (!node || !node.nodeValue) return;
        const original = node.nodeValue;
        const replaced = original.replace(re, (m, p) => p + '\u00A0');
        if (replaced !== original) node.nodeValue = replaced;
    }

    function walkAndFix(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            // skip script/style/template tags (TreeWalker already scoped by root)
            if (!node.nodeValue.trim()) continue;
            replaceInTextNode(node);
        }
    }

    function fixOrphans(customSelectors) {
        const list = customSelectors && customSelectors.length ? customSelectors : selectors;
        list.forEach(sel => {
            try {
                document.querySelectorAll(sel).forEach(el => walkAndFix(el));
            } catch (e) {
                // invalid selector or other issue — ignore
            }
        });
    }

    // Auto-run after DOM ready
    function onReady() {
        fixOrphans();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady, { once: true });
    } else {
        onReady();
    }

    // Export API
    window.typography = {
        fixOrphans
    };
})();
