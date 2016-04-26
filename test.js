'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var del = require('delete');
var generator = require('./');
var app;

function exists(name, cb) {
  var filepath = path.resolve(__dirname, 'actual', name);

  return function(err) {
    if (err) return cb(err);

    fs.stat(filepath, function(err, stat) {
      assert(stat);
      del(path.dirname(filepath), cb);
    });
  }
}

describe('generate-license', function() {
  beforeEach(function() {
    app = generate();

    app.option('dest', path.resolve(__dirname, 'actual'));
    app.option('askWhen', 'not-answered');
    app.data('author.name', 'Jon Schlinkert');
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
  });

  describe('generator', function() {
    it('should work as a plugin', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('mit'));
    });

    it('should work as a generator', function(cb) {
      app.register('license', generator);
      app.generate('license', exists('LICENSE', cb));
    });

    it('should run the `default` task', function(cb) {
      app.register('license', generator);
      app.generate('license:default', exists('LICENSE', cb));
    });

    it('should run the `mit` task', function(cb) {
      app.register('license', generator);
      app.generate('license:mit', exists('LICENSE', cb));
    });
  });
});
