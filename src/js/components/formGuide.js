/**
 * ================================================
 * FORM
 * Утилиты для форм: типограф, маска телефона, ограничения ввода
 * ================================================
 */

class Typograph {
    constructor() {
        this.prepositions = [
            'в', 'во', 'на', 'с', 'со', 'у', 'о', 'об', 'к', 'ко',
            'и', 'а', 'но', 'да', 'за', 'по', 'из', 'от', 'до',
            'над', 'под', 'при', 'про', 'не', 'ни',
            'для', 'без', 'как', 'так'
        ];

        this.regex = new RegExp(`(^|\\s|&nbsp;| )(${this.prepositions.join('|')})\\s+`, 'gi');
        this.init();
    }

    init() {
        this.processNode(document.body);
    }

    processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const parentName = node.parentNode.tagName ? node.parentNode.tagName.toLowerCase() : '';
            if (['script', 'style', 'textarea', 'code', 'pre'].includes(parentName)) return;
            const originalText = node.textContent;
            const fixedText = originalText.replace(this.regex, (match, p1, p2) => {
                return p1 + p2 + '\u00A0';
            });
            if (fixedText !== originalText) node.textContent = fixedText;
        } else {
            for (let i = 0; i < node.childNodes.length; i++) this.processNode(node.childNodes[i]);
        }
    }
}

/**
 * PhoneMask — форматирование телефона и ограничения ввода для имён/textarea
 */
class PhoneMask {
    constructor(input) {
        this.input = input;
        this.init();
    }

    init() {
        this.input.addEventListener('input', (e) => this.format(e));

        this.input.addEventListener('keydown', (e) => {
            const allowed = /[0-9+()\-\s]/;
            const key = e.key;
            if (key.length > 1) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (!allowed.test(key)) e.preventDefault();
        });

        this.input.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const sanitized = text.replace(/[^0-9+()\-\s]/g, '');
            const start = this.input.selectionStart || 0;
            const end = this.input.selectionEnd || 0;
            const before = this.input.value.slice(0, start);
            const after = this.input.value.slice(end);
            this.input.value = before + sanitized + after;
            this.format({ target: this.input });
        });

        this.input.addEventListener('focus', () => {
            if (!this.input.value) this.input.value = '+7 (';
        });

        this.input.addEventListener('blur', () => {
            if (this.input.value === '+7 (') this.input.value = '';
        });
    }

    format(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('7')) value = value.substring(1);
        else if (value.startsWith('8')) value = value.substring(1);
        let formatted = '+7';
        if (value.length > 0) formatted += ' (' + value.substring(0, 3);
        if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
        if (value.length >= 7) formatted += '-' + value.substring(6, 8);
        if (value.length >= 9) formatted += '-' + value.substring(8, 10);
        e.target.value = formatted;
    }
}

/**
 * Ограничения для полей имени и для textarea — только латиница и кириллица,
 * пробел и дефис.
 */
function attachNameRestrictions() {
    const nameSelector = 'input[name="name"], input[data-validate="name"]';
    const nameInputs = Array.from(document.querySelectorAll(nameSelector));
    const textareas = Array.from(document.querySelectorAll('textarea'));

    const allowedRe = /^[A-Za-zА-Яа-яЁё\s-]+$/;
    const allowedCharRe = /^[A-Za-zА-Яа-яЁё\s-]$/;

    function bindField(el) {
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key.length > 1) return; // allow control keys
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (!allowedCharRe.test(key)) e.preventDefault();
        });

        el.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const sanitized = text.split('').filter(ch => allowedCharRe.test(ch)).join('');
            const start = el.selectionStart || 0;
            const end = el.selectionEnd || 0;
            const before = el.value.slice(0, start);
            const after = el.value.slice(end);
            el.value = before + sanitized + after;
        });

        el.addEventListener('input', (e) => {
            const cleaned = e.target.value.split('').filter(ch => allowedCharRe.test(ch)).join('');
            if (cleaned !== e.target.value) e.target.value = cleaned;
        });
    }

    nameInputs.forEach(bindField);
    textareas.forEach(bindField);
}

export { Typograph, PhoneMask, attachNameRestrictions };
