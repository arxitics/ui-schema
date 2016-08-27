/*!
 * Images
 */

(function ($) {
  'use strict';

  // Defer image loading until it becomes visible on the screen
  schema.lazyload = function (event, options) {
    var selector = schema.events.lazyload.selector;
    var $_elements = $(selector).add(options && options.selector);
    var height = $(window).height();
    $(window).on('scroll', function () {
      var scrollTop = $(window).scrollTop();
      $_elements.each(function () {
        var $_this = $(this);
        var $_data = schema.parseData($_this.data());
        var src = $_data.src || $_this.attr('srcset');
        if (src !== $_this.attr('src')) {
          var lazyload = (+$_data.lazyload - 1) || 200;
          var distance = $_this.offset().top - height - scrollTop;
          if (distance < lazyload) {
            var delay = (+$_data.delay - 1) || 0;
            window.setTimeout(function () {
              $_this.attr('src', src);
            }, delay);
          }
        }
      });
    });
    $(window).scroll();
  };

})(jQuery);
