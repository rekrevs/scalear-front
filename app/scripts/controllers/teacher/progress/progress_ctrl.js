'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['$scope', '$stateParams', '$location','Course','$log', '$window','Page','$anchorScroll','$timeout', function ($scope, $stateParams, $location, Course, $log, $window,Page,$anchorScroll,$timeout) {

  		$window.scrollTo(0, 0);
  		Page.setTitle('head.progress')
   		//Course.getCourse({course_id:$stateParams.course_id},
  		$scope.open=[]
   		Course.getCourseEditor({course_id:$stateParams.course_id},
			function(data){
				$scope.modules = data.groups
				$log.debug(data)
			}, 
			function(){

			}
		)
			
		$scope.getLocation= function(){
			var str = $location.path();
		 	var res = str.match(/.*\/modules\/(\d+)/);
		 	return res?res[1]:0
		}

		$scope.invertOpen = function(id)
		{
			if($scope.open[id])
				$scope.open[id] = false
			else{ 
				for(var i in $scope.open)
					$scope.open[i]=false;
				$scope.open[id] = true
			}
		}

		$scope.scrollTo = function(item) {
			var id
			if(item.class_name == 'quiz')
				id = item.quiz_type
			else
				id="lecture"
			id+="_"+item.id

	      $location.hash(id);
	      $anchorScroll();
	      $timeout(function(){$window.scrollTo($window.scrollX, $window.scrollY-44)})
	   	}
			
  }]);
