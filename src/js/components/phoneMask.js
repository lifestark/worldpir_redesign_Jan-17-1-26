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

