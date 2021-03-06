// DecentCMS (c) 2014 Bertrand Le Roy, under MIT. See LICENSE.txt for licensing details.
'use strict';
// TODO: resolve culture dynamically
// TODO: format strings have positional placeholders
// TODO: handling plurals
// TODO: handling completely custom string selection logic
// TODO: persist default strings as they are used to the default translation files
var format = require('util').format;

/**
 * @description
 * Provides the translation of the provided string in the current culture.
 * 
 * @param {String} defaultString  The string to translate in the default en-US culture.
 */
function t(defaultString) {
  var translation = t.resolve(defaultString, 'en-US');
  if (arguments.length == 1) return translation;
  var args = Array.prototype.slice.call(arguments, 0);
  args[0] = translation;
  return format.apply(null, args);
}

t.feature = 'localization';
t.service = 'localization';
t.isStatic = true;
t.scope = 'shell';

/**
 * @description
 * Broadcasts calls for resolving string translations.
 * Don't call directly. Used internally by t.
 *
 * @param {String} defaultString the string to translate.
 * @param {String} culture       the culture for which a translation is required.
 */
t.resolve = function(defaultString, culture) {
  var translationEventPayload = {
    defaultString: defaultString,
    culture: culture,
    translation: null
  };
  t.translationProviders.forEach(function(provider) {
    provider(translationEventPayload);
  });
  return translationEventPayload.translation || defaultString;
};

t.translationProviders = [];

module.exports = t;