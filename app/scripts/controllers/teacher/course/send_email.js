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

        $scope.sendEmail = function(address, title, body){
//            var params = $.param({email: address, subject: title, message: body});
            Course.send_email_through({email:address, subject:title, message:body}, console.log('worked!'), console.log('failed'))
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
