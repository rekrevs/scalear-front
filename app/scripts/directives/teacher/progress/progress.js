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
.directive("tab3",function(){
    return{
	    restrict: "E",
	    templateUrl:'views/teacher/progress/tab3.html' 
    };
})
.directive("tab4",function(){
    return{
	    restrict: "E",
	    templateUrl:'views/teacher/progress/tab4.html' 
    };
})