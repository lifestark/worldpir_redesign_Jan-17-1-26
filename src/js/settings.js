export const settings = {
    company: {
        name: "Вселенная Праздников",
        legal_name: "ИП Старков А.А.",
        phone: "+7 (495) 032-13-03",
        phone_clean: "+74950321303", // Для ссылок tel:
        hours: "с 9:00 до 21:00 без выходных",
        address: "Москва, ул. Стромынка 19к1",
        address_html: "Москва, ул. Стромынка 19к1<br>Организация детских<br> праздников в Москве и МО",
        email: "worldofpir@gmail.com",
        domain: "worldpir.ru",
        inn: "1234567890",
        ogrn: "123456789012345",
        legal_address: "Москва, ул. Стромынка 19к2"
    },
    socials: {
        vk: "https://vk.com/worldpir",
        tg: "https://t.me/worldofpir",
        wa: "https://wa.me/79850321303"
    },

    // AmoCRM credentials (client-side copy). To use server-side, copy these values
    // into your PHP config (e.g. config/settings.php or api/config.php).
    amo: {
        subdomain: "worldpir",
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        redirectUri: "YOUR_REDIRECT_URI",
        authCode: "YOUR_ONE_TIME_CODE"
    }
};

// Expose globally for other scripts
window.APP_SETTINGS = settings;

// Auto-apply settings to DOM elements
(function () {
    function applySettings() {
        try {
            console.debug('[settings] applySettings start', settings.company);
        } catch (e) { /* ignore */ }
        // 1. Text Content Updates (data-set="keys")
        document.querySelectorAll('[data-set]').forEach(el => {
            const key = el.getAttribute('data-set');
            if (settings.company[key]) {
                if (key === 'address_html') {
                    el.innerHTML = settings.company[key];
                } else {
                    el.textContent = settings.company[key];
                }
            }
        });

        // 2. Phone Links (href="tel:...")
        document.querySelectorAll('[data-set-link="phone"]').forEach(el => {
            el.href = `tel:${settings.company.phone_clean}`;
            if (!el.hasAttribute('data-no-text')) {
                el.textContent = settings.company.phone;
            }
        });

        // 3. Email Links (href="mailto:...")
        document.querySelectorAll('[data-set-link="email"]').forEach(el => {
            el.href = `mailto:${settings.company.email}`;
            el.textContent = settings.company.email;
        });

        // 4. Social Links
        document.querySelectorAll('[data-social]').forEach(el => {
            const network = el.getAttribute('data-social');
            if (settings.socials[network]) {
                el.href = settings.socials[network];
            }
        });

        // 5. Legal Replacements (for text inside legal pages)
        const legalBlock = document.querySelector('.legal-box');
        if (legalBlock) {
            let html = legalBlock.innerHTML;
            html = html.replace(/\[домен\]/g, settings.company.domain);
            html = html.replace(/\[Название ИП\/ООО\]/g, settings.company.legal_name);
            html = html.replace(/\[ИНН\]/g, settings.company.inn);
            html = html.replace(/\[ОГРН\(ИП\)\]/g, settings.company.ogrn);
            html = html.replace(/\[адрес\]/g, settings.company.legal_address);
            html = html.replace(/\[e-mail\]/g, settings.company.email);

            if (html !== legalBlock.innerHTML) {
                legalBlock.innerHTML = html;
            }
        }
        try { console.debug('[settings] applySettings finished'); } catch (e) { }
    }

    // Auto-run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySettings);
    } else {
        applySettings();
    }

    // Expose for debugging and provide a fallback run (in case of module race)
    try { window.applySiteSettings = applySettings; } catch (e) { /* ignore */ }
    // Run again shortly after load as a safe fallback
    window.addEventListener('load', () => setTimeout(applySettings, 120));
})();
