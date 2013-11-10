'use strict';

angular.module('scalearAngularApp')
.factory('ErrorHandler', function () {    

  
  var x={
  	
  	 elementsList: $(),

     showMessage: function(content, cl, time) {
     		console.log(x.elementsList);
     		// x.elementsList=$("<div>dd</div>");
     		angular.element('.message').remove();
            $('<div/>')
                .addClass('message')
                .addClass(cl)
                .hide()
                .fadeIn('fast')
                //.delay(time)
                //.fadeOut('fast', function() { $(this).remove(); })
                .appendTo(x.elementsList)
                .text(content);
       },
       
  };
  return x;


});