'use strict';

angular.module('scalearAngularApp')
  .directive("progressMatrix",function(){
    return{
	    restrict: "E",
	    scope: {
	        columnNames:"=",
	        students:"=",
	        status:"=",
	        solvedCount:"=",
	        totalLecQuiz:"=",
	        action:"&",
	        popover:'='
	    },
	    templateUrl:'/views/teacher/progress/progress_matrix.html', 
	    link:function(scope){
	    	if(scope.popover){
	    		var template="<div style='font-size:14px'>"+
    							"<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:4px'><span translate>courses.original</span>"+
    							"<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:4px' value='Finished on Time' translate><span translate>courses.on_time</span>"+
    							"<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:4px' value='Not Finished' translate><span translate>courses.not_done</span>"+
    						"</div>"
		    	scope.popover_options={
		        	content: template,
		        	title: "<span translate>courses.change_status</span>",
		        	html:true
		        }
		    }
            scope.getImg = function(module)
            {
                module=parseInt(module);
                if(module==-1)
                    return "not_finished"
                else if(module==0)
                    return "finished_on_time"
                else
                    return "finished_not_on_time"
            }
	    }
    };
})
.directive("freeTextTable", function(){
	return {
		restrict:'E',
		scope:{
			question:'=',
			survey_id:'=surveyId',
			related_answers:'=relatedAnswers',
			display_only:'=displayOnly'
		},
	    templateUrl:'/views/teacher/progress/free_text_table.html', 
	    controller:'freeTextTableCtrl'
	}
})
.directive("tab1",function(){
    return{
	    restrict: "E",
	    controller: "lectureQuizzesCtrl",
	    templateUrl:'/views/teacher/progress/lecture_quizzes_tab.html' 
    };
})
.directive("tab2",function(){
    return{
	    restrict: "E",
	    controller: "studentStatisticsCtrl",
	    templateUrl:'/views/teacher/progress/student_statistics_tab.html' 
    };
})
.directive("tab3",function(){
    return{
	    restrict: "E",
	    controller: "lectureProgressCtrl",
	    templateUrl:'/views/teacher/progress/lecture_progress_tab.html' 
    };
})
.directive("tab4",function(){
    return{
	    restrict: "E",
	    controller: "quizzesProgressCtrl",
	    templateUrl:'/views/teacher/progress/quizzes_progress_tab.html' 
    };
})
.directive("tab5",function(){
    return{
	    restrict: "E",
	    controller: "surveysCtrl",
	    templateUrl:'/views/teacher/progress/surveys_tab.html' 
    };
})
.directive("tab6",function(){
    return{
	    restrict: "E",
	    controller: "quizzesCtrl",
	    templateUrl:'/views/teacher/progress/quizzes_tab.html' 
    };
})