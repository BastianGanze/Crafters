'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Game = require("./game");

app.use(express.static(__dirname + '/../../'));

const port = 61692;
// server.listen(port, function () {
//     console.log('Server listening at port %d', port);
// });

const game = new Game(io);
