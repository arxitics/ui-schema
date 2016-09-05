/*!
 * UI Schema v0.4.2 (https://github.com/arxitics/ui-schema)
 * Copyright 2016 Arxitics <help@arxitics.com>
 * Licensed under MIT (https://github.com/arxitics/ui-schema/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('jQuery has not been loaded yet for context');
}

var schema = jQuery.isPlainObject(schema) ? schema : {};

(function ($) {
  'use strict';

  schema = $.extend(true, {
    // Default setup options
    setup: {
      classPrefix: 'ui',
      dataPrefix: 'schema',
      autoLoad: true,
      autoBind: '.schema',
      autoTrigger: '.schema'
    },
    // Register schema events
    events: {
      bind: {
        type: 'bind',
        namespace: 'event.data-api.schema',
        selector: '[data-schema-event]'
      },
      retrieve: {
        type: 'retrieve',
        namespace: 'options.data-api.schema',
        selector: '[data-schema-options]'
      },
      validate: {
        type: 'validate',
        namespace: 'form.data-api.schema',
        selector: 'form[data-schema-validate]'
      },
      lazyload: {
        type: 'lazyload',
        namespace: 'image.data-api.schema',
        selector: 'img[data-schema-lazyload]'
      },
      sprite: {
        type: 'sprite',
        namespace: 'icon.svg.data-api.schema',
        selector: 'i[data-schema-icon]'
      },
      trim: {
        type: 'trim',
        namespace: 'text-node.dom.data-api.schema',
        selector: 'body [data-schema-trim]'
      },
      extract: {
        type: 'extract',
        namespace: 'dom.data-api.schema',
        selector: 'body [data-schema-extract]'
      },
      dismiss: {
        type: 'dismiss',
        namespace: 'dom.data-api.schema',
        selector: 'body [data-schema-dismiss]'
      },
      autoplay: {
        type: 'autoplay',
        namespace: 'dom.data-api.schema',
        selector: '[data-schema-autoplay]'
      },
      toggle: {
        type: 'toggle',
        namespace: 'class.data-api.schema',
        selector: '[data-schema-toggle]'
      }
    }
  }, schema);

  $(function () {
    if (schema.setup.autoLoad && schema.load) {
      schema.load();
    }
  });

})(jQuery);

/*!
 * Core
 */

