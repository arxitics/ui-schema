/*!
 * UI Schema - Forms v0.0.1 (http://photino.github.io/ui-schema/js/schema-icons.js)
 * Copyright 2014 Zan Pan <panzan89@gmail.com>
 * Licensed under MIT (https://github.com/photino/ui-schema/blob/master/LICENSE.txt)
 */

(function($) {
  'use strict';

  Schema.validate = function(event, options) {
    var eventSelector = Schema.events.validate.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function() {
      var $_this = $(this);
      $_this.on('submit', function (event) {
        var $_form = $(this);
        $_form.find('input').each(function () {
          var $_input = $(this);
          var value = $_input.val().toString().trim();
          if (value === '') {
            $_input.prop('disabled', true);
          }
        });
        $_form.submit();
        event.preventDefault();
      });
    });
  };

})(jQuery);
