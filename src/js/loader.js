// loader.js — загрузка head.html как partial в <head id="head-partial">

async function loadHeadPartial() {
    const headContainer = document.getElementById('head-partial');
    if (!headContainer) return;
    try {
        const resp = await fetch('src/template/layout/head.html');
        if (!resp.ok) throw new Error('Head partial not found');
        const html = await resp.text();
        // Вставляем содержимое head.html во временный контейнер
        const temp = document.createElement('div');
        temp.innerHTML = html;
        // Переносим все теги из head.html в настоящий <head>
        const realHead = document.getElementsByTagName('head')[0];
        Array.from(temp.children[0].children).forEach(node => {
            realHead.appendChild(node.cloneNode(true));
        });
        // Удаляем head-partial-заглушку
        headContainer.remove();
    } catch (e) {
        console.error('Не удалось загрузить head partial:', e);
    }
}

// Запуск до загрузки модулей
loadHeadPartial();
