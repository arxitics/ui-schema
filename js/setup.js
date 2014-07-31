/*!
 * UI Schema v0.0.1 (http://photino.github.io/ui-schema/)
 * Copyright 2014 Zan Pan <panzan89@gmail.com>
 * Licensed under MIT (https://github.com/photino/ui-schema/blob/master/LICENSE.txt)
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
    autoTrigger: '.schema',
    deviceWidth: 1024,
    minFontSize: 8,
    maxFontSize: 18,
    baseFontSize: 0
  };

  Schema.events = {
    retrieve: {
      type: 'retrieve',
      namespace: '.options.data-api.schema',
      selector: '[data-schema-options]'
    },
    resize: {
      type: 'resize',
      namespace: '.font-size.viewport.schema',
      selector: 'html'
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

