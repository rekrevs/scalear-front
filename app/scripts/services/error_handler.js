'use strict';

angular.module('scalearAngularApp')
.factory('ErrorHandler', ['$log',function ($log) {    

  
  var x={
  	
  	 elementsList: $(),

     showMessage: function(content, cl, time) {
     		$log.debug(x.elementsList);
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


}]);