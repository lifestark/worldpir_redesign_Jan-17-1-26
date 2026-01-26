PROTECTED FILES
===============

Файл `src/js/components/navigation.js` защищён от нежелательных правок.

Рекомендуемый локальный способ защиты:

1) Сделать файл только для чтения:

```bash
chmod 444 src/js/components/navigation.js
```

2) Включить локальные git хуки (разовый шаг в вашем рабочем каталоге):

```bash
git config core.hooksPath .githooks
```

Хук `.githooks/prevent-navigation-changes.sh` уже добавлен — он блокирует коммиты,
содержащие изменения в `src/js/components/navigation.js`.

Если вам нужно внести изменение, временно отключите хуки или измените права,
но обязательно согласуйте изменение с командой.
