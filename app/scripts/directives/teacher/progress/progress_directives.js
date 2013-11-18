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
	        totalLecQuiz:"="
	    },
	    templateUrl:'views/teacher/progress/progress_matrix.html' 
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