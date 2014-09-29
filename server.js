var _ = require('lodash');
var path = require('path');
var http = require('http');
var express = require('express');
var Queries = require('./queries');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

server.listen(3005);

app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, '.tmp'))); //TODO

var queries = new Queries();

function generateQueryResults() {
  var activeQueries = queries.getQueryList();
  console.log(io.sockets.adapter.rooms);
  console.log(activeQueries);
  console.log('_');

  activeQueries.forEach(function (query) {
    var r = (query * 1000) + Math.floor(Math.random() * 100);
    var result = query + '->' + r;

    // notify all sockets subscribed to the query
    io.to(query).emit(query, result);
  });
}

setInterval(generateQueryResults, 500);

io.on('connection', function (socket) {
  socket.emit('news', 'server data');
  socket.on('subscribe', function (data) {
    console.log('_sub ' + data.query);
    var query = data.query;
    socket.join(query); // join room with specified query
    queries.addQuery(socket.id, query);
  });

  socket.on('unsubscribe', function (data) {
    var query = data.query;
    socket.leave(query);
    queries.removeQuery(socket.id, query);
    //TODO clean up rooms
    /*
    var room = io.sockets.adapter.rooms[query];
    if (room && _.isEmpty(room)) {
      delete queries[query];
    }
    */
  });

  socket.on('disconnect', function () {
    console.log(socket.id + ' disconnected ' + socket.connected);
    queries.removeId(socket.id);
  });
});