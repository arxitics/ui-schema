/*!
 * Icons
 */

(function ($) {
  'use strict';

  // Create SVG icons
  schema.sprite = function (event, options) {
    var icons = schema.icons;
    var $elements = schema.find('sprite', options);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var animation = $data.animation || false;
      var name = $data.icon || 'unknown';
      var icon = icons[name] || icons.unknown;
      if ($.type(icon) === 'string') {
        icon = icons[icon];
      }

      var width = $data.width || icon[0];
      var height = $data.height || icon[1];
      var path = $data.path || icon[2];
      var color = $data.color || icon[3];

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
          if(color && color !== 'unset') {
            element.setAttribute('fill', Array.isArray(color) ? color[index] : color);
          }
          element.setAttribute('d', segment);
          svg.appendChild(element);
        });
      } else {
        var element = document.createElementNS(namespace, 'path');
        if (color && color !== 'unset') {
          element.setAttribute('fill', color);
        }
        element.setAttribute('d', path);
        svg.appendChild(element);
      }
      if (!$this.html() && animation) {
        $this.hide().html(svg).show(animation);
      } else {
        $this.html(svg);
      }
    });
  };

  schema.icons = {
    'unknown': [32, 32, 'M1 1h31v31h-31zM3 3v27h27v-27z']
  };

})(jQuery);
