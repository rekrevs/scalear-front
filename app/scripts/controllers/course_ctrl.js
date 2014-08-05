'use strict';

angular.module('scalearAngularApp')

.controller('courseCtrl', ['$rootScope', '$stateParams', '$scope', 'Course', '$log', '$cookieStore', 'util','course_data', function ($rootScope, $stateParams, $scope, Course, $log, $cookieStore, util,course_data) {
 	
 	angular.extend($scope.$parent, course_data)

}]).factory('courseResolver',['$rootScope', '$stateParams', 'Course', '$log', '$cookieStore', 'util','$q', function($rootScope, $stateParams, Course, $log, $cookieStore, util,$q){
	var x={
	 	init:function(id){
		 	var deferred = $q.defer();
            var unwatch = $rootScope.$watch('current_user', function(){
                if($rootScope.current_user && $rootScope.current_user.roles){
                    unwatch()
                    if($rootScope.current_user.roles[0].id == 1 || $rootScope.current_user.roles[0].id == 5)
                        x.getTeacherData(id).then(function(data){
                            deferred.resolve(data); 
                        })
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
					$scope.course.custom_links = data.links
					$scope.today = data.today;	
					$scope.next_item = data.next_item
					$scope.module_obj = util.toObjectById($scope.course.groups)
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