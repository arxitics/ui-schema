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
      required: 'schema-required',
      rating: 'schema-rating',
      icons: 'schema-icons',
      tagging: 'schema-tagging',
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
        selector: 'input[data-schema-rating]'
      },
      tagging: {
        type: 'tagging',
        namespace: '.form.data-api.schema',
        selector: 'input[data-schema-tagging]'
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
