'use strict';

angular.module('scalearAngularApp')
	.directive('appMessages', ['ErrorHandler',function(ErrorHandler) {
			
            var directiveDefinitionObject = {
            	replace:true,
            	template: "<div class='errormove'><img  src='images/error.png'/></div>",
                link: function(scope, element, attrs) {
                	console.log(element);
                	ErrorHandler.elementsList.push($(element)); 
                }
            };
            return directiveDefinitionObject;
 }]).directive('errorMessage', [function() {
			
            return {
            	restrict:"E",
            	scope:{
            		column: "@",
            		data: "="
            	},
            	replace:true,
            	template: "<div ng-if='error' class='errormessage'>{{error}}</div>",
                link: function(scope, element, attrs) {
                	console.log("in error directive")
                	scope.$watch(function(){
                		if(scope.data)
                		{var arr=scope.data[scope.column]
                	 	scope.error=arr.join();}	
                	});
                	 
                }
            };
            
 }]);