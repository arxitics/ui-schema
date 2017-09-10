/*!
 * UI Schema v0.4.5 (https://github.com/arxitics/ui-schema)
 * Copyright 2017 Arxitics <help@arxitics.com>
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
    // Data attributes
    data: {
      event: 'schema-event',
      namespace: 'schema-namespace',
      selector: 'schema-selector',
      options: 'schema-options',
      animation: 'schema-animation',
      model: 'schema-model',
      value: 'schema-value',
      text: 'schema-text',
      adapter: 'schema-adapter',
      controller: 'schema-controller',
      trigger: 'schema-trigger',
      init: 'schema-init',
      empty: 'schema-empty',
      view: 'schema-view',
      template: 'schema-template',
      snapshot: 'schema-snapshot',
      condition: 'schema-condition',
      iteration: 'schema-itration',
      target: 'schema-target',
      loader: 'schema-loader',
      route: 'schema-route',
      validate: 'schema-validate',
      changed: 'schema-changed',
      disabled: 'schema-disabled',
      rating: 'schema-rating',
      score: 'schema-score',
      icons: 'schema-icons',
      lazyload: 'schema-lazyload',
      delay: 'schema-delay',
      src: 'schema-src',
      magnify: 'schema-magnify',
      shape: 'schema-shape',
      trim: 'schema-trim',
      toggle: 'schema-toggle',
      toggler: 'schema-toggler',
      storage: 'schema-storage',
      autoplay: 'schema-autoplay',
      dismiss: 'schema-dismiss',
      extract: 'schema-extract',
      emoji: 'schema-emoji',
      icon: 'schema-icon',
      width: 'schema-width',
      height: 'schema-height',
      path: 'schema-path',
      color: 'schema-color'
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
      route: {
        type: 'route',
        namespace: '.navigation.data-api.schema',
        selector: 'a[data-schema-route]'
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
      magnify: {
        type: 'magnify',
        namespace: '.image.data-api.schema',
        selector: 'img[data-schema-magnify]'
      },
      sprite: {
        type: 'sprite',
        namespace: '.icon.svg.data-api.schema',
        selector: 'i[data-schema-icon]'
      },
      trim: {
        type: 'trim',
        namespace: '.text.dom.data-api.schema',
        selector: '[data-schema-trim]'
      },
      copy: {
        type: 'copy',
        namespace: '.text.dom.data-api.schema',
        selector: '[data-schema-copy]'
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
    if ($.type(delegation) !== 'number') {
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
      $(document).on(name, schema[type]);
      if (delegation > 2) {
        schema.trigger(name, event.options);
      }
    }
  };

  // Trigger an event attached to the document
  schema.trigger = function (event, options) {
    var name = event;
    var type = $.type(options);
    var data = {};
    if ($.type(event) === 'object') {
      name = event.type + event.namespace;
    }
    if (type === 'string' || type === 'object' && options.jquery) {
      data.selector = options;
    } else {
      data = options;
    }
    $(document).trigger(name, data);
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
    var type = $.type(input);
    if (type === 'object') {
      object = input;
    } else if (type === 'string') {
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
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $options = schema.parseOptions($data.options);
      String($data.event).split(/\s+/).forEach(function (type) {
        var defaults = {
          type: type,
          selector: selector.replace(/\-(\w+)\]$/, '-' + type + ']'),
          target: $this
        };
        var $event = $.extend({}, bind, defaults, $data, $options);
        schema.events[type] = $event;
        schema.delegate($event, $options);
      });
    });
  };

  // Retrieve schema event options and store as event data
  schema.retrieve = function (event, options) {
    var params = { prefix: schema.setup.dataPrefix };
    var selector = schema.events.retrieve.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $options = schema.parseOptions($data.options, params);
      for (var key in $options) {
        if ($options.hasOwnProperty(key)) {
          $this.data(key, $options[key]);
        }
      }
    });
  };

  // Observe a model and update the view
  schema.observe = function (event, options) {
    var events = schema.events;
    var models = schema.models;
    var selector = events.observe.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var trigger = $data.trigger;
      if (trigger) {
        var model = $data.model;
        var adapter = $data.adapter;
        var controller = $data.controller;
        var value = $data.value || null;
        var text = value || $data.text;
        var init = $data.init || null;
        var empty = $data.empty || false;
        $this.on(trigger, function () {
          value = $this.val() || $this.text();
          if (empty) {
            if (text) {
              $this.text('');
            } else if (value) {
              $this.val('');
            }
          }
          if (adapter) {
            value = schema[adapter](value, $this);
          }
          schema.set(models, model, value);
          if (controller) {
            $.extend(models, schema[controller](models, $this));
          }
          schema.trigger(events.render);
        });
        if (init || (text && init !== false)) {
          if (value) {
            $this.val(value);
          } else {
            $this.text(text);
          }
          $this.trigger(trigger.replace(/\s.*$/, ''));
        }
      }
    });
  };

  // Render a partial view
  schema.render = function (event, options) {
    var data = schema.data;
    var events = schema.events;
    var models = schema.models;
    var template = data.template;
    var snapshot = data.snapshot;
    var selector = events.render.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var animation = $data.animation;
      var controller = $data.controller;
      var condition = $data.condition;
      var iteration = $data.iteration;
      var adapter = $data.adapter;
      var view = $data.view;
      var $template = $data.template;
      var $cache = $this.html();
      var $html = '';
      var ready = true;
      var changed = false;
      if ($template === undefined) {
        $template = $cache;
        $this.data(template, $template);
      }
      if (controller) {
        models = $.extend({}, models, schema[controller](models, $this));
      }
      if ($.type(view) === 'string') {
        var $snapshot = $data.snapshot || {};
        ready = view.split(/\s*\,\s*/).every(function (view) {
          if (models.hasOwnProperty(view)) {
            var value = schema.get(models, view);
            var $value = schema.get($snapshot, view);
            if (!schema.equals(value, $value)) {
              schema.set($snapshot, view, value);
              changed = true;
            }
            return true;
          }
          return false;
        });
        if (changed) {
          $snapshot.updated = Date.now();
          $this.data(snapshot, $.extend(true, {}, $snapshot));
        }
      }
      if (ready && (!condition || schema.get(models, condition) === true)) {
        if (changed || adapter) {
          if (iteration) {
            var segments = schema.regexp.segments;
            var matches = String(iteration).match(segments);
            if (matches) {
              var name = matches[1];
              var list = matches[3];
              var entries = schema.get(models, list);
              if (Array.isArray(entries)) {
                if (adapter) {
                  entries = schema[adapter](entries, $this);
                }
                entries.forEach(function (entry) {
                  schema.set(models, name, entry);
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
                var $bindings = $this.find(event.selector);
                if ($bindings.length) {
                  schema.trigger(event);
                }
              }
            }
          }
        }
        $this.css('visibility', 'visible');
        $this.show();
      } else {
        $this.css('visibility', 'hidden');
        $this.hide(animation);
      }
    });
  };

  // Insert the content of a template
  schema.insert = function (event, options) {
    var events = schema.events;
    var selector = events.insert.selector;
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $html = $this.html();
      var $target = $($data.target);
      var loader = $data.loader;
      if (loader) {
        $.when(schema[loader]($this)).done(function (data) {
          $html = $.isPlainObject(data) ? schema.format($html, data) : data;
          $target.append($html);
          for (var key in events) {
            if (events.hasOwnProperty(key)) {
              var event = events[key];
              var $bindings = $target.find(event.selector);
              if ($bindings.length) {
                schema.trigger(event, $bindings);
              }
            }
          }
        }).fail(function () {
          throw new Error('Schema fails to instantiate the template');
        });
      } else if ($html) {
        $target.html($html);
      }
    });
  };

  // Hash-based routing
  schema.route = function (event, options) {
    var data = schema.data;
    var route = data.route;
    var changed = data.changed;
    var selector = schema.events.route.selector;
    var $elements = $(options && options.selector || selector);
    var hash = window.location.hash || '#';
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $route = $data.route;
      if ($.type($route) === 'boolean') {
        $route = $this.attr('href') || '';
      }
      if ($.type($route) === 'string') {
        $route = $route.replace(/\:\w+/g, '(\\w+)').replace(/\/?$/, '/?$');
        $this.data(route, $route);
        $route = new RegExp($route);
      }
      if ($.type($route) === 'regexp' && $route.test(hash)) {
        $this.click();
      }
      $this.on('click', function () {
        $this.data(changed, false);
      });
    });
    $(window).on('hashchange', function () {
      var hash = window.location.hash || '#';
      $elements.each(function () {
        var $this = $(this);
        var $data = schema.parseData($this.data());
        var $route = $data.route;
        if ($.type($route) === 'string') {
          $route = new RegExp($route);
        }
        if ($.type($route) === 'regexp' && $route.test(hash) && $data.changed) {
          $this.click();
        } else {
          $this.data(changed, true);
        }
      });
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

/*!
 * Images
 */

(function ($) {
  'use strict';

  // Defer image loading until it becomes visible on the screen
  schema.lazyload = function (event, options) {
    var selector = schema.events.lazyload.selector;
    var $elements = $(options && options.selector || selector);
    $(window).on('scroll', function () {
      var $window = $(this);
      var top = $window.height() + $window.scrollTop();
      $elements.each(function () {
        var $this = $(this);
        var $data = schema.parseData($this.data());
        var srcset = $this.attr('srcset') || '';
        var src = $data.src || srcset.split(' ')[0];
        if (src !== $this.attr('src')) {
          var lazyload = (+$data.lazyload - 1) || 200;
          var distance = $this.offset().top - top;
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

  // Copy a string to clipboard
  schema.copy = function (event, options) {
    var selector = schema.events.copy.selector;
    var $elements = $(options && options.selector || selector);
    var dataString = '';
    $elements.on('click', function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var $target = $($data.target || $this.next());
      dataString = $target.text();
      document.execCommand('copy');
    });
    document.addEventListener('copy', function (event) {
      event.clipboardData.setData('text/plain', dataString);
      event.preventDefault();
    });
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
      window.localStorage.setItem(this.item(key, options), this.stringify(value));
    },
    get: function (key, options) {
      var value = this.parse(window.localStorage.getItem(this.item(key, options)));
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
      window.localStorage.removeItem(this.item(key, options));
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
    url: /\b((ftp|https?)\:\/\/|(mailto|tel)\:)[^\s\"]+(\/|\b)/g
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
    var $elements = $(options && options.selector || selector);
    $elements.each(function () {
      var $this = $(this);
      var $data = schema.parseData($this.data());
      var animation = $data.animation || false;
      var name = $data.icon || 'unknown';
      var icon = icons[name] || icons.unknown;
      if ($.type(icon) === 'string') {
        icon = icons[icon];
      }

      var width = $data.width || icon[0];
      var height = $data.height || icon[1];
      var path = $data.path || icon[2];
      var color = $data.color || icon[3];

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
          if(color && color !== 'unset') {
            element.setAttribute('fill', Array.isArray(color) ? color[index] : color);
          }
          element.setAttribute('d', segment);
          svg.appendChild(element);
        });
      } else {
        var element = document.createElementNS(namespace, 'path');
        if (color && color !== 'unset') {
          element.setAttribute('fill', color);
        }
        element.setAttribute('d', path);
        svg.appendChild(element);
      }
      if (!$this.html() && animation) {
        $this.hide().html(svg).show(animation);
      } else {
        $this.html(svg);
      }
    });
  };

  schema.icons = {
    'unknown': [32, 32, 'M1 1h31v31h-31zM3 3v27h27v-27z']
  };

})(jQuery);
