'use strict';

/**
 * Seneca-micro smoke test, adopted from 
 * https://github.com/yeoman/generator-node/blob/master/test/test-creation.js
 */
/* global describe, beforeEach, it */
var path = require('path'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test;

describe('seneca-micro', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.app = helpers.createGenerator('seneca-micro', [ '../../generators/app' ]);
      this.app.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'index.js',
      '.dockerignore',
      '.gitignore',
      '.jshintrc',
      '.npmignore',
      '.travis.yml',
      'Dockerfile',
      'package.json',
      'README.md'
    ];

    helpers.mockPrompt(this.app, {
      'name': 'myService',
      'description': 'Sample Seneca Service',
      'docker': true,
      'ports': [ 10101 ],
      'addPlugin': false,
      'addService': false
    });

    this.app.run(function () {
      assert.file(expected);
      assert.fileContent('package.json', /"name": "myService"/);
      done();
    });
  });
});

describe('seneca-micro:service', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.app = helpers.createGenerator('seneca-micro:service', [ '../../generators/service' ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'services/fooService/index.js'
    ];

    helpers.mockPrompt(this.app, {
      'name': 'fooService',
      'pattern': '{ "foo": "bar" }'
    });

    this.app.run(function () {
      assert.file(expected);
      done();
    });
  });
});

describe('seneca-micro:client', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        done(err);
        return;
      }

      this.app = helpers.createGenerator('seneca-micro:client', [ '../../generators/client' ]);
      this.app.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'index.js',
      '.dockerignore',
      '.gitignore',
      '.jshintrc',
      '.npmignore',
      '.travis.yml',
      'Dockerfile',
      'package.json'
    ];

    helpers.mockPrompt(this.app, {
      'name': 'myClient',
      'description': 'Sample Seneca Service',
      'docker': true,
      'message': '{ "foo": "bar" }'
    });

    this.app.run(function () {
      assert.file(expected);
      assert.fileContent('package.json', /"name": "myClient"/);
      done();
    });
  });
});