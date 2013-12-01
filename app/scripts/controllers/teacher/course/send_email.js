'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseSendEmailCtrl', ['$scope', '$http', 'emails', 'Course', 'batchEmailService', '$stateParams','$state', function ($scope, $http, emails, Course, batchEmailService, $stateParams, $state) {

console.log("in send emails");
console.log($stateParams);
//            $scope.batch_emails = batchEmailService.getEmails();
//            while($scope.batch_emails.indexOf(',') != -1){
//                for(var i=0; i <$scope.batch_emails.length; i++){
//                    console.log(i)
//                    console.log($scope.batch_emails[i])
//                    if($scope.batch_emails[i] == ','){
//                        $scope.batch_emails.splice(i,1);
//                    }
//                    else{
//                        console.log('no');
//                    }
//
//                }
//            }
//
//            $scope.final_emails = "";
//            for(var i=0; i< $scope.batch_emails.length; i++){
//                $scope.final_emails += $scope.batch_emails[i]+';';
//            }
//            console.log($scope.final_emails)

        $scope.email = emails.data.email
//        $scope.students = emails.data.st//udents

//        $scope.hello = function(students, subject, me//ssage){
//            console.log(stu//dents);
//            console.log(su//bject);
//            console.log(me//ssage);
//        }

        $scope.sendEmail = function(address, title, body){
//            var params = $.param({email: address, subject: title, message: body});
            Course.send_email_through(
                {
                    course_id:$stateParams.course_id
                },
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
