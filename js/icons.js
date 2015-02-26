
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
