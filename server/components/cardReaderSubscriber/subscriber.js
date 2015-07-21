/**
 * Recv card reader messages.
 * Then broadcast updates to client.
 */

'use strict';

var mySocket = null;
exports.register = function(socket) {
  mySocket = socket;
};

exports.start = function(socket) {
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
        mySocket.emit('cardInserted', curCard);
      }
      else {
        curCard = null;
        mySocket.emit('cardEjected', null);
      }
    }
  });
  client1.subscribe("test");
};
