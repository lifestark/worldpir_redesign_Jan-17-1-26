/**
 * ================================================
 * MODAL
 * Модальные окна
 * ================================================
 */
class Modal {
    constructor() {
        this.modal = document.getElementById('orderModal');
        this.modalTriggers = document.querySelectorAll('[data-modal="order"]');
        if (!this.modal) {
            // No modal on the page — nothing to initialize
            console.warn('Modal: #orderModal not found on this page. Skipping modal initialization.');
            return;
        }

        this.modalClosers = this.modal.querySelectorAll('[data-modal-close]');
        this.form = document.getElementById('orderForm');

        this.init();
    }

    init() {
        // Открытие модалки
        this.modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const packageType = trigger.getAttribute('data-package');
                this.open(packageType);
            });
        });

        // Закрытие модалки
        this.modalClosers.forEach(closer => {
            closer.addEventListener('click', () => {
                this.close();
            });
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('modal--active')) {
                this.close();
            }
        });

        // Закрытие кликом вне контента
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Отправка формы (если форма присутствует)
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                this.handleSubmit(e);
            });
        }

        // Toggle consent dropdown
        this.consentToggle = this.modal.querySelector('.modal__consent-toggle');
        this.consentList = this.modal.querySelector('.modal__consent-list');
        if (this.consentToggle && this.consentList) {
            this.consentToggle.addEventListener('click', () => {
                const isOpen = this.consentToggle.getAttribute('aria-expanded') === 'true';
                this.consentToggle.setAttribute('aria-expanded', String(!isOpen));
                if (isOpen) {
                    this.consentList.classList.remove('modal__consent-list--open');
                } else {
                    this.consentList.classList.add('modal__consent-list--open');
                }
            });
        }
    }

    open(packageType = null) {
        this.modal.classList.add('modal--active');
        document.body.style.overflow = 'hidden';

        // Устанавливаем выбранный пакет
        if (packageType) {
            const packageSelect = this.form.querySelector('#package');
            packageSelect.value = packageType;
        }

        // Фокус на первое поле
        setTimeout(() => {
            this.form.querySelector('input').focus();
        }, 300);
    }

    close() {
        this.modal.classList.remove('modal--active');
        document.body.style.overflow = '';
    }

    handleSubmit(e) {
        e.preventDefault();

        // Получаем данные формы
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Здесь должна быть отправка на сервер
        console.log('Данные формы:', data);

        // Показываем сообщение об успехе
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');

        // Закрываем модалку и очищаем форму
        this.close();
        this.form.reset();
    }
}

export default Modal;