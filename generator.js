'use strict';

var isValid = require('is-valid-app');
var choices = require('./tasks/choices');
var choose = require('./lib/choose');
var tasks = require('./tasks');

module.exports = function(app) {
  if (!isValid(app, 'generate-license')) return;

  /**
   * Plugins
   */

  app.use(require('generate-defaults'));
  app.use(require('./tasks'));

  /**
   * The `default` task prompts you to choose the `LICENSE` to generate. All licenses
   * from [github/choosealicense.com](https://github.com/github/choosealicense.com) are
   * available.
   *
   * ```sh
   * $ gen license
   * $ gen license --dest ./docs
   * # or
   * $ gen license:choose
   * $ gen license:choose --dest ./docs
   * ```
   * @name default
   * @api public
   */

  app.task('default', ['license']);
  app.task('license', function(cb) {
    app.build(app.options.defaultLicense || ['choose'], cb);
  });

  /**
   * Prompt the user to choose the license to generate.
   */

  app.task('license-choose', ['choose']);
  app.task('license-prompt', ['choose']);
  app.task('choose', function(cb) {
    var options = {
      message: 'Which license would you like to generate?',
      choices: choices,
      filter: function(str, choice) {
        var re = new RegExp(str, 'i');
        return re.test(choice.name[0]) || re.test(choice.id);
      }
    };

    choose(app, options)
      .then(function(name) {
        app.build(name, cb);
      })
      .catch(cb);
  });

  /**
   * Generate `tasks.js` file
   */

  app.task('create-tasks', function(cb) {
    return app.src('templates/*.tmpl')
      .pipe(tasks({template: 'tasks/support/tasks.tmpl'}))
      .pipe(app.renderFile('*'))
      .pipe(app.dest(app.cwd));
  });

  /**
   * Generate `choices.js` file
   */

  app.task('create-choices', function(cb) {
    return app.src('templates/*.tmpl')
      .pipe(tasks({template: 'tasks/support/choices.tmpl'}))
      .pipe(app.renderFile('*'))
      .pipe(app.dest(app.cwd));
  });

  app.task('create', ['create-*']);
};

