'use strict';

angular.module('scalearAngularApp')
    .controller('TeacherCourseTeachersCtrl', ['$scope', '$http', '$state', 'Course', 'teachers','$stateParams', '$translate','$window', function ($scope, $http, $state, Course, teachers, $stateParams, $translate, $window) {
        
        $window.scrollTo(0, 0);
        
        console.log("in enrolled students");
        console.log($stateParams);

        $scope.teachers = teachers.data.data;
        $scope.new_teachers = []
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

        $scope.roles = [{value:3, text:'courses.professor'}, {value:4, text:'courses.ta'}];

        $scope.addRow = function(index){
            $scope.new_teachers.splice(index+1, 0, {email: null, role: null, status: "Pending"});
            console.log($scope.new_teachers);
        }

        $scope.removeRow = function(index){
            var answer = confirm($translate('courses.you_sure_remove_teacher'));
            if(answer){
                Course.deleteTeacher({course_id:$stateParams.course_id, email:$scope.teachers[index].email}, {},
                    function(value) {$scope.teachers.splice(index, 1);},
                    //handle the server error
                    function(value) {}
                )

                console.log($scope.teachers);
            }
        }
        $scope.updateTeacher = function(index){
            Course.updateTeacher({course_id:$stateParams.course_id},{email:$scope.teachers[index].email, role_id:$scope.teachers[index].role});
        }
        $scope.removeNewRow = function(index){
            $scope.new_teachers.splice(index, 1);
        }
        $scope.getTeachers= function(){
        	Course.getTeachers({course_id:$stateParams.course_id},
                  function(value){
                       $scope.teachers = value.data;
                       $scope.new_teachers = [];
                   },
                        //handle error
                   function(value){}
             )
        }
        $scope.saveTeachers = function(){
            Course.saveTeachers({course_id:$stateParams.course_id},{new_teachers:$scope.new_teachers},
                function(value) {
                    $scope.error = $scope.getTeachers();
                },
                //handle error
                function(value) {
                	$scope.errors=value.data.errors
                	for(var element in $scope.new_teachers)
                	{
                		$scope.new_teachers[element].error=$scope.errors[$scope.new_teachers[element].email]
                	}
                	console.log($scope.errors);
                	//$scope.error = $scope.getTeachers();
                }
            )

        }
        $scope.check = function(value, index){
            if(value == ''){
                $scope.new_teachers[index].email = null;
            }
        }

    }]);
