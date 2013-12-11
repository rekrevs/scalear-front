'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseSendEmailCtrl', ['$scope', '$http', 'emails', 'Course', 'batchEmailService', '$stateParams','$state', function ($scope, $http, emails, Course, batchEmailService, $stateParams, $state) {

        console.log("in send emails");
        console.log($stateParams);

        $scope.email = emails.data.email

        $scope.sendEmail = function(address, title, body){
            Course.send_email_through(
                {course_id:$stateParams.course_id},
                {
                    email:address,
                    subject:title,
                    message:body
                },
                function(){
                    $state.go('course.enrolled_students')
                },
                function(){
                    console.log("BAD")
                }
            );
        }
  }]);
