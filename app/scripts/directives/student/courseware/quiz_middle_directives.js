'use strict';

angular.module('scalearAngularApp')
.directive('studentQuiz', ['Lecture','$stateParams','$log','$rootScope',function(Lecture, $stateParams, $log, $rootScope){
	return {
		scope: {
			quiz:"=",
			studentAnswers:"=",
			submitted:"=",
			correct:"=",
			explanation:"="			
		},
		restrict: 'E',
		templateUrl:'/views/student/lectures/student_quiz.html',
		link:function(scope){
			scope.index=0
			scope.getIndex=function(){
				return ++scope.index
			}
			scope.updateValues= function(ques){
				scope.values=0;			
				if(scope.studentAnswers[ques]=="" && scope.studentAnswers[ques]==null)// ocq/mcq not solved
					scope.values=0;
			    else if(typeof(scope.studentAnswers[ques])=="number" || (typeof(scope.studentAnswers[ques])=="string" && scope.studentAnswers[ques].length>0)) //ocq solved
			    	scope.values=1;
				else{
					for(var element in scope.studentAnswers[ques]){
						if(scope.studentAnswers[ques][element]==true)
							scope.values=1;
					}
				}
				return scope.values
			};
			scope.valid= function(ques){
				return scope.updateValues(ques)!=0
			}

			scope.getExplanationPop=function(id){
				console.log("id", id)
				scope.id = id
				return {
					content:'<div>{{explanation[id]}}{{explanation}}</div>',
		            html:true,
		            trigger:$rootScope.is_mobile? 'click' : 'hover',
		            placement:"right"
				}
			}
      // scope.$watch('correct', function(newval){
      //   if(scope.correct[scope.quiz.questions[0].id]==0){
	     //    scope.explanation_pop={
	     //        content:'<div>{{quiz.questions[0].answers[0].explanation}}</div>',
	     //        html:true,
	     //        trigger:$rootScope.is_mobile? 'click' : 'hover',
	     //        placement:"right"
	     //      }	
      //   }
      // })


		}
	};
}]);