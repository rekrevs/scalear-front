'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseTeachersCtrl', ['$scope', '$http', 'Course', 'teachers', function ($scope, $http, Course, teachers) {
        $scope.teachers = teachers.data;
        console.log(teachers.data);

//        $scope.rows[0] = "<td>"+$scope.teachers[0].email+"</td><td  style = \'width:500px\'><details-select value=\'" + $scope.teachers[0].role + "\' options=\'roles\' save=\'\' style=\'width: 120px;\'></details-select></td>";
//        for(var i=0; i<$scope.teachers.length; i++){
//            var teacher = $scope.teachers[i];
//            $scope.rows.splice(i, 0, "<td>"+teacher.email+"</td><td  style = \'width:500px\'><details-select value=\'" + teacher.role + "\' options=\'roles\' save=\'\' style=\'width: 120px;\'></details-select></td>")
//        }


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

        $scope.add_row = function(index){
//            var students = angular.copy($scope.teachers)
//            var teachers_table = angular.element(document.querySelector('#teachers'))
//            teachers_table.append("<tr>" +"<td>" + "<input type='email' required placeholder='Email' id='email' name='email'/></td><td><select name='role'><option value='3'>Professor</option><option value='4'>TA</option></select></td><td></td><td><img src='../../../images/trash3.png' style='cursor: pointer;' ng-click='remove_row(this)' /></td></tr>")
//            console.log($scope.teachers)
            $scope.teachers.splice(1, 0, {email: '', role : 'role', status:'pending'})
            console.log($scope.teachers);
        }
        $scope.remove_row = function(index){
            $scope.teachers.splice(index, 1);
            console.log($scope.teachers);
        }
  }]);
