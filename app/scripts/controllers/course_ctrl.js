'use strict';

angular.module('scalearAngularApp')

.controller('courseCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture','Quiz','CourseEditor','$location', '$translate','$log','$window','Page','$modal','Impersonate', '$cookieStore', '$timeout','$filter','CustomLink', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture,Quiz,CourseEditor, $location, $translate, $log, $window, Page,$modal,Impersonate, $cookieStore, $timeout, $filter, CustomLink) {
 	
 	var init = function(){
 		// $cookieStore.remove('preview_as_student')
   //    	$cookieStore.remove('old_user_id')
   //    	$cookieStore.remove('new_user_id')
   //    	$cookieStore.remove('course_id')
 		// $scope.open_id="-1";
	  //   $scope.open={};
	  //   $scope.oneAtATime = true;
	  //   $scope.init_loading=true
	  // 	if($rootScope.current_user.roles[0].id == 1 || $rootScope.current_user.roles[0].id == 5)
	 	// 	getTeacherData()
	 	// else if($rootScope.current_user.roles[0].id == 2){
	 	// 	getStudentData()
	 	// }
	 	var unwatch = $rootScope.$watch('current_user', function(){
			if($rootScope.current_user && $rootScope.current_user.roles){
				if($rootScope.current_user.roles[0].id == 1 || $rootScope.current_user.roles[0].id == 5)
			 		getTeacherData()
			 	else if($rootScope.current_user.roles[0].id == 2){
			 		getStudentData()
			 	}
			 	unwatch()
			}
		});
	}

 	init();

 	var getTeacherData=function(){
 		Course.getCourseEditor(
 			{course_id:$stateParams.course_id},
 			function(data){
 				$scope = $scope.$parent
		 		$scope.course=data.course
		 		$scope.course.custom_links = data.links
		 		$scope.modules=data.groups
		 		$scope.module_obj ={}
		 		$scope.items_obj ={}
                $scope.items_obj["lecture"]={}
                $scope.items_obj["quiz"]={}
		 		$scope.modules.forEach(function(module){
		 			$scope.module_obj[module.id] = module
		 			module.items.forEach(function(item){
		 				$scope.items_obj[item.class_name][item.id] = item
		 			})
		 		})

		 		// $scope.init_loading=false
		 		console.log("course ctrl")
		 		console.log($scope)
		    },
		    function(){
		    }
	    );
 	}

 	var getStudentData=function(){
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
	    	}
    	);
 	}

}]);