/*!
 * Utilities
 */

(function ($) {
  'use strict';

  // Trim white spaces between inline blocks
  schema.trim = function (event, options) {
    var selector = schema.events.trim.selector;
    var $elements = $(options && options.selector || selector);
    $elements.contents().filter(function () {
      return this.nodeType === 3;
    }).remove();
  };

  // Toggle a CSS class
  schema.toggle = function (event, options) {
    var storage = schema.storage;
    var selector = schema.events.toggle.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var target = $data.toggle;
      var $target = (target === 'next') ? $this.next() : $(target);
      var $param = schema.parseData($target.data());
      var toggler = $param.toggler;
      var trigger = $data.trigger || 'click';
      var item = $data.storage || '';
      $this.on(trigger, function () {
        if ($data.toggler) {
          var togglers = $data.toggler.trim().split(/\s*,\s*/);
          var entries = target.trim().replace(/\s*,$/, '').split(/\s*,\s*/);
          entries.forEach(function (entry, index) {
            toggler = togglers[index] || toggler;
            $(entry).toggleClass(toggler);
          });
          toggler = '';
        } else if (toggler) {
          $target.toggleClass(toggler);
        }
        if (item) {
          var value = storage.get(item) === true ? false : true;
          storage.set(item, value);
        }
      });
      if (item && $data.init) {
        if (storage.get(item) === true) {
          $this.trigger(trigger.replace(/\s.*$/, ''));
          storage.set(item, true);
        }
      }
    });
  };

  // Autoplay event with a specific interval
  schema.autoplay = function (event, options) {
    var selector = schema.events.autoplay.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $inputs = $this.children('input[type=radio]');
      var $ol = $this.find('ol').last();
      var $links = $ol.find('a,label');
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

  // Dismiss any alert inline
  schema.dismiss = function (event, options) {
    var selector = schema.events.dismiss.selector;
    var $elements = $(options && options.selector || selector);
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
    var regexp = schema.regexp;
    var selector = schema.events.extract.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var tags = $data.extract.split(/\s*\,\s*/);
      if (tags.indexOf('url') !== -1) {
        var url = regexp.url;
        $this.html($this.html().replace(url, function (str) {
          return schema.format('<a href="${href}">${href}</a>', {href: str});
        }));
      }
      if (tags.indexOf('emoji') !== -1 && $data.emoji) {
        var emoji = regexp.emoji;
        var $emoji = $data.emoji.replace(/\/*$/, '/');
        var $height = Math.round(+$this.css('font-size').slice(0, -2) * 1.4);
        $this.html($this.html().replace(emoji, function (str, p1, p2, p3) {
          var template = '${sep}<img src="${src}" height=${height} alt="${alt}" title="${title}" />';
          return schema.format(template, {
            sep: p1,
            src: $emoji + p3.replace(/\_/g, '-') + '.svg',
            height: $height,
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
    if ($.isPlainObject(data)) {
      var placeholder = schema.regexp.placeholder;
      var matches = string.match(placeholder) || [];
      matches.forEach(function (str) {
        var key = str.replace(placeholder, '$1');
        var value = schema.get(data, key);
        if (!$.isPlainObject(value)) {
          string = string.replace(str, function () {
            return value;
          });
        }
      });
    }
    return string;
  };

  // Set a key-value pair for the object
  schema.set = function (object, key, value) {
    if ($.isPlainObject(object)) {
      var keys = String(key).replace(/\[([^\]]+)\]/g, '.$1').split('.');
      var last = keys.pop();
      var pair = object;
      keys.forEach(function (key) {
        pair[key] = ($.isPlainObject(pair) ? pair[key] : null ) || {};
        pair = pair[key];
      });
      pair[last] = value;
    }
    return object;
  };

  // Get a key-value pair from the object
  schema.get = function (object, key) {
    var value = object;
    if ($.isPlainObject(object)) {
      var keys = String(key).replace(/\[([^\]]+)\]/g, '.$1').split('.');
      keys.every(function (key) {
        if ($.isPlainObject(value)) {
          if (value.hasOwnProperty(key)) {
            value = value[key];
            return true;
          }
        }
        return false;
      });
    }
    return value;
  };

  // Determine if two objects or two values are equivalent
  schema.equals = function (object1, object2) {
    if (object1 === object2) {
      return true;
    }
    if (object1 === null || object2 === null) {
      return false;
    }
    if ($.type(object1) === $.type(object2)) {
      if ($.isPlainObject(object1)) {
        if (Object.keys(object1).length !== Object.keys(object2).length) {
          return false;
        }
        for (var key in object1) {
          if (object1.hasOwnProperty(key)) {
            if (!schema.equals(object1[key], object2[key])) {
              return false;
            }
          }
        }
        return true;
      } else if (Array.isArray(object1)) {
        if (object1.length !== object2.length) {
          return false;
        }
        return object1.every(function (value, index) {
          return schema.equals(value, object2[index]);
        });
      }
      return object1.toString() === object2.toString();
    }
    return false;
  };

  // Parses a URL into an object
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

  // Wrapper for localStorage
  schema.storage = {
    set: function (key, value, options) {
      if (options && options.expires) {
        value = {
          value: value,
          expires: new Date(options.expires)
        };
      }
      localStorage.setItem(this.item(key, options), this.stringify(value));
    },
    get: function (key, options) {
      var value = this.parse(localStorage.getItem(this.item(key, options)));
      if ($.isPlainObject(value) && value.hasOwnProperty('value')) {
        if (value.hasOwnProperty('expires')) {
          if (Date.now() > value.expires.getTime()) {
            this.remove(key, options);
            value = undefined;
          } else {
            value = value.value;
          }
        }
      }
      return value;
    },
    remove: function (key, options) {
      localStorage.removeItem(this.item(key, options));
    },
    item: function (key, options) {
      var prefix = (options && options.prefix) || schema.setup.dataPrefix;
      if (prefix.length) {
        prefix += '-';
      }
      return prefix + key.replace(/[A-Z]/g, function (char) {
        return '-' + char.toLowerCase();
      });
    },
    stringify: function (value) {
      var primitives = ['boolean', 'number', 'string', 'null'];
      var type = $.type(value);
      if (type === 'object') {
        for (var key in value) {
          if (value.hasOwnProperty(key)) {
            value[key] = this.stringify(value[key]);
          }
        }
      } else if (type === 'regexp') {
        return value.toString();
      } else if (primitives.indexOf(type) !== -1) {
        return value;
      }
      return JSON.stringify(value);
    },
    parse: function (value) {
      try {
        var type = $.type(value);
        if (type === 'string') {
          value = JSON.parse(value);
          if (type === 'object') {
            for (var key in value) {
              if (value.hasOwnProperty(key)) {
                value[key] = this.parse(this.stringify(value[key]));
              }
            }
          } else if (type === 'string') {
            var regexp = schema.regexp;
            if (regexp.date.test(value)) {
              value = new Date(value);
            } else if (regexp.syntax.test(value)) {
              var matches = value.match(regexp.syntax);
              value = new RegExp(matches[1], matches[2]);
            }
          }
        }
      } finally {
        return value;
      }
    }
  };

  // Regular expressions
  schema.regexp = {
    syntax: /^\/(.*)\/([gimuy]*)$/,
    delimiter: /(^\/)|(\/[gimuy]*$)/,
    ascii: /^[\x00-\x7F]+$/,
    segments: /^\s*([\w\-]+)(\s+.*\s+|[^\w\-]+)([\w\-]+)\s*$/,
    date: /^((\d{4})\-(\d{2})\-(\d{2}))T((\d{2})\:(\d{2})\:(\d{2}))(\.(\d{3}))?Z$/,
    emoji: /(^|[^\w\"\'\`])(\:([\w\-]+)\:)/g,
    placeholder: /\$\{\s*([^\{\}\s]+)\s*\}/g,
    url: /\b(ftp|https?|mailto|tel)\:\/\/[^\s\"]+(\/|\b)/g
  };

})(jQuery);
