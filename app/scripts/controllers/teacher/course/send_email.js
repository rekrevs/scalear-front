'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseSendEmailCtrl', ['$scope', '$http', 'emails', 'Course', 'studentsService' function ($scope, $http, emails, Course, studentsService) {
//    $scope.email = $routeParams.student;
        $scope.email = emails.data.email
        $scope.students = emails.data.students

        $scope.hello = function(students, subject, message){
            console.log(students);
            console.log(subject);
            console.log(message);
        }

        $scope.sendEmail = function(address, title, body){
//            var params = $.param({email: address, subject: title, message: body});
            Course.send_email_through({email:address, subject:title, message:body});
        }

        $scope.sendBatchEmail = function(title, body){
            emails = studentsService.getStudents();
            console.log(emails);
//            Course.send_batch_email_through({emails:emails, subject:title, message:body});
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
