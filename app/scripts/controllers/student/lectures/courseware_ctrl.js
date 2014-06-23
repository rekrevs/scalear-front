'use strict';

angular.module('scalearAngularApp')
  .controller('coursewareCtrl', ['$scope','Course','$stateParams','$rootScope', '$interval','$log', '$state','Module', 'Page', 'util', function ($scope, Course, $stateParams, $rootScope, $interval, $log, $state, Module, Page, util) {
	Page.setTitle('head.lectures');

    var init = function()
    {
	    Course.getCourseware(
	    	{course_id: $stateParams.course_id}, function(data){
				$scope.course= JSON.parse(data.course);
				$log.debug($scope.course);
				$scope.today = data.today;	
				$scope.last_viewed = data.last_viewed
				$scope.modules_obj = util.toObjectById($scope.course.groups)
				var classname = 'lecture'

			 	if($state.params.module_id)
			 		$scope.current_module = $scope.modules_obj[$state.params.module_id]	
			 	else if($scope.last_viewed.module != -1)
			 		$scope.current_module = $scope.modules_obj[$scope.last_viewed.module]	
			 	else
			 		$scope.current_module = $scope.course.groups[0] 

			 	if($scope.current_module.items && $scope.current_module.items.length){
	    			if($state.params.lecture_id)
						$scope.current_item = $state.params.lecture_id
	    			else if($state.params.quiz_id){
	    				$scope.current_item = $state.params.quiz_id
		    			classname = 'quiz'
		    		}
					else if($scope.last_viewed.lecture)
						$scope.current_item = $scope.last_viewed.lecture
					else{
						$scope.current_item = $scope.current_module.items[0].id
			    		classname = $scope.current_module.items[0].class_name
					}
			 	}
			    if($scope.current_module && $scope.current_item){	
			    	var params = {'module_id': $scope.current_module.id}	
			    	params[classname+'_id'] = $scope.current_item
					$state.go('course.courseware.module.'+classname, params)
				}
	    	});
	}

	$scope.showModule = function(module){
		$scope.current_module = module
		Module.getLastWatched(
			{course_id: $stateParams.course_id, module_id: module.id}, function(data){
				if(data.last_watched != -1){
					$state.go('course.courseware.module.lecture', {'module_id': module.id, 'lecture_id': data.last_watched})
					$scope.current_item = data.last_watched
				}
				else{
					$state.go('course.courseware.module.quiz', {'module_id': module.id, 'quiz_id': module.quizzes[0].id})
					$scope.current_item = module.quizzes[0].id
				}
			}
		)		
	}

	$scope.$watch('current_module', function(){
		if($scope.current_module)
			$scope.spacing = 80/$scope.current_module.quizzes.concat($scope.current_module.lectures).length
	})

	init();
	
  }]);
