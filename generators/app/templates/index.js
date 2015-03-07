'use strict';

var seneca = require('seneca'),
    fs = require('fs'),
    path = require('path'),
    pkg = require('./package.json');
/**
 * Iterates through all the services that exist
 */
function findModules(name, callback) {
  fs.readdir(name, function(err, contents) {
    var modules;

    // In case of non-existing director, return an empty array
    if (err) {
      return callback(null, []);
    }

    modules = contents.map(function(name) {
      var fullPath = path.join(__dirname, 'services', name);
      return require(fullPath);
    });

    return callback(null, modules);
  });
}

// Create the server to host the services.
console.log('[Seneca] Creating micro-service server.');
var server = seneca();

// Iterate through all the plugins
if (pkg.config.plugins) {
  Object.keys(pkg.config.plugins).forEach(function(plugin) {
    console.log('[Seneca] Adding plugin', plugin);
    var options = pkg.config.plugins[plugin];
    server.use(plugin, options);
  });
}

// Launch the services when the plugin loading is ready
console.log('[Seneca] Plugins loaded. Loading services.');

// Iterate through available services, listen for them.
findModules('services', function(err, contents) {
  if (contents.length === 0) {
    console.log('[Seneca] No services found.');
    return;
  }

  contents.forEach(function(module) {
    console.log('[Seneca] Adding service', module.pattern);

    server.add(module.pattern, module.callback);
  });

  console.log('[Seneca] Services added, listening for input.');
  server.listen();
});

console.log('[Seneca] Startup done, running...');