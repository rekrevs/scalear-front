'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseCourseInformationCtrl', ['$scope', '$stateParams','$http', 'Course','$q', '$translate',function ($scope, $stateParams,$http, Course, $q, $translate) {
        
       
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
            console.log(modified_course);
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
		        console.log(data.status);
		        console.log(data);
		        console.log(data.data["errors"][column])
		        if(data.status==422)
		          d.resolve(data.data["errors"][column].join());
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
