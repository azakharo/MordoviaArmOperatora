/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});


/////////////////////////////////////////////////////////////////////
// Redis - send messages to the client

var redis = require("redis");
var client1 = redis.createClient();
var curCard = null;
client1.on("message", function (channel, message) {
  //console.log("recv redis message - channel: " + channel + " msg: " + message);
  var recvMsg = JSON.parse(message);
  if (recvMsg.subject == "inserted" || recvMsg.subject == "ejected") {
    var card = recvMsg.data;
    console.log("card " + card.number + " " + recvMsg.subject);
    if (recvMsg.subject == "inserted") {
      curCard = card;
    }
    else {
      curCard = null;
    }
  }
});
client1.subscribe("test");

// Redis - send messages to the client
/////////////////////////////////////////////////////////////////////


// Expose app
exports = module.exports = app;
