'use strict';

angular.module('scalearAngularApp')
	.directive("videoContainer",function($rootScope){
		return{
			transclude: true,
			restrict: "E",
			template: '<div class="ontop3" ng-class="lecture.aspect_ratio" style="width:500px;height:306px;margin-top:0px;" >'+
						'<div class="ontop2 {{lecture.aspect_ratio}}" ng-class="{ontop2_big: fullscreen}" style="width:500px;position:absolute;border:8px solid;margin-top:0px;" ng-transclude>'+
						'</div>'+
						'<div id="side_bar" class="sidebar_big" ng-show="fullscreen" ui-view="quizList" ></div>'+
					  '</div>',
		  	link: function($scope, element){
			  	$rootScope.$on("refreshVideo", function(event, args) {
			  		element.find('iframe').remove();
			  		$scope.load_video();
			  		console.log("event emitted: updating video player");
			    });
		  	}
		};
}).directive('quiz',function(){
		return {
			transclude: true,
			restrict: 'E', 
			template: '<div class="wall" id="wall"></div>'+
					  '<div class="ontop" id="ontop" ng-class="lecture.aspect_ratio" ng-style="ontopStyle" ng-transclude></div>'
		};
}).directive('youtube',function(){
		return {
			restrict: 'E', 
			template: '<div id="youtube" style="width:500px;height:306px;"></div>',
			link: function($scope, element){
			  	$scope.load_video();
		    }
		};
}).directive('loadingBig',function(){
	return {		
		 restrict: 'E',
		 template: '<div id="loading" ng-style="loadingStyle">'+
 						'<img src="images/loading2.gif" id ="loading-image" />'+
  						'<b id="please" ng-style="pleaseStyle">Please wait... </b>'+
					'</div>',
	};
}).directive('editPanel',function(){
	return {		
		 restrict: 'E',
		 template: '<div id="editing">'+
						'<div class="alert" >'+
							'<div>'+
								'Editing quiz {{selectedQuiz.question}} at {{selectedQuiz.time|format}}'+
								'<b ng-bind-html="doubleClickMsg"></b>'+
							'</div>'+
							'<a class="btn btn-primary" id="done" style="margin-top:5px;" ng-click="save_btn()">Save</a>'+
							'<a class="btn" id="done" style="margin-top:5px;" ng-click="exit_btn()">Exit</a>'+
						'</div>'+
					'</div>',
	};
}).directive('dropdownList',function(){
	return {
		 scope: {
		 	title:"@",
		 	quiztype:'@',
		 	list:"=",
		 	method:"&"
		 },
		 restrict: 'E',
		 template: 	'<div class="btn-group">'+
						'<a class="btn btn-small dropdown-toggle" data-toggle="dropdown" href="">'+
							'Insert Quiz ({{title}})'+
							'<span class="caret"></span>'+
						'</a>'+
						'<ul class="dropdown-menu">'+
				              '<li ng-repeat="item in list">'+
				              		'<a href="" class="insert_quiz" ng-click="action(quiztype,item.type)">{{item.text}}</a>'+
				              '</li>'+ 
						'</ul>'+
				  	'</div>',
		  link: function(scope){
		  		scope.action=function(a,b){
		  			var func =scope.method()
		  			func(a,b);		  			
		  		}
		  }
	};
}).directive('answervideo', function($compile){
	return {
		 scope: {
		 	data:"=",
		 	type:"=",
		 	list:'=',
		 	remove:"&"
		 },
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-switch on='type'>"+
		 				"<answer ng-switch-when='MCQ' />"+
		 				"<answer ng-switch-when='OCQ' />"+
		 				"<drag ng-switch-when='drag' />"+
	 				"</div>",
	};
}).directive('answer', function($compile){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div><img ng-src='images/{{imgName}}' ng-class=imgClass ng-style='{left: xcoor, top: ycoor, position: \"absolute\"}' data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculate_position'}\" pop-over='popover_options' unique='true'/></div>",

		link: function(scope, element, attrs, controller) {

			//===FUNCTIONS===//
			scope.setQuizImg=function(){
				if(scope.type == "OCQ")
					scope.imgName = scope.data.correct? 'button_green.png' : 'button8.png';
				else
					scope.imgName = scope.data.correct? 'checkbox_green.gif' : 'checkbox.gif';
			}

			scope.calculate_position=function(){
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height() - 26);
			}
			//===============//
			
			// COULD BE FILTER //	
			var ontop=angular.element('.ontop');		
			var w = scope.data.width * ontop.width();
			var h = scope.data.height* (ontop.height() - 26);
			var add_left= (w-13)/2.0
			var add_top = (h-13)/2.0 
			scope.xcoor = (scope.data.xcoor * ontop.width())+ add_left;
			scope.ycoor = (scope.data.ycoor * (ontop.height() - 26)) + add_top;
			// // // // // // //

			scope.imgClass = "component dropped answer_img"

			scope.setQuizImg()						

			var template = "<p>Correct:<input class='must_save_check' ng-change='setQuizImg()' ng-model='data.correct' style='margin-left:20px;margin-bottom:2px' type='checkbox' ng-checked='data.correct' /><br>Answer: <textarea rows=3 class='must_save' type='text' ng-model='data.answer' value={{data.answer}}/><br>Explanation:<textarea rows=3 class='must_save' type='text' ng-model='data.explanation' value={{data.explanation}} /><br><input type='button' ng-click='remove()' class='btn btn-danger remove_button' value='Remove'/></p>"

           	scope.popover_options={
            	html:true,
            	content: template
            }

		}
	};
}).directive('drag', function($compile){
	return {
		 replace:true,
		 restrict: 'E',
		 template: "<div ng-class='dragClass' style='background-color:transparent;width:300px;height:40px;padding:0px;position:absolute;' ng-style=\"{width: width, height: height, top: ycoor, left: xcoor}\" data-drag='true' data-jqyoui-options=\"{containment:'.ontop'}\" jqyoui-draggable=\"{animate:true, onStop:'calculate_position'}\" >"+
		 				"<div class='input-prepend' pop-over='popover_options' unique='true' >"+
		 					"<span class='add-on'>{{data.pos}}</span>"+
		 					"<textarea class='area' style='resize:none;width:254px;height:20px;padding:10px;' ng-model='data.answer' value='{{data.answer}}' />"+
	 					"</div>"+
 					"</div>",

		link: function(scope, element, attrs, controller) {
			 
			//===FUNCTIONS===//
			scope.calculate_position=function(){
				scope.data.xcoor= parseFloat(element.position().left)/ontop.width();
				scope.data.ycoor= parseFloat(element.position().top)/(ontop.height() - 26);
			}
			//===============//	
			
			var ontop=angular.element('.ontop');
			scope.width = scope.data.width * ontop.width();
			scope.height = scope.data.height* (ontop.height() - 26);
			scope.xcoor = (scope.data.xcoor * ontop.width())
			scope.ycoor = (scope.data.ycoor * (ontop.height() - 26))

			scope.dragClass = "component dropped answer_drag" 

			
			if(!(scope.data.explanation instanceof Array)) 
			{
				console.log("not an array")
				scope.data.explanation = new Array()
				for(var i in scope.list)
					scope.data.explanation[i]=""
			}

			if(scope.data.pos == null)
			{	console.log("pos undefined")
				var max = Math.max.apply(Math,scope.list)
				max = max ==-Infinity? -1 : max
				console.log("max= "+max)
				scope.data.pos=max+1
				scope.list.push(scope.data.pos)
			}
			scope.pos= parseInt(scope.data.pos)
			console.log(scope.pos)
			console.log(scope.list)

			var template = '<ul><p>Correct Because:<br><textarea rows=3 type="text" class="must_save" ng-model="data.explanation[pos]" /><br/><div ng-repeat="num in list|filter:\'!\'+pos" >{{num}} Incorrect Because:<br><textarea rows=3 class="must_save" type="text" ng-model="data.explanation[num]" /><br></div><input type="button" ng-click="remove()" class="btn btn-danger remove_button" value="Remove"/></p></ul>'

            scope.popover_options={
            	content: template,
            	html: true
            }
		}
	};
}).directive('answerform', function(Lecture, $stateParams){
	return {
		scope: {
			quiz:"=",
			add:"&",
			remove:"&"
		},
		restrict: 'E',
		template: "<div style='text-align:left;margin:10px;'>"+
						"<label class='q_label'>Question</label>"+
						"<br/>"+
						"<input type='text' ng-model='quiz.question' value='{{quiz.question}}' />"+
						"<br/>"+
						"<div class='answer_div'>"+
								"<htmlanswer />"+
								"<a class='add_multiple_answer' ng-click='add_answer()' href=''>Add Answer</a>"+
								"<br/>"+
							"</div>"+
					"</div>",
		link: function(scope, iElm, iAttrs, controller) {

			scope.add_answer=scope.add()
			
			scope.radio_change=function(corr_ans){
				scope.quiz.answers.forEach(function(ans){
					ans.correct=false
				})
				corr_ans.correct=true
			}
		}
	};
}).directive('htmlanswer',function(){
	return {
	 	restrict: 'E',
	 	template: "<div ng-switch on='quiz.question_type'>"+					
					"<div ng-switch-when='MCQ' ><html_mcq  ng-repeat='answer in quiz.answers' /></div>"+
					"<div ng-switch-when='OCQ' ><html_ocq  ng-repeat='answer in quiz.answers' /></div>"+	
					"<ul  ng-switch-when='drag' class='drag-sort sortable' ui-sortable ng-model='quiz.answers' >"+
						"<html_drag ng-repeat='answer in quiz.answers' />"+
					"</ul>"+
				"</div>",
		link:function(scope){
			scope.remove_answer=scope.remove()
		}
	};
}).directive('htmlMcq',function(){
	return {
		restrict:'E',
		template:"<input type='text' placeholder='Answer' title='Enter Answer' ng-model='answer.answer' value='{{answer.answer}}' />"+
				"<input type='checkbox' name='mcq' style='margin:5px 10px 15px;' ng-model='answer.correct' ng-checked='answer.correct' />"+
				"<br/>"+
				"<input type='text' placeholder='Explanation' title='Enter Explanation' ng-model='answer.explanation' value='{{answer.explanation}}' /> "+
				"<a href='' title='Delete' style='float:right;' class='real_delete_ans' ng-click='remove_answer($index)'>"+
					"<img src='images/trash3.png' />"+
				"</a>"
	}
	
}).directive('htmlOcq',function(){
	return {
		restrict:'E',
		template:"<input type='text' placeholder='Answer' title='Enter Answer' ng-model='answer.answer' value='{{answer.answer}}' />"+
				"<input type='radio' name='ocq' style='margin:5px 10px 15px;' ng-checked='answer.correct' value='true' ng-click='radio_change(answer)'/>"+
				"<br/>"+
				"<input type='text' placeholder='Explanation' title='Enter Explanation' ng-model='answer.explanation' value='{{answer.explanation}}' /> "+
				"<a href='' title='Delete' style='float:right;' class='real_delete_ans' ng-click='remove_answer($index)'>"+
					"<img src='images/trash3.png' />"+
				"</a>"
	}
	
}).directive('htmlDrag',function(){
	return {
		restrict:'E',
		replace:true,
		template:"<li class='ui-state-default'  >"+
					"<span class='ui-icon ui-icon-arrowthick-2-n-s'></span>"+
					"<input type='text' placeholder='Answer' title='Enter Answer' ng-model='answer.answer' value='{{answer.answer}}' />"+
					"<a href='' title='Delete' style='float:right;' class='delete_drag' ng-click='remove_answer($index)' ><img src='images/trash3.png' /></a>"+
				"</li>"				 
	}
	
}).directive('popOver',function ($parse, $compile, $q) {
    return{
  		restrict: 'A',
  		link: function(scope, element, attr, ctrl) {
      
	        var getter = $parse(attr.popOver)

	        $q.when(getter(scope) != null).then(function(){

	        	var options = getter(scope)
	        	// console.log(options)
		        
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

	          		element.popover(options);
		          	var popover = element.data('popover');
		          
		          	popover.getPosition = function(){
			            var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
			            $compile(this.$tip)(scope);
			            scope.$digest();
			            this.$tip.data('popover', this);
			            return r;
		          	};	         
		        }
	        });
      	}
    };
});