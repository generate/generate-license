'use strict';

var path = require('path');
var templates = path.resolve.bind(path, __dirname, 'templates');
var isValid = require('is-valid-app');

module.exports = function(app) {
  if (!isValid(app, 'generate-license')) return;

  /**
   * Plugins
   */

  app.use(require('generate-collections'));
  app.use(require('generate-defaults'));

  /**
   * Generate a `LICENSE` file in the current working directory.
   * _(You will be prompted for the file name to use)_.
   *
   * ```sh
   * $ gen license:mit
   * # or
   * $ gen license
   * ```
   * @name license:mit
   * @api public
   */

  app.task('license', ['mit']);
  app.task('mit', { silent: true }, function() {
    return file(app, 'mit');
  });

  /**
   * Generate a Creative Commons `LICENSE-CC` file in the current working directory.
   * _(You will be prompted for the file name to use)_.
   *
   * ```sh
   * $ gen license:cc
   * ```
   * @name license:cc
   * @api public
   */

  app.task('creative-commons', ['cc']);
  app.task('cc', { silent: true }, function() {
    return file(app, 'cc');
  });

  /**
   * Alias for the [license](#license) task.
   *
   * ```sh
   * $ gen license
   * ```
   * @name license
   * @api public
   */

  app.task('default', { silent: true }, ['license']);
};

/**
 * Generate a file
 */

function file(app, name) {
  var dest = app.option('dest') || app.cwd;
  return app.src(templates(`${name}.tmpl`))
    .pipe(app.renderFile('*'))
    .pipe(app.conflicts(dest))
    .pipe(app.dest(dest));
}
