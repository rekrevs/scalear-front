'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseSendEmailCtrl', ['$scope', '$http', 'emails', 'Course', function ($scope, $http, emails, Course) {
//    $scope.email = $routeParams.student;
        $scope.email = emails.data.email

        $scope.hello = function(email, subject, message){
            console.log(email);
            console.log(subject);
            console.log(message);
        }


//        $scope.sendEmail = function(){
////            Course.send_email_through(
////                {email:$scope.email},
////                {subject:$scope.subject},
////                {message:$scope.body}
////            )
//
//            $http.post('')
//        }


  }]);
