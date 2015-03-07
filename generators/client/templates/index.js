'use strict';

var seneca = require('seneca'),
    client = seneca().client(),
    message = JSON.parse('<%= message %>');

// Construct a stub client and perform an action with it
client.act(message, function(err, data) {
  if (err) {
    console.error('[Seneca client] Error:', err);
  }

  console.log('[Seneca client] Response:', data);
});