// Умная warning-bar с картинкой и универсальным смещением body
let isBarVisible = true;
// Дополнительная величина сдвига (прибавляется к реальной высоте барa).
// Можно переопределить из CSS: :root { --warning-bar-extra: 12px; }
const DEFAULT_EXTRA_SHIFT = 20; // px

// Создаем CSS (фоновой паттерн анимируется через CSS)
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
    z-index: 10050;
    transition: transform 0.28s ease, opacity 0.28s ease;
    font-family: Arial, sans-serif;
    pointer-events: auto;
  }

  /* Дополнительный сдвиг: можно переопределить из :root */
  :root { --warning-bar-extra: 20px; }

  /* Apply body margin using CSS variable so other styles can override if needed */
  body {
    margin-top: var(--warning-bar-height, 0px);
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
  }

  /* CSS animation for the repeating background pattern (horizontal scroll) */
  @keyframes patternScroll {
    from { background-position: 0 0; }
    to { background-position: 1000px 0; }
  }

  /* Respect user prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .warning-bar.pattern .warning-bar-inner { animation: none !important; }
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

  .warning-bar.pattern .warning-bar-inner {
    background-image: url('src/img/errors/dev.jpg');
    background-repeat: repeat-x;
    background-size: auto 40px;
    background-position: 0 0;
    animation: patternScroll 18s linear infinite;
    will-change: background-position;
  }

  /* При активном паттерне скрываем <img> — чтобы не дублировать */
  .warning-bar.pattern .warning-img { display: none; }

  .warning-img { height: 32px; width: auto; display: block; }

  /* Сдвиг бургера: используем CSS-переменные напрямую (без классов) */
  #burgerBtn, .navigation__burger { 
    transition: top 0.28s ease !important; 
    top: calc(var(--burger-original-top, 20px) + var(--warning-bar-height, 0px)) !important;
    z-index: 10060 !important; /* выше варнинг */
  }

  /* Когда мобильное меню открыто — бургер остаётся на своей оригинальной позиции */
  .navigation.navigation--open #burgerBtn,
  .navigation.navigation--open .navigation__burger {
    top: var(--burger-original-top, 20px) !important;
  }
`;
document.head.appendChild(style);

// Разметка с внутренним контейнером (нужен для высоты и паддингов)
const barHTML = `
  <div class="warning-bar" id="warningBar">
    <div class="warning-bar-inner">
      <img class="warning-img" src="src/img/errors/dev.jpg" alt="Dev Warning" /> 
    </div>
  </div>
`;

// Insert bar into DOM safely (handle scripts loaded in <head>)
function insertBarIntoDOM() {
  if (document.getElementById('warningBar')) return;
  if (document.body) {
    document.body.insertAdjacentHTML('afterbegin', barHTML);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.getElementById('warningBar')) {
        document.body.insertAdjacentHTML('afterbegin', barHTML);
      }
    }, { once: true });
  }
}
insertBarIntoDOM();


// Elements (may be null until DOMContentLoaded if script loaded early)
let warningBar = document.getElementById('warningBar');
const burgerBtn = document.getElementById('burgerBtn') || document.querySelector('.navigation__burger');

// Cache DOM refs and state
let _cachedHeight = null;
let patternEl = warningBar ? warningBar.querySelector('.warning-bar-inner') : null;

// Сохраняем оригинальное положение бургера
if (burgerBtn) {
  const originalTop = window.getComputedStyle(burgerBtn).top || '20px';
  document.documentElement.style.setProperty('--burger-original-top', originalTop);
}

// Вычислить и применить смещение body, а также CSS-переменную для бургера
function applyBodyShift(forceRecalc = false) {
  if (!warningBar) return;
  const hidden = warningBar.classList.contains('hidden');

  if (forceRecalc || _cachedHeight === null) {
    const h = hidden ? 0 : (patternEl ? patternEl.offsetHeight : warningBar.offsetHeight) || 0;
    _cachedHeight = h;
  }

  // read extra shift from CSS var if present (allows tuning from styles), fallback to DEFAULT_EXTRA_SHIFT
  let extraShift = DEFAULT_EXTRA_SHIFT;
  try {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--warning-bar-extra') || '';
    const parsed = parseInt(raw, 10);
    if (!Number.isNaN(parsed)) extraShift = parsed;
  } catch (e) { /* ignore */ }

  const val = hidden ? '0px' : (_cachedHeight > 0 ? (_cachedHeight + extraShift) + 'px' : '0px');
  document.documentElement.style.setProperty('--warning-bar-height', val);
}

// Пересчитать при ресайзе (debounce)
let _resizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimeout);
  _resizeTimeout = setTimeout(() => applyBodyShift(true), 120);
});

// Toggle / show / hide
function toggleBar() {
  isBarVisible = !isBarVisible;
  if (isBarVisible) {
    showBar();
  } else {
    hideBar();
  }
}

function showBar() {
  isBarVisible = true;
  // refresh refs in case the script ran before DOM was ready and bar inserted later
  warningBar = warningBar || document.getElementById('warningBar');
  patternEl = patternEl || (warningBar && warningBar.querySelector('.warning-bar-inner'));
  _cachedHeight = null; // force recalculation
  if (!warningBar) warningBar = document.getElementById('warningBar');
  if (warningBar) {
    warningBar.classList.remove('hidden');
    // restart pattern animation: remove -> reflow -> add
    warningBar.classList.remove('pattern');
    void warningBar.offsetWidth;
    warningBar.classList.add('pattern');
    const wimg = warningBar.querySelector('.warning-img');
    if (wimg) wimg.style.display = 'none';

    warningBar.classList.add('animate-in');
    const onAnimEnd = () => {
      applyBodyShift(true);
      warningBar.classList.remove('animate-in');
      warningBar.removeEventListener('animationend', onAnimEnd);
    };
    warningBar.addEventListener('animationend', onAnimEnd);

    setTimeout(() => applyBodyShift(true), 80);
  }
}

function hideBar() {
  isBarVisible = false;
  if (warningBar) {
    warningBar.classList.add('hidden');
    // ensure pattern is removed so animation restarts next show
    warningBar.classList.remove('pattern');
    _cachedHeight = null;
    applyBodyShift(true);
  }
}

// Инициализация при загрузке
function initWarningBar() {
  if (!warningBar) warningBar = document.getElementById('warningBar');
  if (!patternEl && warningBar) patternEl = warningBar.querySelector('.warning-bar-inner');

  if (warningBar && isBarVisible) {
    warningBar.classList.add('pattern');
    const wimg = warningBar.querySelector('.warning-img');
    if (wimg) wimg.style.display = 'none';

    warningBar.classList.add('animate-in');
    const onAnimEnd = () => {
      applyBodyShift(true);
      warningBar.classList.remove('animate-in');
      warningBar.removeEventListener('animationend', onAnimEnd);
    };
    warningBar.addEventListener('animationend', onAnimEnd);

    setTimeout(() => applyBodyShift(true), 80);
  } else if (warningBar && !isBarVisible) {
    warningBar.classList.add('hidden');
  }
}

// Экспорт в глобальную область и авто-инициализация
if (typeof window !== 'undefined') {
  window.toggleWarningBar = toggleBar;
  window.showWarningBar = showBar;
  window.hideWarningBar = hideBar;
  window.isWarningBarVisible = () => isBarVisible;
  window.initWarningBar = initWarningBar;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWarningBar, { once: true });
  } else {
    initWarningBar();
  }
}
