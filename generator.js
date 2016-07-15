'use strict';

var isValid = require('is-valid-app');

module.exports = function(app) {
  if (!isValid(app, 'generate-license')) return;

  /**
   * Plugins
   */

  app.use(require('generate-defaults'));

  /**
   * Generate a GNU Affero General Public License v3.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:agpl-3.0
   * $ gen license:agpl-3.0 --dest ./docs
   * $ gen dest license:agpl-3.0
   * ```
   * @name license:agpl-3.0
   * @api public
   */

  app.task('agpl-3.0', { silent: true }, function() {
    return file(app, 'agpl-3.0');
  });

  /**
   * Generate an Apache License 2.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:apache-2.0
   * $ gen license:apache-2.0 --dest ./docs
   * $ gen dest license:apache-2.0
   * ```
   * @name license:apache-2.0
   * @api public
   */

  app.task('apache-2.0', { silent: true }, function() {
    return file(app, 'apache-2.0');
  });

  /**
   * Generate an Artistic License 2.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:artistic-2.0
   * $ gen license:artistic-2.0 --dest ./docs
   * $ gen dest license:artistic-2.0
   * ```
   * @name license:artistic-2.0
   * @api public
   */

  app.task('artistic-2.0', { silent: true }, function() {
    return file(app, 'artistic-2.0');
  });

  /**
   * Generate a BSD 2-clause "Simplified" License `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:bsd-2-clause
   * $ gen license:bsd-2-clause --dest ./docs
   * $ gen dest license:bsd-2-clause
   * ```
   * @name license:bsd-2-clause
   * @api public
   */

  app.task('bsd-2-clause', { silent: true }, function() {
    return file(app, 'bsd-2-clause');
  });

  /**
   * Generate a BSD 3-clause "New" or "Revised" License `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:bsd-3-clause
   * $ gen license:bsd-3-clause --dest ./docs
   * $ gen dest license:bsd-3-clause
   * ```
   * @name license:bsd-3-clause
   * @api public
   */

  app.task('bsd-3-clause', { silent: true }, function() {
    return file(app, 'bsd-3-clause');
  });

  /**
   * Generate a Creative Commons Zero v1.0 Universal `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:cc0-1.0
   * $ gen license:cc0-1.0 --dest ./docs
   * $ gen dest license:cc0-1.0
   * ```
   * @name license:cc0-1.0
   * @api public
   */

  app.task('cc0-1.0', { silent: true }, function() {
    return file(app, 'cc0-1.0');
  });

  /**
   * Generate an Eclipse Public License 1.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:epl-1.0
   * $ gen license:epl-1.0 --dest ./docs
   * $ gen dest license:epl-1.0
   * ```
   * @name license:epl-1.0
   * @api public
   */

  app.task('epl-1.0', { silent: true }, function() {
    return file(app, 'epl-1.0');
  });

  /**
   * Generate a GNU General Public License v2.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:gpl-2.0
   * $ gen license:gpl-2.0 --dest ./docs
   * $ gen dest license:gpl-2.0
   * ```
   * @name license:gpl-2.0
   * @api public
   */

  app.task('gpl-2.0', { silent: true }, function() {
    return file(app, 'gpl-2.0');
  });

  /**
   * Generate a GNU General Public License v3.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:gpl-3.0
   * $ gen license:gpl-3.0 --dest ./docs
   * $ gen dest license:gpl-3.0
   * ```
   * @name license:gpl-3.0
   * @api public
   */

  app.task('gpl-3.0', { silent: true }, function() {
    return file(app, 'gpl-3.0');
  });

  /**
   * Generate a ISC License `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:isc
   * $ gen license:isc --dest ./docs
   * $ gen dest license:isc
   * ```
   * @name license:isc
   * @api public
   */

  app.task('isc', { silent: true }, function() {
    return file(app, 'isc');
  });

  /**
   * Generate a GNU Lesser General Public License v2.1 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:lgpl-2.1
   * $ gen license:lgpl-2.1 --dest ./docs
   * $ gen dest license:lgpl-2.1
   * ```
   * @name license:lgpl-2.1
   * @api public
   */

  app.task('lgpl-2.1', { silent: true }, function() {
    return file(app, 'lgpl-2.1');
  });

  /**
   * Generate a GNU Lesser General Public License v3.0 `LICENSE.lesser`
   * file in the current working directory.
   *
   * This will also generate a GNU General Public License v3.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:lgpl-3.0
   * $ gen license:lgpl-3.0 --dest ./docs
   * $ gen dest license:lgpl-3.0
   * ```
   * @name license:lgpl-3.0
   * @api public
   */

  app.task('lgpl-3.0', ['gpl-3.0'], function() {
    return file(app, 'lgpl-3.0');
  });

  /**
   * Generate a MIT License `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:mit
   * $ gen license:mit --dest ./docs
   * $ gen dest license:mit
   * ```
   * @name license:mit
   * @api public
   */

  app.task('mit', { silent: true }, function() {
    return file(app, 'mit');
  });

  /**
   * Generate a Mozilla Public License 2.0 `LICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:mpl-2.0
   * $ gen license:mpl-2.0 --dest ./docs
   * $ gen dest license:mpl-2.0
   * ```
   * @name license:mpl-2.0
   * @api public
   */

  app.task('mpl-2.0', { silent: true }, function() {
    return file(app, 'mpl-2.0');
  });

  /**
   * Generate a The Unlicense `UNLICENSE`
   * file in the current working directory.
   *
   * ```sh
   * $ gen license:unlicense
   * $ gen license:unlicense --dest ./docs
   * $ gen dest license:unlicense
   * ```
   * @name license:unlicense
   * @api public
   */

  app.task('unlicense', { silent: true }, function() {
    return file(app, 'unlicense');
  });

  /**
   * Prompts the user to choose the template to use for generating`
   * a `LICENSE` file in the current working directory.
   *
   * ```sh
   * $ gen license:choose
   * $ gen license:choose --dest ./docs
   * $ gen dest license:choose
   * # or
   * $ gen license
   * $ gen license --dest ./docs
   * $ gen dest license
   * ```
   * @name license:choose
   * @api public
   */

  app.task('license', ['choose-license']);
  app.task('choose-license', { silent: true }, function(callback) {
    app.questions.list('licenses', 'Which license do you want to write?', {
      default: 12, // <= index of the default license
      choices: [
        { name: ['Apache License 2.0'], value: 'apache-2.0' },
        { name: ['Artistic License 2.0'], value: 'artistic-2.0' },
        { name: ['BSD 2-clause "Simplified" License'], value: 'bsd-2-clause' },
        { name: ['BSD 3-clause "New" or "Revised" License'], value: 'bsd-3-clause' },
        { name: ['Creative Commons Zero v1.0 Universal'], value: 'cc0-1.0' },
        { name: ['Eclipse Public License 1.0'], value: 'epl-1.0' },
        { name: ['GNU Affero General Public License v3.0'], value: 'agpl-3.0' },
        { name: ['GNU General Public License v2.0'], value: 'gpl-2.0' },
        { name: ['GNU General Public License v3.0'], value: 'gpl-3.0' },
        { name: ['GNU Lesser General Public License v2.1'], value: 'lgpl-2.1' },
        { name: ['GNU Lesser General Public License v3.0'], value: 'lgpl-3.0' },
        { name: ['ISC License'], value: 'isc' },
        { name: ['MIT License'], value: 'mit' },
        { name: ['Mozilla Public License 2.0'], value: 'mpl-2.0' },
        { name: ['The Unlicense'], value: 'unlicense' }
      ]
    });

    app.ask('licenses', { save: false }, function(err, answers) {
      if (err) return callback(err);
      app.build(answers.licenses, callback);
    });
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
