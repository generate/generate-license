'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var clone = require('gh-clone');
var through = require('through2');
var extend = require('extend-shallow');
var parser = require('parser-front-matter');
var File = require('vinyl');
var yaml = require('js-yaml');
var del = require('delete');

var cwd = path.join.bind(path, __dirname);
var cache = {};
var paths = {
  support: cwd.bind(cwd, 'support'),
  templates: cwd.bind(cwd, 'templates'),
  vendor: cwd.bind(cwd, 'vendor/choosealicense'),
  licenses: cwd.bind(cwd, 'vendor/choosealicense/_licenses')
};

var yfm = {rename: {basename: 'LICENSE'}};

var replacements = {
  helpers: [],
  fields: {
    description: ['description', 'Project description?'],
    email: ['author.email', 'Author\'s primary email address?'],
    fullname: ['author.name', 'Author\'s full name?'],
    login: ['owner', 'Project owner (GitHub username or org)?'],
    project: ['name', 'Project name?']
  },
  basename: {
    'unlicense': 'UNLICENSE',
    'lgpl-3.0': 'LICENSE.lesser'
  },
  dependencies: {
    'lgpl-3.0': ['gpl-3.0', '\nThis will also generate a GNU General Public License v3.0 `LICENSE` * file in the current working directory.\n']
  },
  snippets: {
    'MIT License': 'The MIT License (MIT)'
  }
};

gulp.task('del', function() {
  return del(['vendor/*', 'templates']);
});

gulp.task('cache', function() {
  return del(['vendor/*', 'templates']);
});

gulp.task('convert', function(cb) {
  var json = {};
  gulp.src('*.txt', {cwd: paths.licenses()})
    .pipe(through.obj(function(file, enc, next) {
      parser.parse(file, function(err, res) {
        if (err) return next(err);
        var newFile = convert(res, replacements);
        json[newFile.stem] = {
          content: newFile.contents.toString(),
          data: newFile.data,
          path: newFile.path,
          basename: newFile.basename,
          stem: newFile.stem
        };
        next(null, newFile);
      });
    }))
    .pipe(gulp.dest(rename('templates', '.tmpl')))
    .pipe(through.obj(function(file, enc, next) {
      next();
    }, function(cb) {
      var file = new File({
        path: 'cache.json',
        contents: new Buffer(JSON.stringify(json, null, 2))
      });
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest('templates'))
});

gulp.task('data', function(cb) {
  replacements.helpers = buildData(replacements);
  cb();
});

gulp.task('clone', ['del'], function(cb) {
  clone({repo: 'github/choosealicense.com', dest: paths.vendor()}, function(err) {
    if (err) return cb(err);
    gulp.start(['data', 'convert'], cb);
  });
});

gulp.task('default', ['clone']);

function rename(dest, ext) {
  return function(file) {
    var extname = path.extname(file.path);
    var basename = path.basename(file.path, extname);
    file.path = path.join(path.dirname(file.path), basename + (ext || extname));
    return dest;
  };
}

function convert(parsed, replacements) {
  var file = new File({path: parsed.path, base: paths.licenses()});
  var str = parsed.content;
  var obj = extend({}, yfm);
  var data = extend({names: [file.stem]}, obj, parsed.data);

  // if the license depends on other licenses, add those to `names`
  var deps = replacements.dependencies[file.stem];
  if (deps) {
    data.names = data.names.concat(deps[0]);
    data.extra = deps[1] || '';
  }

  var basename = data.rename.basename;
  if (replacements.basename.hasOwnProperty(file.stem)) {
    basename = replacements.basename[file.stem];
  }

  var rename = { basename: basename };
  data.rename = rename;
  file.data = data;

  var prefix = '---\n' + yaml.dump(data) + '---\n';

  // '[LICENSE]': 'author.name'
  str = str.replace(/\t/g, '    ');
  replacements.helpers.forEach(function(obj) {
    str = str.split(obj.name).join(obj.tmpl);
  });

  for (var key in replacements.snippets) {
    if (replacements.snippets.hasOwnProperty(key)) {
      // replace only the first occurrence
      str = str.replace(key, replacements.snippets[key]);
    }
  }

  file.contents = new Buffer(prefix + str);
  return file;
}

function buildData(replacements) {
  var fields = yaml.safeLoad(fs.readFileSync(paths.vendor('_data/fields.yml')));
  var arr = [];
  fields.forEach(function(item) {
    var field = extend({}, item);
    var obj = {};
    obj.name = `[${field.name}]`;
    var name = field.name;
    var desc = field.description;

    var newField = replacements.fields[field.name];
    if (newField) {
      name = newField[0] || '';
      desc = newField[1] || desc || '';
    }

    name = name.split('"').join('\\"');
    desc = desc.split('"').join('\\"');

    if (field.name === 'year') {
      obj.tmpl = '<%= year %>';
    } else {
      obj.tmpl = `<%= ask("${name}", "${desc}") %>`;
    }
    arr.push(obj);
  });
  return arr;
}
