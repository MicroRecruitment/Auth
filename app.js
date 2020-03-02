'use strict';
const express = require('express');
const http = require('http');
const ctrl = require('./controller.js');

/* Routes */
const app = express();
const srv = http.createServer(app);
const PORT = 8080;

var controller = new ctrl();

srv.listen(PORT, function() {
  console.log('Server started on *:' + PORT);
});
