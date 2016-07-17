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
              $rootScope.show_alert = "error";
              ErrorHandler.showMessage(response.data.errors, 'errorMessage', 2000);
              $interval(function() {
                $rootScope.show_alert = "";
              }, 4000, 1);
              if($rootScope.current_user)
                $state.go("course_list")
          }) 

  }]);
