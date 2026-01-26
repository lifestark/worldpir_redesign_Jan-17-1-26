/**
 * ================================================
 * SCROLL EFFECTS
 * Объединённый модуль: SmoothScroll + ScrollAnimations
 * ================================================
 */

/* SmoothScroll: плавная прокрутка по якорям */
class SmoothScroll {
    constructor(options = {}) {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.selector = options.selector || 'a[href^="#"]';
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
        const nav = document.querySelector('.navigation');
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = target.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/* ScrollAnimations: анимация элементов при скролле */
class ScrollAnimations {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            selector: options.selector || '.card, .benefit, .review, .faq__item'
        };

        this.init();
    }

    init() {
        const observerOptions = {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(this.options.selector);

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            io.observe(el);
        });
    }
}

export { SmoothScroll, ScrollAnimations };
