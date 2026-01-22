export const settings = {
    company: {
        name: "Вселенная Праздников",
        legal_name: "ООО «Вселенная Праздников»",
        phone: "+7 (495) 032-13-03",
        phone_clean: "+74950321303", // Для ссылок tel:
        hours: "с 9:00 до 21:00 без выходных",
        address: "Москва, ул. Стромынка 19к2",
        address_html: "Москва, ул. Стромынка 19к2<br>Организация детских<br> праздников в Москве и МО",
        email: "info@worldparty.ru",
        domain: "worldpir.ru",
        inn: "1234567890",
        ogrn: "123456789012345",
        legal_address: "Москва, ул. Стромынка 19к2"
    },
    socials: {
        vk: "https://vk.com",
        tg: "https://t.me",
        wa: "https://wa.me"
    },

    // AmoCRM credentials (client-side copy). To use server-side, copy these values
    // into your PHP config (e.g. config/settings.php or api/config.php).
    amo: {
        subdomain: "YOUR_SUBDOMAIN",
        clientId: "YOUR_CLIENT_ID",
        clientSecret: "YOUR_CLIENT_SECRET",
        redirectUri: "YOUR_REDIRECT_URI",
        authCode: "YOUR_ONE_TIME_CODE"
    }
};

// Expose globally for other scripts
window.APP_SETTINGS = settings;

// Auto-insert company info into DOM elements using data attributes.
(function () {
    function populate() {
        if (!document.body) return;

        const map = {
            'data-company-name': settings.company.name,
            'data-company-legal': settings.company.legal_name,
            'data-company-phone': settings.company.phone,
            'data-company-phone-clean': settings.company.phone_clean,
            'data-company-hours': settings.company.hours,
            'data-company-address': settings.company.address,
            'data-company-address-html': settings.company.address_html,
            'data-company-email': settings.company.email,
            'data-company-domain': settings.company.domain
        };

        Object.keys(map).forEach(attr => {
            document.querySelectorAll('[' + attr + ']').forEach(el => {
                if (attr === 'data-company-phone-clean') {
                    if (el.tagName.toLowerCase() === 'a') {
                        el.setAttribute('href', 'tel:' + map[attr]);
                        el.textContent = settings.company.phone;
                    } else {
                        el.textContent = settings.company.phone;
                    }
                    return;
                }

                if (attr === 'data-company-email') {
                    if (el.tagName.toLowerCase() === 'a') {
                        el.setAttribute('href', 'mailto:' + map[attr]);
                    }
                    el.textContent = map[attr];
                    return;
                }

                if (attr === 'data-company-address-html') {
                    el.innerHTML = map[attr];
                    return;
                }

                el.textContent = map[attr];
            });
        });

        // Social links
        if (settings.socials) {
            if (settings.socials.vk) document.querySelectorAll('[data-social="vk"]').forEach(a => a.href = settings.socials.vk);
            if (settings.socials.tg) document.querySelectorAll('[data-social="tg"]').forEach(a => a.href = settings.socials.tg);
            if (settings.socials.wa) document.querySelectorAll('[data-social="wa"]').forEach(a => a.href = settings.socials.wa);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', populate);
    } else {
        populate();
    }
})();

// expose also under window for external tools
window.APP_SETTINGS = window.APP_SETTINGS || settings;
