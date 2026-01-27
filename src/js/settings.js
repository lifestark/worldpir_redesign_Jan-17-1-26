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
        // start applying settings
        // 1. Text Content Updates (data-set="keys")
        document.querySelectorAll('[data-set]').forEach(el => {
            const key = el.getAttribute('data-set');
            const value = settings.company[key];
            if (!value) return;
            // allow a tiny safe subset for address_html (only <br> tags)
            if (key === 'address_html') {
                // sanitize by parsing and keeping only text and <br>
                const temp = document.createElement('div');
                temp.innerHTML = value;
                // remove any element nodes that are not BR, and strip attributes
                const walker = document.createTreeWalker(temp, NodeFilter.SHOW_ELEMENT, null, false);
                const toRemove = [];
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    if (node.tagName !== 'BR') toRemove.push(node);
                    else {
                        // remove attributes from BR just in case
                        while (node.attributes && node.attributes.length) node.removeAttribute(node.attributes[0].name);
                    }
                }
                toRemove.forEach(n => {
                    const parent = n.parentNode;
                    while (n.firstChild) parent.insertBefore(n.firstChild, n);
                    parent.removeChild(n);
                });
                // set sanitized markup
                el.innerHTML = temp.innerHTML;
            } else {
                el.textContent = value;
            }
        });

        // 2. Phone Links (href="tel:...")
        document.querySelectorAll('[data-set-link="phone"]').forEach(el => {
            // sanitize phone for href: digits only (no spaces, no plus)
            const phoneDigits = (settings.company.phone_clean || '').replace(/\D+/g, '');
            if (el.tagName && el.tagName.toLowerCase() === 'a') {
                if (phoneDigits) el.href = `tel:${phoneDigits}`;
                if (!el.hasAttribute('data-no-text')) el.textContent = settings.company.phone;
            } else {
                el.textContent = settings.company.phone;
            }
        });

        // 3. Email Links (href="mailto:...")
        document.querySelectorAll('[data-set-link="email"]').forEach(el => {
            if (el.tagName && el.tagName.toLowerCase() === 'a') {
                el.href = `mailto:${settings.company.email}`;
                el.textContent = settings.company.email;
            } else {
                el.textContent = settings.company.email;
            }
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
        // finished
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

// (no inline fallbacks here — use src/js/fallbacks.js)
