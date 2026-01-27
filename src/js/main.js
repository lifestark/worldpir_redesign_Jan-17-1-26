import { autofillDescriptionFromH1 } from './description-autofill.js';
// Автоматически подставлять description из первого h1
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autofillDescriptionFromH1);
} else {
    autofillDescriptionFromH1();
}
import Navigation from './components/navigation.js';
import GallerySwiper from './components/gallerySwiper.js'; // New Swiper
import FAQ from './components/faq.js';
import Modal from './components/modal.js';

import { SmoothScroll, ScrollAnimations } from './components/scroll-effects.js';
import PhoneMask from './components/formGuide.js';
import Typograph from './components/formGuide.js';
import { init as initFallbacks } from './fallbacks.js';
// Автоматическая подстановка года
import './year.js';
import './settings.js';
import './widgets/telegram-widget.js';
(async function () {
    try {
        await import('./components/filterAnimators.js');
    } catch (e) {
        // filter module missing in some builds — fail silently
    }
})();


/**
 * ================================================
 * COMPONENT INITIALIZATION
 * Функции для инициализации компонентов
 * ================================================
 */
function initializeNavigation() {
    // store instance on window to avoid duplicate initializations
    try {
        if (!window.__NavigationInitialized) {
            window.__NavigationInstance = new Navigation();
            window.__NavigationInitialized = true;
        }
    } catch (e) {
        // ignore initialization errors
        console.debug('Navigation init failed', e);
    }
}

function initializeGallerySlider() {
    // new GallerySlider('gallerySlider');
    new GallerySwiper();
}

function initializeFAQ() {
    new FAQ();
}

function initializeModals() {
    new Modal();
}

function initializePhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        new PhoneMask(phoneInput);
    }
}

function initializeSmoothScroll() {
    new SmoothScroll();
}

function initializeScrollAnimations() {
    new ScrollAnimations();
}

/**
 * ================================================
 * DOMContentLoaded
 * Инициализация всех компонентов после загрузки DOM
 * ================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGallerySlider();
    initializeFAQ();
    initializeModals();
    initializePhoneMask();
    initializeSmoothScroll();
    initializeScrollAnimations();

    // Инициализация типографа
    new Typograph();

    // Инициализация warning bar (паттерн-анимация теперь в JS)
    try { if (window && window.initWarningBar) window.initWarningBar(); } catch (e) { /* fail silently */ }

    // Надёжно получаем элемент навигации после загрузки DOM
    const navigation = document.querySelector('.navigation');
    if (!navigation) return;

    // Helper: toggle BEM modifier used in CSS
    function setScrolledState(scrolled) {
        if (scrolled) {
            navigation.classList.add('navigation--scrolled');
        } else {
            navigation.classList.remove('navigation--scrolled');
        }
    }

    // Initial state: pages with no hero should appear scrolled
    const isNoHero = document.body.classList.contains('no-hero');
    if (isNoHero || window.scrollY > 0) {
        setScrolledState(true);
    } else {
        setScrolledState(false);
    }

    // Scroll handler: toggle the modifier used in CSS
    window.addEventListener('scroll', () => {
        setScrolledState(window.scrollY > 0);
    }, { passive: true });

    // Устанавливаем CSS-переменную --nav-height равной текущей высоте навигации
    function updateNavHeight() {
        const height = navigation.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${height}px`);
    }

    // Обновляем при загрузке и при изменении размера окна
    window.addEventListener('load', () => {
        // небольшая задержка, чтобы стили и переходы завершились
        setTimeout(updateNavHeight, 50);
    });

    window.addEventListener('resize', () => {
        clearTimeout(window.__updateNavHeightTimeout);
        window.__updateNavHeightTimeout = setTimeout(updateNavHeight, 120);
    });

    // Также наблюдаем за изменениями внутри навигации (открытие мобильного меню, изменение логотипов и т.п.)
    const observer = new MutationObserver(() => {
        // debounce
        clearTimeout(window.__updateNavHeightMutation);
        window.__updateNavHeightMutation = setTimeout(updateNavHeight, 60);
    });

    observer.observe(navigation, { attributes: true, childList: true, subtree: true });

    // Также обновляем сразу
    updateNavHeight();

    // initialize lightweight fallbacks (calls applySiteSettings once if needed)
    try { initFallbacks(); } catch (e) { /* ignore */ }
});


