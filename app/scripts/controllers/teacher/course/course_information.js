'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCourseInformationCtrl', ['$scope', '$stateParams', 'Course','$q', '$translate', '$log','$window', function ($scope, $stateParams, Course, $q, $translate, $log, $window) {

        $window.scrollTo(0, 0);
        Course.show({course_id:$stateParams.course_id},function(response){
        	$scope.data=response
        	$scope.timezones=response.timezones;
        });
        

        $scope.updateCourse = function(data,type){
            if(data && data instanceof Date){ 
                  data.setMinutes(data.getMinutes() + 120);
                  $scope.data.course[type] = data
            }
            var modified_course=angular.copy($scope.data.course);
            delete modified_course["id"];
            delete modified_course["created_at"];
            delete modified_course["updated_at"];
            delete modified_course["unique_identifier"];
            $log.debug(modified_course);
            Course.update(
                {course_id:$stateParams.course_id},
                {course:modified_course}
                ,function(response){
                	$scope.data=response;
                });
        }

		$scope.validateCourse = function(column,data) {
		      var d = $q.defer();
		      var course={}
		      course[column]=data;
		      Course.validateCourse({course_id:$stateParams.course_id},course,function(data){
		        d.resolve()
		      },function(data){
		        $log.debug(data.status);
		        $log.debug(data);
		        if(data.status==422)
		          d.resolve(data.data["errors"].join());
		        else
		          d.reject('Server Error');
		        }
		      )
		      return d.promise;
    	}; 

        // $scope.validateDuration=function(type,value){
            // if (value<1 || value >=1000)
                  // return $translate('courses.duration_invalid')
        // }

  }]);
