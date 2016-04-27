'use strict';

var path = require('path');
var templates = path.resolve.bind(path, __dirname, 'templates');
var matchFile = require('match-file');
var through = require('through2');

module.exports = function(app) {
  if (app.isRegistered('generate-license')) return;
  app.use(require('generate-defaults'));

  app.task('mit', function() {
    app.question('author.name', 'Author\'s name?');
    app.data('argv', app.get('cache.argv.orig'));

    return app.src('*.tmpl', {cwd: templates()})
      .pipe(app.renderFile('*'))
      .pipe(filter('mit.tmpl'))
      .pipe(app.dest(function(file) {
        file.basename = app.option('license.basename') || 'LICENSE';
        return app.option('dest');
      }));
  });

  // aliases
  app.task('license', ['mit']);
  app.task('default', ['license']);
};

function filter(pattern, options) {
  var isMatch = matchFile.matcher(pattern, options);

  return through.obj(function(file, enc, next) {
    if (isMatch(file)) {
      next(null, file);
    } else {
      next();
    }
  });
}
