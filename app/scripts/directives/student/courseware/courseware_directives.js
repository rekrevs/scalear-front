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
			var optional = (total==0)
			if (optional)
				total = scope.module().items.filter(function(item){return item.class_name!="customlink"}).length
			var unwatch = scope.$watch('module().items', function() {
				scope.module_done = calculateDone() == total
			}, true)

			var calculateDone = function(){
				if(optional){
					var done = function(item){
						return (item.is_done && item.class_name!="customlink")
					}
				}
				else{
					var done = function(item){
						return (item.is_done && item.graded)
					}
				}
				return scope.module().items.filter(done).length
			}			

			scope.$on('$destroy', function(){
				unwatch()
			});

		}
	}
})