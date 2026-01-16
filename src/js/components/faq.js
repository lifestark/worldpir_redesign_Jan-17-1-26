/**
 * ================================================
 * FAQ ACCORDION
 * Аккордеон для FAQ секции
 * ================================================
 */
class FAQ {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq__item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');

            question.addEventListener('click', () => {
                this.toggleItem(item);
            });
        });
    }

    toggleItem(item) {
        const isActive = item.classList.contains('faq__item--active');

        // Закрываем все открытые элементы (опционально - для одновременного открытия удалите)
        // this.closeAll();

        if (isActive) {
            item.classList.remove('faq__item--active');
        } else {
            item.classList.add('faq__item--active');
        }
    }

    closeAll() {
        this.faqItems.forEach(item => {
            item.classList.remove('faq__item--active');
        });
    }
}

export default FAQ;
