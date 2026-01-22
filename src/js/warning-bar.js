// Умная warning-bar с картинкой и универсальным смещением body
let isBarVisible = true;

// Создаем CSS
const style = document.createElement('style');
style.textContent = `
  .warning-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 12px;
    background-color: transparent;
    z-index: 10000;
    transition: transform 0.28s ease, opacity 0.28s ease;
    font-family: Arial, sans-serif;
    pointer-events: auto;
  }

  /* Apply body margin using CSS variable so other styles can override if needed */
  body {
    margin-top: var(--warning-bar-height, 10px);
    transition: margin-top 0.28s ease;
  }

  .warning-bar-inner {
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;
    min-height: 40px;
    padding: 6px 14px;
    background-repeat: repeat-x;
    background-position: 0 0;
    background-size: auto 40px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.12);
  }

  .warning-bar.hidden { transform: translateY(-120%); opacity: 0; }

  /* Появление с небольшим подпрыгиванием */
  @keyframes slideDownBounce {
    0% { transform: translateY(-120%); opacity: 0; }
    60% { transform: translateY(8px); opacity: 1; }
    80% { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }

  .warning-bar.animate-in { animation: slideDownBounce 620ms cubic-bezier(.22,.9,.32,1) both; }

  /* Мягкая пульсация яркости фона для привлечения внимания (опционально) */
  @keyframes pulseBG {
    0% { filter: brightness(1); }
    50% { filter: brightness(1.04); }
    100% { filter: brightness(1); }
  }
  .warning-bar.pulse { animation: pulseBG 3.6s ease-in-out infinite; }

  /* Паттерн из картинки и анимация справа-налево */
  @keyframes patternScroll {
    from { background-position: 0 50%; }
    to { background-position: -100% 50%; }
  }

  .warning-bar.pattern {
    background-image: url('src/img/errors/dev.jpg');
    background-repeat: repeat-x;
    background-size: auto 40px;
    background-position: 0 0;
    animation: patternScroll 12s linear infinite;
  }

  /* При активном паттерне скрываем <img> — чтобы не дублировать */
  .warning-bar.pattern .warning-img { display: none; }

  .warning-img { height: 32px; width: auto; display:block; }

  /* dev-strip helpers (compatibility with provided snippet) */
  .dev-strip__img { display: block; width: 100%; height: auto; }
  .dev-strip__inner { position: relative; display: block; width: 100%; overflow: hidden; min-height: 40px; background-repeat: repeat-x; background-position: 0 0; background-size: auto 40px; }

  @keyframes dev-strip-bg-slide {
    from { background-position: 0 0; }
    to { background-position: -200px 0; }
  }

  .warning-bar-text {
    color: #000;
    font-weight: 700;
    font-size: clamp(12px, 1.6vw, 14px);
    text-align: left;
    text-transform: uppercase;
    line-height: 1;
  }

  /* Сдвиг бургера */
  /* Перекрывающаяся навигация: сдвигаем её вниз на высоту warning-bar */
  .navigation { top: calc(var(--warning-bar-height, 0px)); }

  /* Сдвиг бургера (поддержка разных селекторов) */
  #burgerBtn, .navigation__burger { transition: top 0.28s ease !important; }
  #burgerBtn.shifted, .navigation__burger.shifted { top: calc(var(--burger-original-top, 20px) + var(--warning-bar-height, 48px)) !important; }
`;
document.head.appendChild(style);

// Разметка с внутренним контейнером (нужен для высоты и паддингов)
const barHTML = `
  <div class="warning-bar" id="warningBar">
    <div class="warning-bar-inner dev-strip__inner">
      <img class="warning-img dev-strip__img" src="src/img/errors/dev.jpg" alt="Dev Warning" /> 
      </div>
  </div>
`;
document.body.insertAdjacentHTML('afterbegin', barHTML);

// Elements
const warningBar = document.getElementById('warningBar');
const burgerBtn = document.getElementById('burgerBtn') || document.querySelector('.navigation__burger');

// При инициализации проиграть анимацию появления и затем применить смещение body
if (warningBar && isBarVisible) {
  // добавить класс анимации
  warningBar.classList.add('animate-in');
  const __onAnimEnd = function onAnimEnd() {
    try { applyBodyShift(); } catch (e) { }
    warningBar.classList.remove('animate-in');
    warningBar.removeEventListener('animationend', __onAnimEnd);
  };
  warningBar.addEventListener('animationend', __onAnimEnd);
  // запасной вызов, если animationend не сработал (например, если анимация отключена)
  setTimeout(() => applyBodyShift(), 740);
}

// Включаем паттерн и анимацию справа-налево по умолчанию
if (warningBar) {
  if (isBarVisible) {
    warningBar.classList.add('pattern');
    const wimg = warningBar.querySelector('.warning-img');
    if (wimg) wimg.style.display = 'none';
    // пересчитать высоту теперь, когда внутренняя разметка добавлена
    // если используем фиксированное позиционирование, убедимся что body сдвинется
    setTimeout(() => applyBodyShift(), 80);
    // оставляем только основную анимацию на .warning-bar.pattern
  } else {
    // скрываем бар если по умолчанию он отключён
    warningBar.classList.add('hidden');
  }
}

