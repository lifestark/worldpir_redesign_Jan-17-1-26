(function () {
  // CSS
  const style = document.createElement('style');
  style.textContent = `
    *{box-sizing:border-box}
    .widget-container{position:fixed;bottom:24px;right:24px;z-index:9999}

    /* Chat card (hidden by default) */
    .chat-card{width:360px;max-width:calc(100vw - 48px);background:#fff;border-radius:12px;box-shadow:0 18px 50px rgba(16,24,40,0.12);overflow:hidden;opacity:0;transform:translateY(8px) scale(.995);transition:opacity .26s ease,transform .26s ease;pointer-events:none;z-index:10000}
    .chat-card.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}
    .chat-card.closing{opacity:0;transform:translateY(8px) scale(.995);pointer-events:none}

    /* Telegram button inside card (single consolidated definition) */
    .telegram-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#3b82f6;color:#fff;border-radius:9999px;border:0;padding:12px 24px;font-weight:500;font-size:16px;text-decoration:none;cursor:pointer;box-shadow:0 8px 24px rgba(59,130,246,0.28);position:relative;overflow:hidden;transition:all .28s cubic-bezier(.2,.9,.2,1)}
    .telegram-button.collapsed{width:56px;padding:10px;border-radius:9999px}
    .telegram-button.expanded{width:100%;padding:12px 56px 12px 24px}
    .telegram-button.reveal .telegram-label{opacity:1;transform:translateX(0)}
    .telegram-label{display:inline-block;opacity:0;transform:translateX(8px);transition:opacity .26s var(--ease, cubic-bezier(.2,.9,.2,1));white-space:nowrap}
    .telegram-icon-wrap{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:36px;height:36px;display:flex;align-items:center;justify-content:center}
    .telegram-icon{width:20px;height:20px;display:block}

    .avatar-container{position:relative;margin-right:12px}
    .avatar{width:48px;height:48px;border-radius:50%;object-fit:cover}
    .online-indicator{position:absolute;bottom:0;right:0;width:14px;height:14px;background:#10b981;border-radius:50%;border:2px solid #fff}

    .chat-header{display:flex;align-items:center;justify-content:space-between;padding:16px}
    .chat-header-left{display:flex;align-items:center;gap:12px}
    .user-info h3{font-size:16px;margin:0 0 2px 0;color:#111}
    .user-info p{font-size:12px;margin:0;color:#6b7280}
    .close-btn{background:none;border:0;color:#9ca3af;cursor:pointer;padding:4px}

    .chat-background{height:192px;padding:24px;background-color:#d4e8d4;background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c1dcc1' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");overflow:hidden}
    .message-bubble{background:#fff;border-radius:16px;border-top-left-radius:4px;padding:12px 16px;box-shadow:0 2px 8px rgba(2,6,23,0.06);max-width:280px}
    .message-time{display:block;margin-top:6px;font-size:11px;color:#9ca3af}

    /* Floating button */
    .floating-button{width:64px;height:64px;background:#3b82f6;border-radius:50%;border:0;display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(59,130,246,0.22);cursor:pointer;transition:transform .28s,opacity .2s;position:relative}
    .floating-button.hidden{transform:scale(.2);opacity:0;pointer-events:none}
    .floating-button svg{width:28px;height:28px;color:#fff}

    .notification-badge{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 4px;background:#ef4444;border-radius:9999px;border:2px solid #fff;color:#fff;font-size:12px;display:inline-flex;align-items:center;justify-content:center}
    .notification-badge.pulse{animation:pulseBadge .9s ease-in-out 0s 2}

    @keyframes pulseBadge{0%{transform:scale(1);opacity:1}50%{transform:scale(1.22);opacity:.92}100%{transform:scale(1);opacity:1}}

    @media(max-width:480px){.chat-card{width:calc(100vw - 32px);right:16px}.widget-container{right:16px;bottom:16px}}
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
            <p>Привет👋 Чем могу помочь?</p>
    
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
  function initWidget() {
    if (window.__telegramWidgetInited) return;
    window.__telegramWidgetInited = true;
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
        // silent
      }
    }

    function playClickSound() { playBeep(880, 90, 0.06); }

    let audioNotification = null;
    (function initNotificationAudio() {
      const path = 'src/audio/telegram_notify.mp3';
      try {
        const a = new Audio(path);
        a.preload = 'auto';
        const onReady = () => { audioNotification = a; cleanup(); };
        const onError = () => { audioNotification = null; cleanup(); };
        function cleanup() { a.removeEventListener('canplaythrough', onReady); a.removeEventListener('error', onError); }
        a.addEventListener('canplaythrough', onReady);
        a.addEventListener('error', onError);
        a.load();
      } catch (e) { audioNotification = null; }
    })();

    function playNotification() {
      if (audioNotification) {
        try { const clone = audioNotification.cloneNode(); clone.play().catch(() => { playBeep(660, 160, 0.06); setTimeout(() => playBeep(990, 120, 0.04), 120); }); return; } catch (e) { }
      }
      playBeep(660, 160, 0.06); setTimeout(() => playBeep(990, 120, 0.04), 120);
    }

    function updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      if (messageTime) messageTime.textContent = `${hours}:${minutes}`;
    }
    updateTime();

    function openChatSequence() {
      if (chatCard) chatCard.classList.add('open');
      if (floatingBtn) floatingBtn.classList.add('hidden');
      if (floatingBtn) { floatingBtn.classList.add('bounce'); playClickSound(); setTimeout(() => floatingBtn.classList.remove('bounce'), 600); }
      const telegramBtn = document.querySelector('.telegram-button');
      if (telegramBtn) { setTimeout(() => { telegramBtn.classList.remove('collapsed'); telegramBtn.classList.add('expanded'); setTimeout(() => telegramBtn.classList.add('reveal'), 120); }, 160); }
    }

    if (floatingBtn) floatingBtn.addEventListener('click', openChatSequence);

    function openThenPulse(times = 1, gap = 680) {
      openChatSequence(); setTimeout(() => { let i = 0; function nextFade() { if (i >= times) { setTimeout(() => { if (floatingBtn) floatingBtn.style.opacity = ''; }, 400); return; } const targetOpacity = Math.max(0.6, 1 - (i * 0.12)); if (floatingBtn) floatingBtn.style.opacity = String(targetOpacity); i++; if (floatingBtn) { floatingBtn.classList.add('pulse-shadow-fade'); setTimeout(() => floatingBtn.classList.remove('pulse-shadow-fade'), 720); } setTimeout(nextFade, gap); } nextFade(); }, 260);
    }

    if (closeBtn) closeBtn.addEventListener('click', () => {
      if (isClosing) return; isClosing = true; if (chatCard) chatCard.classList.add('closing'); setTimeout(() => { if (chatCard) chatCard.classList.remove('open', 'closing'); if (floatingBtn) floatingBtn.classList.remove('hidden'); const telegramBtn = document.querySelector('.telegram-button'); if (telegramBtn) { telegramBtn.classList.remove('reveal'); telegramBtn.classList.remove('expanded'); telegramBtn.classList.add('collapsed'); } isClosing = false; }, 300);
    });

    // Avoid starting audio before user interaction to prevent AudioContext autoplay warnings.
    let _userInteracted = false;
    function _onFirstInteraction() { _userInteracted = true; try { document.removeEventListener('pointerdown', _onFirstInteraction); } catch (e) { } }
    document.addEventListener('pointerdown', _onFirstInteraction, { once: true });

    setTimeout(() => {
      const badge = document.querySelector('.notification-badge');
      if (badge) {
        badge.classList.add('pulse');
        // play sound only if user already interacted with the page
        if (_userInteracted) {
          playNotification();
        }
        setTimeout(() => badge.classList.remove('pulse'), 2000);
      }
    }, 450);

    // Open UI sequence; do not force audio here either — audio will play on user interaction
    setTimeout(() => { openThenPulse(1, 680); }, 1200);
  }

  if (document.body) initWidget(); else document.addEventListener('DOMContentLoaded', initWidget);
})();