# ⚡ JavaScript - Быстрая справка

## ✅ Исправленные проблемы

1. ✅ Исправлены некорректные комментарии в начале файлов
2. ✅ Добавлена инициализация Navigation в main.js
3. ✅ Убран ненужный module.exports (для браузера не нужен)
4. ✅ Обновлены пути к скриптам в index.html
5. ✅ Все компоненты корректно изолированы

## 📁 Структура (итоговая)

```
src/js/
├── main.js                      ✅ Точка входа
└── components/
    ├── navigation.js            ✅ Навигация
    ├── gallery.js               ✅ Слайдер
    ├── modal.js                 ✅ Модалки
    ├── FAQ_accordeon.js         ✅ Аккордеон
    ├── phone_mask.js            ✅ Маска телефона + скролл
    └── scroll_animation.js      ✅ Анимации
```

## 🚀 Быстрый старт

### Подключение в HTML
```html
<!-- Компоненты (порядок важен!) -->
<script src="src/js/components/navigation.js"></script>
<script src="src/js/components/gallery.js"></script>
<script src="src/js/components/modal.js"></script>
<script src="src/js/components/FAQ_accordeon.js"></script>
<script src="src/js/components/phone_mask.js"></script>
<script src="src/js/components/scroll_animation.js"></script>

<!-- Инициализация (всегда последним!) -->
<script src="src/js/main.js"></script>
```

### Инициализация компонентов
Все компоненты автоматически инициализируются в `main.js`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();                    // Навигация
    new GallerySlider('gallerySlider');  // Слайдер
    new FAQ();                           // FAQ
    new Modal();                         // Модалки
    new PhoneMask(phoneInput);           // Маска телефона
    new SmoothScroll();                  // Плавный скролл
    initScrollAnimations();              // Анимации
});
```

## 🎯 Компоненты

| Компонент | Файл | Класс/Функция | Описание |
|-----------|------|---------------|----------|
| Навигация | `navigation.js` | `Navigation` | Меню, бургер, скролл |
| Слайдер | `gallery.js` | `GallerySlider` | Галерея с свайпами |
| Модалка | `modal.js` | `Modal` | Модальные окна |
| FAQ | `FAQ_accordeon.js` | `FAQ` | Аккордеон |
| Телефон | `phone_mask.js` | `PhoneMask` | Маска +7 (XXX) XXX-XX-XX |
| Скролл | `phone_mask.js` | `SmoothScroll` | Плавная прокрутка |
| Анимация | `scroll_animation.js` | `initScrollAnimations()` | Появление элементов |

## 🔧 Как использовать

### Navigation
```javascript
// Автоматически инициализируется
new Navigation();

// Определяет наличие hero и меняет поведение
```

### GallerySlider
```javascript
// ID элемента слайдера
new GallerySlider('gallerySlider');

// Включить автоплей (в gallery.js)
// this.startAutoplay(5000); // 5 секунд
```

### Modal
```html
<!-- Кнопка открытия -->
<button data-modal="order" data-package="basic">Открыть</button>

<!-- Модалка -->
<div class="modal" id="orderModal">
    <div class="modal__overlay" data-modal-close></div>
    <button data-modal-close>×</button>
    <!-- Контент -->
</div>
```

### FAQ
```html
<!-- Автоматически работает с классами -->
<div class="faq__item">
    <button class="faq__question">Вопрос</button>
    <div class="faq__answer">
        <p>Ответ</p>
    </div>
</div>
```

### PhoneMask
```javascript
// Примените к input
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    new PhoneMask(phoneInput);
}
```

### SmoothScroll
```html
<!-- Работает с якорями -->
<a href="#services">Услуги</a>

<section id="services">...</section>
```

### Scroll Animations
```javascript
// Автоматически анимирует элементы
initScrollAnimations();

// Анимируются: .card, .benefit, .review, .faq__item
```

## ➕ Добавить свой компонент

### 1. Создайте файл
```javascript
// src/js/components/my-component.js
class MyComponent {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('MyComponent initialized');
    }
}
```

### 2. Подключите в HTML
```html
<script src="src/js/components/my-component.js"></script>
<script src="src/js/main.js"></script>
```

### 3. Инициализируйте в main.js
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // ...другие компоненты
    new MyComponent();
});
```

## 🐛 Проверка работы

### В консоли браузера (F12)
```javascript
// Проверка доступности классов
typeof Navigation;      // "function"
typeof Modal;          // "function"
typeof GallerySlider;  // "function"

// Проверка элементов
document.getElementById('mainNav');        // должен быть
document.getElementById('gallerySlider'); // должен быть
document.getElementById('orderModal');    // должен быть
```

## ⚠️ Частые ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `Navigation is not defined` | Неправильный порядок скриптов | Компоненты ДО main.js |
| Слайдер не работает | Нет элемента с ID | Проверьте HTML |
| Модалка не открывается | Нет атрибута data-modal | Добавьте атрибут |
| Анимации не работают | Нет классов .card и т.д. | Проверьте CSS классы |

## 📊 Тестирование

```javascript
// Откройте консоль и протестируйте
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded');
    console.log('✅ Navigation:', typeof Navigation === 'function');
    console.log('✅ Modal:', typeof Modal === 'function');
    console.log('✅ Gallery:', typeof GallerySlider === 'function');
});
```

## 🎨 Кастомизация

### Изменить задержку анимации
В `scroll_animation.js`:
```javascript
el.style.transition = `opacity 0.6s ease ${index * 0.15}s, ...`; 
// Измените 0.15s на нужное значение
```

### Изменить порог скролла навигации
В `navigation.js`:
```javascript
if (scrollTop > 50) { // Измените 50 на нужное значение
```

### Добавить элементы для анимации
В `scroll_animation.js`:
```javascript
const animatedElements = document.querySelectorAll(`
    .card,
    .benefit,
    .review,
    .faq__item,
    .my-new-class  // Добавьте свой класс
`);
```

## 📚 Документация

- Полная документация: `JS_ARCHITECTURE.md`
- CSS структура: `CSS_ARCHITECTURE.md`
- Общая информация: `README.md`

## 💡 Совет

Всегда проверяйте консоль браузера (F12) на наличие ошибок!
