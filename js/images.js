/*!
 * Images
 */

(function ($) {
  'use strict';

  // Defer image loading until it becomes visible on the screen
  schema.lazyload = function (event, options) {
    var selector = schema.events.lazyload.selector;
    var $elements = $(options && options.selector || selector);
    var height = $(window).height();
    $(window).on('scroll', function () {
      var scrollTop = $(window).scrollTop();
      $elements.each(function () {
        var $this = $(this);
        var $data = schema.parseData($this.data());
        var srcset = $this.attr('srcset') || '';
        var src = $data.src || srcset.split(' ')[0];
        if (src !== $this.attr('src')) {
          var lazyload = (+$data.lazyload - 1) || 200;
          var distance = $this.offset().top - height - scrollTop;
          if (distance < lazyload) {
            var delay = (+$data.delay - 1) || 0;
            window.setTimeout(function () {
              $this.attr('src', src);
            }, delay);
          }
        }
      });
    });
    $(window).scroll();
  };

  // Zoom an image using the magnifier
  schema.magnify = function (event, options) {
    var selector = schema.events.magnify.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var width = $this.width();
      var height = $this.height();
      var offset = $this.offset();
      var $area = $this.next();
      var $data = schema.parseData($area.data());
      var shape = $data.shape || 'rect';
      var $box = $area.next();
      var $img = $box.find('img');
      var ax = width * width / $img.width();
      var ay = height * height / $img.height();
      var params = shape.split(/[^\w\.]+/);
      var name = params[0];
      var dx = +params[1] || ax;
      var dy = +params[2] || ay;
      var xmax = width - dx;
      var ymax = height - dy;
      var sx = width / dx;
      var sy = height / dy;
      if (name === 'rect' || name === 'square') {
        $area.width(dx).height(dy);
      }
      $box.width(width).height(height);
      $this.on('mousemove', function (event) {
        var x = Math.min(Math.max(event.pageX - offset.left - dx / 2, 0), xmax);
        var y = Math.min(Math.max(event.pageY - offset.top - dy / 2, 0), ymax);
        $area.css({
          left: x,
          top: y
        });
        $img.css('transform', schema.format('translate(${x}px, ${y}px)', {
          x: -sx * x,
          y: -sy * y
        }));
      });
    });
  };

})(jQuery);
