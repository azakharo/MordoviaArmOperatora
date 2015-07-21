'use strict';

var mod = angular.module('angularTubeApp');
mod.controller('TestCtrl', function ($scope, $log, socket) {
  $scope.message = 'Hello';
  //log('I am here');

  function onCardInserted(card) {
    log('card inserted');
    $scope.card = card;
  }

  function onCardEjected(card) {
    log('card ejected');
    $scope.card = null;
  }

  socket.subscr2CardEvents(onCardInserted, onCardEjected);

  $scope.$on('$destroy', function () {
    socket.unsubscr2CardEvents();
  });

  function log(msg) {
    $log.debug(msg);
  }

});
