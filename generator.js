'use strict';

var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app) {
  if (!isValid(app, 'generate-license')) return;

  /**
   * Plugins
   */

  app.use(require('generate-defaults'));

  /**
   * Create tasks from templates
   */

  tasks(app, 'templates');

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
  app.task('choose-license', { silent: true }, function(callback) {
    var choices = app.get('cache.choices');

    app.questions.list('licenses', 'Which license do you want to write?', {
      default: getDefault(app, choices),
      choices: choices
    });

    app.ask('licenses', { save: false }, function(err, answers) {
      if (err) return callback(err);
      app.build(answers.licenses, callback);
    });
  });

  /**
   * Generate documentation for dynamically generated tasks.
   *
   * ```sh
   * $ gen license:docs
   * ```
   * @name docs
   * @api public
   */

  app.task('docs', ['license-docs']);
  app.task('license-docs', { silent: true }, function() {
    return app.toStream('docs')
      .pipe(app.dest(function(file) {
        file.basename = 'tasks.md';
        return 'docs';
      }));
  });

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

function file(app, names) {
  return app.src(files(names), { cwd: __dirname })
    .pipe(app.renderFile('*'))
    .pipe(app.conflicts(app.cwd))
    .pipe(app.dest(app.cwd));
}

function files(names) {
  names = Array.isArray(names) ? names : [names];
  return names.map(function(name) {
    return `templates/${name}.tmpl`;
  });
}

/**
 * Create tasks and choices
 */

function tasks(app, dir) {
  // create `docs` collection
  app.create('docs');
  // create `licenses` collection
  app.create('licenses', {cwd: path.join(__dirname, dir)});

  // add a single document to use for creating our documentation
  var doc = app.doc('licenses', {content: ''});
  app.licenses.on('load', function(view) {
    // build up choices
    app.union('cache.choices', { name: [view.data.title], value: view.stem });
    addLicenseDocs(doc, view);
    // create a task for the current template
    app.task(view.stem, function() {
      return file(app, view.data.names);
    });
  });
  // load templates onto the `licenses` collection
  app.licenses('*.tmpl');
}

function getDefault(app, choices) {
  choices.sort(function(a, b) {
    return a.name[0].localeCompare(b.name[0]);
  });
  var name = app.options.defaultLicense || 'mit';
  var len = choices.length;
  var idx = -1;
  while (++idx < len) {
    if (choices[idx].value === name) {
      return idx;
    }
  }
  return 0;
}

function addLicenseDocs(doc, view) {
  var data = view.data;
  var extra = data.extra || '';
  var str = [
    '',
    `### ${view.stem}`,
    '',
    `Generate a ${data.title} \`${data.rename.basename}\` file in the current working directory.`,
    '',
    `${extra}`,
    '',
    '**Example**',
    '',
    '```sh',
    `$ gen license:${view.stem}`,
    `$ gen license:${view.stem} --dest ./docs`,
    `$ gen dest license:${view.stem}`,
    '```',
    ''
  ].join('\n');
  doc.content += str;
}
