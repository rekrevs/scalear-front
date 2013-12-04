'use strict';

angular.module('scalearAngularApp')
	.directive("videoContainer",function(){
		return{
			transclude: true,
			replace:true,
			restrict: "E",
			template: '<div class="videoborder" style="border:4px solid" ng-transclude></div>'
		};
}).directive('quiz',function(){
		return {
			transclude: true,
			replace:true,
			restrict: 'E', 
			template: '<div class="ontop" id="ontop" ng-class="lecture.aspect_ratio" ng-transclude></div>'
		};
}).directive('youtube',['$rootScope',function($rootScope){
		return {
			restrict: 'E',
			replace:true, 
			scope:{
				url:'=',
				ready:'&',
				id:'@',
				player:'='
			},
			link: function(scope, element){

				console.debug("YOUTUBE " + scope.id)
				console.log(scope.controls);
				
				var player

				var player_controls={}
				var player_events = {}


				var loadVideo = function(){
					if(player)
						Popcorn.destroy(player)
					player = Popcorn.youtube( '#'+scope.id, scope.url+"&fs=0&html5=True&showinfo=0&rel=0&autoplay=1" ,{ width: 500, controls: 0});
					setupEvents()

				}

				player_controls.play=function(){
					player.play();
				}

				player_controls.pause = function(){
					player.pause();
				}

				player_controls.mute = function(){
					player.mute();
				}

				player_controls.unmute = function(){
					player.unmute();
				}
				
				player_controls.paused = function(){
					return player.paused();
				}
				
				player_controls.getTime=function(){
					return player.currentTime()
				}

				player_controls.getDuration=function(){
					return player.duration()
				}

				player_controls.seek = function(time){
					if(time<0)
						time=0;
					player.currentTime(time);
	    			player.pause()
				}

				player_controls.refreshVideo = function(){
					console.log("refreshVideo!!!!!!!!!!!!!!!!!!!")
					element.find('iframe').remove();
			  		loadVideo();
				}

				player_controls.hideControls=function(){
					player.controls( false ); 
				}

				player_controls.cue=function(time, callback){
					player.cue(time, callback)
				}

				var setupEvents=function(){
					player.on("loadeddata", 
						function(){
							console.debug("Video data loaded")
							if(player_events.onReady){
								player_events.onReady();
								scope.$apply();
							}
					});

					player.on('play',
						function(){
							if(player_events.onPlay){
								player_events.onPlay();
								scope.$apply();
							}
					});

					player.on('pause',
						function(){
							if(player_events.onPause){
								player_events.onPause();
								scope.$apply();
							}
					});
				}

				$rootScope.$on('refreshVideo',function(){
					player_controls.refreshVideo()
				})

				scope.$watch('url', function(){
					if(scope.url)
						player_controls.refreshVideo();
				})
				scope.$watch('player', function(){
					if(scope.player){
						scope.player.controls=player_controls
					}
					if(scope.player && scope.player.events)
						player_events = scope.player.events
				})

		    }
		};
}]).directive('editPanel',function(){
	return {		
		 restrict: 'E',
		 template: '<div id="editing">'+
						'<div class="alert" >'+
							'<div>'+
								'Editing quiz {{selected_quiz.question}} at {{selected_quiz.time|format}}'+
								'<b ng-bind-html="double_click_msg"></b>'+
							'</div>'+
							'<a class="btn btn-primary" id="done" style="margin-top:5px;" ng-click="saveBtn()">Save</a>'+
							'<a class="btn" id="done" style="margin-top:5px;" ng-click="exitBtn()">Exit</a>'+
						'</div>'+
					'</div>',
	};
}).directive('dropdownList',function(){
	return {
		 scope: {
		 	title:"@",
		 	quiztype:'@',
		 	list:"=",
		 	action:"&"
		 },
		 restrict: 'E',
		 template: 	'<div class="btn-group">'+
						'<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="">'+
							'Insert Quiz ({{title}}) '+
							'<span class="caret"></span>'+
						'</a>'+
						'<ul class="dropdown-menu" style="left:-35%;font-size:12px">'+
				              '<li ng-repeat="item in list">'+
				              		'<a href="" class="insertQuiz" ng-click="action()(quiztype,item.type)">{{item.text}}</a>'+
				              '</li>'+ 
						'</ul>'+
				  	'</div>'
	};
}).directive('answervideo', ['$compile',function($compile){
	return {
		 scope: {
		 	quiz:"=",
		 	data:"=",
		 	list:'=',
		 	remove:"&"
		 },
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-switch on='quiz.question_type'>"+
		 				"<answer ng-switch-when='MCQ' />"+
		 				"<answer ng-switch-when='OCQ' />"+
		 				"<drag ng-switch-when='drag' />"+
	 				"</div>",
	};
}]).directive('answer', ['$compile', '$rootScope', function($compile, $rootScope){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-style='{left: xcoor, top: ycoor, position: \"absolute\"}' data-drag='true' data-jqyoui-options=\"{containment:'.videoborder'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 				"<img ng-src='images/{{imgName}}' ng-class=answerClass  pop-over='popover_options' unique='true' />"+
	 				"</div>",

		link: function(scope, element, attrs, controller) {

			//===FUNCTIONS===//
			var setAnswerLocation=function(){
				console.log("setting answer location")
				var ontop=angular.element('.ontop');		
				var w = scope.data.width * ontop.width();
				var h = scope.data.height* (ontop.height() - 26);
				//var add_left= (w-13)/2.0
				//var add_top = (h-13)/2.0
				scope.xcoor = (scope.data.xcoor * ontop.width())//+ add_left;				
				scope.ycoor = (scope.data.ycoor * (ontop.height() - 26))// + add_top/2 -1;
				scope.popover_options.fullscreen = (ontop.css('position') == 'fixed');
				console.log(scope.xcoor)
				console.log(scope.ycoor)
			}	

			scope.setAnswerColor=function(){
				console.log("image change")
				console.log(scope.data.correct)
				if(scope.quiz.question_type == "OCQ")
					scope.imgName = scope.data.correct? 'button_green.png' : 'button8.png';
				else
					scope.imgName = scope.data.correct? 'checkbox_green.gif' : 'checkbox.gif';
			}

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');		
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height() - 26);
				scope.calculateSize()
				console.log(element.position().left)				
				console.log(element.position().top)				
			}

			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');	
				scope.data.width= element.width()/ontop.width();
				scope.data.height= element.height()/(ontop.height()-26);
			}

			scope.radioChange=function(corr_ans){
				if(scope.quiz.question_type == "OCQ"){
					console.log("radioChange")
					scope.quiz.answers.forEach(function(ans){
						ans.correct=false
					})
					corr_ans.correct=true
					$rootScope.$emit("radioChange")
				}
				
			}
			//===============//
	
			$rootScope.$on("radioChange",function(){
				scope.setAnswerColor()
			})
			$rootScope.$on("updatePosition",function(){
				console.log("event emiited updated position")
				setAnswerLocation()
			})	

			scope.answerClass = "component dropped answer_img"						

			var template = "<p>"+
								"Correct:"+
								"<input class='must_save_check' ng-change='radioChange(data);setAnswerColor()' ng-model='data.correct' style='margin-left:20px;margin-bottom:2px' type='checkbox' ng-checked='data.correct' />"+
								"<br>Answer:"+ 
								"<textarea rows=3 class='must_save' type='text' ng-model='data.answer' value={{data.answer}}/>"+
								"<br>Explanation:"+
								"<textarea rows=3 class='must_save' type='text' ng-model='data.explanation' value={{data.explanation}} />"+
								"<br>"+
								"<input type='button' ng-click='remove()' class='btn btn-danger remove_button' value='Remove'/>"+
							"</p>"

           	scope.popover_options={
            	content: template,
            	html:true,
            	fullscreen:false
            }

            setAnswerLocation()
			scope.setAnswerColor()
		}
	};
}]).directive('drag', ['$compile', '$rootScope', function($compile, $rootScope){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-class='dragClass' style='background-color:transparent;width:300px;height:40px;padding:0px;position:absolute;' ng-style=\"{width: width, height: height, top: ycoor, left: xcoor}\" data-drag='true' data-jqyoui-options=\"{containment:'.videoborder'}\" jqyoui-draggable=\"{animate:true, onStop:'calculatePosition'}\" >"+
		 				"<div class='input-prepend'>"+
		 					"<span class='add-on'>{{data.pos}}</span>"+
		 					"<textarea class='area' style='resize:none;width:254px;height:20px;padding:10px;' ng-style=\"{width:area_width, height:area_height}\" ng-model='data.answer' value='{{data.answer}}' pop-over='popover_options' unique='true'/>"+
	 					"</div>"+
 					"</div>",

		link: function(scope, element, attrs, controller) {
			 
			//===FUNCTIONS===//
			var setAnswerLocation=function(){
				var ontop=angular.element('.ontop');
				scope.width  = scope.data.width * ontop.width();
				scope.height = scope.data.height* (ontop.height() - 26);
				scope.xcoor = (scope.data.xcoor * ontop.width())
				scope.ycoor = (scope.data.ycoor * (ontop.height() - 26))
				scope.area_width= scope.width - 50
				scope.area_height= scope.height - 20
				scope.popover_options.fullscreen = (ontop.css('position') == 'fixed');
			}

			scope.calculatePosition=function(){
				var ontop=angular.element('.ontop');
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height() - 26);
				scope.calculateSize()
			}
			scope.calculateSize=function(){
				var ontop=angular.element('.ontop');
				scope.data.width= element.width()/ontop.width();
				scope.data.height= element.height()/(ontop.height()-26);
			}			
			//===============//	
			
			$rootScope.$on("updatePosition",function(){
				console.log("event emiited updated position")
				setAnswerLocation()
			})	

			scope.dragClass = "component dropped answer_drag" 

			if(scope.data.pos == null){	
				console.log("pos undefined")
				var max = Math.max.apply(Math,scope.list)
				max = max ==-Infinity? -1 : max
				console.log("max= "+max)
				scope.data.pos=max+1
				scope.list.push(scope.data.pos)
			}

			scope.pos= parseInt(scope.data.pos)

			if(!(scope.data.explanation instanceof Array)){
				console.log("not an array")
				scope.data.explanation = new Array()
				for(var i in scope.list)
					scope.data.explanation[i]=""
			}

			scope.quiz.answers.forEach(function(ans){
				if(!ans.explanation[scope.pos])
				{
					ans.explanation[scope.pos]=""
					console.log("creating a new eleme in array" + scope.pos)
				}
			})


			var template = '<ul>'+
							'<p>Correct Because:'+
								'<br>'+
								'<textarea rows=3 type="text" class="must_save" ng-model="data.explanation[pos]" />'+
								'<br>'+
								'<div ng-repeat=\'num in list|filter:"!"+pos\' >'+
									'{{num}} Incorrect Because:<br>'+
									'<textarea rows=3 class="must_save" type="text" ng-model="data.explanation[num]" />'+
									'<br>'+
								'</div>'+
								'<input type="button" ng-click="remove()" class="btn btn-danger remove_button" value="Remove"/>'+
							'</p>'+
						'</ul>'

            scope.popover_options={
            	content: template,
            	html: true,
            	fullscreen:false
            }

            element.resizable({
            	containment: ".videoborder",  
            	alsoResize: element.find('.area'), 
            	minHeight:40, 
            	minWidth:40,
		  		stop: scope.calculateSize
        	});

        	setAnswerLocation()
		}
	};
}]).directive('answerform', ['Lecture','$stateParams','CourseEditor',function(Lecture, $stateParams, CourseEditor){
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
			subtype:"="
		},
		restrict: 'E',
		template: "<ng-form name='qform'><div style='text-align:left;margin:10px;'>"+
						"<label class='q_label'>Question:</label>"+
						"<input required name='qlabel' type='text' ng-model='quiz[column]' />"+
						"<span class='help-inline' ng-show='submitted && qform.qlabel.$error.required'>Required!</span>"+
						// ADD QUESTION TYPE IF ITS A QUIZ QUESTION.. SELECT LIST.
						"<br />"+
						"<label ng-if='show_question()' class='q_label'>Question Type:</label>"+
						"<select ng-if='show_question()' ng-model='quiz.question_type' required  class='choices'>"+
							"<option value='MCQ'>MCQ</option>"+
							"<option value='OCQ' >OCQ</option>"+
							"<option value='DRAG' ng-if='!isSurvey()' >DRAG</option>"+
							"<option ng-if='isSurvey()' value='Free Text Question'>Free Text Question</option>"+
						"</select>"+
						"<a ng-if='show_question()' href='' title='Delete' style='float:right;' class='delete_option' ng-click='removeQuestion(index)'><img src='images/trash3.png' /></a>"+
						"<br/>"+
						"<div ng-hide='hideAnswer()' class='answer_div'>"+
							"<htmlanswer />"+
							"<a class='add_multiple_answer' ng-click='addAnswer(\"\",quiz)' href=''>Add Answer</a>"+
							"<br/>"+
						"</div>"+
					"</ng-form>",
		link: function(scope, iElm, iAttrs, controller) {
			console.log("QUIZZ is ");
			console.log(scope.quiz);
			//scope.quiz.type=scope.quiz.question_type;
			scope.addAnswer=scope.add()
			scope.removeQuestion=scope.removeq()
			
			scope.isSurvey = function()
			{
				if(scope.subtype)
					return scope.subtype.toUpperCase()=="SURVEY"
				else
					return false
			}
			scope.hideAnswer = function()
			{
				return (scope.isSurvey() && scope.quiz.question_type=="Free Text Question")
			}
			
			scope.show_question = function()
			{
				return "content" in scope.quiz
			}
			
			
		}
	};
}]).directive('htmlanswer',function(){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type.toUpperCase()' style='/*overflow:auto*/' >"+
					"<div ng-switch-when='MCQ' ><html_mcq  ng-repeat='answer in quiz.answers' /></div>"+
					"<div ng-switch-when='OCQ' ><html_ocq  ng-repeat='answer in quiz.answers' /></div>"+	
					"<ul  ng-switch-when='DRAG' class='drag-sort sortable' ui-sortable ng-model='quiz.answers' >"+
						"<html_drag ng-repeat='answer in quiz.answers' />"+
					"</ul>"+
				"</div>",
		link:function(scope){
			scope.removeAnswer=scope.remove()
			
			
			scope.updateValues= function()
			{
				console.log("in value update")
				console.log(scope.quiz);
				console.log(scope.quiz.answers);
				scope.values=0
				for(var element in scope.quiz.answers)
				{
					console.log(scope.quiz.answers[element].correct)
					if(scope.quiz.answers[element].correct==true)
					{
						console.log("in true");
						scope.values+=1
					}
				}
				console.log(scope.values)
			}
			
			
			scope.radioChange=function(corr_ans){
				scope.quiz.answers.forEach(function(ans){
					ans.correct=false
				})
				corr_ans.correct=true
				
				scope.updateValues();
			}
			
			scope.show = function()
			{
				 return !("content" in scope.quiz)
			}
			
			scope.$watch('quiz.answers', function(){
				scope.updateValues();	
			},true)
			
		}
	};
}).directive('htmlMcq',function(){	
	return{
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input required name='answer' type='text' placeholder='Answer' title='Enter Answer' ng-model='answer[columna]' />"+
					"<input ng-if='!isSurvey()' ng-change='updateValues()' atleastone type='checkbox' name='mcq' style='margin:5px 10px 15px;' ng-model='answer.correct' ng-checked='answer.correct' />"+
					"<span class='help-inline' ng-show='submitted && aform.answer.$error.required'>Required!</span>"+
					"<span ng-if='!isSurvey()' class='help-inline' ng-show='submitted && aform.mcq.$error.atleastone'>Choose atleast one</span>"+
					"<br ng-if='show()'/>"+
					"<input ng-if='show()' type='text' placeholder='Explanation' title='Enter Explanation' ng-model='answer.explanation' value='{{answer.explanation}}' />"+
					"<a href='' title='Delete' style='float:right;' class='real_delete_ans' ng-click='removeAnswer($index, quiz)'><img src='images/trash3.png' /></a>"+
					"<br/>"+
				"</ng-form>"
		
	}
	
}).directive('htmlOcq',['$timeout',function($timeout){
	return {
		restrict:'E',
		template:"<ng-form name='aform'>"+
					"<input required name='answer' type='text' placeholder='Answer' title='Enter Answer' ng-model='answer[columna]' />"+
					"<input ng-if='!isSurvey()' atleastone type='radio' style='margin:5px 10px 15px;' ng-model='answer.correct' ng-value=true ng-click='radioChange(answer)'/>"+
					"<span class='help-inline' ng-show='submitted && aform.answer.$error.required'>Required!</span>"+
					"<span ng-if='!isSurvey()' class='help-inline' ng-show='submitted && aform.$error.atleastone'>Check one answer</span>"+
					"<br ng-if='show()'/>"+
					"<input ng-if='show()' type='text' placeholder='Explanation' title='Enter Explanation' ng-model='answer.explanation' value='{{answer.explanation}}' /> "+
					"<a href='' title='Delete' style='float:right;' class='real_delete_ans' ng-click='removeAnswer($index, quiz)'>"+
						"<img src='images/trash3.png' />"+
					"</a><br>"+
				"</ng-form>",
		link: function(scope)
		{
			if(scope.answer.correct)
			{
				scope.radioChange(scope.answer);
			}
			scope.getName= function()
			{
				return "ocq"+scope.index+scope.$index
			}
		}
	}
	
}]).directive('htmlDrag',function(){
	return {
		restrict:'E',
		replace:true,
		template:"<li class='ui-state-default'>"+
					"<ng-form name='aform'>"+
						"<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>"+
						"<input type='text' required name='answer' placeholder='Answer' title='Enter Answer' ng-model='answer[columna]' />"+
						"<span class='help-inline' ng-show='submitted && aform.answer.$error.required'>Required!</span>"+
						"<a href='' title='Delete' style='float:right;' class='delete_drag' ng-click='removeAnswer($index, quiz)' ><img src='images/trash3.png' /></a>"+
					"</ng-form>"+
				"</li>"				 
	}
	
}).directive('atleastone', function() {
  return {
  	require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
    
      scope.validate = function(value) {
   				 if (scope.values<1) {
   				 	console.log("errorrr");
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
}).directive('popOver',['$parse','$compile','$q','$window',function ($parse, $compile, $q, $window) {
    return{
  		restrict: 'A',
  		link: function(scope, element, attr, ctrl) {

	        var getter = $parse(attr.popOver)
	        scope.$watch(attr.popOver, function(newval){
	        	var options = getter(scope)
	        	console.log("in popover watch")
	        	if(options){
	        		console.log("there are options")
		        	element.popover('destroy');
		        	element.popover(options);
		          	var popover = element.data('popover');
			        
			        if(options.content){

		      			if(attr.unique){
			            	element.on('show', function(){
			              		$('.popover.in').each(function(){
			                		var $this = $(this)
			                		var popover = $this.data('popover');
			                		if (popover && !popover.$element.is(element)) {
			                  			$this.popover('hide');		                  			
			                		}
		              			});
			              	});
	              			
			          	}

			          	popover.getPosition = function(){
				            var pop = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
				            $compile(this.$tip)(scope);
				            scope.$digest();
				            this.$tip.data('popover', this);
				            var arrow = angular.element(".arrow")
				            arrow.css("top",'50%');
				            if(options.fullscreen){
					            var win = angular.element($window)
								var elem_top= element.offset().top
								var elem_bottom= win.height() - elem_top;
								var arrow_pos
								if(elem_top<170) //too close to top
								{
									arrow_pos = pop.top + (pop.height/2)
							 		arrow.css("top",arrow_pos+'px');
									pop.top = (angular.element('.popover').height() / 2)  - (pop.height/2)
								}
								else if(elem_bottom < 160) //too close to bottom
								{					
									arrow_pos =elem_bottom - (pop.height/2) - 20
							 		arrow.css("top",'initial');
							 		arrow.css("bottom",arrow_pos+'px');
									pop.top = win.height() - (angular.element('.popover').height() / 2) - (pop.height/2) - 10
								}
							}

				            return pop;
			          	};

			          	$(document).on("click", function (e) {
						    var target = $(e.target)
						    var inPopover = target.closest('.popover').length > 0
						    var isElem = target.is(element)
						    if (!inPopover && !isElem)
						    	element.popover('hide');
						});	         
			        }
			    }
			    })
	       // });
      	}
    };
}]);