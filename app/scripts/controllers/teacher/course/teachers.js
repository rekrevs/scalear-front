'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseTeachersCtrl', ['$scope', '$http', 'Course', 'teachers', function ($scope, $http, Course, teachers) {
        $scope.teachers = teachers.data;
        console.log(teachers.data);

        $scope.getRole = function(value){
            if(value == 1){
                return "Admin"
            }
            else if(value == 2){
                return "User"
            }
            else if(value == 3){
                return "Professor"
            }
            else if(value == 4){
                return "TA"
            }
        }

        $scope.roles = [{value:3, text:'Professor'}, {value:4, text:'TA'}];

        $scope.hello = function(){
            console.log('delete clicked');
        }
  }]);
