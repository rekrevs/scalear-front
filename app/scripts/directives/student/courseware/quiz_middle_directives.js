'use strict';

angular.module('scalearAngularApp')
.directive('studentQuiz', ['Lecture','$stateParams','CourseEditor','$log',function(Lecture, $stateParams, CourseEditor, $log){
	return {
		scope: {
			quiz:"=",
			studentAnswers:"=",
			submitted:"=",
			correct:"="
			
		},
		restrict: 'E',
		templateUrl:'/views/student/lectures/student_quiz.html',
	link:function(scope){
		scope.updateValues= function(ques)
			{
				$log.debug("in value update");
				scope.values=0;
				
				if(scope.studentAnswers[ques]==="" && scope.studentAnswers[ques]===null)// ocq/mcq not solved
					scope.values=0;
			    else if(typeof(scope.studentAnswers[ques])=="number" || (typeof(scope.studentAnswers[ques])=="string" && scope.studentAnswers[ques].length>0)) //ocq solved
			    	scope.values=1;
				else{
					for(var element in scope.studentAnswers[ques]){
						if(scope.studentAnswers[ques][element]===true)
							scope.values=1;
					}
				}
				return scope.values
			};
			scope.valid= function(ques)
			{
				
				if(scope.updateValues(ques)===0)
					return false
				else
					return true
			}
	}
	};
}]);