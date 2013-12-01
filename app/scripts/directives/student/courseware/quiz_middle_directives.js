'use strict';

angular.module('scalearAngularApp')
.directive('studentQuiz', ['Lecture','$stateParams','CourseEditor',function(Lecture, $stateParams, CourseEditor){
	return {
		scope: {
			quiz:"=",
			studentAnswers:"=",
			submitted:"=",
			correct:"="
			
		},
		restrict: 'E',
		template: "<table class='table'>"+
						"<tbody ng-repeat='question in quiz.questions'>"+
							"<tr>"+
								"<th width='10px'>{{$index+1}}</th><th colspan='2'>{{question.content}}</th><th ng-if='quiz.quiz_type==\"quiz\"'><p ng-if='correct[question.id]==1' class='green'>Correct</p><p ng-if='correct[question.id]==0' class='red'>Incorrect</p></th>"+
							 "</tr>"+
							 "<tr ng-if='question.question_type == \"Free Text Question\"'>"+
							      "<td><img src='/images/spacer.gif' height='1px' width='1px' /></td>"+
								  "<td colspan='2'><textarea ng-model='studentAnswers[question.id]' style='width:500px;height:100px;'></textarea></td>"+
							 "</tr>"+
							 "<tr ng-if='question.question_type.toUpperCase()==\"OCQ\" || question.question_type.toUpperCase()==\"MCQ\"' ng-repeat='answer in question.answers'>"+
  								"<td><img src='/images/spacer.gif' height='1px' width='1px' /></td>"+
								"<td ng-if='question.question_type==\"MCQ\"' width='10px;'><input atleastone ng-model='studentAnswers[question.id][answer.id]' ng-checked='studentAnswers[question.id][answer.id]'  name='ocq_{{question.id}}' type='checkbox' ng-change='updateValues({{question.id}})'/></td>"+
								"<td ng-if='question.question_type==\"OCQ\"' width='10px;'><input atleastone ng-model='studentAnswers[question.id]' value='{{answer.id}}'  name='ocq_{{question.id}}' type='radio' ng-change='updateValues({{question.id}})'/></td>"+
							 	"<td>{{answer.content}}<br/><span class='errormessage' ng-show='submitted && !valid(question.id)'>Must choose atleast one answer!</span></td>"+
							 	"<td ng-if='quiz.quiz_type==\"quiz\"'></td>"+
	   						"</tr>"+
	   						"<tr ng-if='question.question_type.toUpperCase()==\"DRAG\"'>"+	
	   							"<td><img src='/images/spacer.gif' height='1px' width='1px' /></td>"+
	   							"<td colspan='2' style='overflow:auto'>{{list}}"+
	   								"<ul class='sortable' ui-sortable ng-model='studentAnswers[question.id]'>"+
										"<li ng-repeat='answer in studentAnswers[question.id]' class='ui-state-default'>"+
											"<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>"+
											"{{answer}}"+
										"</li>"+
									"</ul>"+
								"</td>"+
								"<td ng-if='quiz.quiz_type==\"quiz\"'></td>"+
	  						"</tr>"+
						"</tbody>"+	
				"</table>",
	link:function(scope){
		scope.updateValues= function(ques)
			{
				console.log("in value update");
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
			scope.valid= function(ques)
			{
				
				if(scope.updateValues(ques)==0)
					return false
				else
					return true
			}
	}
	};
}]);