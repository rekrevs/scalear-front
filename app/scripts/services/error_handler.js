'use strict';

angular.module('scalearAngularApp')
.factory('ErrorHandler', ['$log',function ($log){
  var x={
    elementsList: $(),
    showMessage: function(content, cl, time){
      console.log("trying to see message")
      angular.element('.message').remove()
      $('<div/>').addClass('message')
      .addClass('valign-super')
      .addClass(cl)
      .hide()
      .fadeIn('fast')
      //.delay(time)
      //.fadeOut('fast', function() { $(this).remove(); })
      .appendTo(x.elementsList)
      .text(content);
    }
  }
  return x;
}]);