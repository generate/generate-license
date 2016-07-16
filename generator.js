'use strict';

var isValid = require('is-valid-app');

module.exports = function(app) {
  if (!isValid(app, 'generate-license')) return;

  /**
   * Plugins
   */

  app.use(require('generate-defaults'));

  /**
   * Generated tasks
   */

  app.use(require('./generator.tasks.js'));

  /**
   * Prompts the user to choose the template to use for generating a `LICENSE`
   * file in the current working directory. This task is also aliased as `choose-license`
   * to provide a semantic name for API usage (e.g. `app.generate('choose-license', cb)`).
   *
   * ```sh
   * $ gen license
   * $ gen license --dest ./docs
   * $ gen dest license
   * # or
   * $ gen license:choose
   * $ gen license:choose --dest ./docs
   * $ gen dest license:choose
   * ```
   * @name license
   * @api public
   */

  app.task('choose', ['choose-license']);
  app.task('license', ['choose-license']);

  /**
   * Alias for the [license](#license) task, to allow this generator to be
   * run with the following command:
   *
   * ```sh
   * $ gen license
   * ```
   * @name default
   * @api public
   */

  app.task('default', { silent: true }, ['choose-license']);
};

/**
 * Generate a file
 */

function file(app, name) {
  return app.src(`templates/${name}.tmpl`, { cwd: __dirname })
    .pipe(app.renderFile('*'))
    .pipe(app.conflicts(app.cwd))
    .pipe(app.dest(app.cwd));
}
