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
.directive("innerTitle",function(){
    return{
	    restrict: "E",
	    scope: {
	    	time:'=',
	    	type:'@',
	    	title:'@'
	    },
	    template:'<span class="inner_title" >'+
					'<span style="cursor:pointer"><span ng-show="time!=null">[{{time|format:"mm:ss"}}]</span> {{type}}: '+ 
						'<span style="color:black;font-weight:normal">{{title}}</span>'+
					'</span>'+
				'</span>', 
	    link:function(scope){

	    }
    };
})
.directive("showBox",function(){
    return{
	    restrict: "E",
	    scope: {
	    	value:"=",
	    	action:"&"
	    },
	    template:'<span>| '+
					'<input type="checkbox" ng-model="value" ng-change="change()" />'+
					'<span style="font-size:12px;color:black;font-weight:normal"> Show in-class</span>'+
				'</span>', 
	    link:function(scope){
	    	scope.change=function(){
	    	 	scope.action()
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
.directive("inclassEstimate",function(){
    return{
	    restrict: "E",
	    scope: {
	    	time_quiz:'=timeQuiz',
	    	time_question:'=timeQuestion',
	    	quiz_count:'=quizCount',
	    	question_count:'=questionCount'
	    },
	    template:'<div ng-show="inclass_estimate" class="time_estimate">'+
					'<h4>Time Estimate</h4>'+
					'<span>In-class: <b>{{inclass_estimate}} minutes</b></span>'+
					'<a style="float:right;color:white;cursor:pointer" pop-over="popover_options">more...</a>'+
				'</div>', 
	    link:function(scope){
	    	scope.numbers = []
  	 		for (var i = 0; i <= 60; i++) {
		        scope.numbers.push(i);
		    }
  	 		var template = "<div style='color:black;font-size:12px'>"+
  	 						"<span class='span2' style='margin-left:0'>Time per quiz:<select style='font-size:12px; width:50px; height:20px; margin:5px' ng-model='time_quiz' ng-options='i for i in numbers'></select></span>"+
  	 						"<span class='span2' style='margin-top: 5px;margin-left: 15px;'>Quizzes for review: {{quiz_count}}</span><br><br>"+
  	 						"<span class='span2' style='margin-left:0; width:160px'>Time per question:<select style='font-size:12px; width:50px; height:20px; margin:5px' ng-model='time_question' ng-options='i for i in numbers'></select></span>"+	  	 						
  	 						"<span class='span2' style='margin-top: 5px;margin-left:0'>Questions for review: {{question_count}}</span><br><br>"+
  	 						"<span>Formula:</span><br>"+
  	 					    "<i style='text-align:center;'>( #Quizzes for review  * {{time_quiz}} ) + ( #Questions for review * {{time_question}} )</i>"+
  	 					   "</div>"

           	scope.popover_options={
            	content: template,
            	html:true,
            	placement:"bottom"
            }

            var estimateCalculator=function(){
		    	return scope.quiz_count * scope.time_quiz + scope.question_count * scope.time_question
		    }

            scope.$watchCollection('[time_quiz, time_question,quiz_count,question_count]', function(newValues){
  	 			scope.inclass_estimate = estimateCalculator()					
			});
	    }
    };
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
}).directive('progressItem',['CourseEditor','$state', function(CourseEditor, $state){
	return {
		 scope: {
		 	circlesize: '@',
		 	name:'=',
		 	id:'=',
            groupId: '=',
		 	className:'=',
		 	quizType:"=",
		 	spacing: '='
		 },
		 restrict: 'E', 
		 templateUrl: '/views/teacher/progress/progressItem.html',
		 link: function(scope, element){
		 	scope.$watch('done', function(){
		 		var canvas;
				var ctx;
				// console.log(element.children())
				var bg = element.children()[1].children[0]
				var ctx = ctx = bg.getContext('2d');
		 		if(scope.done == true){
					ctx.clearRect(0, 0, bg.width, bg.height);
					ctx.fillStyle = 'lightgreen';
					ctx.beginPath();
					ctx.moveTo(bg.width/2,bg.height/2);
					// console.log(scope.percentage)
					ctx.arc(bg.width/2,bg.height/2,bg.height/2,0,(Math.PI*2*(1)),false);
					ctx.lineTo(bg.width/2,bg.height/2);
					ctx.fill();
		 		}

		 	})

		 	scope.type= scope.className=="Quiz"? CourseEditor.capitalize(scope.quizType): scope.className;
             scope.url_with_protocol = function(url)
             {
                 if(url)
                     return url.match(/^http/)? url: 'http://'+url;
                 else
                     return url;
             }
            scope.showItem= function(item_id)
		 	{	
		 		
		 	}
		 }
	};
}]);


