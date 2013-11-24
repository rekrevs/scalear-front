'use strict';

var app = angular.module('scalearAngularApp')
  app.controller('TeacherCourseEnrolledStudentsCtrl', ['$scope', '$http','$location', '$state', 'Course', 'students', 'batchEmailService','$stateParams', function ($scope, $http, $location, $state, Course, students, batchEmailService, $stateParams) {
        
        console.log("in enrolled students");
		console.log($stateParams);

        console.log(students.data.course);
        console.log(students.data.students);
        $scope.data = students.data.students;
        $scope.course = students.data.course;

        $scope.emails=[];
        batchEmailService.setEmails($scope.emails)



        $scope.removeStudent = function(student, index){
            console.log(student)
            var answer = confirm('Are you sure that you want to remove this student?');
            if(answer){
                //console.log('pressed yes')
                Course.remove_student({course_id:$stateParams.course_id ,student: student})
                //console.log(index);

                $scope.data.splice(index, 1);
            }
        }

        $scope.emailForm = function(){
            $state.go('course.send_emails');
        }

        $scope.selectAll = function(){

            $scope.checked = true;
            var checkboxes = angular.element('.checks');
            for(var i=0; i<checkboxes.length; i++){
                $scope.emails[i] = checkboxes[i].value;
                console.log(checkboxes[i].value);
            }
//            console.log(checkboxes);
//            console.log($scope.checked);
        }

        $scope.deSelectAll = function(){
            $scope.checked = false;
            for(var i=0; i< $scope.emails.length; i++){
                $scope.emails[i] = ',';
            }
            console.log($scope.checked);
        }

//      $scope.checked = true;
  }]);


