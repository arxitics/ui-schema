/*!
 * Utilities
 */

(function ($) {
  'use strict';

  // Trim white spaces between inline blocks
  schema.trim = function (event, options) {
    var selector = schema.events.trim.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.contents().filter(function () {
      return this.nodeType === 3;
    }).remove();
  };

  // Toggle a CSS class
  schema.toggle = function (event, options) {
    var selector = schema.events.toggle.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var target = $data.toggle;
      var $target = $(target);
      var $param = schema.parseData($target.data());
      var toggler = $param.toggler;
      var trigger = $data.trigger || 'click';
      var key = $data.storage || '';
      $this.on(trigger, function () {
        if (toggler) {
          $target.toggleClass(toggler);
        } else if ($data.toggler) {
          var togglers = $data.toggler.trim().split(/\s*,\s*/);
          var entries = target.trim().replace(/\s*,$/, '').split(/\s*,\s*/);
          entries.forEach(function (entry, index) {
            toggler = togglers[index] || toggler;
            $(entry).toggleClass(toggler);
          });
          toggler = '';
        }
        if (key && window.localStorage) {
          var value = localStorage.getItem(key) === 'true' ? 'false' : 'true';
          localStorage.setItem(key, value);
        }
      });
      if (key && window.localStorage && $data.init) {
        if (localStorage.getItem(key) === 'true') {
          $this.trigger(trigger.replace(/\s.*$/, ''));
          localStorage.setItem(key, 'true');
        }
      }
    });
  };

  // Autoplay event with a specific interval
  schema.autoplay = function (event, options) {
    var selector = schema.events.autoplay.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $inputs = $this.children('input[type=radio]');
      var $div = $this.find('ol').last();
      var $links = $div.find('a,label');
      var state = $links.first().attr('class');
      var interval = (+$data.autoplay - 1) || 5000;
      var length = $links.length;
      var index = 1;
      window.setInterval(function () {
        if (!$this.find('a:hover,label:hover').length) {
          var $link = $links.eq(index);
          if ($link.is('a')) {
            window.location.hash = $link.attr('href');
          } else {
            $inputs.eq(index).prop('checked', true);
          }
          $link.click();
        }
      }, interval);
      $links.on('click', function () {
        $links.removeClass(state);
        $(this).addClass(state);
        index = ($links.index(this) + 1) % length;
      });
    });
  };

  // Dismiss any alert inline.
  schema.dismiss = function (event, options) {
    var selector = schema.events.dismiss.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var interval = (+$data.dismiss - 1) || 0;
      $this.one('click', function () {
        $this.parent().remove();
      });
      if (interval > 0) {
        window.setTimeout(function () {
          $this.click();
        }, interval);
      }
    });
  };

  // Extract data from text contents
  schema.extract = function (event, options) {
    var selector = schema.events.extract.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var tags = $data.extract.split(/\s*\,\s*/);
      if (tags.indexOf('url') !== -1) {
        var url = /\b(https?|ftp)\:\/\/[^\s\"]+(\/|\b)/g;
        $this.html($this.html().replace(url, function (str) {
          return schema.format('<a href="${href}">${href}</a>', {href: str});
        }));
      }
      if (tags.indexOf('emoji') !== -1 && $data.emoji) {
        var emoji = /(^|[^\w\"\'\`])(\:([\w\-]+)\:)/g;
        $this.html($this.html().replace(emoji, function (str, p1, p2, p3) {
          var template = '${sep}<img src="${src}" height=${height} alt="${alt}" title="${title}" />';
          return schema.format(template, {
            sep: p1,
            src: $data.emoji.replace(/\/*$/, '/') + p3.replace(/\_/g, '-') + '.svg',
            height: Math.round(+$this.css('font-size').slice(0, -2) * 1.4),
            alt: p2,
            title: p3
          });
        }));
      }
    });
  };

  // Format strings with positional parameters
  schema.format = function (template, data) {
    var string = String(template);
    var type = Object.prototype.toString.call(data).slice(8, -1);
    if (type === 'Object') {
      string.match(/\$\{[^\{\}]+\}/g).forEach(function (placeholder, index) {
        var key = placeholder.replace(/^\$\{\s*(.+)\s*\}$/, '$1');
        var value = data;
        key.replace(/\[([^\]]+)\]/g, '.$1').split('.').every(function (key) {
          if (typeof value === 'object') {
            if (value.hasOwnProperty(key)) {
              value = value[key];
              return true;
            }
          }
          return false;
        });
        if (typeof value !== 'object') {
          string = string.replace(placeholder, function () {
            return value;
          });
        }
      });
    }
    return string;
  };

  // Parse a URL into an object
  schema.parseURL = function (url) {
    var a =  document.createElement('a');
    a.href = url.replace(/([^:])\/{2,}/g, '$1/').replace(/\+/g, ' ');
    return {
      href: a.href,
      origin: a.origin,
      protocol: a.protocol,
      username: a.username,
      password: a.password,
      host: a.host,
      hostname: a.hostname,
      port: a.port,
      path: a.pathname + a.search,
      pathname: a.pathname,
      segments: a.pathname.replace(/^\/+/, '').split('/'),
      search: a.search,
      query: (function () {
        var object = {};
        var string = a.search.replace(/(^\?&?)|(&$)/g, '');
        if (string.indexOf('=') === -1) {
          return string;
        }
        string.split(/&+/).forEach(function (entry) {
          var entries = decodeURIComponent(entry).split('=');
          var key = entries[0];
          var value = entries[1];
          if (object.hasOwnProperty(key)) {
            value = [].concat(object[key], value);
          }
          object[key] = value;
        });
        return object;
      })(),
      hash: a.hash,
      fragment: a.hash.replace(/^#/, '')
    };
  };

})(jQuery);
