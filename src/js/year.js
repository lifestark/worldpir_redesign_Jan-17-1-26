// Автоматическая подстановка текущего года
// Поддерживаем два варианта использования в HTML:
// 1) <span data-year></span> — подставит текущий год, например "2026"
// 2) <span data-year-start="2020"></span> — покажет "2020" если текущий год === 2020, иначе "2020–2026"

(function () {
    function run() {
        const now = new Date();
        const year = now.getFullYear();

        // Заполняем элементы с data-year
        document.querySelectorAll('[data-year]').forEach(el => {
            const existingText = (el.textContent || '').trim();
            if (!existingText) el.textContent = String(year);
        });

        // Обрабатываем элементы с data-year-start
        document.querySelectorAll('[data-year-start]').forEach(el => {
            const start = parseInt(el.getAttribute('data-year-start'), 10);
            if (Number.isFinite(start)) {
                if (start >= year) {
                    el.textContent = String(start);
                } else {
                    el.textContent = `${start}–${year}`;
                }
            }
        });

        // Форматирование по шаблону: data-year-format
        document.querySelectorAll('[data-year-format]').forEach(el => {
            const fmt = el.getAttribute('data-year-format');
            const startAttr = el.getAttribute('data-year-start');
            const result = fmt.replace(/{year}/g, String(year)).replace(/{start}/g, startAttr || '');
            el.textContent = result;
        });

        // Поддержка промо-атрибута: data-year-new (также принимаем data-year-new_year)
        // Показать следующий год в период кампании: с октября по 15 января включительно
        const month = now.getMonth(); // 0..11
        const day = now.getDate();
        const campaignActive = (month >= 9) || (month === 0 && day <= 15);
        const nextYear = year + 1;

        // Простые элементы: показывают nextYear во время кампании, иначе текущий год
        document.querySelectorAll('[data-year-new],[data-year-new_year]').forEach(el => {
            el.textContent = campaignActive ? String(nextYear) : String(year);
        });

        // Форматированные: поддержка шаблона через data-year-new-format
        document.querySelectorAll('[data-year-new-format]').forEach(el => {
            const fmt = el.getAttribute('data-year-new-format') || '{year}';
            const value = campaignActive ? String(nextYear) : String(year);
            el.textContent = fmt.replace(/{year}/g, value).replace(/{start}/g, el.getAttribute('data-year-start') || '');
        });

        // Если на странице используется data-year-new_year — скрываем ссылку на эту страницу
        // в навигации вне кампании и автоматически добавляем (или показываем) её в шапке/моб.меню во время кампании.
        const hasYearNewAttr = Boolean(document.querySelector('[data-year-new],[data-year-new_year]'));
        if (hasYearNewAttr) {
            // Определим текущий файл (последний сегмент URL без хэша/параметров)
            const hrefFull = location.href.split('#')[0].split('?')[0];
            const currentFile = hrefFull.split('/').pop();

            // Функция для проверки соответствия ссылки текущей странице
            function linkPointsToCurrent(a) {
                const href = a.getAttribute('href') || '';
                const linkFile = href.split('#')[0].split('?')[0].split('/').pop();
                return linkFile && currentFile && linkFile === currentFile;
            }

            // Скрываем существующие ссылки на текущую страницу в основных меню, если кампания не активна
            const navSelectors = ['.navigation__menu a', '.navigation__mobile-menu a', '.burger-menu__nav a', '.footer__menu a'];
            navSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(a => {
                    if (linkPointsToCurrent(a)) {
                        if (!campaignActive) {
                            a.dataset._autoHidden = 'true';
                            a.style.display = 'none';
                        } else {
                            // During campaign ensure visible
                            a.style.display = '';
                            delete a.dataset._autoHidden;
                        }
                    }
                });
            });

            // Если кампания активна — добавим ссылку в верхнее меню и мобильное меню если её там нет
            if (campaignActive) {
                const topMenu = document.querySelector('.navigation__menu');
                const mobileMenu = document.querySelector('.navigation__mobile-menu');
                const burgerNav = document.querySelector('.burger-menu__nav ul');

                const label = (document.querySelector('[data-year-new-label]') || document.querySelector('[data-year-new-format]'))?.getAttribute('data-year-new-label') || document.title || currentFile;

                function ensureLink(container, liClass, aClass) {
                    if (!container) return;
                    // check existing
                    const exists = Array.from(container.querySelectorAll('a')).some(a => linkPointsToCurrent(a));
                    if (exists) return;
                    const li = document.createElement('li');
                    li.className = liClass;
                    const a = document.createElement('a');
                    a.className = aClass;
                    // Use absolute href so it works when opening files locally
                    a.href = hrefFull;
                    a.textContent = label;
                    li.appendChild(a);
                    container.appendChild(li);
                }

                ensureLink(topMenu, 'navigation__item', 'navigation__link');
                ensureLink(mobileMenu, 'navigation__mobile-item', 'navigation__mobile-link');
                if (burgerNav) {
                    // burgerNav is a UL
                    const existsBurger = Array.from(burgerNav.querySelectorAll('a')).some(a => linkPointsToCurrent(a));
                    if (!existsBurger) {
                        const li = document.createElement('li');
                        const a = document.createElement('a');
                        a.href = hrefFull;
                        a.textContent = label;
                        li.appendChild(a);
                        burgerNav.appendChild(li);
                    }
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
