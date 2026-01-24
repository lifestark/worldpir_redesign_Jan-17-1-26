import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

export default class GallerySwiper {
    constructor() {
        this.init();
    }

    init() {
        const swiper = new Swiper('.gallery-swiper', {
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
    }
}
