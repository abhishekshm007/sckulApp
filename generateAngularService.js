var generateServices = require('loopback-sdk-angular').services;
var app = require('./server/server');

var client = generateServices(app, 'lbServices', '/api');
require('fs').writeFileSync('client/loopback.js', client, 'utf-8');
