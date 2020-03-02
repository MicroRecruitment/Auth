'use strict';
const io = require('socket.io');
const http = require('http');

const ctrl = require('./controller.js');

var srv = http.createServer();
var socket = io(srv);
const PORT = Math.round(Math.random() * 40000);

var controller = new ctrl();

srv.listen(PORT, function() {
  console.log('Server started on *:' + PORT);
});
