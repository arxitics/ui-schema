/*!
 * UI Schema v0.3.3 (https://github.com/arxitics/ui-schema)
 * Copyright 2015 Arxitics <help@arxitics.com>
 * Licensed under MIT (https://github.com/arxitics/ui-schema/blob/master/LICENSE.txt)
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
      retrieve: {
        type: 'retrieve',
        namespace: '.options.data-api.schema',
        selector: '[data-schema-options]'
      },
      trim: {
        type: 'remove',
        namespace: '.white-space.text-node.schema',
        selector: '.ui-space-collapse'
      },
      extract: {
        type: 'create',
        namespace: '.dom.data-api.schema',
        selector: '[data-schema-extract]'
      },
      validate: {
        type: 'validate',
        namespace: '.form-validate.form.data-api.schema',
        selector: 'form[data-schema-validate]'
      },
      sprite: {
        type: 'create',
        namespace: '.icons.svg.data-api.schema',
        selector: 'i[data-schema-icon]'
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

  // Bind and trigger schema events
  schema.load = function (setup, events) {
    var schemaSetup = $.extend({}, schema.setup, setup);
    var schemaEvents = $.extend({}, schema.events, events);

    var schemaDataPrefix = schemaSetup.dataPrefix;
    var dataPrefix = schemaDataPrefix ? schemaDataPrefix + '-' : '';

    for (var key in schemaEvents) {
      if (schemaEvents.hasOwnProperty(key)) {
        var schemaFunction = schema[key];
        var eventObject = schemaEvents[key];
        var eventDelegation = eventObject.delegation;
        if (!eventObject.hasOwnProperty('delegation')) {
          eventDelegation = schema.delegate(eventObject);
          eventObject.delegation = eventDelegation;
        }
        if (eventDelegation > 1) {
          var eventName = eventObject.type + eventObject.namespace;
          $(document).on(eventName, schemaFunction);
          if (eventDelegation > 2) {
            $(document).trigger(eventName);
          }
        }
      }
    }
  };

  // Assign an integer as the delegation of an event
  schema.delegate = function (event) {
    var schemaSetup = schema.setup;
    var eventsBind = schemaSetup.autoBind.split(' ');
    var eventsTrigger = schemaSetup.autoTrigger.split(' ');
    var eventName = event.type + event.namespace;
    var eventArray = eventName.replace(/^\./, '').split('.');

    var eventDelegation = eventsBind.some(function (bindEvent) {
      var bindArray = bindEvent.replace(/^\./, '').split('.');
      return bindArray.every(function (eventKeyword) {
        return eventArray.indexOf(eventKeyword) !== -1;
      });
    }) ? 2 : 0;
    eventDelegation += eventsTrigger.some(function (triggerEvent) {
      var triggerArray = triggerEvent.replace(/^\./, '').split('.');
      return triggerArray.every(function(eventKeyword) {
        return eventArray.indexOf(eventKeyword) !== -1;
      });
    }) ? 1 : 0;

    return eventDelegation;
  };

  // Retrieve schema event options and store as event data
  schema.retrieve = function (event, options) {
    var eventSelector = schema.events.retrieve.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var schemaOptions = schema.parseOptions($_data.schemaOptions);
      for (var key in schemaOptions) {
        if (schemaOptions.hasOwnProperty(key)) {
          $_this.data(key, schemaOptions[key]);
        }
      }
    });
  };

  // Parse and normalize schema data
  schema.parseData = function (data) {
    var dataObject = {};
    var schemaDataPrefix = schema.setup.dataPrefix;
    var dataPrefixLength = schemaDataPrefix && schemaDataPrefix.length;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var dataKey = 'schema-' + key.slice(dataPrefixLength);
        var dataValue = data[key];
        dataKey = dataKey.replace(/\-\w/g, function (matchedSubstr) {
          return matchedSubstr.charAt(1).toUpperCase();
        });
        dataObject[dataKey] = (dataValue === '' ? true : dataValue);
      }
    }
    return dataObject;
  };

  // Parse and normalize schema options
  schema.parseOptions = function (options) {
    var optionsObject = {};
    var parsedOptionsObject = {};
    var schemaDataPrefix = schema.setup.dataPrefix;
    var optionsPrefix = schemaDataPrefix ? schemaDataPrefix + '-' : '';
    var optionsType = Object.prototype.toString.call(options).slice(8, -1);
    if (optionsType === 'Object') {
      optionsObject = options;
    }
    if (optionsType === 'String') {
      try {
        optionsObject = JSON.parse(options);
      } catch (parseError) {
        if (options.indexOf(':') !== -1) {
          options = options.trim().replace(/\s*;$/, '');
          options.split(/\s*;\s*/).forEach(function (keyValuePair) {
            var keyValueArray = keyValuePair.split(/\s*:\s*/);
            var optionKey = keyValueArray[0].toLowerCase();
            var optionValue = keyValueArray[1].replace(/\,/g, ' ').trim();
            if(optionValue.search(/\s+/) !== -1) {
              optionValue = optionValue.split(/\s+/);
            }
            optionsObject[optionKey] = optionValue;
          });
        }
      }
    }
    for (var key in optionsObject) {
      if (optionsObject.hasOwnProperty(key)) {
        var optionKey = optionsPrefix + key;
        optionKey = optionKey.replace(/\-\w/g, function (matchedSubstr) {
          return matchedSubstr.charAt(1).toUpperCase();
        });
        parsedOptionsObject[optionKey] = optionsObject[key];
      }
    }
    return parsedOptionsObject;
  };

})(jQuery);

