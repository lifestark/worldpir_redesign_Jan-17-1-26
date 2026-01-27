/**
 * ================================================
 * NAVIGATION.JS
 * Скрипт для навигационного меню
 * ================================================
 */

import { settings } from '../settings.js';

class Navigation {
    constructor() {
        // Элементы DOM
        this.nav = document.getElementById('mainNav');
        this.burgerBtn = document.getElementById('burgerBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.mobileClose = document.querySelector('.navigation__mobile-close');
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
        if (this.mobileClose) this.mobileClose.addEventListener('click', () => this.closeMobileMenu());

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

        // Note: scroll state and contact population handled centrally in `main.js` / `settings.js`

        // Accessibility: close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
        });
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
        if (this.mobileMenu) this.mobileMenu.setAttribute('aria-hidden', 'false');

        // Save previously focused element and move focus into menu
        this._previousFocus = document.activeElement;
        const firstFocusable = this.mobileMenu && this.mobileMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();

        // Lazy-load mobile logo only when menu opens
        try {
            const mobileLogoImg = this.mobileMenu && this.mobileMenu.querySelector('.navigation__mobile-logo img[data-src]');
            if (mobileLogoImg && mobileLogoImg.dataset && mobileLogoImg.dataset.src) {
                // load only once
                if (!mobileLogoImg.dataset.loaded) {
                    mobileLogoImg.src = mobileLogoImg.dataset.src;
                    mobileLogoImg.dataset.loaded = 'true';
                }
            }
        } catch (e) { /* ignore */ }
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
        if (this.mobileMenu) this.mobileMenu.setAttribute('aria-hidden', 'true');

        // Restore focus
        if (this._previousFocus) {
            try { this._previousFocus.focus(); } catch (e) { this.burgerBtn.focus(); }
        } else {
            this.burgerBtn.focus();
        }
    }

    // Contact population handled by `settings.js` to avoid duplication

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

// expose global for non-module usage (safe try)
try { window.Navigation = Navigation; } catch (e) { /* ignore */ }
