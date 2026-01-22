(function () {
  // CSS
  const style = document.createElement('style');
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .widget-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
    }

    /* Chat Card */
    .telegram-button {
      width: 100%;
      background: #2366f2; /* slightly darker blue to match example */
      color: white;
      font-weight: 500;
      padding: 12px 56px 12px 24px; /* leave space for icon on the right */
      border-radius: 9999px;
      border: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: background 200ms ease, transform 200ms ease;
      box-shadow: 0 8px 20px rgba(35, 102, 242, 0.18);
      text-decoration: none;
      font-size: 18px;
      position: relative;
      overflow: hidden;
    }
    /* collapsed -> small circular button inside chat before expand */
    .telegram-button.collapsed {
      width: 56px;
      padding: 10px;
      border-radius: 9999px;
      display: block;
      margin: 0 auto;
      transition: width 360ms cubic-bezier(.2,.9,.2,1), padding 360ms cubic-bezier(.2,.9,.2,1), border-radius 360ms cubic-bezier(.2,.9,.2,1);
    }
    .telegram-button.expanded {
      width: 100%;
      padding: 12px 56px 12px 24px;
      border-radius: 9999px;
      transition: width 360ms cubic-bezier(.2,.9,.2,1), padding 360ms cubic-bezier(.2,.9,.2,1), border-radius 360ms cubic-bezier(.2,.9,.2,1);
    }
    .telegram-button:hover {
      background: #1b57d1;
      transform: translateY(-2px);
    }
    .telegram-icon {
      width: 28px;
      height: 28px;
      display: block;
    }
    .telegram-icon-wrap {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
    }
    /* Reveal animation for Telegram label */
    .telegram-label {
      display: block;
      width: 100%;
      text-align: center;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity 260ms cubic-bezier(.2,.9,.2,1), transform 260ms cubic-bezier(.2,.9,.2,1);
      white-space: nowrap;
    }
    .telegram-button.reveal .telegram-label {
      opacity: 1;
      transform: translateY(0);
    }

    .avatar-container {
      position: relative;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e5e7eb;
    }

    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 14px;
      height: 14px;
      background: #10b981;
      border-radius: 50%;
      border: 2px solid white;
    }

    .user-info h3 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2px;
    }

    .user-info p {
      font-size: 12px;
      color: #6b7280;
    }

    .close-btn {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
    }

    .close-btn:hover {
      color: #4b5563;
    }

    /* Chat Background */
    .chat-background {
      height: 192px;
      padding: 24px;
      background-color: #d4e8d4;
      background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c1dcc1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      position: relative;
      overflow: hidden;
    }

    .message-bubble {
      background: white;
      border-radius: 16px;
      border-top-left-radius: 4px;
      padding: 12px 16px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      max-width: 280px;
      display: inline-block;
      opacity: 0;
      transform: translateY(10px);
      animation: fadeInUp 0.5s ease-out 0.3s forwards;
    }

    .message-bubble p {
      color: #1f2937;
      margin-bottom: 4px;
      line-height: 1.4;
    }

    .message-bubble p:last-of-type {
      margin-bottom: 8px;
    }

    .message-time {
      font-size: 11px;
      color: #9ca3af;
      display: block;
      margin-top: 4px;
    }

    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Telegram Button */
    .telegram-button-container {
      padding: 24px;
      background: white;
    }

    .telegram-button {
      width: 100%;
      background: #3b82f6;
      color: white;
      font-weight: 500;
      padding: 12px 24px;
      border-radius: 9999px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      text-decoration: none;
      font-size: 16px;
    }

    .telegram-button:hover {
      background: #2563eb;
      transform: scale(1.05);
    }

    .telegram-icon {
      width: 20px;
      height: 20px;
    }
    /* Reveal animation for Telegram label */
    .telegram-button {
      overflow: hidden;
    }
    .telegram-label {
      display: inline-block;
      opacity: 0;
      transform: translateX(8px);
      transition: opacity 260ms cubic-bezier(.2,.9,.2,1), transform 260ms cubic-bezier(.2,.9,.2,1);
      white-space: nowrap;
    }
    .telegram-button.reveal .telegram-label {
      opacity: 1;
      transform: translateX(0);
    }

    /* Floating Button */
    .floating-button {
      width: 64px;
      height: 64px;
      background: #3b82f6;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
      transition: all 0.3s;
      position: relative;
    }

    .floating-button:hover {
      background: #2563eb;
      transform: scale(1.1);
    }

    .floating-button.hidden {
      transform: scale(0);
      opacity: 0;
    }

    .floating-button svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 20px;
      height: 20px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      color: white;
    }

    @media (max-width: 480px) {
      .chat-card {
        width: calc(100vw - 32px);
        right: 16px;
      }

      .widget-container {
        right: 16px;
        bottom: 16px;
      }
    }
    /* Animations */
    @keyframes pulseBadge {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.25); opacity: 0.9; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes floatBounce {
      0% { transform: translateY(0); }
      30% { transform: translateY(-8px); }
      60% { transform: translateY(0); }
      100% { transform: translateY(0); }
    }

    .notification-badge.pulse {
      animation: pulseBadge 900ms ease-in-out 0s 2;
    }

    .floating-button.bounce {
      animation: floatBounce 600ms ease;
    }

    @keyframes pulseShadow {
      0% { box-shadow: 0 8px 24px rgba(59,130,246,0.4); transform: translateY(0); }
      50% { box-shadow: 0 18px 40px rgba(59,130,246,0.18); transform: translateY(-6px); }
      100% { box-shadow: 0 8px 24px rgba(59,130,246,0.4); transform: translateY(0); }
    }

    .floating-button.pulse-shadow {
      animation: pulseShadow 520ms cubic-bezier(.2,.9,.2,1);
    }
    @keyframes pulseShadowFade {
      0% { box-shadow: 0 18px 40px rgba(59,130,246,0.18); opacity: 1; transform: translateY(-4px); }
      60% { box-shadow: 0 28px 60px rgba(59,130,246,0.12); opacity: 0.7; transform: translateY(-8px); }
      100% { box-shadow: 0 8px 24px rgba(59,130,246,0.4); opacity: 0.95; transform: translateY(0); }
    }

    .floating-button.pulse-shadow-fade {
      animation: pulseShadowFade 720ms cubic-bezier(.2,.9,.2,1);
    }
    /* Temporary expanded button shown without opening full chat card */
    .telegram-button.temp-expanded {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 10000;
      width: 320px;
      max-width: calc(100vw - 48px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 56px 12px 24px;
      border-radius: 9999px;
      box-shadow: 0 12px 32px rgba(59,130,246,0.22);
      transform-origin: right bottom;
      transition: transform 260ms cubic-bezier(.2,.9,.2,1), opacity 260ms;
    }
    .telegram-button.temp-expanded.reveal .telegram-label {
      opacity: 1;
      transform: translateX(0);
    }
    /* pulse for temp-expanded (repeated pulses) */
    .telegram-button.temp-expanded.pulse {
      animation: pulseShadow 520ms cubic-bezier(.2,.9,.2,1) 0s 1;
    }

    /* typing indicator */
    .typing {
      display: inline-flex;
      gap: 6px;
      align-items: center;
      height: 18px;
      padding: 6px 10px;
    }
    .typing span {
      width: 6px;
      height: 6px;
      background: #9ca3af;
      border-radius: 50%;
      opacity: 0.5;
      transform: translateY(0);
      animation: typingDot 900ms infinite ease-in-out;
    }
    .typing span:nth-child(1) { animation-delay: 0ms; }
    .typing span:nth-child(2) { animation-delay: 120ms; }
    .typing span:nth-child(3) { animation-delay: 240ms; }
    @keyframes typingDot {
      0% { transform: translateY(0); opacity: 0.45; }
      40% { transform: translateY(-6px); opacity: 1; }
      80% { transform: translateY(0); opacity: 0.45; }
      100% { transform: translateY(0); opacity: 0.45; }
    }
  `;
  document.head.appendChild(style);

  // HTML
  const widgetHTML = `
    <div class="widget-container">
      <div class="chat-card" id="chatCard">
        <div class="chat-header">
          <div class="chat-header-left">
            <div class="avatar-container">
              <img src="src/img/brand/manager_face.png" alt="Валентина Петрова" class="avatar">
              <div class="online-indicator"></div>
            </div>
            <div class="user-info">
              <h3>Валентина Петрова</h3>
              <p>Обычно отвечает в течение 5 минут</p>
            </div>
          </div>
          <button class="close-btn" id="closeBtn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="chat-background">
          <div class="message-bubble">
            <p>Привет👋</p>
            <p>Чем могу помочь?</p>
            <span class="message-time" id="messageTime">21:19</span>
          </div>
        </div>

        <div class="telegram-button-container">
          <a href="https://t.me/worldpir_bot" target="_blank" rel="noopener noreferrer" class="telegram-button">
            <span class="telegram-label">Написать в телеграм</span>
            <span class="telegram-icon-wrap">
              <svg class="telegram-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </a>
        </div>
      </div>

      <button class="floating-button" id="floatingBtn">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
        <div class="notification-badge">1</div>
      </button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // ensure telegram button starts collapsed
  const initialTelegramBtn = document.querySelector('.telegram-button');
  if (initialTelegramBtn) initialTelegramBtn.classList.add('collapsed');

  // JavaScript
  const floatingBtn = document.getElementById('floatingBtn');
  const chatCard = document.getElementById('chatCard');
  const closeBtn = document.getElementById('closeBtn');
  const messageTime = document.getElementById('messageTime');
  let isClosing = false;

  // Конфиг таймингов (ms) для этапов: удобно менять поведение
  const delays = {
    initialBadge: 450,
    // увеличены интервалы между этапами x5
    afterBadge: 6000,
    expandRender: 1300,
    revealAfterClone: 80,
    revealDelay: 600,
    bounceDuration: 600,
    pulseDuration: 520,
    pulseInterval: 3400,
    pulsesCount: 3,
    postPulseToOpen: 1300,
    betweenLines: 1100,
    typingSpeed: 200,
    badgePulseDuration: 10000,
    // автозакрытие виджета после финальной стадии (ms). 0 = не закрывать
    autoCloseAfter: 7000
  };

  // --- Sound (Web Audio API) ---
  function playBeep(freq = 880, duration = 120, volume = 0.05) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = volume;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        try { ctx.close(); } catch (e) { }
      }, duration);
    } catch (e) {
      // WebAudio может быть недоступен — тихо игнорируем
      // console.warn('Audio not available', e);
    }
  }

  // Play short click sound on click
  function playClickSound() {
    playBeep(880, 90, 0.06);
  }

  // Sound dedupe: prevent very close consecutive sounds
  let _lastSoundAt = 0;
  function playOnce(fn, minGap = 700) {
    const now = Date.now();
    if (now - _lastSoundAt < minGap) return;
    _lastSoundAt = now;
    try { fn(); } catch (e) { }
  }

  // Helper: pulse an element `times` times (adds/removes pulse class). Optional callback after finished.
  function pulseElement(el, times = 2, interval = delays.pulseInterval, cls = 'pulse-shadow', cb) {
    if (!el) {
      if (typeof cb === 'function') cb();
      return;
    }
    let i = 0;
    function p() {
      if (i >= times) {
        if (typeof cb === 'function') cb();
        return;
      }
      i++;
      el.classList.add(cls);
      setTimeout(() => el.classList.remove(cls), delays.pulseDuration);
      setTimeout(p, interval);
    }
    p();
  }

  // Try to load stock mp3 from project; fallback to WebAudio beeps
  let audioNotification = null;
  (function initNotificationAudio() {
    const path = 'src/audio/telegram-notify.mp3';
    try {
      const a = new Audio(path);
      a.preload = 'auto';
      // if canplaythrough fires, we consider it available
      const onReady = () => { audioNotification = a; cleanup(); };
      const onError = () => { audioNotification = null; cleanup(); };
      function cleanup() {
        a.removeEventListener('canplaythrough', onReady);
        a.removeEventListener('error', onError);
      }
      a.addEventListener('canplaythrough', onReady);
      a.addEventListener('error', onError);
      // kick off loading
      a.load();
      // keep reference (even if not ready) to allow play attempts
    } catch (e) {
      audioNotification = null;
    }
  })();

  // Play notification: prefer mp3 file, otherwise WebAudio fallback
  function playNotification() {
    if (audioNotification) {
      try {
        // clone to allow overlapping plays
        const clone = audioNotification.cloneNode();
        clone.play().catch(() => { playBeep(660, 160, 0.06); setTimeout(() => playBeep(990, 120, 0.04), 120); });
        return;
      } catch (e) {
        // fallthrough to beep
      }
    }
    playBeep(660, 160, 0.06);
    setTimeout(() => playBeep(990, 120, 0.04), 120);
  }

  // Устанавливаем текущее время
  function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    messageTime.textContent = `${hours}:${minutes}`;
  }

  updateTime();

  // Вынесенная логика открытия чата (можно вызывать вручную)
  function openChatSequence() {
    // remove any temporary expanded button
    const temp = document.querySelector('.telegram-button.temp-expanded');
    if (temp) temp.remove();
    chatCard.classList.add('open');
    floatingBtn.classList.add('hidden');
    // небольшая анимация при открытии
    floatingBtn.classList.add('bounce');
    setTimeout(() => floatingBtn.classList.remove('bounce'), 600);
    // звук активации 3-й стадии (при полном разворачивании)
    // звук активации 3-й стадии (при полном разворачивании) — через дедупликатор
    playOnce(() => playNotification(), 700);
    // раскрыть текст кнопки "Написать в телеграм"
    const telegramBtn = document.querySelector('.telegram-button');
    if (telegramBtn) {
      // небольшая задержка, чтобы кнопка была видима
      setTimeout(() => {
        telegramBtn.classList.remove('collapsed');
        telegramBtn.classList.add('expanded');
        // reveal label after expansion starts
        setTimeout(() => telegramBtn.classList.add('reveal'), 120);
      }, 160);
    }

    // --- typing animation for the message bubble (type lines, then play send sound) ---
    try {
      const bubble = chatCard.querySelector('.message-bubble');
      if (bubble) {
        const originalHTML = bubble.innerHTML;
        // collect original paragraph texts
        const paras = Array.from(bubble.querySelectorAll('p')).map(p => p.textContent.trim());
        // replace content with typing placeholders
        bubble.innerHTML = '<p class="typing-line"></p><p class="typing-line-2"></p><span class="message-time" id="messageTime">' + messageTime.textContent + '</span>';
        bubble.style.opacity = '1';

        function typeLine(el, text, speed = 40) {
          return new Promise((resolve) => {
            let i = 0;
            function step() {
              if (i <= text.length) {
                el.textContent = text.slice(0, i);
                i++;
                setTimeout(step, speed);
              } else {
                resolve();
              }
            }
            step();
          });
        }

        (async () => {
          const line1 = bubble.querySelector('.typing-line');
          const line2 = bubble.querySelector('.typing-line-2');
          if (paras[0]) await typeLine(line1, paras[0], 40);
          // small pause between lines
          await new Promise(r => setTimeout(r, 220));
          if (paras[1]) await typeLine(line2, paras[1], 40);
          // finished typing — restore formatted bubble and play send sound
          bubble.innerHTML = originalHTML;
          updateTime();
          // проигрываем звук отправки только один раз и после завершения печати
          playOnce(() => playClickSound(), 700);
          // автозакрытие после завершения печати (если включено)
          if (delays.autoCloseAfter && delays.autoCloseAfter > 0) {
            setTimeout(() => {
              // закроем чат и восстановим плавающую кнопку
              chatCard.classList.remove('open', 'closing');
              floatingBtn.classList.remove('hidden');
              const telegramBtn = document.querySelector('.telegram-button');
              if (telegramBtn) {
                telegramBtn.classList.remove('reveal');
                telegramBtn.classList.remove('expanded');
                telegramBtn.classList.add('collapsed');
              }
            }, delays.autoCloseAfter);
          }
        })();
      }
    } catch (e) {
      // ignore typing animation errors
    }
  }

  floatingBtn.addEventListener('click', openChatSequence);

  // Повторная пульсация тени несколько раз, затем открыть чат
  function pulseThenOpen(times = 3, gap = 600) {
    let i = 0;
    function next() {
      if (i >= times) {
        // небольшая пауза перед открытием
        setTimeout(() => openChatSequence(), 200);
        return;
      }
      i++;
      floatingBtn.classList.add('pulse-shadow');
      // убрать класс после окончания одной анимации
      setTimeout(() => floatingBtn.classList.remove('pulse-shadow'), 520);
      setTimeout(next, gap);
    }
    next();
  }

  // Сначала раскрыть кнопку, затем один или несколько пульсов с затуханием
  function openThenPulse(times = 1, gap = 680) {
    // сначала показываем только расширенную кнопку без полного чата
    expandButtonOnly();
    // потом даём кнопке время отрисоваться и пульсируем клонированную кнопку
    setTimeout(() => {
      const clone = document.querySelector('.telegram-button.temp-expanded');
      if (!clone) {
        // fallback: если клона нет, откроем чат
        openChatSequence();
        return;
      }
      // сделать несколько пульсов на клоне, затем открыть чат (3-я стадия)
      pulseElement(clone, times || 3, gap || 680, 'pulse', () => {
        // короткая пауза перед открытием полного чата
        setTimeout(() => openChatSequence(), 260);
      });
    }, 260);
  }

  // Показать только расширенную кнопку (без показа полного chatCard)
  function expandButtonOnly() {
    // если уже есть временная кнопка, не создавать новую
    if (document.querySelector('.telegram-button.temp-expanded')) return;
    const source = document.querySelector('.telegram-button');
    if (!source) return;
    // скрываем плавающую кнопку
    floatingBtn.classList.add('hidden');
    // клонируем кнопку для временного показа
    const clone = source.cloneNode(true);
    clone.classList.add('temp-expanded');
    // обеспечить видимость метки
    clone.classList.add('expanded');
    // добавим reveal после небольшой задержки
    setTimeout(() => clone.classList.add('reveal'), 80);
    // при клике на временную кнопку откроем полный чат
    clone.addEventListener('click', (e) => {
      e.preventDefault();
      // удалить временную кнопку
      clone.remove();
      // открыть чат полноценно
      openChatSequence();
    });
    // вставляем в документ
    document.body.appendChild(clone);
  }

  closeBtn.addEventListener('click', () => {
    if (isClosing) return;
    isClosing = true;
    chatCard.classList.add('closing');

    setTimeout(() => {
      chatCard.classList.remove('open', 'closing');
      floatingBtn.classList.remove('hidden');
      // вернуть видимость бейджа после закрытия чата
      const badge = document.querySelector('.notification-badge');
      if (badge) badge.style.display = '';
      const telegramBtn = document.querySelector('.telegram-button');
      if (telegramBtn) {
        telegramBtn.classList.remove('reveal');
        telegramBtn.classList.remove('expanded');
        telegramBtn.classList.add('collapsed');
      }
      isClosing = false;
    }, 300);
  });

  // Запустить начальную настройку: скрываем бейдж на первой стадии (пульс и звук убраны)
  setTimeout(() => {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      // скрываем бейдж на начальной анимации
      badge.style.display = 'none';
    }
  }, delays.initialBadge);

  // После начального баcджа: несколько пульсов тени на кнопке, затем автo‑раскрытие
  setTimeout(() => {
    // сначала раскрываем кнопку, затем несколько пульсов (настраивается через delays.pulsesCount)
    openThenPulse(delays.pulsesCount, delays.pulseInterval);
  }, delays.afterBadge);
})();