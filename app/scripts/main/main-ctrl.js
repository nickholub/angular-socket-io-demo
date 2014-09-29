'use strict';

angular.module('angularSocketIoDemo')
  .controller('SocketCtrl', function ($scope) {
    var socket = io.connect('http://localhost:3005');
    $scope.query = Math.round(Math.random() * 10);

    $scope.lastQuery = null;
    $scope.submitQuery = function () {
      if ($scope.lastQuery) {
        socket.emit('unsubscribe', { query: $scope.lastQuery });
      }

      $scope.lastQuery = $scope.query;
      socket.emit('subscribe', { query: $scope.query });
      socket.on($scope.query, function (data) {
        $scope.result = data;
        $scope.$apply();
        console.log('result', data);
      });
    };

    socket.on('connect', function() {
      $scope.submitQuery();
    });

    socket.on('result', function (data) {
      $scope.result = data;
      $scope.$apply();
      console.log('result', data);
    });

    socket.on('news', function (data) {
      console.log(data);
      socket.emit('my other event', { my: 'data' });
    });
  })
  .controller('MainCtrl', function ($scope) {
    //TODO
  });
