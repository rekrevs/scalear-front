'use strict';

angular.module('scalearAngularApp')
	.directive('appMessages', ['ErrorHandler',function(ErrorHandler) {

            var directiveDefinitionObject = {
            	 scope:{
            		 status:"="
            	 },
            	 replace:true,
            	 templateUrl: "/views/app_messages.html",
                 link: function(scope, element) {
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
    	template: "<div ng-if='error' class='errormessage valign-super'>{{error}}</div>",
        link: function(scope) {
        	$log.debug("in error directive")
        	scope.$watch(function(){
        		if(scope.data)
        		{var arr=scope.data[scope.column]
        	 	scope.error=arr.join();}	
        	});               	 
        }
    };
 }]);