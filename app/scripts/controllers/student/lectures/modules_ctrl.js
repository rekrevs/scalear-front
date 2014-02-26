'use strict';

angular.module('scalearAngularApp')
  .controller('studentModulesCtrl', ['$scope','Course','$stateParams','$rootScope', '$log','$window','Module', function ($scope, Course, $stateParams, $rootScope, $log, $window, Module) {

	$window.scrollTo(0, 0);

	
    var init = function()
    {
    	$scope.open_id="-1";
		$scope.open={};
		$scope.oneAtATime = true;
	
	    Module.getStudentModule(
	    	{course_id: $stateParams.course_id, module_id:$stateParams.module_id}, function(data){
                $scope.module_lectures= JSON.parse(data.module_lectures);
                $scope.lecture_ids = data.lecture_ids;

                for(var e=0; e<$scope.module_lectures.length; e ++)
                {
                    for(var element=$scope.module_lectures[e].online_quizzes.length-1; element>=0; element--) // if no answers remove it
                    {
                        if ($scope.module_lectures[e].online_quizzes[element].online_answers.length == 0 && $scope.module_lectures[e].online_quizzes[element].question_type!= "Free Text Question")
                            $scope.module_lectures[e].online_quizzes.splice(element, 1);
                    }
                }

            });
	}
	
	init();
    
  }]);
