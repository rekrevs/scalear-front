'use strict';

angular.module('scalearAngularApp')

.controller('courseCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture','Quiz','CourseEditor','$location', '$translate','$log','$window','Page','$modal','Impersonate', '$cookieStore', '$timeout','$filter','CustomLink','util', function ($rootScope, $stateParams, $scope, $state, Course, Module, Lecture,Quiz,CourseEditor, $location, $translate, $log, $window, Page,$modal,Impersonate, $cookieStore, $timeout, $filter, CustomLink, util) {
 	
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
	 	// $scope.course = null;
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
 		$scope = $scope.$parent
 		$scope.course = null
 		$cookieStore.remove('preview_as_student')
      	$cookieStore.remove('old_user_id')
      	$cookieStore.remove('new_user_id')
      	$cookieStore.remove('course_id')
 		Course.getCourseEditor(
 			{course_id:$stateParams.course_id},
 			function(data){
 				
		 		$scope.course=data.course
		 		$scope.course.custom_links = data.links
		 		$scope.course.modules=data.groups
		 		$scope.module_obj ={}
		 		$scope.items_obj ={lecture:{}, quiz:{}}
		 		$scope.course.modules.forEach(function(module){
		 			$scope.module_obj[module.id] = module
		 			module.items.forEach(function(item){
		 				$scope.items_obj[item.class_name][item.id] = item
		 			})
		 		})
		    },
		    function(){
		    }
	    );
 	}

 	var getStudentData=function(){
 		Course.getCourseware(
	    	{course_id: $stateParams.course_id}, function(data){
	    		$scope = $scope.$parent
				$scope.course= JSON.parse(data.course);
				$scope.course.custom_links = data.links
				$scope.today = data.today;	
				$scope.last_viewed = data.last_viewed
				$scope.module_obj = util.toObjectById($scope.course.groups)
				// console.log("last viiew")
				// console.log($scope.last_viewed)
				// if($scope.last_viewed.module == -1)
				// 	$scope.last_viewed.module= $scope.course.groups[0]
				// $scope.selected_module = $scope.last_viewed.module != -1? $scope.modules_obj[$scope.last_viewed.module] : $scope.course.groups[0]		 		
		 	// 	if($scope.selected_module.items && $scope.selected_module.items.length){
 			// 		$scope.selected_item = $scope.last_viewed.lecture? $scope.last_viewed.lecture : $scope.selected_module.items[0]
		 	// 	}
				// var classname = 'lecture'

			 	// if($state.params.module_id)
			 	// 	$scope.current_module = $scope.modules_obj[$state.params.module_id]	
			 	// if($scope.last_viewed.module != -1)
			 	// else
			 	// 	$scope.current_module = 
			 	// if($scope.last_viewed.module != -1){
		 		// 	$scope.current_module = $scope.last_viewed.module
		 		// // 	if($scope.current_module.items && $scope.current_module.items.length){
					// // 	$scope.current_item = $scope.last_viewed.lecture
					// // }
		 		// }
		 		// else{
 			  	
			 	// if($scope.current_module.items && $scope.current_module.items.length){
			 	// 	if($scope.last_viewed.lecture){
					// 	$scope.current_item = $scope.last_viewed.lecture
					// 	classname = 'lecture'
					// }
					// else{
					// 	$scope.current_item = $scope.current_module.items[0].id
			  //   		classname = $scope.current_module.items[0].class_name
					// }

	    			//if($state.params.lecture_id)
						// $scope.current_item = $state.params.lecture_id
	    			// if($state.params.quiz_id){
	    			// 	$scope.current_item = $state.params.quiz_id
		    		// 	classname = 'quiz'
		    		// }
			 	// }

			 	// console.log(classname)
			 	// console.log($scope.current_module)
			 	// console.log($scope.current_item)
			 //    if($scope.current_module && $scope.current_item){	
			 //    	var params = {'module_id': $scope.current_module.id}	
			 //    	params[classname+'_id'] = $scope.current_item
				// 	$state.go('course.module.courseware.'+classname, params)
				// }
	    	}
    	);
 	}

}]);