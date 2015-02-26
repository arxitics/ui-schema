/*!
 * UI Schema v0.2.6 (https://github.com/arxitics/ui-schema)
 * Copyright 2014 Arxitics <help@arxitics.com>
 * Licensed under MIT (https://github.com/arxitics/ui-schema/blob/master/LICENSE.txt)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('jQuery has not been loaded yet for context');
}

var schema = {};

(function ($) {
  'use strict';

  schema.setup = {
    classPrefix: 'ui',
    dataPrefix: 'schema',
    autoLoad: true,
    autoBind: '.schema',
    autoTrigger: '.schema'
  };

  schema.events = {
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
    validate: {
      type: 'validate',
      namespace: '.form-validate.form.data-api.schema',
      selector: 'form[data-schema-validate]'
    },
    sprite: {
      type: 'generate',
      namespace: '.icons.svg.data-api.schema',
      selector: '[data-schema-icon]'
    }
  };

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

  schema.create = function (options) {
    this.setup = $.extend({}, schema.setup, options);
    return Object.create(schema);
  };

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

  schema.parseData = function (data) {
    var dataObject = {};
    var schemaDataPrefix = schema.setup.dataPrefix;
    var dataPrefixLength = schemaDataPrefix && schemaDataPrefix.length;
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var dataKey = 'schema-' + key.slice(dataPrefixLength);
        var dataValue = data[key].trim();
        dataKey = dataKey.replace(/\-\w/g, function (matchedSubstr) {
          return matchedSubstr.charAt(1).toUpperCase();
        });
        dataObject[dataKey] = (dataValue === '' ? true : dataValue);
      }
    }
    return dataObject;
  };

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
            if (optionValue.search(/\s+/) !== -1) {
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

  schema.validate = function (event, options) {
    var eventSelector = schema.events.validate.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var requireChanged = ($_data.schemaValidate === 'changed');
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
          if ($_data.schemaValidate === 'once') {
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

  schema.trim = function (event, options) {
    var eventSelector = schema.events.trim.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.contents().filter(function () {
      return this.nodeType === 3;
    }).remove();
  };

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
        if(queryString.indexOf('=') === -1) {
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

  schema.sprite = function (event, options) {
    var iconsData = schema.icons;
    var eventSelector = schema.events.sprite.selector;
    var optionalSelector = options && options.selector;
    var colorEnabled = options && options.colorEnabled;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = schema.parseData($_this.data());
      var iconName = $_data.schemaIcon || 'square';
      var iconData = iconsData[iconName] || iconsData.square;
      if (typeof iconData === 'string') {
        iconData = iconsData[iconData];
      }

      var iconWidth = $_data.schemaWidth || iconData[0];
      var iconHeight = $_data.schemaHeight || iconData[1];
      var iconPath = $_data.schemaPath || iconData[2];
      var iconColor = $_data.schemaColor || iconData[3];
      var iconColorEnabled = $_data.schemaColorEnabled || colorEnabled;
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

  schema.icons = {};

})(jQuery);