(function ($) {
  'use strict';

  // Create a new schema object
  schema.create = function (options) {
    this.setup = $.extend({}, schema.setup, options);
    return Object.create(schema);
  };

  // Load schema events
  schema.load = function (options) {
    var events = $.extend({}, schema.events, options);
    for (var key in events) {
      if (events.hasOwnProperty(key)) {
        schema.delegate(events[key], options);
      }
    }
  };

  // Delegate an event
  schema.delegate = function (event, options) {
    var type = event.type;
    var name = type + event.namespace;
    var delegation = event.delegation;
    if (typeof delegation !== 'number') {
      var setup = (options && options.setup) || schema.setup;
      var bindings = setup.autoBind.split(' ');
      var triggers = setup.autoTrigger.split(' ');
      var phrases = name.replace(/^\./, '').split('.');

      delegation = bindings.some(function (binding) {
        var keywords = binding.replace(/^\./, '').split('.');
        return keywords.every(function (keyword) {
          return phrases.indexOf(keyword) !== -1;
        });
      }) ? 2 : 0;
      delegation += triggers.some(function (trigger) {
        var keywords = trigger.replace(/^\./, '').split('.');
        return keywords.every(function (keyword) {
          return phrases.indexOf(keyword) !== -1;
        });
      }) ? 1 : 0;
      event.delegation = delegation;
    }
    if (delegation > 1) {
      var handler = schema[type] || function () {};
      $(document).on(name, handler);
      if (delegation > 2) {
        $(document).trigger(name, event.options);
      }
    }
  };

  // Parse and normalize schema data
  schema.parseData = function (data, options) {
    var output = {};
    var prefix = (options && options.prefix) || schema.setup.dataPrefix;
    var length = prefix && prefix.length || 0;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var index = key.slice(length);
        var value = data[key];
        index = index.replace(/^[A-Z]/, function (substr) {
          return substr.toLowerCase();
        });
        output[index] = (value === '' ? true : value);
      }
    }
    return output;
  };

  // Parse and normalize schema options
  schema.parseOptions = function (input, options) {
    var output = {};
    var object = {};
    var prefix = options && options.prefix || '';
    var type = Object.prototype.toString.call(input).slice(8, -1);
    if (type === 'Object') {
      object = input;
    } else if (type === 'String') {
      try {
        object = JSON.parse(input);
      } catch (error) {
        if (input.indexOf(':') !== -1) {
          var entries = input.trim().replace(/\s*;$/, '').split(/\s*;\s*/);
          var pattern = /(\S+)\s*:\s*(.*)/;
          entries.filter(function (entry) {
            return pattern.test(entry);
          }).forEach(function (entry) {
            var matches = entry.match(pattern);
            var key = matches[1].toLowerCase();
            var value = matches[2].replace(/\,/g, ' ').trim();
            if (value.search(/\s+/) !== -1) {
              value = value.split(/\s+/);
            }
            object[key] = value;
          });
        }
      }
    }
    if (prefix && prefix.length) {
      prefix += '-';
    }
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        var index = prefix + key;
        index = index.replace(/\-\w/g, function (substr) {
          return substr.charAt(1).toUpperCase();
        });
        output[index] = object[key];
      }
    }
    return output;
  };

  // Bind schema events
  schema.bind = function (event, options) {
    var object = schema.events.bind;
    var selector = object.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var $_options = schema.parseOptions($_data.options);
      var $_name = $_data.event;
      if ($_name) {
        var defaults = {
          type: $_name,
          selector: selector.replace(/\-(\w+)\]$/, '-' + $_name + ']'),
          target: $_this
        };
        var $_event = $.extend({}, object, defaults, $_data, $_options);
        schema.events[$_name] = $_event;
        schema.delegate($_event);
      }
    });
  };

  // Retrieve schema event options and store as event data
  schema.retrieve = function (event, options) {
    var selector = schema.events.retrieve.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var $_options = schema.parseOptions($_data.options, {
        prefix: schema.setup.dataPrefix
      });
      for (var key in $_options) {
        if ($_options.hasOwnProperty(key)) {
          $_this.data(key, $_options[key]);
        }
      }
    });
  };

})(jQuery);

/*!
 * Forms
 */

(function ($) {
  'use strict';

  // Validate user input
  schema.validate = function (event, options) {
    var selector = schema.events.validate.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var validate = $_data.validate;
      $_this.find(':input').one('change', function () {
        $_this.data('changed', true);
      });
      $_this.on('submit', function (event) {
        var $_form = $(this);
        var validated = (validate === 'changed') ? $_form.data('changed') : true;
        if (validated) {
          $_form.find('input, textarea').each(function () {
            var $_input = $(this);
            var value = $_input.val().toString().trim();
            if (value === '') {
              $_input.prop('disabled', true).data('disabled', true);
            }
          });
          if (validate === 'once') {
            $_this.find(':submit').prop('disabled', true);
          }
          $_form.submit();
        } else if (validated === undefined) {
          history.back();
        }
        event.preventDefault();
      });
      $_this.on('reset', function (event) {
        var $_form = $(this);
        $_form.find('input, textarea').each(function () {
          var $_input = $(this);
          if ($_input.data('disabled')) {
            $_input.prop('disabled', false).data('disabled', false);
          }
        });
        return true;
      });
    });
  };

})(jQuery);

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

/*!
 * Utilities
 */

