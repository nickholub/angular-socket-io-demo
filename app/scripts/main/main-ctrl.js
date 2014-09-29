'use strict';

angular.module('angularSocketIoDemo')
  .controller('SocketCtrl', function ($scope, socket) {
    $scope.query = Math.round(Math.random() * 10);

    var unresterFn = null;

    $scope.submitQuery = function () {
      if (unresterFn) {
        unresterFn(); // unsubscribe from previous query
      }

      unresterFn = socket.subscribe($scope.query, function (data) {
        $scope.result = data;
      }, $scope);
    };

    $scope.submitQuery();
  })
  .controller('MainCtrl', function () {
    //TODO
  });
