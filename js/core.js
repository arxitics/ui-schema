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
