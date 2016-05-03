'use strict';

angular.module('scalearAngularApp')
.controller('courseCtrl', ['$rootScope', '$stateParams', '$scope', 'Course', '$log', '$cookieStore', 'scalear_utils','course_data', '$state','ContentNavigator', '$window','MobileDetector', function ($rootScope, $stateParams, $scope, Course, $log, $cookieStore, scalear_utils,course_data, $state, ContentNavigator,$window, MobileDetector) {
 	angular.extend($scope.$parent, course_data)
 	if($state.includes("**.course")){
	 	if($rootScope.current_user.roles[0].id == 2){
	 		if(MobileDetector.isPhone() && angular.element($window).width() < 700 /*ipad 768x1024 */){
	 			$state.go('course.content_selector', {course_id:$scope.course.id})
	 		}
	 		else{
		 		if($scope.next_item.module != -1){
			        var params = {'module_id': $scope.next_item.module}    
			        params[$scope.next_item.item.class_name+'_id'] = $scope.next_item.item.id
			        $state.go('course.module.courseware.'+$scope.next_item.item.class_name, params)
			    }
			    else
			    	$state.go('course.course_information', {course_id:$scope.course.id})
			}
	 	}
	 	else
	 		$state.go('course.edit_course_information', {course_id:$scope.course.id})
	 }
	 $scope.$on('$destroy', function() {
    	ContentNavigator.close()
    	$scope.$parent.course= null
    });
	 

}]).factory('courseResolver',['$rootScope', '$stateParams', 'Course', '$log', '$cookieStore', 'scalear_utils','$q', function($rootScope, $stateParams, Course, $log, $cookieStore, scalear_utils,$q){
	var x={
	 	init:function(id){
		 	var deferred = $q.defer();
            var unwatch = $rootScope.$watch('current_user', function(){
                if($rootScope.current_user && $rootScope.current_user.roles){
                    unwatch()
                    if($rootScope.current_user.roles[0].id == 1 || $rootScope.current_user.roles[0].id == 5){
                        x.getTeacherData(id).then(function(data){
                            deferred.resolve(data); 
                        })
                    }
                    else if($rootScope.current_user.roles[0].id == 2){
                        x.getStudentData(id).then(function(data){
                            deferred.resolve(data); 
                        })
                    }         
                }
            });
            return deferred.promise
		},
	 	getTeacherData:function(id){
	 		var deferred = $q.defer();
	 		var $scope = {}
	 		$cookieStore.remove('preview_as_student')
	      	$cookieStore.remove('old_user_id')
	      	$cookieStore.remove('new_user_id')
	      	$cookieStore.remove('course_id')
	 		Course.getCourseEditor(
	 			{course_id:id},
	 			function(data){
			 		$scope.course=data.course
			 		$scope.course.modules=data.groups
			 		$scope.module_obj ={}
			 		$scope.items_obj ={lecture:{}, quiz:{}, customlink:{}}
			 		$scope.course.modules.forEach(function(module){
			 			$scope.module_obj[module.id] = module
			 			module.items.forEach(function(item){
			 				$scope.items_obj[item.class_name][item.id] = item
			 			})
			 		})
			 		deferred.resolve($scope); 
			    },
			    function(){
			    	deferred.reject();
			    }
		    )
		    return deferred.promise;
	 	},
	 	getStudentData:function(id){
	 		var deferred = $q.defer();
	 		var $scope = {}
	 		Course.getCourseware(
		    	{course_id: id},
		    	function(data){
					$scope.course= JSON.parse(data.course);
					$scope.next_item = data.next_item
					$scope.module_obj = scalear_utils.toObjectById($scope.course.groups)
					$scope.course.markDone=function(module_id, item_id){
						var group_index= scalear_utils.getIndexById($scope.course.groups, module_id)//CourseEditor.getIndexById($scope.$parent.$parent.course.groups, data.done[1])
	                    var item_index= scalear_utils.getIndexById($scope.course.groups[group_index].items, item_id)//CourseEditor.getIndexById($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
	                    if(item_index!=-1 && group_index!=-1)
	                    	$rootScope.$broadcast("item_done", $scope.course.groups[group_index].items[item_index])
					}
					deferred.resolve($scope); 
				},
			 	function(){
			    	deferred.reject();
			    }
	    	)
    	 	return deferred.promise;
	 	}
 	}
 	return x
}])