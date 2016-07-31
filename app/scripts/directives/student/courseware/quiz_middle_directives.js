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
			scope.drag_explanation={}
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

			scope.getExplanationPop=function(id,drag_id){
				var x = 0
				if ( typeof(drag_id) == 'undefined'){
					x = '<div ng-bind-html="explanation['+id+']"></div>'
				}
				else{
					x ='<div ng-bind-html="explanation['+id+']['+drag_id+']"></div>'
				}
				return {
					content:x,
		            html:true,
		            trigger:$rootScope.is_mobile? 'click' : 'hover',
		            placement:"left"
				}
			}



		}
	};
}]);