export default class GallerySwiper {
    constructor() {
        this.init();
    }

    async init() {
        // Load Swiper dynamically from CDN (ESM build). This avoids bundler-only imports
        // and prevents module resolution errors during local development.
        try {
            // inject CSS if not present
            if (!document.querySelector('link[data-swiper-css]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.css';
                link.setAttribute('data-swiper-css', '');
                document.head.appendChild(link);
            }

            const mod = await import('https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.esm.browser.min.js');
            const Swiper = mod.default || mod.Swiper || mod;

            if (!Swiper) return;

            new Swiper('.gallery-swiper', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                speed: 1000,
                effect: 'slide',
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        } catch (e) {
            // Swiper not available; fail silently
            console.warn('GallerySwiper: could not load Swiper from CDN', e);
        }
    }
}
