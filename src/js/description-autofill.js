// Автоматически подставлять текст первого h1 в meta description
// Подключать этот файл в index.html после основного JS

export function autofillDescriptionFromH1() {
    var h1 = document.querySelector('h1');
    var meta = document.querySelector('meta[name="description"]');
    if (h1 && meta) {
        var text = h1.textContent.replace(/\s+/g, ' ').trim();
        meta.setAttribute('content', text);
    }
}
