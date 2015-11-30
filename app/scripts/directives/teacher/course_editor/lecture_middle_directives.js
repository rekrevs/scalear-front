'use strict';

angular.module('scalearAngularApp')
.directive('quizList',function(){
	return {
		restrict: 'E', 
		templateUrl: '/views/teacher/course_editor/lecture.middle.quiz_list.html',
		// controller: 'lectureQuizListCtrl'
	};
})
.directive('markerList',function(){
	return {
		restrict: 'E', 
		templateUrl: '/views/teacher/course_editor/lecture.middle.marker_list.html',
		// controller: 'lectureMarkerListCtrl'
	};
})
.directive('quiz',function(){
	return {
		transclude: true,
		replace:true,
		restrict: 'E', 
		template: '<div class="ontop" id="ontop" style="position: absolute;width:100%; height: 100%; top:0px; left: 0px;" ng-class="lecture.aspect_ratio" ng-transclude></div>'
	};
})
.directive('quizEditPanel',['$timeout','$q','OnlineQuiz','$translate',function($timeout, $q, OnlineQuiz, $translate){
	return {		
		 restrict: 'E',
		 template: '<div id="editing">'+
						'<h6 class="row no-margin color-wheat wheat">'+
							'<span>{{double_click_msg |translate}}</span>'+
							'<div style="margin-top:10px;text-align:left;margin-left:0;">'+
								'<div class="small-12 columns" style="margin-bottom: 5px;"><span translate>editor.quiz_question</span>:</div>'+
								'<div class="small-12 left columns" style="margin-bottom: 15px;">'+
									'<input class="quiz_name" type="text" ng-model="selected_quiz.question" style="height: 30px;margin-bottom:0;">'+
									'<small class="error" ng-show="name_error" ng-bind="name_error"></small>'+
								'</div>'+
							'</div>'+
							// '<div class="row" style="text-align:left;margin-left:0;">'+
							// 	'<div class="small-3 columns"><span translate>editor.start_time</span>:</div>'+
							// 	'<div class="small-3 left columns no-padding" style="margin-bottom: 5px;">'+
							// 		'<input class="quiz_start_time" type="text" ng-model="selected_quiz.start_formatedTime" style="height: 30px;margin-bottom:0;">'+
							// 		'<small class="error position-absolute z-one" ng-show="time_error" ng-bind="time_error"></small>'+
							// 	'</div>'+
							// '</div>'+
							// '<div class="row" style="text-align:left;margin-left:0;">'+
							// 	'<div class="small-3 columns"><span translate>editor.quiz_time</span>:</div>'+
							// 	'<div class="small-3 left columns no-padding" style="margin-bottom: 5px;">'+
							// 		'<input class="quiz_time" type="text" ng-model="selected_quiz.formatedTime" style="height: 30px;margin-bottom:0;">'+
							// 		'<small class="error position-absolute z-one" ng-show="time_error" ng-bind="time_error"></small>'+
							// 	'</div>'+
							// '</div>'+
							// '<div class="row" style="text-align:left;margin-left:0;">'+
							// 	'<div class="small-3 columns"><span translate>editor.end_time</span>:</div>'+
							// 	'<div class="small-3 left columns no-padding" style="margin-bottom: 10px;">'+
							// 		'<input class="quiz_end_time" type="text" ng-model="selected_quiz.end_formatedTime" style="height: 30px;margin-bottom:0;">'+
							// 		'<small class="error position-absolute z-one" ng-show="time_error" ng-bind="time_error"></small>'+
							// 	'</div>'+
							// '</div>'+
							'<div class="row" style="text-align:left;margin-left:0;">'+
								'<div class="small-11 left columns" >'+
									'<lable"><span>Start time</span> <input class="inclass_choice" type="checkbox" ng-change="updateQuizStartTime()" ng-model="has_start"  ></lable>'+
									'<lable style="padding-left:10px"><span>End time</span> <input class="inclass_choice" type="checkbox" ng-model="has_end" ng-change="updateQuizEndTime()" ></lable>'+
								'</div>'+
							'</div>'+
							'<div class="row" style="text-align:left;margin-left:0;">'+
								'<div class="small-11 left columns" >'+
									'<lable"><span>Online</span> <input class="inclass_choice" type="radio" name="inclass" ng-model="selected_quiz.inclass" ng-value="false" ></lable>'+
									'<lable style="padding-left:10px"><span>Inclass</span> <input class="inclass_choice" type="radio" name="inclass" ng-model="selected_quiz.inclass" ng-value="true" ></lable>'+
								'</div>'+
							'</div>'+
							'<span ng-show="selected_quiz.inclass">'+
							'<div class="row" style="text-align:left;margin-left:0;">'+
								'<div class="small-4 columns"><span translate>Intro Timer</span>:</div>'+
								'<div class="small-3 left columns no-padding" style="margin-bottom: 5px;">'+
									'<input  type="text" ng-model="selected_quiz.inclass_session.intro_formatedTime" style="height: 30px;margin-bottom:0;">'+
									'<small class="error position-absolute z-one" ng-show="intro_timer_error" ng-bind="intro_timer_error"></small>'+
								'</div>'+
							'</div>'+
							'<div class="row" style="text-align:left;margin-left:0;">'+
								'<div class="small-4 columns"><span translate>Self Timer</span>:</div>'+
								'<div class="small-3 left columns no-padding" style="margin-bottom: 5px;">'+
									'<input  type="text" ng-model="selected_quiz.inclass_session.self_formatedTime" style="height: 30px;margin-bottom:0;">'+
									'<small class="error position-absolute z-one" ng-show="self_timer_error" ng-bind="self_timer_error"></small>'+
								'</div>'+
							'</div>'+
							'<div class="row" style="text-align:left;margin-left:0;">'+
								'<div class="small-4 columns"><span translate>Group Timer</span>:</div>'+
								'<div class="small-3 left columns no-padding" style="margin-bottom: 5px;">'+
									'<input  type="text" ng-model="selected_quiz.inclass_session.group_formatedTime" style="height: 30px;margin-bottom:0;">'+
									'<small class="error position-absolute z-one" ng-show="group_timer_error" ng-bind="group_timer_error"></small>'+
								'</div>'+
							'</div>'+
							'<div class="row" style="text-align:left;margin-left:0;">'+
								'<div class="small-4 columns"><span translate>Discussion Timer</span>:</div>'+
								'<div class="small-3 left columns no-padding" >'+
									'<input  type="text" ng-model="selected_quiz.inclass_session.discussion_formatedTime" style="height: 30px;margin-bottom:0;">'+
									'<small class="error position-absolute z-one" ng-show="discussion_timer_error" ng-bind="discussion_timer_error"></small>'+
								'</div>'+
							'</div>'+
							'</span>'+
							'<delete_button size="big" action="deleteQuizButton(selected_quiz)" vertical="false" text="true" style="margin:10px;margin-left:0;float:right;margin-top:0;"></delete_button>'+
							'<button id="save_quiz_button" ng-disabled="disable_save_button" class="button tiny" style="float:right" ng-click="saveEdit(selected_quiz)" translate>events.done</button>'+ 
						'</h6>'+
					'</div>',
		link: function(scope, element, attrs) {
			scope.has_start= scope.selected_quiz.start_time!= scope.selected_quiz.time
			scope.has_end  = scope.selected_quiz.end_time  != scope.selected_quiz.time

			$timeout(function() {
	            element.find('.quiz_name').select();
	        });

        	var updateOnlineQuiz=function(quiz){
				OnlineQuiz.update(
					{online_quizzes_id: quiz.id},
					{online_quiz:{
						time:quiz.time, 
						start_time:quiz.start_time, 
						end_time:quiz.end_time, 
						question:quiz.question,
						inclass: quiz.inclass
					},
					intro_timer: quiz.inclass_session.intro,
					self_timer: quiz.inclass_session.self,
					group_timer: quiz.inclass_session.in_group,
					discussion_timer: quiz.inclass_session.discussion,
				}
				);
			}

		 	var validateTime=function(time) { 		
				var int_regex = /^\d\d:\d\d:\d\d$/;  //checking format
				if(int_regex.test(time)) { 
				    var hhmm = time.split(':'); // split hours and minutes
				    var hours = parseInt(hhmm[0]); // get hours and parse it to an int
				    var minutes = parseInt(hhmm[1]); // get minutes and parse it to an int
				    var seconds = parseInt(hhmm[2]);
				    // check if hours or minutes are incorrect
				    var calculated_duration=(hours*60*60)+(minutes*60)+(seconds);
				    if(hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || seconds< 0 || seconds > 59) {// display error
			       		return $translate('editor.incorrect_format_time')
				    }
				    else if( (scope.lecture_player.controls.getDuration()) <= calculated_duration || calculated_duration <= 0 ){
			       		return $translate('editor.time_outside_range')
				    }
				}
			    else{
			   		return $translate('editor.incorrect_format_time')
			    }
			}
			
			var validateName= function(quiz){
				var d = $q.defer();
			    var doc={}
			    doc.question=quiz.question;
			    OnlineQuiz.validateName(
			    	{online_quizzes_id: quiz.id},
			    	doc,
			    	function(){
						d.resolve()
					},function(data){
					if(data.status==422)
					 	d.resolve(data.data.errors.join());
					else
						d.reject('Server Error');
					}
			    )
			    return d.promise;
			}

			var arrayToSeconds=function(a){
				return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]) // minutes are worth 60 seconds. Hours are worth 60 minutes.
			}

			scope.saveEdit=function(quiz){
				validateName(quiz).then(function(error){
					scope.name_error = error
					scope.intro_timer_error 	= validateTime(quiz.inclass_session.intro_formatedTime)
					scope.self_timer_error 		= validateTime(quiz.inclass_session.self_formatedTime)
					scope.group_timer_error 	= validateTime(quiz.inclass_session.group_formatedTime)
					scope.discussion_timer_error= validateTime(quiz.inclass_session.discussion_formatedTime)
					// scope.time_error = validateTime(quiz.formatedTime)
					// scope.start_time_error = validateTime(quiz.start_formatedTime)
					// scope.end_time_error = validateTime(quiz.end_formatedTime)
					// if(!(scope.name_error || scope.time_error || scope.start_time_error || scope.end_time_error) ){
						// quiz.time = arrayToSeconds(quiz.formatedTime.split(':'))
						// quiz.start_time = arrayToSeconds(quiz.start_formatedTime.split(':'))
						// quiz.end_time = arrayToSeconds(quiz.end_formatedTime.split(':'))
					if(!(scope.name_error || scope.intro_timer_error || scope.self_timer_error || scope.group_timer_error || scope.discussion_timer_error)){
						quiz.inclass_session.intro 		= arrayToSeconds(quiz.inclass_session.intro_formatedTime.split(':'))
						quiz.inclass_session.self 		= arrayToSeconds(quiz.inclass_session.self_formatedTime.split(':'))
						quiz.inclass_session.in_group 	= arrayToSeconds(quiz.inclass_session.group_formatedTime.split(':'))
						quiz.inclass_session.discussion = arrayToSeconds(quiz.inclass_session.discussion_formatedTime.split(':'))
						updateOnlineQuiz(quiz)
						scope.saveQuizBtn({exit:true})
					}
					else
					{
						console.log("errors worrro worrrr",  scope.intro_timer_error)
					}
				})				
			}

			scope.updateQuizStartTime=function(){
				scope.selected_quiz.start_time = scope.selected_quiz.time
				if(scope.has_start) 
					scope.selected_quiz.start_time-5<0? 0 : scope.selected_quiz.start_time-=5
			}

			scope.updateQuizEndTime=function(){
				scope.selected_quiz.end_time = scope.selected_quiz.time
				if(scope.has_end){
					var duration = scope.lecture_player.controls.getDuration()
					scope.selected_quiz.end_time+5>duration? duration : scope.selected_quiz.end_time+=5
				}
			}
		}
	};
}])
.directive('markerEditPanel',['$timeout','$q','$translate','OnlineMarker',function($timeout, $q, $translate, OnlineMarker){
	return {		
		 restrict: 'E',
		 template: '<div>'+
						'<h6 class="row no-margin color-wheat wheat">'+
							'<div style="margin-top:10px;text-align:left;margin-left:0;">'+
								'<div class="small-12 columns" style="margin-bottom: 5px;"><span translate>editor.title</span>:</div>'+
								'<div class="small-12 left columns" style="margin-bottom: 15px;">'+
									'<input class="marker_name" type="text" ng-model="selected_marker.title" style="height: 30px;margin-bottom:0;">'+
									'<small class="error" ng-show="name_error" ng-bind="name_error"></small>'+
								'</div>'+
							'</div>'+
							'<div style="margin-top:10px;text-align:left;margin-left:0;">'+
								'<div class="small-12 columns" style="margin-bottom: 5px;"><span translate>editor.annotation</span>:</div>'+
								'<div class="small-12 left columns" style="margin-bottom: 15px;">'+
									'<input class="marker_annotation" type="text" ng-model="selected_marker.annotation" style="height: 30px;margin-bottom:0;">'+
								'</div>'+
							'</div>'+
							'<div class="row" style="text-align:left;margin-left:0;">'+
								'<div class="small-3 columns"><span translate>editor.marker_time</span>:</div>'+
								'<div class="small-4 left columns no-padding" style="margin-bottom: 5px;">'+
									'<input class="marker_time" type="text" ng-model="selected_marker.formatedTime" style="height: 30px;margin-bottom:0;">'+
									'<small class="error position-absolute z-one" ng-show="time_error" ng-bind="time_error"></small>'+
								'</div>'+
							'</div>'+
							'<delete_button size="big" action="deleteMarkerButton(selected_marker)" vertical="false" text="true" style="margin:10px;margin-left:0;float:right;margin-top:0;"></delete_button>'+
							'<button id="save_marker_button" ng-disabled="disable_save_button" class="button tiny" style="float:right" ng-click="saveMarkerBtn(selected_marker)" translate>events.done</button>'+ 
						'</h6>'+
					'</div>',
		link: function(scope, element, attrs){
			$timeout(function() {
	            element.find('.marker_name').select();
	        });       	
		}
	};
}])
.directive('answervideo', function(){
	return {
		 scope: {
		 	quiz:"=",
		 	data:"=",
		 	list:'=',
		 	save: "&",
		 	remove:"&"
		 },
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-switch on='quiz.question_type.toUpperCase()'>"+
		 				"<answer ng-switch-when='MCQ' />"+
		 				"<answer ng-switch-when='OCQ' />"+
		 				"<drag ng-switch-when='DRAG' />"+
	 				"</div>"
	};
}).directive('answer', ['$rootScope','$log','$timeout', function($rootScope,$log,$timeout){
	return {
 		replace:true,
	 	restrict: 'E',
	 	templateUrl:'/views/teacher/course_editor/answer.html',
		link: function(scope, element, attrs){
			scope.setAnswerColor=function(){
				if(scope.quiz.question_type == "OCQ")
					scope.imgName = scope.data.correct? scope.ocq_correct : scope.ocq_incorrect;
				else
					scope.imgName = scope.data.correct? scope.mcq_correct : scope.mcq_incorrect;
			}

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');		
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height());
				scope.calculateSize()
			}

			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');	
				scope.data.width= element.width()/ontop.width();
				scope.data.height= element.height()/(ontop.height());
			}

			scope.radioChange=function(corr_ans){
				if(scope.quiz.question_type == "OCQ"){
					$log.debug("radioChange")
					scope.quiz.answers.forEach(function(ans){
						ans.correct=false
					})
					corr_ans.correct=true
					$rootScope.$emit("radioChange")
				}
				
			}
			scope.selectField=function(){
				$timeout(function(){
					var elem = element.find('textarea')[0]
					if(elem)
						elem.select()
				})				
			}
			scope.updateValues= function(){
				scope.values=0
				for(var element in scope.quiz.answers){
					if(scope.quiz.answers[element].correct){
						scope.values+=1
					}
				}
			}

			scope.close=function(){
				scope.save()
				angular.element(element.children()[0]).popover('hide')
			}

			scope.delete=function(){
				scope.remove()
				angular.element(element.children()[0]).popover('hide')
			}

			scope.answerDragStart=function(){
				angular.element(element.children()[0]).popover('hide')
			}
	
			$rootScope.$on("radioChange",function(){
				scope.setAnswerColor()
			})

			scope.answerClass = "component dropped answer_img"	

			var template =""
			if(scope.quiz.quiz_type == 'survey')
				template = "<form name='aform'>"+								
								"<label class='show-inline'><span translate>editor.answer</span><h6 class='no-margin-bottom'><small translate>editor.popover.shown_in_graph</small></h6></label>"+ 
								"<span class='right' tooltip-append-to-body='true' tooltip={{'editor.tooltip.click_to_delete'|translate}}><delete_button class='right' size='big' hide-confirm='false' color='dark' action='remove()'></delete_button></span>"+
								"<textarea rows=3 class='must_save' ng-class='{error: aform.answer.$error.required}' type='text' ng-model='data.answer' ng-init='selectField()' value={{data.answer}} name='answer' required></textarea>"+
								"<small class='error' ng-show='aform.answer.$error.required' style='padding-top: 5px;'><span translate>error_message.required</span>!</small>"+
								"<button type='button' ng-click='save()' class='button tiny success with-small-margin-top small-12'><span translate>button.save_close</span></button>"+
							"</form>"
			else
				template = "<form name='aform' >"+
								"<label class='show-inline'><span translate>editor.correct</span> <span translate>editor.answer</span>"+
								"<input id='correct_checkbox' class='must_save_check' ng-change='radioChange(data);setAnswerColor();updateValues();' ng-model='data.correct' style='margin-left:10px;margin-bottom:2px' type='checkbox' ng-checked='data.correct' name='mcq'/></label>"+ //ng-class='{error: aform.mcq.$error.atleastone}' atleastone
								"<label class='with-small-margin-top'>"+
									"<span translate>editor.answer</span>"+
									"<h6 class='subheader no-margin'><small style='text-transform: initial;' translate>editor.popover.shown_in_graph</small></h6>"+ 
									"<textarea rows=3 class='must_save' type='text' ng-init='selectField($event)' ng-model='data.answer'  value={{data.answer}} name='answer' ng-class='{error: aform.answer.$error.required}' required></textarea>"+
									"<small class='error' ng-show='aform.answer.$error.required' style='padding-top: 5px;'><span translate>error_message.required</span>!</small>"+
								"</label>"+
								"<label style='margin-top:10px'>"+
									"<span translate>editor.explanation</span>"+
									"<h6 class='subheader no-margin'><small style='text-transform: initial;' translate>editor.popover.shown_to_student</small></h6>"+
									"<textarea rows=3 class='must_save' type='text' ng-model='data.explanation' value={{data.explanation}}></textarea>"+
								"</label>"+
								"<button type='button' ng-click='close()' class='button tiny success with-small-margin-top small-6 columns'><span translate>button.close</span></button>"+
								'<delete_button size="big" action="delete()" vertical="false" text="true" style="margin:8px 0;" class="small-6 columns no-padding"></delete_button>'+
							"</form>"

           	scope.popover_options={
            	content: template,
            	html:true,
            	placement:function(){
					var placement= (scope.data.xcoor > 0.5)? "left":"right"
					return scope.data.ycoor <0.3? "bottom": placement
				},
            	instant_show:!scope.data.id,
            	container: 'body',
            }
            
            scope.$watch('quiz.answers', function(){
				scope.updateValues();	
			},true)

			scope.setAnswerColor()
		}
	};
}]).directive('drag', ['$log','$timeout', function($log, $timeout){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div>"+
		 				"<div class='component dropped answer_drag' style='border: 1px solid #ddd;background-color:white;padding:0px;position:absolute; min-height:40px; min-width: 20px;' ng-style=\"{width: (data.width*100)+'%', height: (data.height*100)+'%', left: (data.xcoor*100)+'%', top: (data.ycoor*100)+'%'}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 					"<div>"+
	 							"<span class='position-header error light-grey dark-text no-margin'>{{data.pos+1}} <span translate>editor.drag.end</span></span>"+
	 							"<h6 class='no-margin' style='resize:none;display: inline-block;width:100%;height:100%;padding:10px;font-size: 0.1rem;min-height: 40px; min-width: 40px;' ng-style='{max_width: width, max_height: height}' pop-over='popover_options' unique='true'>{{data.answer}}</h6>"+
	 						"</div>"+
	 					"</div>"+
	 					"<div class='dragged handle' data-drag='true' style='height: 31px;' ng-style=\"{left: (data.sub_xcoor*100)+'%', top: (data.sub_ycoor*100)+'%'}\" data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
	 						"<span class='position-header error light-grey dark-text no-margin' style='top: -1px;left: -48px;padding: 6px;'>{{data.pos+1}} <span translate>editor.drag.start</span></span>"+
	 						"<h6 class='no-margin' style='font-size: 0.1rem !important;'>{{data.answer}}</h6>"+
	 					"</div>"+
 					"</div>",

		link: function(scope, element, attrs) {

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');
				var main = angular.element(element.children()[0])
				var sub = angular.element(element.children()[1])
				scope.data.xcoor= parseFloat(main.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(main.position().top)/ ontop.height();
				scope.data.sub_xcoor= parseFloat(sub.position().left)/ontop.width();
				scope.data.sub_ycoor= parseFloat(sub.position().top)/ ontop.height();
				$log.debug(scope.data)
				scope.calculateSize()
			}
			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');
				var main = angular.element(element.children()[0])
				$log.debug(scope.area_width+", "+scope.area_height)
				scope.data.width= main.width()/ontop.width();
				scope.data.height= main.height()/(ontop.height());
			}	

			scope.selectField=function(){
				$timeout(function(){
					element.find('textarea')[0].select()
				})				
			}

			if(scope.data.pos == null){	
				$log.debug("pos undefined")
				var max = Math.max.apply(Math,scope.list)
				scope.data.pos = max ==-Infinity? -1 : max+1
 				scope.list.push(scope.data.pos)
			}

			scope.pos= parseInt(scope.data.pos)

			if(!(scope.data.explanation instanceof Array)){
				scope.data.explanation = []
				for(var i in scope.list)
					scope.data.explanation[i]=""
			}

			scope.quiz.answers.forEach(function(ans){
				if(!ans.explanation[scope.data.pos])
					ans.explanation[scope.data.pos]=""
			})


			var template = '<ul class="no-margin">'+
							'<label>'+
								'<span translate>editor.drag.instruction</span>'+
								'<textarea rows=3 type="text" class="must_save" ng-model="data.answer" />'+
							'</label>'+	
							'<label>'+
								'<span translate>editor.drag.correct</span>:'+
								'<textarea rows=3 type="text" class="must_save" ng-model="data.explanation[pos]" />'+
							'</label>'+							
							'<label ng-repeat=\'num in list|filter:"!"+data.pos\' >'+
								'<span translate translate-values="{num:num+1}">editor.drag.incorrect</span>:'+
								'<textarea rows=3 class="must_save" style="resize:vertical;" ng-model="data.explanation[num]" />'+
							'</label>'+
							"<button type='button' ng-click='save()' class='button tiny success with-small-margin-top small-8'><span translate>button.close</span></button>"+
							'<delete_button size="big" action="remove()" vertical="false" text="true" style="margin:8px 0;float:right"></delete_button>'+
						'</ul>'

            scope.popover_options={
            	content: template,
            	html: true,
            	placement:function(){
					var placement= (scope.data.xcoor > 0.5)? "left":"right"
					return scope.data.ycoor <0.3? "bottom": placement
				},
            	instant_show:!scope.data.id
            }

            angular.element(element.children()[0]).resizable({
            	containment: ".videoborder",  
            	minHeight:40, 
            	minWidth:40,
		  		stop: scope.calculateSize
        	});
		}
	};
}]).directive('answerform',['$log','$translate',function($log, $translate){
	return {
		scope: {
			quiz:"=",
			add:"&",
			remove:"&",
			removeq:"&",
			column: "@",
			columna:"@",
			index: "=",
			submitted: "=",
			subtype:"=",
			sortable:'@'
		},
		restrict: 'E',
		templateUrl: '/views/teacher/course_editor/answer_forum.html',
		link: function(scope, element, iAttrs) {			
			
			scope.isSurvey = function(){
				if(scope.subtype)
					return scope.subtype.toUpperCase()=="SURVEY"
				else
					return false
			}
			scope.isFreeText = function(){
				return (scope.quiz.question_type=="Free Text Question")
			}
			
			scope.isNormalQuiz = function(){
				return "content" in scope.quiz
			}
			scope.quiz_types=[
				{value:"MCQ", text:$translate('content.questions.quiz_types.mcq')},
				{value:"OCQ", text:$translate('content.questions.quiz_types.ocq')},
				{value:"Free Text Question", text:$translate('content.questions.quiz_types.text')}
			]
			scope.match_types =[
				{value:'Free Text', text:$translate('content.questions.quiz_types.free_text')}, 
				{value:'Match Text', text:$translate('content.questions.quiz_types.match_text')}
			]
			$log.debug(scope.quiz)
			if(!scope.quiz.match_type)
				scope.quiz.match_type = scope.match_types[0].value

			if(!scope.isSurvey()){
				scope.quiz_types.push({value:"drag", text:$translate('content.questions.quiz_types.drag')})
			}

			scope.addAnswer=scope.add()
			scope.removeQuestion=scope.removeq()
			element.find('input')[0].focus()

            scope.$on('$destroy', function() {
                shortcut.remove("Enter");
            });

			shortcut.add("Enter",function(){
				if(!scope.isFreeText()){
					var all_inputs= element.find('input')
					$log.debug(all_inputs.length)
					all_inputs.each(function(ind,elem){
						$log.debug(elem)
						if(document.activeElement == elem)
							scope.addAnswer("",scope.quiz)
						return
					})
					scope.$apply()
					if(element.find('input')[all_inputs.length])
						element.find('input')[all_inputs.length].focus()
				}
			},{"disable_in_input" : false, 'propagate':true});			
			
		}
	};
}]).directive('htmlanswer',['$log',function($log){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type.toUpperCase()'>"+
					"<div ng-switch-when='FREE TEXT QUESTION' ><html_freetext ng-repeat='answer in quiz.answers' /></div>"+
					"<div ng-switch-when='MCQ' ><html_mcq  ng-repeat='answer in quiz.answers' /></div>"+
					"<div ng-switch-when='OCQ' ><html_ocq  ng-repeat='answer in quiz.answers' /></div>"+	
					"<ul  ng-switch-when='DRAG' class='no-padding-top'>"+
						"<h5 class='no-margin-top'><small translate>editor.messages.random_answers</small></h5>"+
						"<span ui-sortable ng-model='quiz.answers'>"+
							"<html_drag ng-repeat='answer in quiz.answers' />"+
						"</span>"+
					"</ul>"+
				"</div>",
		link:function(scope){
			scope.removeAnswer=scope.remove()		
			
			scope.updateValues= function(){
				scope.values=0
				for(var element in scope.quiz.answers)
					if(scope.quiz.answers[element].correct)
						scope.values+=1
			}			
			
			scope.radioChange=function(corr_ans){
				scope.quiz.answers.forEach(function(ans){
					ans.correct=false
				})
				corr_ans.correct=true
				
				scope.updateValues();
			}
			
			scope.show = function(){
		 		return ("time" in scope.quiz)
			}
			
			scope.$watch('quiz.answers', function(){
				scope.updateValues();	
			},true)

			scope.answers_sortable_options={
		 		axis: 'y',
				dropOnEmpty: false,
				handle: '.drag-item',
				cursor: 'crosshair',
				items: '.drag-answer',
				opacity: 0.4,
				scroll: true
		 	}			
		}
	};
}]).directive('htmlFreetext',function(){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<div class='row'>"+
						"<div class='small-10 columns'>"+
							"<input required name='answer' type='text' placeholder='String to match' ng-model='answer[columna]' style='margin-bottom: 0;' />"+
							"<small class='error' ng-show='submitted && aform.answer.$error.required' style='padding-top: 5px;'><span translate>error_message.required</span>!</small>"+
						"</div>"+
					"</div>"+
					"<div class='text-left size-12'>"+
						"<div><br/><span translate>editor.regex.enter_string</span><br /><br /><span translate>Examples</span>:</div>"+
						"<ul class='size-12'>"+
							"<li>Waterloo -> <span translate>editor.regex.correct_if</span> 'Waterloo'</li>"+
							"<li>/(Waterloo|waterloo)/ -> <span translate>editor.regex.correct_for</span> 'Waterloo' , 'waterloo'</li>"+
							"<li>/[0-9]/ -> <span translate>editor.regex.correct_for</span> <span translate>editor.regex.any_integer</span></li>"+
							"<li>/(10|14|29)/ -> <span translate>editor.regex.correct_for</span> <span translate>editor.regex.numbers</span></li>"+
						"</ul>"+
					"</div>"+
				"</ng-form>"
	}
	
}).directive('htmlMcq',function(){	
	return{
		restrict:'E',
		template:"<div class='small-12 no-padding columns'>"+ 
					"<delete_button class='right with-small-margin-top' size='small' mode='content_navigator' color='dark' action='removeAnswer($index, quiz)' />"+
					"<ng-form name='aform'>"+
						"<div class='row collapse'>"+
							"<div class='small-2 columns' style='padding: 10px 0;'>"+
								"<label class='text-left' translate>editor.answer</label>"+
							"</div>"+
							"<div class='small-7 columns left no-padding'>"+
								"<input class='no-margin' required name='answer' type='text' placeholder={{'editor.answer'|translate}} ng-model='answer[columna]' ng-class='{error: (submitted && aform.answer.$error.required) }' />"+ //|| (submitted && aform.$error.atleastone)
								"<small class='error with-tiny-margin-bottom' ng-show='submitted && aform.answer.$error.required' ><span translate>error_message.required</span>!</small>"+
							"</div>"+
							"<div class='small-2 columns' ng-if='!isSurvey()'>"+
								"<label><span translate>editor.correct</span></label>"+
								"<input class='valign-middle' ng-change='updateValues()' type='checkbox' name='mcq' ng-model='answer.correct' ng-checked='answer.correct' />"+ //atleastone
							"</div>"+
						"</div>"+
						"<div class ='row collapse' ng-if='show() && !isSurvey()'>"+
							"<div class='small-2 columns' style='padding: 10px 0;'>"+
								"<label class='text-left' translate>editor.explanation</label>"+
							"</div>"+
							"<div class='small-7 left columns no-padding'>"+
								"<input class='no-margin' type='text' class='explain' placeholder={{'editor.explanation'|translate}} ng-model='answer.explanation' value='{{answer.explanation}}' /></span>"+
							"</div>"+
						"</div>"+
					"</ng-form>"+
				"</div>"+
				"<hr style='margin: 10px 0;'/>"
	}
	
}).directive('htmlOcq',function(){
	return {
		restrict:'E',
		template:"<div class='small-12 no-padding columns'>"+ 
					"<ng-form name='aform'>"+
						"<delete_button class='right with-small-margin-top' mode='content_navigator' size='small' color='dark' action='removeAnswer($index, quiz)' />"+
						"<div class='row collapse'>"+
							"<div class='small-2 columns' style='padding: 10px 0;'>"+
								"<label class='text-left' translate>editor.answer</label>"+
							"</div>"+
							"<div class='small-7 columns left no-padding'>"+
								"<input class='no-margin' required name='answer' type='text' placeholder={{'editor.answer'|translate}} ng-model='answer[columna]' ng-class='{error: (submitted && aform.answer.$error.required) }' />"+ //|| (submitted && aform.$error.atleastone)
								"<small class='error with-tiny-margin-bottom' ng-show='submitted && aform.answer.$error.required' ><span translate>error_message.required</span>!</small>"+
							"</div>"+
							"<div class='small-2 columns' ng-if='!isSurvey()'>"+
								"<label><span translate>editor.correct</span></label>"+
								"<input class='valign-middle' id='radio_correct' type='radio' ng-model='answer.correct' ng-value=true ng-click='radioChange(answer)'/>"+ //atleastone
							"</div>"+
						"</div>"+
						"<div class ='row collapse' ng-if='show() && !isSurvey()'>"+
							"<div class='small-2 columns' style='padding: 10px 0;'>"+
								"<label class='text-left' translate>editor.explanation</label>"+
							"</div>"+
							"<div class='small-7 left columns no-padding'>"+
								"<input class='no-margin' type='text' class='explain' placeholder={{'editor.explanation'|translate}} ng-model='answer.explanation' value='{{answer.explanation}}' /></span>"+
							"</div>"+
						"</div>"+
					"</ng-form>"+
				"</div>"+
				"<hr style='margin: 10px 0;'/>",
		link: function(scope){
			if(scope.answer.correct)
				scope.radioChange(scope.answer)
		}
	}	
}).directive('htmlDrag',function(){
	return {
		restrict:'E',
		replace:true,
		templateUrl: '/views/teacher/course_editor/html_drag.html'
	}
	
}).directive('atleastone', ['$log', function($log) {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
		
			scope.validate = function(value) {
				if (scope.values<1) {
					$log.debug("errorrr");
					ctrl.$setValidity('atleastone', false);
				} else {
					ctrl.$setValidity('atleastone', true);
				}
			}

			scope.$watch('values',function(){
				scope.validate();
			});
		}
	};
}]).directive('controlsTeacher', ['$window','$timeout', function($window,$timeout) {
  return {
      restrict: "E",
      scope:{
        link:'&'
      },
      template: '<div class="linkDiv" tooltip="{{\'editor.tooltip.create_link_time\'|translate}}" pop-over="link_content" unique="false" highlight="true"></div>',
      link: function (scope, element) {
  	 	scope.selectLink=function(event){
            $timeout(function() {
                element.find('.video_link').select();
            });
        }
        scope.link_content = {
        	content: "<b>Student link to time {{link().time| formattime:'hh:mm:ss'}} in this video</b><hr style='margin: 5px;'/><div style='word-break: break-all;'>{{link().url}}</div>",
        	html:true,
        	placement: 'left'
        }
      }
    };
}])
