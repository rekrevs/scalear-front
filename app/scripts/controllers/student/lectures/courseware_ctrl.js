'use strict';

angular.module('scalearAngularApp')
  .controller('coursewareCtrl', ['$scope','$stateParams', '$log','Module','Timeline','Page','$state', function ($scope, $stateParams, $log, Module, Timeline, Page, $state) {
	
	Page.setTitle('navigation.lectures');
  	Page.startTour();

    var init = function(){
    	$scope.module_items = $scope.module_obj[$stateParams.module_id].items
    	$log.debug("items are")
    	$log.debug($scope.module_items)
	    Module.getStudentModule(
	    	{course_id: $stateParams.course_id, module_id:$stateParams.module_id}, 
            function(data){
                $scope.module_lectures= JSON.parse(data.module_lectures);

                // arrange timeline
                $scope.timeline = {}
                $scope.timeline['lecture']={}
                $log.debug("timeline")
                for(var l in $scope.module_lectures){
                    var lec= $scope.module_lectures[l]
                    $scope.timeline['lecture'][lec.id] = new Timeline()
                    $scope.timeline['lecture'][lec.id].meta = lec

                    // remove quizzes with no answers - else - add it to timeline.
                    for(var element=lec.online_quizzes.length-1; element>=0; element--){
                        if (lec.online_quizzes[element].online_answers.length == 0 && lec.online_quizzes[element].question_type!= "Free Text Question")
                            lec.online_quizzes.splice(element, 1);
                        else
                            $scope.timeline['lecture'][lec.id].add(lec.online_quizzes[element].time, "quiz", lec.online_quizzes[element])
                    }

                    for(var type in lec.current_confused){
                        $scope.timeline['lecture'][lec.id].add(lec.current_confused[type].time, "confused", lec.current_confused[type])
                    }

                    // will be the same timeline later to be able to put in one and filter. (so both will be lecture, no discussion)
                    for(var type in lec.posts_public){
                        $scope.timeline['lecture'][lec.id].add(lec.posts_public[type].post.time, "discussion", lec.posts_public[type].post)
                    }

                    for(var i in lec.notes){
                        $scope.timeline['lecture'][lec.id].add(lec.notes[i].time, "note", lec.notes[i])
                    }
                    for(var i in lec.annotated_markers){
                        $scope.timeline['lecture'][lec.id].add(lec.annotated_markers[i].time, "marker", lec.annotated_markers[i])
                    }
                }
                $log.debug("timeline",$scope.timeline)
                showModuleCourseware($scope.module_obj[$stateParams.module_id])
                
            }
        );
	}

	init();

	var showModuleCourseware = function(module){
		if(module.items.length){
	        if(!$state.params.lecture_id && !$state.params.quiz_id){
	          Module.getLastWatched(
	            {
	            	course_id: $stateParams.course_id, 
	            	module_id: module.id
	            }, 
	            function(data){
	              if(data.last_watched != -1){
	                $state.go('course.module.courseware.lecture', {'module_id': module.id, 'lecture_id': data.last_watched})
	              }
	              else{
	                $state.go('course.module.courseware.quiz', {'module_id': module.id, 'quiz_id': module.quizzes[0].id})
	              }
	          }) 
	        } 
	    }
	    else
	    	$state.go('course.course_information')	
  	}

}]);
