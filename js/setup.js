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
