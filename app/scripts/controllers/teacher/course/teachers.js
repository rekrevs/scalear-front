'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherCourseTeachersCtrl', ['$scope', '$http', '$state', 'Course', 'teachers','$stateParams',  function ($scope, $http, $state, Course, teachers, $stateParams) {
        
        console.log("in enrolled students");
		console.log($stateParams);
		
        $scope.teachers = teachers.data.data;
        $scope.new_teachers = []
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
            $scope.new_teachers.splice(index+1, 0, {email:'', role: '', status: 'pending'});
//            $scope.teachers.splice(index+1, 0, {email: '', role : 'role', status:'pending'})
            console.log($scope.new_teachers);
        }

        $scope.removeRow = function(index){
            var answer = confirm('Are you sure that you want to remove \''+$scope.teachers[index].email+'\' from this course?');
            if(answer){
                Course.deleteTeacher({course_id:$stateParams.course_id, email:$scope.teachers[index].email}).$promise.then(
                    function(value) {$scope.teachers.splice(index, 1);},
                    //handle the server error
                    function(value) {}
                )

                console.log($scope.teachers);
            }
        }
        $scope.updateTeacher = function(index){
            Course.updateTeacher({course_id:$stateParams.course_id, email:$scope.teachers[index].email, role_id:$scope.teachers[index].role});
        }
        $scope.removeNewRow = function(index){
            $scope.new_teachers.splice(index, 1);
        }
        $scope.saveTeachers = function(){
            Course.saveTeachers({course_id:$stateParams.course_id, new_teachers:$scope.new_teachers}).$promise.then(
                function(value) {
                    $scope.error = Course.getTeachers({}).$promise.then(
                        function(value){
                            $scope.teachers = value.data;
                            $scope.new_teachers = [];
                        },
                        //handle error
                        function(value){}
                    )
                },
                //handle error
                function(value) {}
            )

        }
  }]);
