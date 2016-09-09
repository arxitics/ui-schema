/*!
 * Images
 */

(function ($) {
  'use strict';

  // Defer image loading until it becomes visible on the screen
  schema.lazyload = function (event, options) {
    var selector = schema.events.lazyload.selector;
    var $elements = $(selector).add(options && options.selector);
    var height = $(window).height();
    $(window).on('scroll', function () {
      var scrollTop = $(window).scrollTop();
      $elements.each(function () {
        var $this = $(this);
        var $data = schema.parseData($this.data());
        var src = $data.src || $this.attr('srcset');
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

})(jQuery);
