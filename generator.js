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

  // customize prompt for `author.name` in mit.tmpl
  app.task('mit', function(cb) {
    app.question('author.name', 'Author\'s name?');

    var name = app.option('license.basename') || 'LICENSE';
    var dest = app.option('dest') || app.cwd;

    app.src('*.tmpl', {cwd: templates()})
      .pipe(app.renderFile('*'))
      .pipe(filter('mit.tmpl'))
      .pipe(app.dest(function(file) {
        file.basename = name;
        return dest;
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
