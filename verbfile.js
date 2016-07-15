'use strict';

module.exports = function(verb) {
  verb.use(require('verb-generate-readme'));
  verb.use(require('./generator'));
  verb.task('default', ['license-docs', 'readme']);
};
