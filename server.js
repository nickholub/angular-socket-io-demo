var _ = require('lodash');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3005);

app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, '.tmp'))); //TODO

var query2client = {};

function notifyClients(query, result) {
  console.log('notify', query,  result);
  var clients = query2client[query];
  if (clients) {
    clients.forEach(function (socket) {
      socket.emit('result', result);
    });
  }
}

function sendResult() {
  var queries = _.keys(query2client);
  queries.forEach(function (query) {
    var r = (query * 1000) + Math.floor(Math.random() * 100);
    var result = query + '->' + r;
    notifyClients(query, result);
  });
}

setInterval(sendResult, 500);

io.on('connection', function (socket) {
  console.log(socket.id);
  socket.on('query', function (data) {
    var query = data.query;
    console.log('query', query);
    var queryClients = query2client[query];
    if (!queryClients) {
      queryClients = [];
      query2client[query] = queryClients;
    }
    if (!_.contains(queryClients, socket)) {
      queryClients.push(socket);
    }
    console.log(query2client);
  });
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('disconnect', function () {
    //TODO free resources
    console.log(socket.id + ' disconnected ' + socket.connected);
  });
});