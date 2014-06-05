'use strict';

angular.module('scalearAngularApp')
  .controller('progressLectureCtrl', ['$scope', '$stateParams','Timeline','Module','Quiz','OnlineQuiz','$log', '$window','$translate','$timeout','Forum',function ($scope, $stateParams, Timeline, Module,Quiz,OnlineQuiz,$log, $window, $translate,$timeout,Forum) {

    $scope.Math = window.Math;
  	$scope.highlight_index = -1
  	$scope.inner_highlight_index = -1
  	$scope.progress_player= {}
  	$scope.timeline = {}
    $scope.right_container = angular.element('#right-container')

  	$scope.time_parameters={
  		quiz: 3,
  		question: 2
  	}

    $scope.$on('$destroy', function() {
      removeShortcuts()
    });

    $scope.filters=
    {
      "all":"",
      "lectures.confused":"confused",
      // "Questions":"question",
      "courses.charts": "charts",
      "lectures.discussion": "discussion",
    }

    $scope.grade_options= [{
      value: 0, // not set
      text: $translate('courses.under_review')
    }, {
      value: 1, // wrong
      text: $translate('courses.wrong')
    }, {
      value: 2,
      text: $translate('courses.partial')
    }, {
      value: 3,
      text: $translate('courses.good')
    }]

  	var init= function(){
  		$scope.timeline = new Timeline()
  		Module.getModuleProgress({
	  			course_id: $stateParams.course_id,
          module_id: $stateParams.module_id
	  		},
	  		function(data){
	  			angular.extend($scope, data)
	  	 		$scope.url = $scope.first_lecture
	  	 		$scope.timeline['lecture'] = {}
	  	 		for(var lec_id in $scope.lectures){
	  	 			$scope.timeline['lecture'][lec_id] = new Timeline()
	  	 			for(var type in $scope.lectures[lec_id]){
	  	 				if(type!= "meta")
		  	 				for(var it in $scope.lectures[lec_id][type] ){
			  	 				$scope.timeline['lecture'][lec_id].add($scope.lectures[lec_id][type][it][0], type, $scope.lectures[lec_id][type][it][1])	
			  	 			}
	  	 			}	  	 			
	  	 		}
          console.log($scope.timeline)
	  	 		getModuleCharts()
	  	 		getQuizCharts()
	  	 		getSurveyCharts()
				  setupShortcuts()
          resizeContainer()
	  		},	
	  		function(){}
		)
	}
  var resizeContainer = function(){
    $scope.right_container.css('height', angular.element($window).height() - 200)
  }
  angular.element($window).bind('resize', function () {
    resizeContainer();
  });
 	var getModuleCharts = function(){
    Module.getModuleCharts(
        {             
            course_id: $stateParams.course_id,
            module_id:$stateParams.module_id
        },
        function(data){ 
        	$scope.timeline["module"]= new Timeline()
        	$scope.timeline["module"].add(0, 'module', data.module_data)
        },
        function(){}
    )
  }

	var getQuizCharts = function(){

    Module.getQuizCharts(
      {             
          course_id: $stateParams.course_id,
          module_id:$stateParams.module_id
      },
      function(resp){
        $scope.quizzes=angular.extend({}, resp.quizzes, $scope.quizzes)
      	$scope.timeline['quiz'] ={}
        console.log(resp)
  	 		for(var quiz_id in $scope.quizzes){
  	 			$scope.timeline['quiz'][quiz_id] = new Timeline()
  	 			for(var q_idx in $scope.quizzes[quiz_id].questions){
            var q_id = $scope.quizzes[quiz_id].questions[q_idx].id
            var data = $scope.quizzes[quiz_id].charts[q_id] || $scope.quizzes[quiz_id].free_question[q_id]
            data.type = $scope.quizzes[quiz_id].questions[q_idx].type
            data.id = q_id  
            data.quiz_type='quiz'
            data.title=$scope.quizzes[quiz_id].questions[q_idx].question
            var type = $scope.quizzes[quiz_id].questions[q_idx].type == "Free Text Question"? $scope.quizzes[quiz_id].questions[q_idx].type : 'charts'
  	 			  $scope.timeline['quiz'][quiz_id].add(0, type, data,'quiz')
          }
  	 		}


 	    },
      function(){}
    )
  }

    var getSurveyCharts = function(){
      Module.getSurveyCharts(
        {             
            course_id: $stateParams.course_id,
            module_id:$stateParams.module_id
        },
        function(data){
          console.log(data)
        	$scope.quizzes=angular.extend({}, data.surveys, $scope.quizzes)
        	$scope.timeline["survey"]={}
        	for (var survey_id in $scope.quizzes ){
        		$scope.timeline["survey"][survey_id]=new Timeline()
        		for(var q_idx in $scope.quizzes[survey_id].questions){
        			var q_id = $scope.quizzes[survey_id].questions[q_idx].id
              var data = $scope.quizzes[survey_id].charts[q_id] || $scope.quizzes[survey_id].free_question[q_id]
              data.type = $scope.quizzes[survey_id].questions[q_idx].type
              data.id = q_id  
              data.quiz_type='survey'
              var type = $scope.quizzes[survey_id].questions[q_idx].type == "Free Text Question"? $scope.quizzes[survey_id].questions[q_idx].type : 'charts'
              $scope.timeline['survey'][survey_id].add(0, type, data)
        		}
        	}
    	 	},
        function(){}
      )
    }

  	$scope.manageHighlight=function(x){
  		var divs = angular.element('.ul_item')
		  angular.element(divs[$scope.highlight_index]).removeClass('highlight')	
		  angular.element('li.highlight').removeClass('highlight')	
      $scope.highlight_index = $scope.highlight_index+x
      if($scope.highlight_index < 0)
        $scope.highlight_index = 0
      else if ($scope.highlight_index >divs.length-1)
        $scope.highlight_index = divs.length-1
		  // $scope.highlight_index = (($scope.highlight_index+x)%divs.length);
    	// $scope.highlight_index = $scope.highlight_index < 0 ? divs.length+$scope.highlight_index : $scope.highlight_index;	    
	    var ul = angular.element(divs[$scope.highlight_index])
	    ul.addClass("highlight")	
	    
	    var parent_div = ul.closest('div')
      if(parent_div.attr('id')){
        var id=parent_div.attr('id').split('_')
        console.log(ul.attr('item'))
        $scope.selected_item = $scope.timeline[id[0]][id[1]].items[ul.attr('index')]
        console.log($scope.selected_item)
        $scope.selected_item.lec_id = id[1]
      }
      else
        $scope.selected_item =null
      var view_index
      if($scope.highlight_index-2 < 0)
        view_index = 0
      else if ($scope.selected_item && $scope.selected_item.type=="Free Text Question")
        view_index = $scope.highlight_index
      else
        view_index = $scope.highlight_index-2

      divs[view_index].scrollIntoView()
      $timeout(function(){$window.scrollTo($window.ScrollX,150)})
	    $scope.inner_highlight_index = -1
      setupRemoveHightlightEvent()
	    $scope.$apply()
  	}

  	$scope.manageInnerHighlight=function(x){
  		var inner_ul= angular.element('ul.highlight').find('ul')
  		if(inner_ul.length){
  			var inner_li = inner_ul.find('li').not('.no_highlight')
  			if(angular.element('li.highlight').length)
  				angular.element('li.highlight').removeClass('highlight')
        $scope.inner_highlight_index = $scope.inner_highlight_index+x
        if($scope.inner_highlight_index < 0)
          $scope.inner_highlight_index = 0
        else if ($scope.inner_highlight_index >inner_li.length-1)
          $scope.inner_highlight_index = inner_li.length-1
  			// $scope.inner_highlight_index = (($scope.inner_highlight_index+x)%inner_li.length);
    		// $scope.inner_highlight_index = $scope.inner_highlight_index < 0 ? inner_li.length+$scope.inner_highlight_index : $scope.inner_highlight_index;	    
	    
  			angular.element(inner_li[$scope.inner_highlight_index]).addClass('highlight')

        if ($scope.selected_item && $scope.selected_item.type=="Free Text Question"){
          var view_index = $scope.inner_highlight_index-3 < 0? 0: $scope.inner_highlight_index - 3
          inner_li[view_index].scrollIntoView()
          $timeout(function(){$window.scrollTo($window.ScrollX,150)})
        }
  		}
	    $scope.$apply()
  	}

  	$scope.highlight=function(ev,item){
  		var ul = angular.element(ev.target).closest('ul.ul_item')
  		var divs = angular.element('.ul_item')
  		// angular.element(divs[$scope.highlight_index]).removeClass('highlight')
      $(".highlight").removeClass("highlight");
  		$scope.highlight_index = divs.index(ul)
  		angular.element(ul).addClass("highlight")
      setupRemoveHightlightEvent()
      if($scope.selected_item == item)
        return
      $scope.selected_item =item
      var parent_div = ul.closest('div')
      if(parent_div.attr('id')){
        var id=parent_div.attr('id').split('_') 
        $scope.selected_item.lec_id = id[1]
      }
  		$scope.inner_highlight_index = -1	
  	}

   var setupRemoveHightlightEvent=function(){
    console.log("adding")
      $(document).click(function(e){
        if(angular.element(e.target).find('.inner_content').length){
          $(".highlight").removeClass("highlight");
          $scope.highlight_index = -1
          $scope.inner_highlight_index = -1
          console.log("removing")
          $(document).off('click');
        }
      })
    }

  	$scope.updateHideQuiz = function(id, value) {
  		if(value)
  			$scope.review_quizzes_count--
  		else
  			$scope.review_quizzes_count++
        Module.hideQuiz({
                course_id: $stateParams.course_id,
                module_id: $stateParams.module_id
            }, {
                quiz: id,
                hide: value
            },
            function() {},
            function() {}
        )
    }

    $scope.updateHideQuestion=function(id, value){
    	if(value)
  			$scope.review_question_count--
  		else
  			$scope.review_question_count++
  		Module.hideQuestion(
  			{
  				course_id:$stateParams.course_id,
          module_id:$stateParams.module_id
  			},
  			{
  				question:id,
  				hide:value
  			},
  			function(){},
  			function(){}
		  )
  	}

    $scope.updateHideDiscussion=function(id,value){
      if(value)
        $scope.review_question_count--
      else
        $scope.review_question_count++
      Forum.hideDiscussion({},
        {
          post_id:id,
          hide:value
        },
        function(){},
        function(){}
      )
    }

    $scope.updateHideResponse = function(quiz_id, id, value){
      Quiz.hideResponses(
        {
          course_id:$stateParams.course_id,
          quiz_id: quiz_id
        },
        {
            hide:{
              id:id, 
              hide: value
            }                
        }
      )
    }

   $scope.updateHideResponseOnlineQuiz = function(quiz_id, id, value){
      OnlineQuiz.hideResponses(
        {
          course_id:$stateParams.course_id,
          online_quizzes_id: quiz_id
        },
        {
            hide:{
              id:id, 
              hide: value
            }                
        }
      )
    }

    $scope.updateHideSurveyQuestion=function(quiz_id,id, value){
      console.log("updaing")
      Quiz.showInclass(
        {
          course_id:$stateParams.course_id,
          quiz_id:quiz_id
        },
        {
          question:id,
          show:value
        }
      )
    }

  $scope.sendComment=function(discussion){
    if(discussion.temp_response && discussion.temp_response.length && discussion.temp_response.trim()!=""){
       Forum.createComment(
        {comment: {content: discussion.temp_response, post_id:discussion.id, lecture_id:discussion.lecture_id}}, 
        function(response){
          discussion.comments.push(response)
          discussion.temp_response = null
        },function(){}
      )
    }
  }


  $scope.sendFeedback=function(question){
    if(question.temp_response && question.temp_response.length && question.temp_response.trim()!=""){
      var survey_id = question.quiz_id,
      answer_id = question.id,
      response = question.temp_response    

      Quiz.sendFeedback(
      {quiz_id: survey_id},
      {
        groups:[answer_id],
        response:response
      },
      function(){
        question.response = angular.copy(question.temp_response)
        question.temp_response = null
      },
      function(){}
      )
    }
  }

  $scope.deletePost=function(items, index){    
     var discussion = items[index]
     Forum.deletePost(
      {post_id: discussion.post.id}, 
      function(response){
        items.splice(index,1)
      },
      function(){}
    )
  }


  $scope.deleteComment=function(comment, discussion){
    Forum.deleteComment(
      {comment_id: comment.comment.id, post_id: discussion.id}, 
      function(response){
        discussion.comments.splice(discussion.comments.indexOf(comment),1)
      }, 
      function(){}
    )
  }

  $scope.removeFlag=function(discussion){
    Forum.removeAllFlags(
      {post_id:discussion.id},
      function(){
        discussion.flags_count = 0
      },
      function(){}
    )
  }

  $scope.removeCommentFlag=function(comment, discussion){
    Forum.removeAllCommentFlags(
      {comment_id: comment.comment.id, post_id:discussion.id},
      function(){
        discussion.comments[discussion.comments.indexOf(comment)].comment.flags_count = 0
      },
      function(){}
    )
  }

  $scope.updateGrade = function(answer){
    Quiz.updateGrade(
        {course_id:$stateParams.course_id, quiz_id: answer.quiz_id},
        {answer_id: answer.id, grade:answer.grade}
    )
  }

	$scope.seek=function(time, url){
  //   $scope.$parent.selected_item = item;
		// if ($scope.url.indexOf(url) == -1) 
  //       $scope.url = url+'&start='+Math.round(time)
  //   else
  //   	$scope.progress_player.controls.seek_and_pause(time)
  console.log(url)
  console.log($scope.url)
    if($scope.url.indexOf(url) == -1){
      if($scope.progress_player.controls.isYoutube(url))
        $scope.progress_player.controls.setStartTime(time)
      $scope.url= url
      if($scope.progress_player.controls.isMP4(url)){
        $timeout(function(){
          $scope.progress_player.controls.seek_and_pause(time)
        })
      }
    }
    else{
      $timeout(function(){
        $scope.progress_player.controls.seek_and_pause(time)
      })
    }
	}

  $scope.formatModuleChartData = function(data){
    var formated_data ={}
    formated_data.cols=
        [
            {"label": $translate('courses.students'),"type": "string"},
            {"label": $translate('courses.students'),"type": "number"}
        ]
    formated_data.rows= []
    var x_titles=[$translate('courses.not_started_watching'), $translate('courses.watched')+" <= 50%", $translate('courses.completed_on_time'), $translate('courses.completed_late')]
    for(var ind in data)
    {
        var row=
        {"c":
            [
                {"v":x_titles[ind]},
                {"v":data[ind]}
            ]
        }
        formated_data.rows.push(row)
    }
    return formated_data
  }


  $scope.formatLectureChartData = function(data, type) {
		var formated_data = {}
		formated_data.cols =
	    [{
		    "label": $translate('courses.students'),
		    "type": "string"
		}, {
		    "label": $translate('lectures.correct'),
		    "type": "number"
		}, {
		    "label": $translate('lectures.incorrect'),
		    "type": "number"
		}, ]
		formated_data.rows = []
		for (var ind in data) {
		    var text, correct, incorrect
		    if (data[ind][1] == "gray") {
		        text = data[ind][2]
            if(type != 'Survey')
              text+= " (" + $translate('lectures.incorrect') + ")";
		        correct = 0
		        incorrect = data[ind][0]
		    } else {
		        text = data[ind][2]
            if(type != 'Survey')
              text+= " (" + $translate('lectures.correct') + ")";
		        correct = data[ind][0]
		        incorrect = 0
		    }
		    var row = {
		        "c": [{
		            "v": text
		        }, {
		            "v": correct
		        }, {
		            "v": incorrect
		        }, ]
		    }
		    formated_data.rows.push(row)
		}
		return formated_data
	}

  $scope.formatQuizChartData = function(data) {
      var formated_data = {}
      formated_data.cols =
          [{
          "label": $translate('courses.students'),
          "type": "string"
      }, {
          "label": $translate('lectures.correct'),
          "type": "number"
      }, {
          "label": $translate('lectures.incorrect'),
          "type": "number"
      }, ]
      formated_data.rows = []
      var text, correct, incorrect
      for (var ind in data) {
          if (!data[ind][1]) {
              text = data[ind][2] + " " + "(" + $translate('lectures.incorrect') + ")";
              correct = 0
              incorrect = data[ind][0]
          } else {
              text = data[ind][2] + " " + "(" + $translate('lectures.correct') + ")";
              correct = data[ind][0]
              incorrect = 0
          }
          var row = {
              "c": [{
                  "v": text
              }, {
                  "v": correct
              }, {
                  "v": incorrect
              }, ]
          }
          formated_data.rows.push(row)
      }
      return formated_data
  }


  $scope.formatSurveyChartData = function(data){
    var formated_data ={}
    formated_data.cols=
        [
            {"label": $translate('courses.students'),"type": "string"},
            {"label": $translate('controller_msg.answered'),"type": "number"},
        ]
    formated_data.rows= []
    for(var ind in data)
    {
        var row=
        {"c":
            [
                {"v": data[ind][1]},
                {"v": data[ind][0]}
            ]
        }
        formated_data.rows.push(row)
    }
    return formated_data
  }

  // $scope.formatSurveyLectureChartData = function(data) {
  //   var formated_data = {}
  //   formated_data.cols=
  //       [
  //           {"label": $translate('courses.students'),"type": "string"},
  //           {"label": $translate('controller_msg.answered'),"type": "number"},
  //       ]
  //   formated_data.rows = []
  //   for (var ind in data) {
  //       var row = 
  //       {"c": 
  //           [
  //             {"v": data[ind][2]}, 
  //             {"v": data[ind][0]} 
  //           ]
  //       }
  //       formated_data.rows.push(row)
  //   }
  //   return formated_data
  // }


	$scope.createChart = function(data,student_count, options, formatter, type) {
		var chart = {};
		chart.type = "ColumnChart"
		chart.options = {
		    "colors": ['green', 'gray'],
		    "isStacked": "true",
		    "fill": 20,
		    "height": 135,
		    "displayExactValues": true,
		    "fontSize": 10,
		    "legend": {"position":"none"},
		    "chartArea":{"left": 30, "width": "95%"},
		    "vAxis": {
		        "gridlines": {
		            "count": 7
		        },
		        "viewWindow":{"max":student_count}
		    },
		};
		angular.extend(chart.options,options)

		chart.data = $scope[formatter](data, type)
		return chart
	}

  var setupShortcuts=function(){
    shortcut.add("r",function(){
      console.log($scope.inner_highlight_index)
      if($scope.selected_item && ($scope.selected_item.type == "Free Text Question" || $scope.selected_item.type == "discussion")) 
          if($scope.inner_highlight_index >= 0){
            if($scope.selected_item.data.answers)
              $scope.selected_item.data.answers[$scope.inner_highlight_index].show_feedback = !$scope.selected_item.data.answers[$scope.inner_highlight_index].show_feedback
            else{
              $scope.selected_item.data[$scope.inner_highlight_index].post.show_feedback = !$scope.selected_item.data[$scope.inner_highlight_index].post.show_feedback
            }$scope.$apply()
            angular.element('li.highlight').find('textarea').focus()
          }
    },{"disable_in_input" : true});

	  shortcut.add("Down",function(){
		 $scope.manageHighlight(1)    				
    },{"disable_in_input" : true});

    shortcut.add("Up",function(){
		 $scope.manageHighlight(-1)
    },{"disable_in_input" : true});

    shortcut.add("Right",function(){
		 $scope.manageInnerHighlight(1)
    },{"disable_in_input" : true});

    shortcut.add("Left",function(){
		 $scope.manageInnerHighlight(-1)
    },{"disable_in_input" : true});

    shortcut.add("Space",function(){
      
      if($scope.selected_item.time>0){
	      $scope.seek($scope.selected_item.time, $scope.lectures[$scope.selected_item.lec_id].meta.url)
        $scope.$apply()
      }
    },{"disable_in_input" : true});

    shortcut.add("m",function(){
      console.log($scope.selected_item)
      if($scope.selected_item){        
  			if ($scope.selected_item.type == "discussion"){
  				var q_ind = $scope.inner_highlight_index <0 ? 0 : $scope.inner_highlight_index
  				$scope.selected_item.data[q_ind].post.hide = !$scope.selected_item.data[q_ind].post.hide
  				$scope.updateHideDiscussion($scope.selected_item.data[q_ind].post.id,$scope.selected_item.data[q_ind].post.hide)
  			}
  			else if ($scope.selected_item.type == "charts"){
          if($scope.selected_item.data.hide != null){
    				$scope.selected_item.data.hide = !$scope.selected_item.data.hide
    				$scope.updateHideQuiz($scope.selected_item.data.id,!$scope.selected_item.data.hide )
          }
  			}
        else if($scope.selected_item.type == "Free Text Question"){
          if($scope.selected_item.data.quiz_type == 'survey'){
            if($scope.inner_highlight_index < 0){
              $scope.selected_item.data.show = !$scope.selected_item.data.show
              $scope.updateHideFreeText($scope.selected_item.data.answers[0].quiz_id,$scope.selected_item.data.id, $scope.selected_item.data.show)
            }
            else{
              var q_ind = $scope.inner_highlight_index
              $scope.selected_item.data.answers[q_ind].hide = !$scope.selected_item.data.answers[q_ind].hide
              $scope.updateHideResponse($scope.selected_item.data.answers[q_ind].quiz_id,$scope.selected_item.data.answers[q_ind].id,!$scope.selected_item.data.answers[q_ind].hide)
            }
          }
        }
        else if($scope.selected_item.type == "free_question"){
          if($scope.inner_highlight_index < 0){
            $scope.selected_item.data.show = !$scope.selected_item.data.show
            $scope.updateHideQuiz($scope.selected_item.data.id, !$scope.selected_item.data.show)
          }
          else{
            var q_ind = $scope.inner_highlight_index
            $scope.selected_item.data.answers[q_ind].hide = !$scope.selected_item.data.answers[q_ind].hide
            $scope.updateHideResponseOnlineQuiz($scope.selected_item.data.answers[q_ind].online_quiz_id,$scope.selected_item.data.answers[q_ind].id,!$scope.selected_item.data.answers[q_ind].hide)
          }
        }
      }
    },{"disable_in_input" : true});
  }

  var removeShortcuts=function(){
    shortcut.remove("r");
    shortcut.remove("Down");
    shortcut.remove("Up");
    shortcut.remove("Right");
    shortcut.remove("Left");
    shortcut.remove("Space");
    shortcut.remove("m");
  }

	$scope.getKeys = function( obj ) {
		return Object.keys ? Object.keys( obj ) : (function( obj ) {			
			var list = [];
			for (var item in obj ) 
				if ( hasOwn.call( obj, item ) ) 
					list.push( item );
			return list;
		})( obj );
	},

  	init()
}])