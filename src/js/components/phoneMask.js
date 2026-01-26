/**
 * ================================================
 * PHONE MASK
 * Маска для телефона
 * ================================================
 */
class PhoneMask {
    constructor(input) {
        this.input = input;
        this.init();
    }

    init() {
        this.input.addEventListener('input', (e) => {
            this.format(e);
        });

        // Prevent typing invalid characters (allow digits, +, space, -, parentheses)
        this.input.addEventListener('keydown', (e) => {
            const allowed = /[0-9+()\-\s]/;
            const key = e.key;

            // allow control/navigation keys
            if (key.length > 1) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            if (!allowed.test(key)) {
                e.preventDefault();
            }
        });

        // Sanitize pasted content
        this.input.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const sanitized = text.replace(/[^0-9+()\-\s]/g, '');
            // insert sanitized text at cursor position
            const start = this.input.selectionStart || 0;
            const end = this.input.selectionEnd || 0;
            const before = this.input.value.slice(0, start);
            const after = this.input.value.slice(end);
            this.input.value = before + sanitized + after;
            // trigger formatting
            this.format({ target: this.input });
        });

        this.input.addEventListener('focus', () => {
            if (!this.input.value) {
                this.input.value = '+7 (';
            }
        });

        this.input.addEventListener('blur', () => {
            if (this.input.value === '+7 (') {
                this.input.value = '';
            }
        });
    }

    format(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.startsWith('7')) {
            value = value.substring(1);
        } else if (value.startsWith('8')) {
            value = value.substring(1);
        }

        let formatted = '+7';

        if (value.length > 0) {
            formatted += ' (' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(8, 10);
        }

        e.target.value = formatted;
    }
}

export default PhoneMask;

