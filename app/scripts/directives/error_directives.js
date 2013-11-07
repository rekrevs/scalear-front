'use strict';

angular.module('scalearAngularApp')
	.directive('appMessages', function(ErrorHandler) {
			
            var directiveDefinitionObject = {
            	replace:true,
            	template: "<div class='errormove'><img  src='images/error.png'/></div>",
                link: function(scope, element, attrs) { 
                	console.log(element);
                	ErrorHandler.elementsList.push($(element)); 
                }
            };
            return directiveDefinitionObject;
 });