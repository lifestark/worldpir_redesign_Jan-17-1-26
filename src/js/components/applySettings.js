import { settings } from '../settings.js';

class ApplySettings {
    constructor() {
        this.init();
    }

    init() {
        // 1. Text Content Updates (data-set="keys")
        document.querySelectorAll('[data-set]').forEach(el => {
            const key = el.getAttribute('data-set');
            if (settings.company[key]) {
                if (key === 'address_html') {
                    el.innerHTML = settings.company[key];
                } else {
                    el.textContent = settings.company[key];
                }
            } else if (key.startsWith('socials.')) {
                // Logic mostly handles text, but socials are usually links. 
                // If we needed text for them we could add it here.
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
        // This looks for specific placeholders like [домен] or [Название ИП/ООО] and replaces them
        // Only runs if we find a legal-content block to avoid performance hit on main page
        const legalBlock = document.querySelector('.legal-box');
        if (legalBlock) {
            let html = legalBlock.innerHTML;
            html = html.replace(/\[домен\]/g, settings.company.domain);
            html = html.replace(/\[Название ИП\/ООО\]/g, settings.company.legal_name);
            html = html.replace(/\[ИНН\]/g, settings.company.inn);
            html = html.replace(/\[ОГРН\(ИП\)\]/g, settings.company.ogrn);
            html = html.replace(/\[адрес\]/g, settings.company.legal_address);
            html = html.replace(/\[e-mail\]/g, settings.company.email);

            // Only update if changes were made to avoid resetting event listeners (though unlikely in legal text)
            if (html !== legalBlock.innerHTML) {
                legalBlock.innerHTML = html;
            }
        }
    }
}

export default ApplySettings;
