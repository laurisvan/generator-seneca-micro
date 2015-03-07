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
            message: 'What is the name of the service handler (e.g. fooService)?',
            filter: function(input) {
              return _this._.camelize(_this._.slugify(_this._.humanize(input)));
            }
          },
          {
            type: 'input',
            name: 'pattern',
            message: 'What is the JSON pattern (e.g. { "foo": "bar" } ' +
              'it reacts to?',
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
      _this.pattern = data.pattern;

      done();
    });
  },

  writing: function() {
    var _this = this;

    [ 'index.js' ]
    .forEach(function(file) {
      _this.template(file, path.join('services', _this.name, file));
    });
  }
});
