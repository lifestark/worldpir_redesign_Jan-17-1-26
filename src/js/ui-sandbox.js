document.addEventListener('DOMContentLoaded', function () {
    // Close notices
    document.querySelectorAll('.notice__close').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var notice = btn.closest('.notice');
            if (!notice) return;
            notice.classList.add('notice--hidden');
            // remove from DOM after transition
            setTimeout(function () { if (notice && notice.parentNode) notice.parentNode.removeChild(notice); }, 300);
        });
    });

    // Button group single-active behavior
    document.querySelectorAll('.button-group').forEach(function (group) {
        group.addEventListener('click', function (e) {
            var item = e.target.closest('.button-group__item');
            if (!item || !group.contains(item)) return;
            group.querySelectorAll('.button-group__item').forEach(function (i) { i.classList.remove('button-group__item--active'); });
            item.classList.add('button-group__item--active');
        });
    });

    // Tabs behavior (both horizontal and vertical)
    document.querySelectorAll('.tabs-horizontal, .tabs-vertical').forEach(function (tabs) {
        tabs.addEventListener('click', function (e) {
            var tab = e.target.closest('.tab');
            if (!tab || !tabs.contains(tab)) return;
            tabs.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('tab--active'); });
            tab.classList.add('tab--active');
        });
    });

    // Chip close (remove)
    document.querySelectorAll('.chip .chip__close').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var chip = btn.closest('.chip');
            if (!chip) return;
            chip.classList.add('chip--removing');
            setTimeout(function () { if (chip && chip.parentNode) chip.parentNode.removeChild(chip); }, 180);
        });
    });

    // Range tooltip
    document.querySelectorAll('input[type="range"]').forEach(function (range) {
        var tooltip = document.createElement('div');
        tooltip.className = 'range-tooltip';
        tooltip.textContent = range.value;
        document.body.appendChild(tooltip);

        function update() {
            var rect = range.getBoundingClientRect();
            var min = parseFloat(range.min) || 0;
            var max = parseFloat(range.max);
            if (isNaN(max)) max = min + 100;
            var val = parseFloat(range.value);
            var pct = (val - min) / (max - min || 1);
            var left = rect.left + pct * rect.width;
            tooltip.textContent = range.value;
            tooltip.style.left = (left) + 'px';
            tooltip.style.top = (rect.top - 36) + 'px';
            tooltip.style.opacity = '1';
        }

        range.addEventListener('input', update);
        range.addEventListener('pointerdown', update);
        range.addEventListener('pointerup', function () { tooltip.style.opacity = '0'; });
        range.addEventListener('mouseleave', function () { tooltip.style.opacity = '0'; });
    });

});

// Modal: open/close, Esc and focus trap
(function () {
    var openBtn = document.getElementById('openModal');
    var modal = document.getElementById('demoModal');
    if (!modal) return;

    var focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var previouslyFocused = null;

    function getFocusable() {
        return Array.prototype.slice.call(modal.querySelectorAll(focusableSelector)).filter(function (el) {
            return el.offsetWidth || el.offsetHeight || el.getClientRects().length;
        });
    }

    function openModal() {
        previouslyFocused = document.activeElement;
        modal.removeAttribute('hidden');
        // ensure transition runs
        requestAnimationFrame(function () {
            modal.classList.add('modal--open');
        });
        var focusable = getFocusable();
        if (focusable.length) focusable[0].focus();
        document.addEventListener('keydown', trapTab);
        document.addEventListener('keydown', escClose);
    }

    function closeModal() {
        // start fade-out
        modal.classList.remove('modal--open');

        // after transition ends, hide completely
        var onHide = function (e) {
            if (e.target !== modal) return;
            modal.setAttribute('hidden', '');
            modal.removeEventListener('transitionend', onHide);
        };
        modal.addEventListener('transitionend', onHide);

        if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
        document.removeEventListener('keydown', trapTab);
        document.removeEventListener('keydown', escClose);
    }

    function escClose(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeModal();
        }
    }

    function trapTab(e) {
        if (e.key !== 'Tab') return;
        var focusable = getFocusable();
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    // open button
    if (openBtn) openBtn.addEventListener('click', function () { openModal(); });

    // close triggers (data-modal-close)
    modal.querySelectorAll('[data-modal-close]').forEach(function (el) { el.addEventListener('click', function () { closeModal(); }); });

    // confirm button example
    var confirmBtn = document.getElementById('modalConfirm');
    if (confirmBtn) confirmBtn.addEventListener('click', function () { closeModal(); });

})();

// Palette: fill swatch values and colors from CSS variables
document.addEventListener('DOMContentLoaded', function () {
    var swatches = document.querySelectorAll('.swatch[data-css-var]');
    swatches.forEach(function (sw) {
        var varName = sw.getAttribute('data-css-var');
        var valueEl = sw.querySelector('.swatch__value');
        var box = sw.querySelector('.swatch__box');
        try {
            var style = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            if (valueEl) valueEl.textContent = style || '—';
            if (box) box.style.background = 'var(' + varName + ')';
            // for dark backgrounds, adjust label color
            if (box && style) {
                // simple luminance check for readable label
                var hex = style.replace(/\s/g, '');
                if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) {
                    var c = hex.substring(1);
                    if (c.length === 3) c = c.split('').map(function (ch) { return ch + ch; }).join('');
                    var r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16);
                    var luminance = (0.299*r + 0.587*g + 0.114*b)/255;
                    if (luminance < 0.5) sw.querySelectorAll('.swatch__label, .swatch__value').forEach(function (el) { el.style.color = '#fff'; });
                }
            }
        } catch (e) { if (valueEl) valueEl.textContent = '—'; }
    });
});
