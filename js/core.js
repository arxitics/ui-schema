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
