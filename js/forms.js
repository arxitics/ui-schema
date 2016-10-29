/*!
 * Forms
 */

(function ($) {
  'use strict';

  // Validate user input
  schema.validate = function (event, options) {
    var data = schema.data;
    var changed = data.changed;
    var disabled = data.disabled;
    var selector = schema.events.validate.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var validate = $data.validate;
      $this.find(':input').one('change', function () {
        $this.data(changed, true);
      });
      $this.on('submit', function (event) {
        var $form = $(this);
        var validated = (validate === 'changed') ? $form.data(changed) : true;
        if (validated) {
          $form.find('input, textarea').each(function () {
            var $input = $(this);
            var value = $input.val().toString().trim();
            if (value === '') {
              $input.prop('disabled', true).data(disabled, true);
            }
          });
          if (validate === 'once') {
            $this.find(':submit').prop('disabled', true);
          }
          $form.submit();
        } else if (validated === undefined) {
          window.history.back();
        }
        event.preventDefault();
      });
      $this.on('reset', function () {
        var $form = $(this);
        $form.find('input, textarea').each(function () {
          var $input = $(this);
          if ($input.data(disabled)) {
            $input.prop('disabled', false).data(disabled, false);
          }
        });
        return true;
      });
    });
  };

  // Rating
  schema.rating = function (event, options) {
    var events = schema.events;
    var icon = schema.data.icon;
    var selector = events.rating.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $form = $(this);
      var $icons = $form.find('a > i');
      var $parent = $icons.parent();
      var $data = schema.parseData($parent.data());
      var icons = $data.icons.split(/\s*\,\s*/);
      var score = $data.score || 0;
      var integer = Math.round(score);
      var rounding = Math.abs(score - integer);
      var empty = icons.shift();
      var full = icons.pop();
      var half = icons.pop();
      $icons.each(function (index) {
        var $icon = $(this);
        $icon.on('mouseenter', function () {
          $icon.prevAll().addBack().data(icon, full);
          $icon.nextAll().data(icon, empty);
          schema.trigger(events.sprite, $icons);
        });
        $icon.on('click', function () {
          $parent.prev('input[type="hidden"]').val(index + 1);
          $form.submit();
        });
      });
      $parent.on('mouseleave', function () {
        $icons.slice(integer).data(icon, empty);
        if (integer > 0) {
          $icons.slice(0, integer).data(icon, full);
          if (half && Math.abs(rounding) > 0.25) {
            $icons.eq(Math.floor(score)).data(icon, half);
          }
        }
        schema.trigger(events.sprite, $icons);
      });
    });
  };

})(jQuery);
