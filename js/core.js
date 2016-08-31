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
      if ($_data.type === undefined) {
        $_data.type = $_name;
      }
      if ($_data.selector === undefined) {
        $_data.selector = selector.replace(/\-(\w+)\]$/, '-' + $_name + ']');
      }
      if ($_name) {
        var $_event = $.extend({}, object, $_data, $_options);
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
