'use strict';

angular.module('scalearAngularApp')
.factory('ErrorHandler', ['$log',function ($log){
  var x={
    elementsList: $(),
    showMessage: function(content, cl, time){
      angular.element('.message').remove()
      $('<div/>').addClass('message')
      .addClass('valign-super')
      .addClass(cl)
      .hide()
      .fadeIn('fast')
      .appendTo(x.elementsList)
      .text(content);
    }
  }
  return x;
}]);