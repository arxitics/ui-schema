/*!
 * UI Schema v0.2.0 (https://github.com/arxitics/ui-schema)
 * Copyright 2014 Arxitics <help@arxitics.com>
 * Licensed under MIT (https://github.com/arxitics/ui-schema/blob/master/LICENSE.txt)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('jQuery has not been loaded yet for context');
}

var Schema = {};

(function ($) {
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

  $(function () {
    Schema.setup.autoLoad && Schema.load && Schema.load();
  });

})(jQuery);
