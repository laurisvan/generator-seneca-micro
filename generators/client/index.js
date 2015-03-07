'use strict';

var generators = require('yeoman-generator'),
    path = require('path');

module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);
  },

  prompting: function() {
    var _this = this,
        done = this.async(),
        prompts = [
          {
            type: 'input',
            name: 'name',
            message: 'What is the name of your micro-service client?',
            filter: function(input) {
              return _this._.camelize(_this._.slugify(_this._.humanize(input)));
            },
            'default': path.basename(process.cwd())
          },
          {
            type: 'input',
            name: 'description',
            message: 'What is the description your client (in package.json)?',
            'default': ''
          },
          {
            type: 'confirm',
            name: 'docker',
            message: 'Do you want to run the client in Docker?',
            'default': true
          },
          {
            type: 'input',
            name: 'message',
            message: 'What is the JSON message (e.g. { "foo": "bar" } ' +
              'your client sends?',
            validate: function(input) {
              try {
                return JSON.parse(input) instanceof Object;
              } catch (e) {
                return false;
              }
            },
            filter: function(input) {
              return JSON.stringify(JSON.parse(input));
            }
          }
        ];

    // Execute the prompts
    this.prompt(prompts, function(data) {
        _this.name = data.name;
        _this.description = data.description;
        _this.docker = data.docker;
        _this.message = data.message;

      done();
    });
  },

  configuring: function() {
    var _this = this;

    [
      '.gitignore', '.jshintrc', '.npmignore',
      '.travis.yml'
    ]
    .forEach(function(file) {
      _this.fs.copy(
        path.join(__dirname, '..', 'app', 'templates', file),
        _this.destinationPath(file)
      );
    });

    if (this.docker) {
      [ '.dockerignore' ].forEach(function(file) {
        _this.fs.copy(
          path.join(__dirname, '..', 'app', 'templates', file),
          _this.destinationPath(file)
        );
      });
    }
  },

  writing: function() {
    var _this = this;

    [
      'package.json', 'index.js'
    ]
    .forEach(function(file) {
      _this.template(file, file);
    });

    if (this.docker) {
      _this.template('Dockerfile', 'Dockerfile');
    }
  },

  install: function () {
    this.installDependencies({
      npm: true,
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
});
