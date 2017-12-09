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
    var $elements = schema.find('validate', options);
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
    var $elements = schema.find('rating', options);
    $elements.each(function () {
      var $input = $(this);
      var $form = $input.closest('form');
      var $anchor = $input.next();
      var $icons = $anchor.find('i');
      var $data = schema.parseData($anchor.data());
      var icons = $data.icons.split(/\s*\,\s*/);
      var score = Number($input.val() || 0);
      var integer = Math.round(score);
      var rounding = Math.abs(score - integer);
      var empty = icons.shift();
      var full = icons.pop();
      var half = icons.pop();
      $anchor.on('mouseenter', 'i', function () {
        var $icon = $(this);
        $icon.prevAll().addBack().data(icon, full);
        $icon.nextAll().data(icon, empty);
        schema.trigger(events.sprite, $icons);
      });
      $anchor.on('mouseleave', function () {
        $icons.slice(integer).data(icon, empty);
        if (integer > 0) {
          $icons.slice(0, integer).data(icon, full);
          if (half && Math.abs(rounding) > 0.25) {
            $icons.eq(Math.floor(score)).data(icon, half);
          }
        }
        schema.trigger(events.sprite, $icons);
      });
      $anchor.on('click', 'i', function () {
        var index = $(this).prevAll().length;
        $input.val(index + 1);
        $form.submit();
      });
    });
  };

  // Tagging
  schema.tagging = function (event, options) {
    var events = schema.events;
    var $elements = schema.find('tagging', options);
    $elements.each(function () {
      var $input = $(this);
      var $data = schema.parseData($input.data());
      var $parent = $input.parent();
      var $select = $input.next();
      var $output = $select.is(':last-child') ? $parent.next() : $select.next();
      var $span = $output.find('span:first-child');
      var $form = $input.closest('form');
      var required = $data.required;
      var init = $input.val();
      var values = [];
      var index = 0;
      var value = '';
      $select.on('change', function () {
        value = $select.val();
        if (value && values.indexOf(value) === -1) {
          var $option = $parent.find('option[value="' + value + '"]');
          var $optionData = schema.parseData($option.data());
          if ($optionData.empty) {
            $output.find('span > :last-child').click();
            values.length = 0;
          } else {
            var text = $option.text() || value;
            $output.append($span.clone().prepend(text));
            if ($select.is('input')) {
              $select.val('');
            }
            values.push(value);
            schema.trigger(events.sprite, $output.find('i'));
          }
        }
      });
      $output.on('click', 'span > :last-child', function () {
        var $span = $(this).parent();
        if (!required || values.length > 1) {
          index = $span.prevAll().length;
          values.splice(index, 1);
          $span.remove();
        }
      });
      $output.on('dragstart', 'span', function (event) {
        var $span = $(this);
        index = $span.prevAll().length;
        value = $span.text();
        event.dataTransfer.setData('text/html', $span.html());
      });
      $output.on('dragover', 'span', function (event) {
        if (event.dataTransfer.types == 'text/html') {
          event.preventDefault();
        }
      });
      $output.on('drop', 'span', function (event) {
        var $target = $(event.target);
        var html = $target.html();
        var text = $target.text();
        if (text && value) {
          values[index] = text;
          values[$target.prevAll().length] = value;
          $target.html(event.dataTransfer.getData('text/html'));
          $output.find('span').eq(index).html(html);
          schema.trigger(events.sprite, $output.find('i'));
        }
        return false;
      });
      $form.on('submit', function () {
        $input.val(values.join(','));
        return true;
      });
      if (init) {
        init.split(',').forEach(function (value) {
          $select.val(value).change();
        });
      }
      $select.change();
      $span.remove();
    });
    $.event.addProp('dataTransfer');
  };

})(jQuery);
