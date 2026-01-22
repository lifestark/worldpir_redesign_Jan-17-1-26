/**
 * ================================================
 * GALLERY SLIDER
 * Простой слайдер без библиотек
 * ================================================
 */
class GallerySlider {
    constructor(sliderId) {
        this.slider = document.getElementById(sliderId);
        if (!this.slider) return;

        this.track = this.slider.querySelector('.gallery__track');
        this.slides = this.slider.querySelectorAll('.gallery__slide');
        this.prevBtn = document.getElementById('galleryPrev');
        this.nextBtn = document.getElementById('galleryNext');
        this.dotsContainer = document.getElementById('galleryDots');

        this.currentSlide = 0;
        this.totalSlides = this.slides.length;

        this.init();
    }

    init() {
        // Создаём точки навигации
        this.createDots();

        // События
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Автоплей (опционально)
        // this.startAutoplay();

        // Touch events для свайпа
        this.initTouchEvents();
    }

    createDots() {
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('gallery__dot');
            dot.setAttribute('aria-label', `Перейти к слайду ${i + 1}`);

            if (i === 0) {
                dot.classList.add('gallery__dot--active');
            }

            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }

        this.dots = this.dotsContainer.querySelectorAll('.gallery__dot');
    }

    goToSlide(index) {
        this.currentSlide = index;
        const offset = -100 * index;
        this.track.style.transform = `translateX(${offset}%)`;

        // Обновляем активную точку
        this.updateDots();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(this.currentSlide);
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(this.currentSlide);
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                dot.classList.add('gallery__dot--active');
            } else {
                dot.classList.remove('gallery__dot--active');
            }
        });
    }

    startAutoplay(interval = 5000) {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, interval);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }

    initTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
}

export default GallerySlider;