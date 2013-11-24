'use strict';

angular.module('scalearAngularApp')
  .directive("progressMatrix",function(){
    return{
	    restrict: "E",
	    scope: {
	        columnNames:"=",
	        students:"=",
	        status:"=",
	        lateCount:"=",
	        solvedCount:"=",
	        totalLecQuiz:"=",
	        action:"&",
	        popover:'='
	    },
	    templateUrl:'views/teacher/progress/progress_matrix.html', 
	    link:function(scope){
	    	if(scope.popover){
	    		var template="<div style='font-size:14px'>"+
    							"<input type='radio' name='stat' ng-model='student.status[id]' ng-change='action({student_id:student.id, module_id:id, module_status:student.status[id]})' style='margin:4px'>Original"+
    							"<input type='radio' name='stat' ng-model='student.status[id]' ng-change='action({student_id:student.id, module_id:id, module_status:student.status[id]})' style='margin:4px' value='Finished on Time'>On Time"+
    							"<input type='radio' name='stat' ng-model='student.status[id]' ng-change='action({student_id:student.id, module_id:id, module_status:student.status[id]})' style='margin:4px' value='Not Finished'>Not Done"+
    						"</div>"
		    	scope.popover_options={
		        	content: template,
		        	title: "Change Status",
		        	html:true
		        }
		    }
		    scope.module_ids=[]
		    if(scope.students[0])
			    for(var id in scope.status[scope.students[0].id])
			    	scope.module_ids.push(id)
	    }
    };
})
.directive("tab1",function(){
    return{
	    restrict: "E",
	    controller: "lectureQuizzesCtrl",
	    templateUrl:'views/teacher/progress/lecture_quizzes_tab.html' 
    };
})
.directive("tab2",function(){
    return{
	    restrict: "E",
	    controller: "studentStatisticsCtrl",
	    templateUrl:'views/teacher/progress/student_statistics_tab.html' 
    };
})
.directive("tab3",function(){
    return{
	    restrict: "E",
	    controller: "lectureProgressCtrl",
	    templateUrl:'views/teacher/progress/lecture_progress_tab.html' 
    };
})
.directive("tab4",function(){
    return{
	    restrict: "E",
	    controller: "quizzesProgressCtrl",
	    templateUrl:'views/teacher/progress/quizzes_progress_tab.html' 
    };
})
.directive("tab5",function(){
    return{
	    restrict: "E",
	    controller: "surveysCtrl",
	    templateUrl:'views/teacher/progress/surveys_tab.html' 
    };
})
.directive("tab6",function(){
    return{
	    restrict: "E",
	    controller: "quizzesCtrl",
	    templateUrl:'views/teacher/progress/quizzes_tab.html' 
    };
})