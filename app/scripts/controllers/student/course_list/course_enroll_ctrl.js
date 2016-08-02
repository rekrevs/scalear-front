'use strict';

angular.module('scalearAngularApp')
  .controller('CoursesEnrollCtrl',['$scope','Course','$state','$stateParams', '$timeout','$rootScope','UserSession','Page','$log','ErrorHandler','$interval', function ($scope, Course, $state, $stateParams, $timeout, $rootScope, UserSession,Page, $log,ErrorHandler,$interval) {
        $scope.user={}
        Course.enroll({},
          {unique_identifier : $stateParams.id},
          function(data){
            $state.go("course.course_information", {course_id: data.course.id})
            $rootScope.$broadcast('get_current_courses')
          }, function(response){
              $scope.user.errors=response;
              ErrorHandler.showMessage(response.data.errors, 'errorMessage', 4000, "error");
              if($rootScope.current_user)
                $state.go("course_list")
          })

  }]);
