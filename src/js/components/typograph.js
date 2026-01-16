/**
 * ================================================
 * TYPOGRAPH
 * Скрипт автоматического типографа
 * ================================================
 */
class Typograph {
  constructor() {
    // Список предлогов, союзов и частиц для обработки
    this.prepositions = [
      'в', 'во', 'на', 'с', 'со', 'у', 'о', 'об', 'к', 'ко',
      'и', 'а', 'но', 'да', 'за', 'по', 'из', 'от', 'до',
      'над', 'под', 'при', 'про', 'не', 'ни',
      'для', 'без', 'как', 'так'
    ];

    // Регулярное выражение: ищет слово из списка, окруженное пробелами или началом строки
    this.regex = new RegExp(`(^|\\s|&nbsp;| )(${this.prepositions.join('|')})\\s+`, 'gi');

    this.init();
  }

  init() {
    this.processNode(document.body);
  }

  processNode(node) {
    // Обрабатываем только текстовые узлы
    if (node.nodeType === Node.TEXT_NODE) {
      const parentName = node.parentNode.tagName ? node.parentNode.tagName.toLowerCase() : '';

      // Пропускаем технические теги
      if (['script', 'style', 'textarea', 'code', 'pre'].includes(parentName)) return;

      const originalText = node.textContent;
      const fixedText = originalText.replace(this.regex, (match, p1, p2) => {
        return p1 + p2 + '\u00A0'; // Добавляем неразрывный пробел
      });

      if (fixedText !== originalText) {
        node.textContent = fixedText;
      }
    } else {
      // Рекурсивно проходим по всем дочерним элементам
      for (let i = 0; i < node.childNodes.length; i++) {
        this.processNode(node.childNodes[i]);
      }
    }
  }
}

export default Typograph;
