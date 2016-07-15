'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var bddStdin = require('bdd-stdin');
var intercept = require("intercept-stdout");
var generate = require('generate');
var npm = require('npm-install-global');
var gm = require('global-modules');
var del = require('delete');
var generator = require('./');
var app;

var actual = path.resolve.bind(path, __dirname, 'actual');
function symlink(dir, cb) {
  var src = path.resolve(dir);
  var name = path.basename(src);
  var dest = path.resolve(gm, name);
  fs.stat(dest, function(err, stat) {
    if (err) {
      fs.symlink(src, dest, cb);
    } else {
      cb();
    }
  });
}

function exists(name, re, cb) {
  return function(err) {
    if (err) return cb(err);
    var filepath = actual(name);
    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      var str = fs.readFileSync(filepath, 'utf8');
      assert(re.test(str));
      del(actual(), cb);
    });
  };
}

var intercepted = false;
var unhook_intercept = intercept(function (txt) {
  if (intercepted) {
    if (txt.indexOf('[?25h') === 1) {
      intercepted = false;
    }
    return '';
  } else {
    if (txt.indexOf('Which license do you want to write?') !== -1) {
      intercepted = true;
      return '';
    } else {
      return txt;
    }
  }
});

describe('generate-license', function() {
  if (!process.env.CI && !process.env.TRAVIS) {
    // if tests are being run manually, this will install generate globally
    // if it isn't already, so we can test behavior with Generate's CLI
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  after(function () {
    unhook_intercept();
  });

  beforeEach(function () {
    app = generate({silent: true});
    app.cwd = actual();
    app.option('dest', actual());
    app.option('askWhen', 'not-answered');
    app.option('basename', 'LICENSE');

    // provide template data to avoid prompts
    app.data(require('./package'));
    app.data({
      author: {
        name: 'Jon Schlinkert',
        username: 'jonschlnkert',
        url: 'https://github.com/jonschlinkert'
      }
    });
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'generate-license') {
          count++;
        }
      });
      app.use(generator);
      app.use(generator);
      app.use(generator);
      assert.equal(count, 1);
      cb();
    });

    it('should extend tasks onto the instance', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('license'));
    });
  });

  describe('tasks', function() {
    beforeEach(function() {
      app.use(generator);
    });

    it('should run the `default` task with .build', function(cb) {
      bddStdin('\n');
      app.build('default', exists('LICENSE', /MIT License/, cb));
    });

    it('should run the `default` task with .generate', function(cb) {
      bddStdin('\n');
      app.generate('default', exists('LICENSE', /MIT License/, cb));
    });

    it('should run the `license` task with .build', function(cb) {
      bddStdin('\n');
      app.build('license', exists('LICENSE', /MIT License/, cb));
    });

    it('should run the `license` task with .generate', function(cb) {
      bddStdin('\n');
      app.generate('license', exists('LICENSE', /MIT License/, cb));
    });
  });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('generator (CLI)', function() {
      before(function(cb) {
        symlink(__dirname, cb);
      });

      it('should run the default task using the `generate-license` name', function(cb) {
        bddStdin('\n');
        app.use(generator);
        app.generate('generate-license', exists('LICENSE', /MIT License/, cb));
      });

      it('should run the default task using the `license` generator alias', function(cb) {
        bddStdin('\n');
        app.use(generator);
        app.generate('license', exists('LICENSE', /MIT License/, cb));
      });
    });
  }

  describe('generator (API)', function() {
    it('should run the `agpl-3.0` task when defined explicitly', function(cb) {
      app.register('license', generator);
      app.generate('license:agpl-3.0', exists('LICENSE', /GNU AFFERO GENERAL PUBLIC LICENSE/, cb));
    });
    it('should run the `apache-2.0` task when defined explicitly', function(cb) {
      app.register('license', generator);
      app.generate('license:apache-2.0', exists('LICENSE', /Apache License/, cb));
    });
    it('should run the `artistic-2.0` task when defined explicitly', function(cb) {
      app.register('license', generator);
      app.generate('license:artistic-2.0', exists('LICENSE', /The Artistic License/, cb));
    });
    it('should run the `mit` task when defined explicitly', function(cb) {
      app.register('license', generator);
      app.generate('license:mit', exists('LICENSE', /MIT License/, cb));
    });
    it('should run the default task on the generator', function (cb) {
      bddStdin('\n');
      app.register('license', generator);
      app.generate('license', exists('LICENSE', /MIT License/, cb));
    });
    it('should run the `license` task', function(cb) {
      bddStdin('\n');
      app.register('license', generator);
      app.generate('license:license', exists('LICENSE', /MIT License/, cb));
    });
    it('should run the `default` task when defined explicitly', function(cb) {
      bddStdin('\n');
      app.register('license', generator);
      app.generate('license:default', exists('LICENSE', /MIT License/, cb));
    });
  });

  describe('sub-generator', function() {
    it('should work as a sub-generator', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license', exists('LICENSE', /MIT License/, cb));
    });

    it('should run the `default` task by default', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license', exists('LICENSE', /MIT License/, cb));
    });

    it('should run the `license:default` task when defined explicitly', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license:default', exists('LICENSE', /MIT License/, cb));
    });

    it('should run the `license:license` task', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license:license', exists('LICENSE', /MIT License/, cb));
    });

    it('should work with nested sub-generators', function(cb) {
      bddStdin('\n');
      app
        .register('foo', generator)
        .register('bar', generator)
        .register('baz', generator)

      app.generate('foo.bar.baz', exists('LICENSE', /MIT License/, cb));
    });
  });
});