// Сохраняем оригинальное положение бургера
if (burgerBtn) {
  const originalTop = window.getComputedStyle(burgerBtn).top || '20px';
  burgerBtn.style.setProperty('--burger-original-top', originalTop);
}

// Вычислить и применить смещение body, а также CSS-переменную для бургера
function applyBodyShift() {
  if (!warningBar) return;
  const hidden = warningBar.classList.contains('hidden');
  const inner = warningBar.querySelector('.warning-bar-inner');
  const height = hidden ? 0 : (inner ? inner.offsetHeight : warningBar.offsetHeight) || 0;
  // установить CSS-переменную для использования в стилях бургера
  document.documentElement.style.setProperty('--warning-bar-height', height + 'px');
  // устанавливаем CSS-переменную; body margin теперь управляется через CSS
  document.documentElement.style.setProperty('--warning-bar-height', (height > 0 ? height + 'px' : '0px'));
  // Дополнительно сдвигаем кнопку-бургер (если она фиксирована) — выравниваем по центру навигации
  try {
    if (burgerBtn) {
      const nav = document.querySelector('.navigation');
      const compBurger = window.getComputedStyle(burgerBtn);
      const burgerH = burgerBtn.offsetHeight || parseFloat(compBurger.height) || 0;

      if (nav) {
        const navRect = nav.getBoundingClientRect();
        // Позиция top для фиксированной кнопки — относительная к вьюпорту
        const desiredTop = Math.round(navRect.top + (navRect.height - burgerH) / 2);
        burgerBtn.style.top = desiredTop + 'px';
      } else {
        // fallback: использовать сохранённую переменную или простое смещение
        const comp = compBurger;
        const topVal = comp.top;
        let base = parseFloat(topVal);
        if (isNaN(base)) {
          const saved = comp.getPropertyValue('--burger-original-top') || burgerBtn.style.getPropertyValue('--burger-original-top');
          base = parseFloat(saved) || 18;
        }
        burgerBtn.style.top = (base + height) + 'px';
      }
    }
  } catch (e) { /* silent */ }
}

// Пересчитать при ресайзе (debounce)
let _resizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimeout);
  _resizeTimeout = setTimeout(applyBodyShift, 120);
});

// Toggle / show / hide
function toggleBar() {
  isBarVisible = !isBarVisible;
  if (isBarVisible) {
    if (warningBar) {
      // показать и включить паттерн
      warningBar.classList.remove('hidden');
      warningBar.classList.add('pattern');
      const _wimg = warningBar.querySelector('.warning-img'); if (_wimg) _wimg.style.display = 'none';
      // проиграть анимацию появления
      warningBar.classList.add('animate-in');
      const __t = function () { applyBodyShift(); warningBar.classList.remove('animate-in'); warningBar.removeEventListener('animationend', __t); };
      warningBar.addEventListener('animationend', __t);
      // запасной вызов
      setTimeout(() => applyBodyShift(), 740);
    }
    if (burgerBtn) burgerBtn.classList.add('shifted');
  } else {
    warningBar.classList.add('hidden');
    if (burgerBtn) burgerBtn.classList.remove('shifted');
  }
  applyBodyShift();
}

function showBar() {
  isBarVisible = true;
  if (warningBar) {
    // показать и включить паттерн
    warningBar.classList.remove('hidden');
    warningBar.classList.add('pattern');
    const _wimg2 = warningBar.querySelector('.warning-img'); if (_wimg2) _wimg2.style.display = 'none';
    // проиграть анимацию появления
    warningBar.classList.add('animate-in');
    const __s = function () { applyBodyShift(); warningBar.classList.remove('animate-in'); warningBar.removeEventListener('animationend', __s); };
    warningBar.addEventListener('animationend', __s);
    setTimeout(() => applyBodyShift(), 740);
  }
  if (burgerBtn) burgerBtn.classList.add('shifted');
}

function hideBar() {
  isBarVisible = false;
  if (warningBar) warningBar.classList.add('hidden');
  if (burgerBtn) burgerBtn.classList.remove('shifted');
  applyBodyShift();
}

// Инициализация: если бар видим по умолчанию, применим смещение
if (warningBar && !warningBar.classList.contains('hidden')) {
  // небольшая задержка, чтобы DOM отрисовал и можно было корректно измерить
  setTimeout(applyBodyShift, 40);
}

// Экспорт в глобальную область
window.toggleWarningBar = toggleBar;
window.showWarningBar = showBar;
window.hideWarningBar = hideBar;
window.isWarningBarVisible = () => isBarVisible;

// Пример использования доступен через глобальные функции