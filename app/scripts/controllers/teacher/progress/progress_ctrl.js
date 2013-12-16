'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['$scope', '$stateParams', '$location','Course','$log', '$window', function ($scope, $stateParams, $location, Course, $log, $window) {

  		$window.scrollTo(0, 0);
   		Course.getCourse({course_id:$stateParams.course_id},
			function(data){
				$scope.modules = data.groups
				$log.debug(data)
			}, 
			function(){

			})
			
		$scope.getLocation= function(){
			var str = $location.path();
		 	var res = str.match(/.*\/modules\/(\d+)/);
		 	return res?res[1]:0
		}
			
  }]);
