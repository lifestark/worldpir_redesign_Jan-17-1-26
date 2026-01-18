/**
 * ================================================
 * MAIN.JS
 * Основной JavaScript файл приложения
 * ================================================
 */

// Импорты компонентов
import Navigation from './components/navigation.js';
import GallerySlider from './components/gallerySlider.js';
import FAQ from './components/faq.js';
import Modal from './components/modal.js';
import PhoneMask from './components/phoneMask.js';
import SmoothScroll from './components/smoothScroll.js';
import ScrollAnimations from './components/scrollAnimations.js';

/**
 * ================================================
 * COMPONENT INITIALIZATION
 * Функции для инициализации компонентов
 * ================================================
 */
function initializeNavigation() {
    new Navigation();
}

function initializeGallerySlider() {
    new GallerySlider('gallerySlider');
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
});

// Check for 'no-hero' mode
const isNoHero = document.body.classList.contains('no-hero');
const navigation = document.querySelector('.navigation');

if (isNoHero) {
    navigation.classList.add('scrolled');
} else {
    // Existing scroll logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    });
}


