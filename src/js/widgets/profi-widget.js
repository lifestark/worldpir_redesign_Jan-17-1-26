(function(){
  var profiWidgets = profiWidgets || function() {};

  profiWidgets.host = profiWidgets.host || '//profi.ru';
  profiWidgets.inited = profiWidgets.inited || false;
  profiWidgets.list = [];

  profiWidgets.init = profiWidgets.init || function() {
    var nodes = document.getElementsByClassName('profi-widget');
    var l = nodes.length;
    if(!l) return;

    for(var i = 0; i < l; i++) {
      var node = nodes[i];
      if(node.id) continue;
      var widget = new profiWidget(node);
      profiWidgets.list.push(widget);
    }

    if(profiWidgets.inited) return;
    profiWidgets.inited = true;
  };

  /*
   * Widget
   */

  var profiWidget = function(node) {
    this.node = node;
    // this.init(); // <-- Отключаем стандартную инициализацию
    this.customInit(); // <-- Заменяем на нашу кастомную
  };

  profiWidget.prototype = {
    // Делаем копию init для истории, но не используем
    init: function() {
      this.node.innerHTML = '';
      this.node.appendChild(this.createFrame());
    },
    // Наша кастомная инициализация
    customInit: function() {
       this.node.innerHTML = '';
       this.node.appendChild(this.createFrame());
    },
    attr: function(attr) {
      var result = (this.node.getAttribute && this.node.getAttribute(attr)) || null;
      if(!result) return null;

      var attrs = this.node.attributes;
      var length = attrs.length;

      for(var i = 0; i < length; i++) if(attrs[i].nodeName === attr) {
        result = attrs[i].nodeValue;
      }

      return result;
    },
    createFrame: function() {
      var frame = document.createElement('iframe');
      var size = this.getFrameSize();
      var isEmitEvents = +this.attr('data-emit-events') === 1;

      // УБИРАЕМ ТЕНИ И ФОН у самого iframe
      frame.style.boxShadow = 'none'; 
      frame.style.borderRadius = '0';
      frame.style.background = 'transparent';

      frame.style.width = size[0];
      frame.style.height = size[1];
      frame.frameBorder = 0;
      // Добавляем параметр transparent=1 если API профи это поддерживает, или надеемся что стили применятся
      frame.src = 'https:' + profiWidgets.host + '/backoffice/widget.php?'
          +'id='+this.attr('data-id')
          +'&type='+this.attr('data-type')
          +(isEmitEvents ? '&emit_events=1' : '');
          
      return frame;
    },
    getFrameSize: function() {
      var type = this.attr('data-type') || '';
      var w, h;

      switch(type) {
        case '210x190':
          w = '210px';
          h = '190px';
          break;
        case '300x100':
          w = '300px';
          h = '100px';
          break;
        default:
          w = '300px';
          h = '100px';
      }

      return [w,h];
    }
  };

  window.addEventListener('DOMContentLoaded', function() {
    if(!profiWidgets.inited) {
      profiWidgets.init();
    }
  });
}());
