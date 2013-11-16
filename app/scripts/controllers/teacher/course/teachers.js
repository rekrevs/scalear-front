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

        $scope.addRow = function(index){
            $scope.teachers.splice(1, 0, {email: '', role : 'role', status:'pending'})
            console.log($scope.teachers);
        }
        $scope.removeRow = function(index){
            var answer = confirm('Are you sure that you want to remove \''+$scope.teachers[index].email+'\' from this course?');
            if(answer){
                Course.delete_teacher({email:$scope.teachers[index].email});
                $scope.teachers.splice(index, 1);
                console.log($scope.teachers);
            }
        }
        $scope.updateTeacher = function(index){
            Course.save_teacher({email:$scope.teachers[index].email, role_id:$scope.teachers[index].role});

        }
  }]);
