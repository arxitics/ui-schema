/*!
 * UI Schema v0.1.0 (https://github.com/arxitics/ui-schema)
 * Copyright 2014 Arxitics <help@arxitics.com>
 * Licensed under MIT (https://github.com/arxitics/ui-schema/blob/master/LICENSE.txt)
 */

if(typeof jQuery === 'undefined') {
  throw new Error('jQuery has not been loaded yet for context');
}

var Schema = {};

(function($) {
  'use strict';

  Schema.setup = {
    classPrefix: 'ui',
    dataPrefix: 'schema',
    autoLoad: true,
    autoBind: '.schema',
    autoTrigger: '.schema'
  };

  Schema.events = {
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

  $(function() {
    Schema.setup.autoLoad && Schema.load && Schema.load();
  });

})(jQuery);

/*!
 * Core
 */

(function($) {
  'use strict';

  Schema.create = function(options) {
    this.setup = $.extend({}, Schema.setup, options);
    return Object.create(Schema);
  };

  Schema.load = function(setup, events) {
    var schemaSetup = $.extend({}, Schema.setup, setup);
    var schemaEvents = $.extend({}, Schema.events, events);

    var schemaDataPrefix = schemaSetup.dataPrefix;
    var dataPrefix = schemaDataPrefix ? schemaDataPrefix + '-' : '';

    for(var key in schemaEvents) {
      if(schemaEvents.hasOwnProperty(key)) {
        var schemaFunction = Schema[key];
        var eventObject = schemaEvents[key];
        var eventDelegation = eventObject.delegation;
        if(!eventObject.hasOwnProperty('delegation')) {
          eventDelegation = Schema.delegate(eventObject);
          eventObject.delegation = eventDelegation;
        }
        if(eventDelegation > 1) {
          var eventName = eventObject.type + eventObject.namespace;
          $(document).on(eventName, schemaFunction);
          if(eventDelegation > 2) {
            $(document).trigger(eventName);
          }
        }
      }
    }
  };

  Schema.delegate = function(event) {
    var schemaSetup = Schema.setup;
    var eventsBind = schemaSetup.autoBind.split(' ');
    var eventsTrigger = schemaSetup.autoTrigger.split(' ');
    var eventName = event.type + event.namespace;
    var eventArray = eventName.replace(/^\./, '').split('.');

    var eventDelegation = eventsBind.some(function(bindEvent) {
      var bindArray = bindEvent.replace(/^\./, '').split('.');
      return bindArray.every(function(eventKeyword) {
        return eventArray.indexOf(eventKeyword) !== -1;
      });
    }) ? 2 : 0;
    eventDelegation += eventsTrigger.some(function(triggerEvent) {
      var triggerArray = triggerEvent.replace(/^\./, '').split('.');
      return triggerArray.every(function(eventKeyword) {
        return eventArray.indexOf(eventKeyword) !== -1;
      });
    }) ? 1 : 0;

    return eventDelegation;
  };

  Schema.trim = function(event, options) {
    var eventSelector = Schema.events.trim.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.contents().filter(function() {
      return this.nodeType === 3;
    }).remove();
  };

  Schema.retrieve = function(event, options) {
    var eventSelector = Schema.events.retrieve.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function() {
      var $_this = $(this);
      var $_data = Schema.parseData($_this.data());
      var schemaOptions = Schema.parseOptions($_data.schemaOptions);
      for(var key in schemaOptions) {
        if(schemaOptions.hasOwnProperty(key)) {
          $_this.data(key, schemaOptions[key]);
        }
      }
    });
  };

  Schema.parseData = function(data) {
    var dataObject = {};
    var schemaDataPrefix = Schema.setup.dataPrefix;
    var dataPrefixLength = schemaDataPrefix && schemaDataPrefix.length;
    for(var key in data) {
      if(data.hasOwnProperty(key)) {
        var dataKey = 'schema-' + key.slice(dataPrefixLength);
        var dataValue = data[key].trim();
        dataKey = dataKey.replace(/-\w/g, function(matchedSubstr) {
          return matchedSubstr.charAt(1).toUpperCase();
        });
        dataObject[dataKey] = (dataValue === '' ? true : dataValue);
      }
    }
    return dataObject;
  };

  Schema.parseOptions = function(options) {
    var optionsObject = {};
    var parsedOptionsObject = {};
    var schemaDataPrefix = Schema.setup.dataPrefix;
    var optionsPrefix = schemaDataPrefix ? schemaDataPrefix + '-' : '';
    var optionsType = Object.prototype.toString.call(options).slice(8, -1);
    if(optionsType === 'Object') {
      optionsObject = options;
    }
    if(optionsType === 'String') {
      try {
        optionsObject = JSON.parse(options);
      } catch(parseError) {
        if(options.indexOf(':') !== -1) {
          options = options.trim().replace(/\s*;$/, '');
          options.split(/\s*;\s*/).forEach(function(keyValuePair) {
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
    for(var key in optionsObject) {
      if(optionsObject.hasOwnProperty(key)) {
        var optionKey = optionsPrefix + key;
        optionKey = optionKey.replace(/-\w/g, function(matchedSubstr) {
          return matchedSubstr.charAt(1).toUpperCase();
        });
        parsedOptionsObject[optionKey] = optionsObject[key];
      }
    }
    return parsedOptionsObject;
  };

  Schema.parseURL = function(url) {
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
 * Forms
 */

(function($) {
  'use strict';

  Schema.validate = function(event, options) {
    var eventSelector = Schema.events.validate.selector;
    var optionalSelector = options && options.selector;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function () {
      var $_this = $(this);
      var $_data = Schema.parseData($_this.data());
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
 * Icons
 */

(function($) {
  'use strict';

  Schema.sprite = function(event, options) {
    var iconsData = Schema.icons;
    var eventSelector = Schema.events.sprite.selector;
    var optionalSelector = options && options.selector;
    var colorEnabled = options && options.colorEnabled;
    var $_elements = $(eventSelector).add(optionalSelector);
    $_elements.each(function() {
      var $_this = $(this);
      var $_data = Schema.parseData($_this.data());
      var iconName = $_data.schemaIcon || 'square';
      var iconData = iconsData[iconName] || iconsData['square'];
      if(typeof iconData === 'string') {
        iconData = iconsData[iconData];
      }

      var iconWidth = $_data.schemaWidth || iconData[0];
      var iconHeight = $_data.schemaHeight || iconData[1];
      var iconPath = $_data.schemaPath || iconData[2];
      var iconColor = $_data.schemaColor || iconData[3];
      var iconColorEnabled = $_data.schemaColorEnabled || colorEnabled;
      if(iconColorEnabled === undefined && iconColor) {
        iconColorEnabled = true;
      }

      /* Create <svg> element */
      var svgNamespace = 'http://www.w3.org/2000/svg';
      var svgDoc = document.createElementNS(svgNamespace, 'svg');
      svgDoc.setAttribute('width', iconWidth);
      svgDoc.setAttribute('height', iconHeight);
      svgDoc.setAttribute('viewBox', '0 0 ' + iconWidth + ' ' + iconHeight);

      /* Create <path> element */
      if(Array.isArray(iconPath)) {
        iconPath.forEach(function(pathSegment, index) {
          var pathTag = document.createElementNS(svgNamespace, 'path');
          if(iconColorEnabled && iconColor && iconColor[index]) {
            pathTag.setAttribute('fill', iconColor[index]);
          }
          pathTag.setAttribute('d', pathSegment);
          svgDoc.appendChild(pathTag);
        });
      } else {
        var pathTag = document.createElementNS(svgNamespace, 'path');
        if(iconColorEnabled && iconColor) {
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

  Schema.icons = {
    'search': [30, 32, 'M20.571 14.857q0-3.304-2.348-5.652t-5.652-2.348-5.652 2.348-2.348 5.652 2.348 5.652 5.652 2.348 5.652-2.348 2.348-5.652zM29.714 29.714q0 0.929-0.679 1.607t-1.607 0.679q-0.964 0-1.607-0.679l-6.125-6.107q-3.196 2.214-7.125 2.214-2.554 0-4.884-0.991t-4.018-2.679-2.679-4.018-0.991-4.884 0.991-4.884 2.679-4.018 4.018-2.679 4.884-0.991 4.884 0.991 4.018 2.679 2.679 4.018 0.991 4.884q0 3.929-2.214 7.125l6.125 6.125q0.661 0.661 0.661 1.607z'],
    'arrow-left': [32, 32, 'M12.586 4.586l-10 10c-0.781 0.781-0.781 2.047 0 2.828l10 10c0.781 0.781 2.047 0.781 2.828 0 0.781-0.781 0.781-2.047 0-2.828l-6.586-6.586h19.172c1.105 0 2-0.895 2-2 0-1.105-0.895-2-2-2h-19.172l6.586-6.586c0.39-0.391 0.586-0.902 0.586-1.414s-0.195-1.024-0.586-1.414c-0.781-0.781-2.047-0.781-2.828 0z'],
    'arrow-right': [32, 32, 'M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0-0.781 0.781-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z'],
    'envelope': [32, 32, 'M0 26.857v-14.179q0.786 0.875 1.804 1.554 6.464 4.393 8.875 6.161 1.018 0.75 1.652 1.17t1.688 0.857 1.964 0.438h0.036q0.911 0 1.964-0.438t1.688-0.857 1.652-1.17q3.036-2.196 8.893-6.161 1.018-0.696 1.786-1.554v14.179q0 1.179-0.839 2.018t-2.018 0.839h-26.286q-1.179 0-2.018-0.839t-0.839-2.018zM0 7.821q0-1.393 0.741-2.321t2.116-0.929h26.286q1.161 0 2.009 0.839t0.848 2.018q0 1.411-0.875 2.696t-2.179 2.196q-6.714 4.661-8.357 5.804-0.179 0.125-0.759 0.545t-0.964 0.679-0.929 0.58-1.027 0.482-0.893 0.161h-0.036q-0.411 0-0.893-0.161t-1.027-0.482-0.929-0.58-0.964-0.679-0.759-0.545q-1.625-1.143-4.679-3.259t-3.661-2.545q-1.107-0.75-2.089-2.063t-0.982-2.438z'],
    'envelope-o': [32, 32, 'M0 26.857v-19.429q0-1.179 0.839-2.018t2.018-0.839h26.286q1.179 0 2.018 0.839t0.839 2.018v19.429q0 1.179-0.839 2.018t-2.018 0.839h-26.286q-1.179 0-2.018-0.839t-0.839-2.018zM2.286 26.857q0 0.232 0.17 0.402t0.402 0.17h26.286q0.232 0 0.402-0.17t0.17-0.402v-13.714q-0.571 0.643-1.232 1.179-4.786 3.679-7.607 6.036-0.911 0.768-1.482 1.196t-1.545 0.866-1.83 0.438h-0.036q-0.857 0-1.83-0.438t-1.545-0.866-1.482-1.196q-2.821-2.357-7.607-6.036-0.661-0.536-1.232-1.179v13.714zM2.286 7.429q0 3 2.625 5.071 3.446 2.714 7.161 5.661 0.107 0.089 0.625 0.527t0.821 0.67 0.795 0.563 0.902 0.491 0.768 0.161h0.036q0.357 0 0.768-0.161t0.902-0.491 0.795-0.563 0.821-0.67 0.625-0.527q3.714-2.946 7.161-5.661 0.964-0.768 1.795-2.063t0.83-2.348v-0.438t-0.009-0.232-0.054-0.223-0.098-0.161-0.161-0.134-0.25-0.045h-26.286q-0.232 0-0.402 0.17t-0.17 0.402z'],
    'key': [32, 32, 'M28.304 7.562c-0.803-4.765-5.152-7.947-9.71-7.106-4.56 0.84-8.406 4.506-7.603 9.27 0.174 1.026 0.653 2.632 1.221 3.784l-8.28 12.357c-0.306 0.456-0.478 1.278-0.387 1.826l0.533 3.154c0.093 0.547 0.597 0.915 1.12 0.819l2.426-0.446c0.525-0.098 1.189-0.558 1.478-1.026l3.304-5.33 2.216-0.41 3.822-6.205c1.258 0.222 3.059 0.147 4.125-0.050 4.562-0.842 6.541-5.874 5.736-10.638zM24.266 10.003c-1.254 1.87-2.533 0.552-4.325-0.76-1.79-1.31-3.416-2.117-2.162-3.987 1.254-1.872 3.722-2.328 5.514-1.016 1.792 1.31 2.227 3.893 0.973 5.763z'],
    'user': [25, 32, 'M25.143 25.089q0 2.143-1.304 3.384t-3.464 1.241h-15.607q-2.161 0-3.464-1.241t-1.304-3.384q0-0.946 0.063-1.848t0.25-1.946 0.473-1.938 0.768-1.741 1.107-1.446 1.527-0.955 1.991-0.357q0.161 0 0.75 0.384t1.33 0.857 1.929 0.857 2.384 0.384 2.384-0.384 1.929-0.857 1.33-0.857 0.75-0.384q1.089 0 1.991 0.357t1.527 0.955 1.107 1.446 0.768 1.741 0.473 1.938 0.25 1.946 0.063 1.848zM19.429 9.143q0 2.839-2.009 4.848t-4.848 2.009-4.848-2.009-2.009-4.848 2.009-4.848 4.848-2.009 4.848 2.009 2.009 4.848z'],
    'user-md': [25, 32, 'M0 25.089q0-1.214 0.098-2.339t0.429-2.464 0.848-2.366 1.446-1.839 2.143-1.080q-0.393 0.929-0.393 2.143v3.625q-1.036 0.357-1.661 1.25t-0.625 1.982q0 1.429 1 2.429t2.429 1 2.429-1 1-2.429q0-1.089-0.634-1.982t-1.652-1.25v-3.625q0-1.107 0.446-1.661 2.357 1.857 5.268 1.857t5.268-1.857q0.446 0.554 0.446 1.661v1.143q-1.893 0-3.232 1.339t-1.339 3.232v1.589q-0.571 0.518-0.571 1.268 0 0.714 0.5 1.214t1.214 0.5 1.214-0.5 0.5-1.214q0-0.75-0.571-1.268v-1.589q0-0.929 0.679-1.607t1.607-0.679 1.607 0.679 0.679 1.607v1.589q-0.571 0.518-0.571 1.268 0 0.714 0.5 1.214t1.214 0.5 1.214-0.5 0.5-1.214q0-0.75-0.571-1.268v-1.589q0-1.214-0.616-2.277t-1.67-1.67q0-0.179 0.009-0.759t0-0.857-0.045-0.741-0.125-0.839-0.232-0.714q1.214 0.268 2.143 1.080t1.446 1.839 0.848 2.366 0.429 2.464 0.098 2.339q0 2.161-1.304 3.393t-3.464 1.232h-15.607q-2.161 0-3.464-1.232t-1.304-3.393zM4.571 24q0-0.464 0.339-0.804t0.804-0.339 0.804 0.339 0.339 0.804-0.339 0.804-0.804 0.339-0.804-0.339-0.339-0.804zM5.714 9.143q0-2.839 2.009-4.848t4.848-2.009 4.848 2.009 2.009 4.848-2.009 4.848-4.848 2.009-4.848-2.009-2.009-4.848z'],
    'mail-reply': [32, 32, 'M0 11.429q0-0.464 0.339-0.804l9.143-9.143q0.339-0.339 0.804-0.339t0.804 0.339 0.339 0.804v4.571h4q12.732 0 15.625 7.196 0.946 2.393 0.946 5.946 0 2.964-2.268 8.054-0.054 0.125-0.188 0.429t-0.241 0.536-0.232 0.393q-0.214 0.304-0.5 0.304-0.268 0-0.42-0.179t-0.152-0.446q0-0.161 0.045-0.473t0.045-0.42q0.089-1.214 0.089-2.196 0-1.804-0.313-3.232t-0.866-2.473-1.429-1.804-1.884-1.241-2.375-0.759-2.75-0.384-3.134-0.107h-4v4.571q0 0.464-0.339 0.804t-0.804 0.339-0.804-0.339l-9.143-9.143q-0.339-0.339-0.339-0.804z'],
    'trash-o': [25, 32, 'M0 8.571v-1.143q0-0.25 0.161-0.411t0.411-0.161h5.518l1.25-2.982q0.268-0.661 0.964-1.125t1.411-0.464h5.714q0.714 0 1.411 0.464t0.964 1.125l1.25 2.982h5.518q0.25 0 0.411 0.161t0.161 0.411v1.143q0 0.25-0.161 0.411t-0.411 0.161h-1.714v16.929q0 1.482-0.839 2.563t-2.018 1.080h-14.857q-1.179 0-2.018-1.045t-0.839-2.527v-17h-1.714q-0.25 0-0.411-0.161t-0.161-0.411zM4.571 26.071q0 0.393 0.125 0.723t0.259 0.482 0.188 0.152h14.857q0.054 0 0.188-0.152t0.259-0.482 0.125-0.723v-16.929h-16v16.929zM6.857 23.429v-10.286q0-0.25 0.161-0.411t0.411-0.161h1.143q0.25 0 0.411 0.161t0.161 0.411v10.286q0 0.25-0.161 0.411t-0.411 0.161h-1.143q-0.25 0-0.411-0.161t-0.161-0.411zM8.571 6.857h8l-0.857-2.089q-0.125-0.161-0.304-0.196h-5.661q-0.179 0.036-0.304 0.196zM11.429 23.429v-10.286q0-0.25 0.161-0.411t0.411-0.161h1.143q0.25 0 0.411 0.161t0.161 0.411v10.286q0 0.25-0.161 0.411t-0.411 0.161h-1.143q-0.25 0-0.411-0.161t-0.161-0.411zM16 23.429v-10.286q0-0.25 0.161-0.411t0.411-0.161h1.143q0.25 0 0.411 0.161t0.161 0.411v10.286q0 0.25-0.161 0.411t-0.411 0.161h-1.143q-0.25 0-0.411-0.161t-0.161-0.411z'],
    'sort-amount-asc': [32, 32, 'M0.607 25.5q0.143-0.357 0.536-0.357h3.429v-24.571q0-0.25 0.161-0.411t0.411-0.161h3.429q0.25 0 0.411 0.161t0.161 0.411v24.571h3.429q0.25 0 0.411 0.161t0.161 0.411q0 0.214-0.179 0.429l-5.696 5.696q-0.179 0.161-0.411 0.161-0.214 0-0.411-0.161l-5.714-5.714q-0.268-0.286-0.125-0.625zM16 28q0-0.25 0.161-0.411t0.411-0.161h14.857q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-14.857q-0.25 0-0.411-0.161t-0.161-0.411v-3.429zM16 22.286v-3.429q0-0.25 0.161-0.411t0.411-0.161h11.429q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-11.429q-0.25 0-0.411-0.161t-0.161-0.411zM16 13.143v-3.429q0-0.25 0.161-0.411t0.411-0.161h8q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-8q-0.25 0-0.411-0.161t-0.161-0.411zM16 4v-3.429q0-0.25 0.161-0.411t0.411-0.161h4.571q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-4.571q-0.25 0-0.411-0.161t-0.161-0.411z'],
    'star': [30, 32, 'M29.714 11.554q0 0.393-0.464 0.857l-6.482 6.321 1.536 8.929q0.018 0.125 0.018 0.357 0 0.375-0.188 0.634t-0.545 0.259q-0.339 0-0.714-0.214l-8.018-4.214-8.018 4.214q-0.393 0.214-0.714 0.214-0.375 0-0.563-0.259t-0.188-0.634q0-0.107 0.036-0.357l1.536-8.929-6.5-6.321q-0.446-0.482-0.446-0.857 0-0.661 1-0.821l8.964-1.304 4.018-8.125q0.339-0.732 0.875-0.732t0.875 0.732l4.018 8.125 8.964 1.304q1 0.161 1 0.821z'],
    'star-half-empty': [30, 32, 'M21.179 17.089l4.589-4.464-7.536-1.107-0.536-1.071-2.839-5.75v17.196l1.054 0.554 5.679 3-1.071-6.339-0.214-1.179zM29.25 12.411l-6.482 6.321 1.536 8.929q0.089 0.589-0.107 0.92t-0.607 0.33q-0.304 0-0.714-0.214l-8.018-4.214-8.018 4.214q-0.411 0.214-0.714 0.214-0.411 0-0.607-0.33t-0.107-0.92l1.536-8.929-6.5-6.321q-0.571-0.571-0.411-1.063t0.964-0.616l8.964-1.304 4.018-8.125q0.357-0.732 0.875-0.732 0.5 0 0.875 0.732l4.018 8.125 8.964 1.304q0.804 0.125 0.964 0.616t-0.429 1.063z'],
    'star-o': [30, 32, 'M20.304 17.929l5.464-5.304-7.536-1.107-3.375-6.821-3.375 6.821-7.536 1.107 5.464 5.304-1.304 7.518 6.75-3.554 6.732 3.554zM29.714 11.554q0 0.393-0.464 0.857l-6.482 6.321 1.536 8.929q0.018 0.125 0.018 0.357 0 0.893-0.732 0.893-0.339 0-0.714-0.214l-8.018-4.214-8.018 4.214q-0.393 0.214-0.714 0.214-0.375 0-0.563-0.259t-0.188-0.634q0-0.107 0.036-0.357l1.536-8.929-6.5-6.321q-0.446-0.482-0.446-0.857 0-0.661 1-0.821l8.964-1.304 4.018-8.125q0.339-0.732 0.875-0.732t0.875 0.732l4.018 8.125 8.964 1.304q1 0.161 1 0.821z'],
    'sort-amount-desc': [32, 32, 'M0.607 25.5q0.143-0.357 0.536-0.357h3.429v-24.571q0-0.25 0.161-0.411t0.411-0.161h3.429q0.25 0 0.411 0.161t0.161 0.411v24.571h3.429q0.25 0 0.411 0.161t0.161 0.411q0 0.214-0.179 0.429l-5.696 5.696q-0.179 0.161-0.411 0.161-0.214 0-0.411-0.161l-5.714-5.714q-0.268-0.286-0.125-0.625zM16 28q0-0.25 0.161-0.411t0.411-0.161h4.571q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-4.571q-0.25 0-0.411-0.161t-0.161-0.411v-3.429zM16 22.286v-3.429q0-0.25 0.161-0.411t0.411-0.161h8q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-8q-0.25 0-0.411-0.161t-0.161-0.411zM16 13.143v-3.429q0-0.25 0.161-0.411t0.411-0.161h11.429q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-11.429q-0.25 0-0.411-0.161t-0.161-0.411zM16 4v-3.429q0-0.25 0.161-0.411t0.411-0.161h14.857q0.25 0 0.411 0.161t0.161 0.411v3.429q0 0.25-0.161 0.411t-0.411 0.161h-14.857q-0.25 0-0.411-0.161t-0.161-0.411z'],
    'comments': [32, 32, 'M25.143 13.714q0 2.482-1.679 4.589t-4.58 3.33-6.313 1.223q-1.536 0-3.143-0.286-2.214 1.571-4.964 2.286-0.643 0.161-1.536 0.286h-0.054q-0.196 0-0.366-0.143t-0.205-0.375q-0.018-0.054-0.018-0.116t0.009-0.116 0.036-0.107l0.045-0.089t0.063-0.098 0.071-0.089 0.080-0.089 0.071-0.080q0.089-0.107 0.411-0.446t0.464-0.527 0.402-0.518 0.446-0.688 0.366-0.786q-2.214-1.286-3.482-3.161t-1.268-4q0-2.482 1.679-4.589t4.58-3.33 6.312-1.223 6.313 1.223 4.58 3.33 1.679 4.589zM32 18.286q0 2.143-1.268 4.009t-3.482 3.152q0.179 0.429 0.366 0.786t0.446 0.688 0.402 0.518 0.464 0.527 0.411 0.446q0.018 0.018 0.071 0.080t0.080 0.089 0.071 0.089 0.063 0.098l0.045 0.089t0.036 0.107 0.009 0.116-0.018 0.116q-0.054 0.25-0.232 0.393t-0.393 0.125q-0.893-0.125-1.536-0.286-2.75-0.714-4.964-2.286-1.607 0.286-3.143 0.286-4.839 0-8.429-2.357 1.036 0.071 1.571 0.071 2.875 0 5.518-0.804t4.714-2.304q2.232-1.643 3.429-3.786t1.196-4.536q0-1.375-0.411-2.714 2.304 1.268 3.643 3.179t1.339 4.107z'],
    'comments-o': [32, 32, 'M12.571 6.857q-2.732 0-5.107 0.929t-3.777 2.518-1.402 3.411q0 1.464 0.946 2.821t2.661 2.357l1.732 1-0.625 1.5q0.607-0.357 1.107-0.696l0.786-0.554 0.946 0.179q1.393 0.25 2.732 0.25 2.732 0 5.107-0.929t3.777-2.518 1.402-3.411-1.402-3.411-3.777-2.518-5.107-0.929zM12.571 4.571q3.411 0 6.313 1.223t4.58 3.33 1.679 4.589-1.679 4.589-4.58 3.33-6.313 1.223q-1.536 0-3.143-0.286-2.214 1.571-4.964 2.286-0.643 0.161-1.536 0.286h-0.054q-0.196 0-0.366-0.143t-0.205-0.375q-0.018-0.054-0.018-0.116t0.009-0.116 0.036-0.107l0.045-0.089t0.063-0.098 0.071-0.089 0.080-0.089 0.071-0.080q0.089-0.107 0.411-0.446t0.464-0.527 0.402-0.518 0.446-0.688 0.366-0.786q-2.214-1.286-3.482-3.161t-1.268-4q0-2.482 1.679-4.589t4.58-3.33 6.312-1.223zM27.25 25.446q0.179 0.429 0.366 0.786t0.446 0.688 0.402 0.518 0.464 0.527 0.411 0.446q0.018 0.018 0.071 0.080t0.080 0.089 0.071 0.089 0.063 0.098l0.045 0.089t0.036 0.107 0.009 0.116-0.018 0.116q-0.054 0.25-0.232 0.393t-0.393 0.125q-0.893-0.125-1.536-0.286-2.75-0.714-4.964-2.286-1.607 0.286-3.143 0.286-4.839 0-8.429-2.357 1.036 0.071 1.571 0.071 2.875 0 5.518-0.804t4.714-2.304q2.232-1.643 3.429-3.786t1.196-4.536q0-1.375-0.411-2.714 2.304 1.268 3.643 3.179t1.339 4.107q0 2.143-1.268 4.009t-3.482 3.152z'],
    'bookmark': [23, 32, 'M0 27.304v-23.018q0-0.607 0.348-1.107t0.938-0.732q0.375-0.161 0.786-0.161h18.714q0.411 0 0.786 0.161 0.589 0.232 0.938 0.732t0.348 1.107v23.018q0 0.607-0.348 1.107t-0.938 0.732q-0.339 0.143-0.786 0.143-0.857 0-1.482-0.571l-7.875-7.571-7.875 7.571q-0.643 0.589-1.482 0.589-0.411 0-0.786-0.161-0.589-0.232-0.938-0.732t-0.348-1.107z'],
    'bookmark-o': [23, 32, 'M0 27.304v-23.018q0-0.607 0.348-1.107t0.938-0.732q0.375-0.161 0.786-0.161h18.714q0.411 0 0.786 0.161 0.589 0.232 0.938 0.732t0.348 1.107v23.018q0 0.607-0.348 1.107t-0.938 0.732q-0.339 0.143-0.786 0.143-0.857 0-1.482-0.571l-7.875-7.571-7.875 7.571q-0.643 0.589-1.482 0.589-0.411 0-0.786-0.161-0.589-0.232-0.938-0.732t-0.348-1.107zM2.286 26.75l9.143-8.768 1.589 1.518 7.554 7.25v-22.179h-18.286v22.179z'],
    'thumbs-down': [30, 32, 'M4.571 10.286q0 0.464-0.339 0.804t-0.804 0.339q-0.482 0-0.813-0.339t-0.33-0.804q0-0.482 0.33-0.813t0.813-0.33q0.464 0 0.804 0.33t0.339 0.813zM7.429 19.429v-11.429q0-0.464-0.339-0.804t-0.804-0.339h-5.143q-0.464 0-0.804 0.339t-0.339 0.804v11.429q0 0.464 0.339 0.804t0.804 0.339h5.143q0.464 0 0.804-0.339t0.339-0.804zM27.589 16.768q0.982 1.089 0.982 2.661-0.018 1.393-1.027 2.411t-2.402 1.018h-4.946q0.071 0.25 0.143 0.429t0.196 0.393 0.179 0.321q0.321 0.661 0.482 1.018t0.339 1.045 0.179 1.366q0 0.429-0.009 0.696t-0.089 0.804-0.214 0.893-0.429 0.804-0.714 0.723-1.071 0.464-1.473 0.188q-0.464 0-0.804-0.339-0.357-0.357-0.607-0.893t-0.348-0.929-0.223-1.089q-0.161-0.75-0.241-1.080t-0.313-0.866-0.554-0.857q-0.589-0.589-1.804-2.143-0.875-1.143-1.804-2.161t-1.357-1.054q-0.446-0.036-0.768-0.366t-0.321-0.777v-11.446q0-0.464 0.339-0.795t0.804-0.348q0.625-0.018 2.821-0.786 1.375-0.464 2.152-0.705t2.17-0.518 2.571-0.277h2.304q2.375 0.036 3.518 1.393 1.036 1.232 0.875 3.232 0.696 0.661 0.964 1.679 0.304 1.089 0 2.089 0.821 1.089 0.768 2.446 0 0.571-0.268 1.357z'],
    'thumbs-o-down': [32, 32, 'M4.571 8q0-0.464-0.339-0.804t-0.804-0.339-0.804 0.339-0.339 0.804 0.339 0.804 0.804 0.339 0.804-0.339 0.339-0.804zM25.143 18.286q0-0.625-0.384-1.446t-0.955-0.839q0.268-0.304 0.446-0.848t0.179-0.991q0-1.232-0.946-2.125 0.321-0.571 0.321-1.232t-0.313-1.313-0.848-0.938q0.089-0.536 0.089-1 0-1.518-0.875-2.25t-2.429-0.732h-2.286q-2.339 0-6.107 1.304-0.089 0.036-0.518 0.188t-0.634 0.223-0.625 0.205-0.679 0.196-0.589 0.116-0.563 0.054h-0.571v11.429h0.571q0.286 0 0.634 0.161t0.714 0.482 0.688 0.634 0.714 0.786 0.616 0.759 0.563 0.732 0.411 0.536q0.982 1.214 1.375 1.625 0.732 0.768 1.063 1.955t0.545 2.241 0.679 1.518q1.714 0 2.286-0.839t0.571-2.589q0-1.054-0.857-2.866t-0.857-2.848h6.286q0.893 0 1.589-0.688t0.696-1.598zM27.429 18.304q0 1.839-1.357 3.196t-3.214 1.357h-3.143q0.857 1.768 0.857 3.429 0 2.107-0.625 3.321-0.625 1.232-1.821 1.813t-2.696 0.58q-0.911 0-1.607-0.661-0.607-0.589-0.964-1.464t-0.455-1.616-0.313-1.509-0.554-1.143q-0.857-0.893-1.911-2.268-1.804-2.339-2.446-2.768h-4.893q-0.946 0-1.616-0.67t-0.67-1.616v-11.429q0-0.946 0.67-1.616t1.616-0.67h5.143q0.393 0 2.464-0.714 2.286-0.786 3.982-1.179t3.571-0.393h2q2.5 0 4.045 1.411t1.527 3.857v0.089q1.071 1.375 1.071 3.179 0 0.393-0.054 0.768 0.679 1.196 0.679 2.571 0 0.643-0.161 1.232 0.875 1.321 0.875 2.911z'],
    'thumbs-o-up': [32, 32, 'M4.571 24q0-0.464-0.339-0.804t-0.804-0.339-0.804 0.339-0.339 0.804 0.339 0.804 0.804 0.339 0.804-0.339 0.339-0.804zM25.143 13.714q0-0.911-0.696-1.598t-1.589-0.688h-6.286q0-1.036 0.857-2.848t0.857-2.866q0-1.75-0.571-2.589t-2.286-0.839q-0.464 0.464-0.679 1.518t-0.545 2.241-1.063 1.955q-0.393 0.411-1.375 1.625-0.071 0.089-0.411 0.536t-0.563 0.732-0.616 0.759-0.714 0.786-0.688 0.634-0.714 0.482-0.634 0.161h-0.571v11.429h0.571q0.232 0 0.563 0.054t0.589 0.116 0.679 0.196 0.625 0.205 0.634 0.223 0.518 0.188q3.768 1.304 6.107 1.304h2.161q3.429 0 3.429-2.982 0-0.464-0.089-1 0.536-0.286 0.848-0.938t0.313-1.313-0.321-1.232q0.946-0.893 0.946-2.125 0-0.446-0.179-0.991t-0.446-0.848q0.571-0.018 0.955-0.839t0.384-1.446zM27.429 13.696q0 1.589-0.875 2.911 0.161 0.589 0.161 1.232 0 1.375-0.679 2.571 0.054 0.375 0.054 0.768 0 1.804-1.071 3.179 0.018 2.482-1.518 3.92t-4.054 1.438h-2.304q-1.714 0-3.384-0.402t-3.866-1.17q-2.071-0.714-2.464-0.714h-5.143q-0.946 0-1.616-0.67t-0.67-1.616v-11.429q0-0.946 0.67-1.616t1.616-0.67h4.893q0.643-0.429 2.446-2.768 1.036-1.339 1.911-2.286 0.429-0.446 0.634-1.527t0.545-2.259 1.107-1.929q0.696-0.661 1.607-0.661 1.5 0 2.696 0.58t1.821 1.813 0.625 3.321q0 1.661-0.857 3.429h3.143q1.857 0 3.214 1.357t1.357 3.196z'],
    'thumbs-up': [30, 32, 'M4.571 24q0-0.464-0.339-0.804t-0.804-0.339q-0.482 0-0.813 0.339t-0.33 0.804q0 0.482 0.33 0.813t0.813 0.33q0.464 0 0.804-0.33t0.339-0.813zM7.429 14.857v11.429q0 0.464-0.339 0.804t-0.804 0.339h-5.143q-0.464 0-0.804-0.339t-0.339-0.804v-11.429q0-0.464 0.339-0.804t0.804-0.339h5.143q0.464 0 0.804 0.339t0.339 0.804zM28.571 14.857q0 1.536-0.982 2.661 0.268 0.786 0.268 1.357 0.054 1.357-0.768 2.446 0.304 1 0 2.089-0.268 1.018-0.964 1.679 0.161 2-0.875 3.232-1.143 1.357-3.518 1.393h-2.304q-1.179 0-2.571-0.277t-2.17-0.518-2.152-0.705q-2.196-0.768-2.821-0.786-0.464-0.018-0.804-0.348t-0.339-0.795v-11.446q0-0.446 0.321-0.777t0.768-0.366q0.429-0.036 1.357-1.054t1.804-2.161q1.214-1.554 1.804-2.143 0.321-0.321 0.554-0.857t0.313-0.866 0.241-1.080q0.125-0.696 0.223-1.089t0.348-0.929 0.607-0.893q0.339-0.339 0.804-0.339 0.821 0 1.473 0.188t1.071 0.464 0.714 0.723 0.429 0.804 0.214 0.893 0.089 0.804 0.009 0.696q0 0.679-0.17 1.357t-0.339 1.071-0.491 1q-0.054 0.107-0.179 0.321t-0.196 0.393-0.143 0.429h4.946q1.393 0 2.411 1.018t1.018 2.411z'],
    'edit': [32, 32, 'M15.857 21.143l2.071-2.071-2.714-2.714-2.071 2.071v1h1.714v1.714h1zM23.714 8.286q-0.286-0.286-0.589 0.018l-6.25 6.25q-0.304 0.304-0.018 0.589t0.589-0.018l6.25-6.25q0.304-0.304 0.018-0.589zM25.143 18.893v3.393q0 2.125-1.509 3.634t-3.634 1.509h-14.857q-2.125 0-3.634-1.509t-1.509-3.634v-14.857q0-2.125 1.509-3.634t3.634-1.509h14.857q1.125 0 2.089 0.446 0.268 0.125 0.321 0.411 0.054 0.304-0.161 0.518l-0.875 0.875q-0.25 0.25-0.571 0.143-0.411-0.107-0.804-0.107h-14.857q-1.179 0-2.018 0.839t-0.839 2.018v14.857q0 1.179 0.839 2.018t2.018 0.839h14.857q1.179 0 2.018-0.839t0.839-2.018v-2.25q0-0.232 0.161-0.393l1.143-1.143q0.268-0.268 0.625-0.125t0.357 0.518zM23.429 5.714l5.143 5.143-12 12h-5.143v-5.143zM31.357 8.071l-1.643 1.643-5.143-5.143 1.643-1.643q0.5-0.5 1.214-0.5t1.214 0.5l2.714 2.714q0.5 0.5 0.5 1.214t-0.5 1.214z'],
    'history': [32, 32, 'M0 12.571v-8q0-0.75 0.714-1.054 0.696-0.304 1.232 0.25l2.321 2.304q1.911-1.804 4.366-2.795t5.080-0.991q2.786 0 5.321 1.089t4.375 2.929 2.929 4.375 1.089 5.321-1.089 5.321-2.929 4.375-4.375 2.929-5.321 1.089q-3.071 0-5.839-1.295t-4.714-3.652q-0.125-0.179-0.116-0.402t0.152-0.366l2.446-2.464q0.179-0.161 0.446-0.161 0.286 0.036 0.411 0.214 1.304 1.696 3.196 2.625t4.018 0.929q1.857 0 3.545-0.723t2.92-1.955 1.955-2.92 0.723-3.545-0.723-3.545-1.955-2.92-2.92-1.955-3.545-0.723q-1.75 0-3.357 0.634t-2.857 1.813l2.446 2.464q0.554 0.536 0.25 1.232-0.304 0.714-1.054 0.714h-8q-0.464 0-0.804-0.339t-0.339-0.804zM9.143 18.857v-1.143q0-0.25 0.161-0.411t0.411-0.161h4v-6.286q0-0.25 0.161-0.411t0.411-0.161h1.143q0.25 0 0.411 0.161t0.161 0.411v8q0 0.25-0.161 0.411t-0.411 0.161h-5.714q-0.25 0-0.411-0.161t-0.161-0.411z'],
    'square': [32, 32, 'M27.429 7.429v17.143q0 2.125-1.509 3.634t-3.634 1.509h-17.143q-2.125 0-3.634-1.509t-1.509-3.634v-17.143q0-2.125 1.509-3.634t3.634-1.509h17.143q2.125 0 3.634 1.509t1.509 3.634z']
  };

})(jQuery);

