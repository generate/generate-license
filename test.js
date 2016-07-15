'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var bddStdin = require('bdd-stdin');
var generate = require('generate');
var npm = require('npm-install-global');
var del = require('delete');
var generator = require('./');
var app;

var cwd = path.resolve.bind(path, __dirname, 'actual');

function exists(name, re, cb) {
  return function(err) {
    if (err) return cb(err);
    var filepath = cwd(name);
    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      var str = fs.readFileSync(filepath, 'utf8');
      assert(re.test(str));
      del(path.dirname(filepath), cb);
    });
  };
}

describe('generate-license', function() {
  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('generate', cb);
    });
  }

  beforeEach(function () {
    app = generate({silent: true});
    app.cwd = cwd();
    app.option('dest', cwd());
    app.option('askWhen', 'not-answered');
    app.option('basename', 'LICENSE');

    // provide template data to avoid prompts
    app.data({
      author: {
        name: 'Jon Schlinkert',
        username: 'jonschlnkert',
        url: 'https://github.com/jonschlinkert'
      },
      project: {
        name: 'foo',
        description: 'bar',
        version: '0.1.0'
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

/*
    it('should run the `default` task with .build', function(cb) {
      app.use(generator);
      app.build('default', exists('LICENSE', cb));
    });
    it('should run the `default` task with .generate', function(cb) {
      app.use(generator);
      app.generate('default', exists('LICENSE', cb));
    });
    it('should run the `license` task with .build', function(cb) {
      app.use(generator);
      app.build('license', exists('LICENSE', cb));
    });

    it('should run the `license` task with .generate', function(cb) {
      app.use(generator);
      app.generate('license', exists('LICENSE', cb));
    });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('generator (CLI)', function() {
      it('should run the default task using the `generate-license` name', function(cb) {
        app.use(generator);
        app.generate('generate-license', exists('LICENSE', cb));
      });

      it('should run the default task using the `license` generator alias', function(cb) {
        app.use(generator);
        app.generate('license', exists('LICENSE', cb));
      });
    });
  }
  */

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
      app.generate('license:mit', exists('LICENSE', /Jon Schlinkert/, cb));
    });
    it('should run the default task on the generator', function (cb) {
      bddStdin('\n');
      app.register('license', generator);
      app.generate('license', exists('LICENSE', /Apache License/, cb));
    });
    it('should run the `license` task', function(cb) {
      bddStdin('\n');
      app.register('license', generator);
      app.generate('license:license', exists('LICENSE', /Apache License/, cb));
    });
    it('should run the `default` task when defined explicitly', function(cb) {
      bddStdin('\n');
      app.register('license', generator);
      app.generate('license:default', exists('LICENSE', /Apache License/, cb));
    });
  });

  describe('sub-generator', function() {
    it('should work as a sub-generator', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license', exists('LICENSE', /Apache License/, cb));
    });

    it('should run the `default` task by default', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license', exists('LICENSE', /Apache License/, cb));
    });

    it('should run the `license:default` task when defined explicitly', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license:default', exists('LICENSE', /Apache License/, cb));
    });

    it('should run the `license:license` task', function(cb) {
      bddStdin('\n');
      app.register('foo', function(foo) {
        foo.register('license', generator);
      });
      app.generate('foo.license:license', exists('LICENSE', /Apache License/, cb));
    });
/*
    it('should work with nested sub-generators', function(cb) {
      bddStdin('\n');
      app
        .register('foo', generator)
        .register('bar', generator)
        .register('baz', generator)

      app.generate('foo.bar.baz', exists('LICENSE', /Apache License/, cb));
    });
*/
  });
});
