/**
 * ================================================
 * SMOOTH SCROLL
 * Плавная прокрутка к якорям
 * ================================================
 */

class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Игнорируем пустые якоря
                if (href === '#' || href === '#!') {
                    e.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollTo(target);
                }
            });
        });
    }

    scrollTo(target) {
        const navHeight = document.querySelector('.navigation').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

export default SmoothScroll;