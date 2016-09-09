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
        namespace: '.event.data-api.schema',
        selector: '[data-schema-event]'
      },
      retrieve: {
        type: 'retrieve',
        namespace: '.options.data-api.schema',
        selector: '[data-schema-options]'
      },
      observe: {
        type: 'observe',
        namespace: '.model.data-api.schema',
        selector: '[data-schema-model]'
      },
      render: {
        type: 'render',
        namespace: '.view.data-api.schema',
        selector: '[data-schema-view]'
      },
      insert: {
        type: 'insert',
        namespace: '.template.data-api.schema',
        selector: 'template[data-schema-target]'
      },
      validate: {
        type: 'validate',
        namespace: '.form.data-api.schema',
        selector: 'form[data-schema-validate]'
      },
      rating: {
        type: 'rating',
        namespace: '.form.data-api.schema',
        selector: 'form[data-schema-rating]'
      },
      lazyload: {
        type: 'lazyload',
        namespace: '.image.data-api.schema',
        selector: 'img[data-schema-lazyload]'
      },
      sprite: {
        type: 'sprite',
        namespace: '.icon.svg.data-api.schema',
        selector: 'i[data-schema-icon]'
      },
      trim: {
        type: 'trim',
        namespace: '.text-node.dom.data-api.schema',
        selector: '[data-schema-trim]'
      },
      extract: {
        type: 'extract',
        namespace: '.dom.data-api.schema',
        selector: '[data-schema-extract]'
      },
      dismiss: {
        type: 'dismiss',
        namespace: '.dom.data-api.schema',
        selector: '[data-schema-dismiss]'
      },
      autoplay: {
        type: 'autoplay',
        namespace: '.dom.data-api.schema',
        selector: '[data-schema-autoplay]'
      },
      toggle: {
        type: 'toggle',
        namespace: '.class.data-api.schema',
        selector: '[data-schema-toggle]'
      }
    },
    models: {}
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
    var bind = schema.events.bind;
    var selector = bind.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $options = schema.parseOptions($data.options);
      var $type = $data.event;
      if ($type) {
        var defaults = {
          type: $type,
          selector: selector.replace(/\-(\w+)\]$/, '-' + $type + ']'),
          target: $this
        };
        var $event = $.extend({}, bind, defaults, $data, $options);
        schema.events[$type] = $event;
        schema.delegate($event);
      }
    });
  };

  // Retrieve schema event options and store as event data
  schema.retrieve = function (event, options) {
    var selector = schema.events.retrieve.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $options = schema.parseOptions($data.options, {
        prefix: schema.setup.dataPrefix
      });
      for (var key in $options) {
        if ($options.hasOwnProperty(key)) {
          $this.data(key, $options[key]);
        }
      }
    });
  };

  // Observe a model and update the view
  schema.observe = function (event, options) {
    var models = schema.models;
    var render = schema.events.render;
    var renderName = render.type + render.namespace;
    var selector = schema.events.observe.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var model = $data.model;
      var parser = $data.parser;
      var controller = $data.controller;
      var trigger = $data.trigger || 'change click keyup';
      var value = $data.value || null;
      var text = value || $data.text;
      $this.on(trigger, function () {
        value = $this.val() || $this.text();
        if (parser) {
          value = schema[parser](value);
        }
        models[model] = value;
        if (controller) {
          models = $.extend(models, schema[controller](models));
        }
        $(document).trigger(renderName);
      });
      if (text) {
        if (value) {
          $this.val(value);
        } else {
          $this.text(text);
        }
        $this.trigger(trigger.replace(/\s.*$/, ''));
      }
    });
  };

  // Render a partial view
  schema.render = function (event, options) {
    var models = schema.models;
    var events = schema.events;
    var selector = events.render.selector;
    var template = selector.replace(/^\[data\-|\]$/g, '');
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $template = $data.view;
      var controller = $data.controller;
      var conditional = $data.conditional;
      var iteration = $data.iteration;
      var $cache = $this.html();
      var $html = '';
      if ($template === true) {
        $template = $cache;
        $this.data(template, $template);
      }
      if (controller) {
        models = $.extend({}, models, schema[controller](models));
      }
      if (!conditional || models[conditional] === true) {
        if (iteration) {
          var pattern = /^\s*([\w\-]+)(\s+.*\s+|[^\w\-]+)([\w\-]+)\s*$/;
          var matches = String(iteration).match(pattern);
          if (matches) {
            var name = matches[1];
            var list = matches[3];
            var entries = models[list];
            if (Array.isArray(entries)) {
              entries.forEach(function (entry) {
                models[name] = entry;
                $html += schema.format($template, models);
              });
            }
          }
        } else {
          $html = schema.format($template, models);
        }
        if ($html !== $cache) {
          $this.html($html);
          for (var key in events) {
            if (events.hasOwnProperty(key)) {
              var event = events[key];
              if ($this.find(event.selector).length) {
                $(document).trigger(event.type + event.namespace);
              }
            }
          }
        }
      }
    });
  };

  // Insert the content of a template
  schema.insert = function (event, options) {
    var selector = schema.events.insert.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $html = $this.html();
      var target = $data.target;
      if (target && $html && !/\$\{[\w\-]+\}/.test($html)) {
        $(target).empty().append($html);
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
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var validate = $data.validate;
      $this.find(':input').one('change', function () {
        $this.data('changed', true);
      });
      $this.on('submit', function (event) {
        var $form = $(this);
        var validated = (validate === 'changed') ? $form.data('changed') : true;
        if (validated) {
          $form.find('input, textarea').each(function () {
            var $input = $(this);
            var value = $input.val().toString().trim();
            if (value === '') {
              $input.prop('disabled', true).data('disabled', true);
            }
          });
          if (validate === 'once') {
            $this.find(':submit').prop('disabled', true);
          }
          $form.submit();
        } else if (validated === undefined) {
          history.back();
        }
        event.preventDefault();
      });
      $this.on('reset', function (event) {
        var $form = $(this);
        $form.find('input, textarea').each(function () {
          var $input = $(this);
          if ($input.data('disabled')) {
            $input.prop('disabled', false).data('disabled', false);
          }
        });
        return true;
      });
    });
  };

  // Rating
  schema.rating = function (event, options) {
    var sprite = schema.events.sprite;
    var spriteName = sprite.type + sprite.namespace;
    var spriteIcon = sprite.selector.replace(/^i\[data\-|\]$/g, '');
    var selector = schema.events.rating.selector;
    var $elements = $(selector).add(options && options.selector);
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
          $icon.prevAll().addBack().data(spriteIcon, full);
          $icon.nextAll().data(spriteIcon, empty);
          $(document).trigger(spriteName);
        });
        $icon.on('click', function () {
          $parent.prev('input[type="hidden"]').val(index + 1);
          $form.submit();
        });
      });
      $parent.on('mouseleave', function () {
        $icons.slice(integer).data(spriteIcon, empty);
        if (integer > 0) {
          $icons.slice(0, integer).data(spriteIcon, full);
          if (half && Math.abs(rounding) > 0.25) {
            $icons.eq(Math.floor(score)).data(spriteIcon, half);
          }
        }
        $(document).trigger(spriteName);
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

/*!
 * Icons
 */

(function ($) {
  'use strict';

  // Create SVG icons
  schema.sprite = function (event, options) {
    var icons = schema.icons;
    var selector = schema.events.sprite.selector;
    var $elements = $(selector).add(options && options.selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var name = $data.icon || 'unknown';
      var icon = icons[name] || icons.unknown;
      if (typeof icon === 'string') {
        icon = icons[icon];
      }

      var width = $data.width || icon[0];
      var height = $data.height || icon[1];
      var path = $data.path || icon[2];
      var color = $data.color || icon[3];
      var colorEnabled = $data.colorEnabled;
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

      $this.empty().append(svg);
    });
  };

  schema.icons = {
    'unknown': [32, 32, 'M1 1h31v31h-31zM3 3v27h27v-27z']
  };

})(jQuery);
