/**
 * ================================================
 * NAVIGATION.JS
 * Скрипт для навигационного меню
 * ================================================
 */

class Navigation {
    constructor() {
        // Элементы DOM
        this.nav = document.getElementById('mainNav');
        this.burgerBtn = document.getElementById('burgerBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.navLinks = document.querySelectorAll('.navigation__link, .navigation__mobile-link');

        // Состояние
        this.isMobileMenuOpen = false;
        this.lastScrollTop = 0;

        // Проверяем наличие hero секции
        this.hasHero = document.getElementById('hero') !== null;

        // Инициализация
        this.init();
    }

    init() {
        // Если нет hero, делаем навигацию сразу белой
        if (!this.hasHero) {
            this.nav.classList.remove('navigation--with-hero');
            this.nav.classList.add('navigation--white');
        }

        // События
        this.burgerBtn.addEventListener('click', () => this.toggleMobileMenu());
        window.addEventListener('scroll', () => this.handleScroll());

        // Закрытие мобильного меню при клике на ссылку
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });

        // Закрытие при изменении размера окна
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Первичная проверка скролла
        this.handleScroll();
    }

    /**
     * Обработчик скролла страницы
     */
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Определяем порог для смены состояния
        const threshold = 50;

        if (scrollTop > threshold) {
            this.nav.classList.add('navigation--scrolled');
        } else {
            this.nav.classList.remove('navigation--scrolled');
        }

        this.lastScrollTop = scrollTop;
    }

    /**
     * Переключение мобильного меню
     */
    toggleMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Открытие мобильного меню
     */
    openMobileMenu() {
        this.isMobileMenuOpen = true;
        this.mobileMenu.classList.add('navigation__mobile--active');
        this.burgerBtn.classList.add('navigation__burger--active');
        this.nav.classList.add('navigation--open');

        // Блокируем скролл body
        document.body.style.overflow = 'hidden';

        // Accessibility
        this.burgerBtn.setAttribute('aria-expanded', 'true');
        this.burgerBtn.setAttribute('aria-label', 'Закрыть меню');
    }

    /**
     * Закрытие мобильного меню
     */
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        this.mobileMenu.classList.remove('navigation__mobile--active');
        this.burgerBtn.classList.remove('navigation__burger--active');
        this.nav.classList.remove('navigation--open');

        // Разблокируем скролл body
        document.body.style.overflow = '';

        // Accessibility
        this.burgerBtn.setAttribute('aria-expanded', 'false');
        this.burgerBtn.setAttribute('aria-label', 'Открыть меню');
    }

    /**
     * Плавная прокрутка к секции
     * @param {string} targetId - ID целевой секции
     */
    scrollToSection(targetId) {
        const target = document.getElementById(targetId);
        if (target) {
            const navHeight = this.nav.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Экспорт для использования в других модулях
export default Navigation;
