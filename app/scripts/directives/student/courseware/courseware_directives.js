'use strict';

angular.module('scalearAngularApp')
.directive("moduleProgressCheck",function(){
	return {
		restrict: "E",
		scope: {
			module: "&"
		},
		templateUrl: "/views/module_progress_check.html",
	  link: function(scope, element){
			var total = scope.module().items.filter(function(item){return item.graded}).length
	  		var unwatch = scope.$watch('module().items', function() {
				scope.module_done = calculateDone() == total
			}, true)

			var calculateDone = function(){
				return scope.module().items.filter(function(item){
					return (item.is_done && item.graded)
				}).length 
			}			

			scope.$on('$destroy', function(){
         		unwatch()
         	});
			
		}
	}
})