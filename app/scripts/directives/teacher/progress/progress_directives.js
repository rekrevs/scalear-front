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
	        show_popover:'=showPopover'
	    },
	    templateUrl:'/views/teacher/progress/progress_matrix.html', 
	    link:function(scope){
	    	if(scope.show_popover){
	    		var template="<div style='font-size:14px; color: black;'>"+
    							"<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:0 4px 4px 4px'><span translate>courses.original</span> "+
    							"<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:0 4px 4px 4px' value='Finished on Time' translate><span translate>courses.on_time</span> "+
    							"<input type='radio' name='stat' ng-model='student.status[module[0]]' ng-change='action({student_id:student.id, module_id:module[0], module_status:student.status[module[0]]})' style='margin:0 4px 4px 4px' value='Not Finished' translate><span translate>courses.not_done</span>"+
    						"</div>"
		    	scope.popover_options={
		        	content: template,
		        	title: "<span style='color: black;' translate>courses.change_status</span>",
		        	html:true,
		        	placement: 'top'
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
	    	title:'@',
	    	color: "="
	    },
	    template:'<span class="inner_title" >'+
					'<span style="cursor:pointer"><span ng-show="time!=null">[{{time|format:"mm:ss"}}]</span> {{type}}: '+ 
						'<span ng-style="title_style">{{title}}</span>'+
					'</span>'+
				'</span>', 
	    link:function(scope){
	    	scope.title_style = {"color":"black", "fontWeight":"normal"}
	    	scope.$watch('color',function(){
	    		if(scope.color)
	    			scope.title_style.color = scope.color
	    			
	    	})
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
					'<input type="checkbox" ng-model="value" ng-change="change()" style="margin:0"/> '+
					'<span style="font-size:12px;color:black;font-weight:normal" translate>courses.show_in_class</span>'+
				'</span>', 
	    link:function(scope,element){
	    	scope.change=function(){
	    		console.log("changes here")
	    	 	scope.action()
	    	 	angular.element('input').blur()
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
			lecture_id:'=lectureId',
			related_answers:'=relatedAnswers',
			display_only:'=displayOnly',
			graded: '@'
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
	    template:'<div class="time_estimate" style="z-index:1">'+
					'<h4 translate>courses.time_estimate</h4>'+
					'<div style="display: inline-block;">In-class: <b>{{inclass_estimate || 0}} <span translate>minutes</span></b></div>'+
					'<a pop-over="popover_options">{{"more" | translate}}...</a>'+
				'</div>', 
	    link:function(scope){
	    	scope.numbers = []
  	 		for (var i = 0; i <= 60; i++) {
		        scope.numbers.push(i);
		    }
  	 		var template = "<div style='color:black;font-size:12px'>"+
  	 						"<span class='span2' style='margin-left:0'><span translate>courses.time_per_quiz</span>:<select style='font-size:12px; width:50px; height:20px; margin:5px' ng-model='time_quiz' ng-options='i for i in numbers'></select></span>"+
  	 						"<span class='span2' style='margin-top: 5px;margin-left: 15px;'><span translate>courses.quizzes_for_review</span>: {{quiz_count}}</span><br><br>"+
  	 						"<span class='span2' style='margin-left:0; width:160px;clear:left'><span translate>courses.time_per_question</span>:<select style='font-size:12px; width:50px; height:20px; margin:5px' ng-model='time_question' ng-options='i for i in numbers'></select></span>"+	  	 						
  	 						"<span class='span2' style='margin-top: 5px;margin-left:0'><span translate>courses.questions_for_review</span>: {{question_count}}</span><br><br>"+
  	 						"<span translate>formula</span>:<br>"+
  	 					    "<i style='text-align:center;'>( #<span translate>courses.quizzes_for_review</span>  * {{time_quiz}} ) + ( #<span translate>courses.questions_for_review</span> * {{time_question}} )</i>"+
  	 					   "</div>"

           	scope.popover_options={
            	content: template,
            	html:true,
            	placement:"right"
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
		 	spacing: '=',
		 	selected: '='
		 },
		 restrict: 'E', 
		 templateUrl: '/views/teacher/progress/progress_item.html',
		 link: function(scope, element){
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
}]).directive('progressNavigator',['CourseEditor','$state', function(CourseEditor, $state){
	return {
		 scope: {
		 	circlesize: '@',
		 	modules: '='
		 },
		 restrict: 'E', 
		 templateUrl: '/views/teacher/progress/progress_navigator.html',
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


