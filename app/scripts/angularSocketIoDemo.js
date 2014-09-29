'use strict';

angular.module('angularSocketIoDemo', [
  'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute',
  'socket'
])
  .config(function ($routeProvider, socketProvider) {
    socketProvider.setWebSocketURL('http://localhost:3005');

    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
