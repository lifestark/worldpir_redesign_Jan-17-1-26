/**
 * NAVIGATION.JS (rewrite)
 * - один класс на <html>: is-mobile-menu-open
 * - без дублей логики, без лишних query внутри событий
 * - десктоп-логику не трогаем (только моб.меню)
 */

class Navigation {
    constructor() {
        this.nav = document.getElementById('mainNav') || document.querySelector('.navigation');
        this.burgerBtn = document.getElementById('burgerBtn') || document.querySelector('.navigation__burger');
        this.mobileMenu = document.getElementById('mobileMenu') || document.querySelector('.navigation__mobile');
        this.mobileClose = this.mobileMenu ? this.mobileMenu.querySelector('.navigation__mobile-close') : null;

        // links: и desktop, и mobile
        this.navLinks = document.querySelectorAll('.navigation__link, .navigation__mobile-link');

        this.hasHero = !!document.getElementById('hero');
        this.isMobileMenuOpen = false;

        // cache panel once (не искать каждый клик)
        this.mobileBody = this.mobileMenu ? this.mobileMenu.querySelector('.navigation__mobile-body') : null;

        // bind once
        this.onBurgerClick = this.onBurgerClick.bind(this);
        this.onOverlayClick = this.onOverlayClick.bind(this);
        this.onResize = this.onResize.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);

        this.init();
    }

    init() {
        if (!this.hasHero && this.nav) {
            this.nav.classList.remove('navigation--with-hero');
            this.nav.classList.add('navigation--white');
        }

        if (this.burgerBtn) this.burgerBtn.addEventListener('click', this.onBurgerClick);
        if (this.mobileClose) this.mobileClose.addEventListener('click', () => this.closeMobileMenu());

        // клик по оверлею — закрыть; клик по панели — не закрывать
        if (this.mobileMenu) this.mobileMenu.addEventListener('click', this.onOverlayClick);

        // закрывать при клике на любую ссылку (и в панели, и в хедере)
        this.navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (this.isMobileMenuOpen) this.closeMobileMenu();
            });
        });

        window.addEventListener('resize', this.onResize);
        document.addEventListener('keydown', this.onKeyDown);

        // начальные aria
        if (this.burgerBtn && !this.burgerBtn.hasAttribute('aria-expanded')) {
            this.burgerBtn.setAttribute('aria-expanded', 'false');
            this.burgerBtn.setAttribute('aria-label', 'Открыть меню');
        }
        if (this.mobileMenu && !this.mobileMenu.hasAttribute('aria-hidden')) {
            this.mobileMenu.setAttribute('aria-hidden', 'true');
        }
    }

    onBurgerClick() {
        this.isMobileMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
    }

    onOverlayClick(e) {
        if (!this.mobileBody) return;
        if (e.target === this.mobileMenu) return this.closeMobileMenu(); // клик по “пустоте”
        if (!this.mobileBody.contains(e.target)) this.closeMobileMenu(); // страховка
    }

    onResize() {
        if (window.innerWidth > 991 && this.isMobileMenuOpen) this.closeMobileMenu();
    }

    onKeyDown(e) {
        if (e.key === 'Escape' && this.isMobileMenuOpen) this.closeMobileMenu();
    }

    openMobileMenu() {
        if (this.isMobileMenuOpen) return;
        this.isMobileMenuOpen = true;

        // classes
        document.documentElement.classList.add('is-mobile-menu-open');
        if (this.mobileMenu) this.mobileMenu.classList.add('navigation__mobile--active');
        if (this.burgerBtn) this.burgerBtn.classList.add('navigation__burger--active');
        if (this.nav) this.nav.classList.add('navigation--open');

        // aria
        if (this.burgerBtn) {
            this.burgerBtn.setAttribute('aria-expanded', 'true');
            this.burgerBtn.setAttribute('aria-label', 'Закрыть меню');
        }
        if (this.mobileMenu) this.mobileMenu.setAttribute('aria-hidden', 'false');

        // focus
        this._previousFocus = document.activeElement;
        const firstFocusable = this.mobileMenu?.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
        firstFocusable?.focus?.();

        // inert main (без поломки верстки)
        const main = document.querySelector('main');
        if (main) {
            if ('inert' in main) main.inert = true;
            else main.setAttribute('aria-hidden', 'true');
        }

        // optional: lazy mobile logo
        const img = this.mobileMenu?.querySelector('.navigation__mobile-logo img[data-src]');
        if (img?.dataset?.src && !img.dataset.loaded) {
            img.src = img.dataset.src;
            img.dataset.loaded = 'true';
        }
    }

    closeMobileMenu() {
        if (!this.isMobileMenuOpen) return;
        this.isMobileMenuOpen = false;

        // classes
        document.documentElement.classList.remove('is-mobile-menu-open');
        this.mobileMenu?.classList.remove('navigation__mobile--active');
        this.burgerBtn?.classList.remove('navigation__burger--active');
        this.nav?.classList.remove('navigation--open');

        // aria
        if (this.burgerBtn) {
            this.burgerBtn.setAttribute('aria-expanded', 'false');
            this.burgerBtn.setAttribute('aria-label', 'Открыть меню');
        }
        this.mobileMenu?.setAttribute('aria-hidden', 'true');

        // restore inert
        const main = document.querySelector('main');
        if (main) {
            if ('inert' in main) main.inert = false;
            else main.removeAttribute('aria-hidden');
        }

        // restore focus
        const toFocus = this._previousFocus || this.burgerBtn;
        toFocus?.focus?.();
    }
}

export default Navigation;
try { window.Navigation = Navigation; } catch (e) { }

// Auto-init fallback: если основной инициализатор не вызвал Navigation,
// создаём один экземпляр после загрузки DOM. Защищено флагом на window.
try {
    if (typeof window !== 'undefined') {
        const _autoInit = () => {
            if (window.__NavigationInitialized) return;
            try {
                window.__NavigationInstance = new Navigation();
                window.__NavigationInitialized = true;
            } catch (err) {
                console.debug('Navigation auto-init failed', err);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', _autoInit);
        } else {
            _autoInit();
        }
    }
} catch (e) { /* ignore */ }