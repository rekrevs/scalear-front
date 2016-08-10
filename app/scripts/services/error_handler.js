'use strict';

angular.module('scalearAngularApp')
  .factory('ErrorHandler', ['$log', '$rootScope', '$interval', function($log, $rootScope, $interval) {

    var $elementsList = $()

    function showMessage(content, className, time, type) {
      $rootScope.$broadcast("ErrorMessage:show", type)
      angular.element('.message').remove()
      $('<div/>').addClass('message')
        .addClass('valign-super')
        .addClass(className)
        .hide()
        .fadeIn('fast')
        .appendTo($elementsList)
        .text(content);

      if(time){
        $interval(function() {
          $rootScope.$broadcast("ErrorMessage:hide")
        }, time, 1);
      }
    }

    function addToElementList($el) {
      $elementsList.push($el)
    }

    return {
      showMessage: showMessage,
      addToElementList: addToElementList
    }
  }]);
