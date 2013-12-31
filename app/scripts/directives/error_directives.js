'use strict';

angular.module('scalearAngularApp')
	.directive('appMessages', ['ErrorHandler',function(ErrorHandler) {

            var directiveDefinitionObject = {
            	 scope:{
            		 status:"="
            	 },
            	 replace:true,
            	 template: "<div ng-class='status==\"error\" ? \"errormove\" :\"successmove\" '><img  ng-src='{{status==\"error\" && \"images/error.png\" || \"images/success.png\"}}'/></div>",
                 link: function(scope, element, attrs) {
                	 ErrorHandler.elementsList.push($(element));
                 }
            };
            return directiveDefinitionObject;
 }]).directive('errorMessage', ['$log',function($log) {

            return {
            	restrict:"E",
            	scope:{
            		column: "@",
            		data: "="
            	},
            	replace:true,
            	template: "<div ng-if='error' class='errormessage'>{{error}}</div>",
                link: function(scope, element, attrs) {
                	$log.debug("in error directive")
                	scope.$watch(function(){
                		if(scope.data)
                		{var arr=scope.data[scope.column]
                	 	scope.error=arr.join();}
                	});

                }
            };

 }]);