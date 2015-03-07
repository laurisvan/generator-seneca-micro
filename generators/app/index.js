'use strict';

var generators = require('yeoman-generator'),
    path = require('path');

module.exports = generators.Base.extend({
  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    // Custom options
    this.option('skip-install', {
      desc: 'Don\'t run npm install when running the generator'
    });
  },

  prompting: {
    app: function() {
      var _this = this,
          done = this.async(),
          prompts = [
            {
              type: 'input',
              name: 'name',
              message: 'What is the name of your micro-service server?',
              filter: function(input) {
                return _this._.camelize(_this._.slugify(_this._.humanize(input)));
              },
              'default': path.basename(process.cwd())
            },
            {
              type: 'input',
              name: 'description',
              message: 'What is the description your service (in package.json)?',
              'default': ''
            },
            {
              type: 'confirm',
              name: 'docker',
              message: 'Do you want to run the service in Docker?',
              'default': true
            },
            {
              type: 'input',
              when: function(data) { return data.docker; },
              name: 'ports',
              message: 'What ports do you want to expose to outside world (comma separated)?',
              'default': '10101',
              filter: function(input) {
                return input.split(/\s*,\s*/).map(function(n) { return parseInt(n, 10); });
              },
              validate: function(input) {
                var ports = input.split(/\s*,\s*/).map(function(n) { return parseInt(n, 10); }),
                    p;

                for (var i = 0; i < ports.length; i++) {
                  p = ports[i];
                  if (p <= 0 || p > 65535) {
                    return false;
                  }
                }
                return true;
              }
            }
          ];

      // Execute the prompts
      this.prompt(prompts, function(data) {
        _this.name = data.name;
        _this.description = data.description;
        _this.docker = data.docker;
        _this.ports = data.ports;
        done();
      });
    },

    plugins: function() {
      var _this = this,
          done = this.async(),
          count = 0,
          prompt = {
            type: 'confirm',
            name: 'addPlugin',
            message: (count === 0) ?
              'Do you want to add a (3rd party) Seneca plugin?' :
              'Do you want to add another Seneca plugin?',
            'default': false
          },
          innerPrompts = [
            {
              type: 'input',
              name: 'pluginName',
              message: 'Name of the plugin (e.g. \'mongo-store\')?',
              validate: function(input) {
                return /\w+/.test(input);
              }
            },
            {
              type: 'input',
              name: 'pluginVersion',
              message: 'Package version/URL (as in NPM manifest,' +
                'e.g. \'^1.0.1\')?',
              'default': 'latest',
              validate: function() {
                // TODO This might require npm package lookup; complex!
                return true;
              }
            },
            {
              type: 'input',
              name: 'pluginOptions',
              message: 'Initialization options (e.g. ' +
                '{ "name": "dbname", "host": "localhost", "port": 27017 })',
              'default': '{}',
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

      function handler() {
        _this.prompt([ prompt ], function(data) {
          // If we weren't prompted for more, move on
          if (!data.addPlugin) {
            return done();
          }

          // Otherwise start to parse plugins recursively
          _this.prompt(innerPrompts, function(innerData) {
            // Did the user skip the plugin, anyway
            if (innerData.pluginName.length === 0) {
              return;
            }
            _this.plugins.push({
              name: innerData.pluginName,
              version: innerData.pluginVersion,
              options: innerData.pluginOptions
            });

            // Prompt for the next plugin
            handler();
          });
        });
      }

      // Start the recursion
      _this.plugins = [];
      handler();
    },

    services: function() {
      var _this = this,
          done = this.async(),
          count = 0,
          // Handler that prompts recursively
          handler = function() {
            var prompt = {
                type: 'confirm',
                name: 'addService',
                message: (count === 0) ?
                  'Do you want to add a service handler?' :
                  'Do you want to add another handler?',
                'default': false
              };

            _this.prompt([ prompt ], function(data) {
              if (data.addService) {
                _this.invoke('seneca-micro:service', {}, function() {
                  // Recursively add another service
                  return handler();
                });
                return count++;
              }

              // Otherwise move on
              done();
            });
          };

      // Start the recursion
      handler();
    }
  },

  configuring: function() {
    var _this = this;

    [ '.gitignore', '.jshintrc', '.npmignore', '.travis.yml' ]
    .forEach(function(file) {
      _this.fs.copy(
        _this.templatePath(file),
        _this.destinationPath(file)
      );
    });

    if (this.docker) {
      [ '.dockerignore' ].forEach(function(file) {
        _this.fs.copy(
          _this.templatePath(file),
          _this.destinationPath(file)
        );
      });
    }
  },

  writing: function() {
    var _this = this,
      // config and dependencies get injected to package.json
      dependencies = {
        seneca: 'latest'
      },
      config = {
        plugins: {
        }
      };

    _this.plugins.forEach(function(plugin) {
      dependencies['seneca-' + plugin.name] = plugin.version;
      config.plugins[plugin.name] = JSON.parse(plugin.options);
    });
    _this.dependencies = JSON.stringify(dependencies, null, 2);
    _this.packageConfig = JSON.stringify(config, null, 2);

    [ 'package.json', 'index.js', 'README.md' ]
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
  },

  end: function() {
    this.log('');
    this.log('Congratulations,', this.name, 'was created succesfully!');
    this.log('Now read README.md for further instructions for running it');
  }
});