(function ($) {
  'use strict';

  // Trim white spaces between inline blocks
  schema.trim = function (event, options) {
    var selector = schema.events.trim.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.contents().filter(function () {
      return this.nodeType === 3;
    }).remove();
  };

  // Toggle a CSS class
  schema.toggle = function (event, options) {
    var selector = schema.events.toggle.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var target = $_data.toggle;
      var $_target = $(target);
      var $_param = schema.parseData($_target.data());
      var toggler = $_param.toggler;
      var events = $_data.trigger || 'click';
      var key = $_data.storage || '';
      $_this.on(events, function () {
        if (toggler) {
          $_target.toggleClass(toggler);
        } else if ($_data.toggler) {
          var togglers = $_data.toggler.trim().split(/\s*,\s*/);
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
      if (key && window.localStorage && $_data.init) {
        if (localStorage.getItem(key) === 'true') {
          $_this.trigger(events);
          localStorage.setItem(key, 'true');
        }
      }
    });
  };

  // Autoplay event with a specific interval
  schema.autoplay = function (event, options) {
    var selector = schema.events.autoplay.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var $_inputs = $_this.children('input[type=radio]');
      var $_div = $_this.find('div').last();
      var $_links = $_div.find('a,label');
      var state = $_links.first().attr('class');
      var interval = (+$_data.autoplay - 1) || 5000;
      var length = $_links.length;
      var count = 1;
      window.setInterval(function () {
        var index = count % length;
        var $_link = $_links.eq(index);
        if (!$_this.find('a:hover,label:hover').length) {
          if ($_link.is('a')) {
            $_link.click();
            window.location.hash = $_link.attr('href');
          } else {
            $_inputs.eq(index).prop('checked', true);
          }
          $_links.removeClass(state);
          $_link.addClass(state);
          count++;
        }
      }, interval);
    });
  };

  // Dismiss any alert inline.
  schema.dismiss = function (event, options) {
    var selector = schema.events.dismiss.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var interval = (+$_data.dismiss - 1) || 0;
      $_this.one('click', function () {
        $_this.parent().remove();
      });
      if (interval > 0) {
        window.setTimeout(function () {
          $_this.click();
        }, interval);
      }
    });
  };

  // Extract data from text contents
  schema.extract = function (event, options) {
    var selector = schema.events.extract.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var tags = $_data.extract.split(/\s*\,\s*/);
      if (tags.indexOf('url') !== -1) {
        var url = /\b(https?|ftp)\:\/\/[^\s\"]+(\/|\b)/g;
        $_this.html($_this.html().replace(url, function (str) {
          return schema.format('<a href="${href}">${href}</a>', {href: str});
        }));
      }
      if (tags.indexOf('emoji') !== -1 && $_data.emoji) {
        var emoji = /(^|[^\w\"\'\`])(\:([\w\-]+)\:)/g;
        $_this.html($_this.html().replace(emoji, function (str, p1, p2, p3) {
          var template = '${sep}<img src="${src}" height=${height} alt="${alt}" title="${title}" />';
          return schema.format(template, {
            sep: p1,
            src: $_data.emoji.replace(/\/*$/, '/') + p3.replace(/\_/g, '-') + '.svg',
            height: Math.round(+$_this.css('font-size').slice(0, -2) * 1.4),
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
        if (data.hasOwnProperty(key)) {
          string = string.replace(placeholder, function () {
            return data[key];
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

/*!
 * Icons
 */

(function ($) {
  'use strict';

  // Create SVG icons
  schema.sprite = function (event, options) {
    var icons = schema.icons;
    var selector = schema.events.sprite.selector;
    var $_elements = $(selector).add(options && options.selector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var name = $_data.icon || 'unknown';
      var icon = icons[name] || icons.unknown;
      if (typeof icon === 'string') {
        icon = icons[icon];
      }

      var width = $_data.width || icon[0];
      var height = $_data.height || icon[1];
      var path = $_data.path || icon[2];
      var color = $_data.color || icon[3];
      var colorEnabled = $_data.colorEnabled;
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

      $_this.empty().append(svg);
    });
  };

  schema.icons = {
    'unknown': [32, 32, 'M1 1h31v31h-31zM3 3v27h27v-27z']
  };

})(jQuery);
