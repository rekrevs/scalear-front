'use strict';

angular.module('scalearAngularApp')
  .controller('sendEmailsCtrl', ['$scope', '$state', 'Course', 'batchEmailService', '$stateParams','$log','$window', function ($scope, $state, Course, batchEmailService, $stateParams,$log, $window) {

        $window.scrollTo(0, 0);
        $log.debug("in sending emails");
        $scope.batch_emails = batchEmailService.getEmails();
        $log.debug($scope.batch_emails.length);
        
        if($scope.batch_emails.length == 0){
            $state.go('course.enrolled_students');
        }
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
        $log.debug($scope.final_emails)

        $scope.sendBatchEmail = function(title, body){

            $log.debug($scope.batch_emails);
            Course.send_batch_email_through(
                {
                    course_id:$stateParams.course_id
                },
                {
                    emails:$scope.batch_emails,
                    subject:title,
                    message:body
                },
            function(){
                $state.go('course.enrolled_students')
            },
            function(){
            });

        }
        
       $scope.tinymceOptions= {
         plugins : "preview, table",//autolink,textcolor, lists,pagebreak,table,save,insertdatetime,preview,searchreplace,print,contextmenu,paste,directionality,noneditable,nonbreaking",
         theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,|,sub,sup,|,charmap,emotions,|,print,|,ltr,rtl",
  		}
  	
       
  }]);
