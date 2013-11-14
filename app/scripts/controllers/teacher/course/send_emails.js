'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseSendEmailsCtrl', ['$scope', '$http', '$state', 'Course', 'batchEmailService',  function ($scope, $http, $state, Course, batchEmailService) {
        $scope.batch_emails = batchEmailService.getEmails();
        while($scope.batch_emails.indexOf(',') != -1){
            for(var i=0; i <$scope.batch_emails.length; i++){
                if($scope.batch_emails[i] == ','){
                    $scope.batch_emails.splice(i,1);
                }
            }
        }

        $scope.final_emails = "";
        for(var i=0; i< $scope.batch_emails.length; i++){
            $scope.final_emails += $scope.batch_emails[i]+'; ';
        }
        console.log($scope.final_emails)

        $scope.sendBatchEmail = function(title, body){

            console.log($scope.batch_emails);
            Course.send_batch_email_through({emails:$scope.batch_emails, subject:title, message:body});
            $state.go('course.enrolled_students')
        }


  }]);
