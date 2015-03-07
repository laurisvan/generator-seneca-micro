'use strict';

var pattern = JSON.parse('<%= pattern %>');

function service(message, done) {
  // TODO Write your service here
  done(null, {
    message: 'TODO: Function implementation missing for <%= pattern %>'
  });
}

module.exports = {
  pattern: pattern,
  callback: service
};