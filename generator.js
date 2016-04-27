'use strict';

var path = require('path');
var templates = path.resolve.bind(path, __dirname, 'templates');
var matchFile = require('match-file');
var through = require('through2');

module.exports = function(app) {
  if (app.isRegistered('generate-license')) return;

  if (typeof app.ask === 'undefined') {
    throw new Error('expected the base-questions plugin to be registered');
  }

  app.use(require('generate-defaults'));

  app.task('mit', function(cb) {
    app.question('author.name', 'Author\'s name?');
    app.data('argv', app.get('cache.argv.orig'));

    app.src('*.tmpl', {cwd: templates()})
      .on('error', cb)
      .pipe(app.renderFile('*'))
      .on('error', cb)
      .pipe(filter('mit.tmpl'))
      .on('error', cb)
      .pipe(app.dest(function(file) {
        file.basename = app.option('license.basename') || 'LICENSE';
        return app.option('dest') || app.cwd;
      }))
      .on('error', cb)
      .on('end', cb)
  });

  // aliases
  app.task('license', ['mit']);
  app.task('default', ['license']);
};

function filter(pattern, options) {
  var isMatch = matchFile.matcher(pattern, options);

  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next();
      return;
    }

    if (isMatch(file)) {
      next(null, file);
    } else {
      next();
    }
  });
}
