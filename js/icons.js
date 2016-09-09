/*!
 * Icons
 */

(function ($) {
  'use strict';

  // Create SVG icons
  schema.sprite = function (event, options) {
    var icons = schema.icons;
    var selector = schema.events.sprite.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var name = $data.icon || 'unknown';
      var icon = icons[name] || icons.unknown;
      if (typeof icon === 'string') {
        icon = icons[icon];
      }

      var width = $data.width || icon[0];
      var height = $data.height || icon[1];
      var path = $data.path || icon[2];
      var color = $data.color || icon[3];
      var colorEnabled = $data.colorEnabled;
      if (colorEnabled === undefined && color) {
        colorEnabled = true;
      }

      // Create <svg> element
      var namespace = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(namespace, 'svg');
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

      // Create <path> element
      if (Array.isArray(path)) {
        path.forEach(function (segment, index) {
          var element = document.createElementNS(namespace, 'path');
          if(colorEnabled && color) {
            element.setAttribute('fill', Array.isArray(color) ? color[index] : color);
          }
          element.setAttribute('d', segment);
          svg.appendChild(element);
        });
      } else {
        var element = document.createElementNS(namespace, 'path');
        if (colorEnabled && color) {
          element.setAttribute('fill', color);
        }
        element.setAttribute('d', path);
        svg.appendChild(element);
      }

      $this.empty().append(svg);
    });
  };

  schema.icons = {
    'unknown': [32, 32, 'M1 1h31v31h-31zM3 3v27h27v-27z']
  };

})(jQuery);