/*!
 * Forms
 */

(function ($) {
  'use strict';

  // Validate user input
  schema.validate = function (event, options) {
    var eventSelector = schema.events.validate.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var validateOption = $_data.schemaValidate;
      var requireChanged = (validateOption === 'changed');
      $_this.find(':input').one('change', function () {
        $_this.data('changed', true);
      });
      $_this.on('submit', function (event) {
        var $_form = $(this);
        var validated = (requireChanged) ? $_form.data('changed') : true;
        if (validated) {
          $_form.find('input, textarea').each(function () {
            var $_input = $(this);
            var value = $_input.val().toString().trim();
            if (value === '') {
              $_input.prop('disabled', true).data('disabled', true);
            }
          });
          if (validateOption === 'once') {
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
 * Utilities
 */

(function ($) {
  'use strict';

  // Trim white spaces between inline blocks
  schema.trim = function (event, options) {
    var eventSelector = schema.events.trim.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.contents().filter(function () {
      return this.nodeType === 3;
    }).remove();
  };

  // Extract data from text contents
  schema.extract = function (event, options) {
    var eventSelector = schema.events.extract.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var extractOption = $_data.schemaExtract;
      if (extractOption === 'url') {
        var urlPattern = /\b(https?|ftp)\:\/\/[^\s\"]+(\/|\b)/g;
        $_this.html($_this.html().replace(urlPattern, function (url) {
          return '<a href="' + url + '">' + url + '</a>';
        }));
      }
    });
  };

  // Parse a URL into an object
  schema.parseURL = function (url) {
    var anchor =  document.createElement('a');
    anchor.href = url.replace(/([^:])\/{2,}/g, '$1/').replace(/\+/g, ' ');
    return {
      href: anchor.href,
      origin: anchor.origin,
      protocol: anchor.protocol,
      username: anchor.username,
      password: anchor.password,
      host: anchor.host,
      hostname: anchor.hostname,
      port: anchor.port,
      path: anchor.pathname + anchor.search,
      pathname: anchor.pathname,
      segments: anchor.pathname.replace(/^\/+/, '').split('/'),
      search: anchor.search,
      query: (function () {
        var queryObject = {};
        var queryString = anchor.search.replace(/(^\?&?)|(&$)/g, '');
        if (queryString.indexOf('=') === -1) {
          return queryString;
        }
        queryString.split(/&+/).forEach(function (keyValuePair) {
          var keyValueArray = decodeURIComponent(keyValuePair).split('=');
          var paramKey = keyValueArray[0];
          var paramValue = keyValueArray[1];
          if (queryObject.hasOwnProperty(paramKey)) {
            paramValue = [].concat(queryObject[paramKey], paramValue);
          }
          queryObject[paramKey] = paramValue;
        });
        return queryObject;
      })(),
      hash: anchor.hash,
      fragment: anchor.hash.replace(/^#/, '')
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
    var iconsData = schema.icons;
    var eventSelector = schema.events.sprite.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var iconName = $_data.schemaIcon || 'unknown';
      var iconData = iconsData[iconName] || iconsData.unknown;
      if (typeof iconData === 'string') {
        iconData = iconsData[iconData];
      }

      var iconWidth = $_data.schemaWidth || iconData[0];
      var iconHeight = $_data.schemaHeight || iconData[1];
      var iconPath = $_data.schemaPath || iconData[2];
      var iconColor = $_data.schemaColor || iconData[3];
      var iconColorEnabled = $_data.schemaColorEnabled;
      if (iconColorEnabled === undefined && iconColor) {
        iconColorEnabled = true;
      }

      // Create <svg> element
      var svgNamespace = 'http://www.w3.org/2000/svg';
      var svgDoc = document.createElementNS(svgNamespace, 'svg');
      svgDoc.setAttribute('width', iconWidth);
      svgDoc.setAttribute('height', iconHeight);
      svgDoc.setAttribute('viewBox', '0 0 ' + iconWidth + ' ' + iconHeight);

      // Create <path> element
      if (Array.isArray(iconPath)) {
        iconPath.forEach(function (pathSegment, index) {
          var pathTag = document.createElementNS(svgNamespace, 'path');
          if(iconColorEnabled && iconColor) {
            pathTag.setAttribute('fill', Array.isArray(iconColor) ? iconColor[index] : iconColor);
          }
          pathTag.setAttribute('d', pathSegment);
          svgDoc.appendChild(pathTag);
        });
      } else {
        var pathTag = document.createElementNS(svgNamespace, 'path');
        if (iconColorEnabled && iconColor) {
          pathTag.setAttribute('fill', iconColor);
        }
        pathTag.setAttribute('d', iconPath);
        svgDoc.appendChild(pathTag);
      }

      $_this.empty().append(svgDoc).css({
        'width': $_this.hasClass('ui-fixed-width') ||
          $_this.hasClass('ui-icon-circle') ?
            $_this.css('height') :
            $_this.css('height').slice(0, -2) * iconWidth / iconHeight
      });
    });
  };

  schema.icons = {
    'unknown': [32, 32, 'M27.429 7.429v17.143q0 2.125-1.509 3.634t-3.634 1.509h-17.143q-2.125 0-3.634-1.509t-1.509-3.634v-17.143q0-2.125 1.509-3.634t3.634-1.509h17.143q2.125 0 3.634 1.509t1.509 3.634z']
  };

})(jQuery);
