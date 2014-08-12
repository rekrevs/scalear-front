'use strict';

angular.module('scalearAngularApp')
  .controller('coursewareCtrl', ['$scope','$stateParams', '$log','Module','Timeline','Page', function ($scope, $stateParams, $log, Module, Timeline, Page) {
	
	Page.setTitle('head.lectures');

    var init = function()
    {
	    Module.getStudentModule(
	    	{course_id: $stateParams.course_id, module_id:$stateParams.module_id}, 
            function(data){
                $scope.module_lectures= JSON.parse(data.module_lectures);

                // arrange timeline
                $scope.timeline = {}
                $scope.timeline['lecture']={}
                console.log("timeline")
                for(var l in $scope.module_lectures)
                {
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
                }
                console.log($scope.timeline)
                
            }
        );
	}

	init();

 //    var init = function()
 //    {
	//     Course.getCourseware(
	//     	{course_id: $stateParams.course_id}, function(data){
	// 			$scope.course= JSON.parse(data.course);
	// 			$log.debug($scope.course);
	// 			$scope.today = data.today;	
	// 			$scope.last_viewed = data.last_viewed
	// 			$scope.module_obj = scalear_utils.toObjectById($scope.course.groups)
	// 			var classname = 'lecture'

	// 		 	if($state.params.module_id)
	// 		 		$scope.current_module = $scope.module_obj[$state.params.module_id]	
	// 		 	else if($scope.last_viewed.module != -1)
	// 		 		$scope.current_module = $scope.module_obj[$scope.last_viewed.module]	
	// 		 	else
	// 		 		$scope.current_module = $scope.course.groups[0] 

	// 		 	if($scope.current_module.items && $scope.current_module.items.length){
	//     			if($state.params.lecture_id)
	// 					$scope.current_item = $state.params.lecture_id
	//     			else if($state.params.quiz_id){
	//     				$scope.current_item = $state.params.quiz_id
	// 	    			classname = 'quiz'
	// 	    		}
	// 				else if($scope.last_viewed.lecture)
	// 					$scope.current_item = $scope.last_viewed.lecture
	// 				else{
	// 					$scope.current_item = $scope.current_module.items[0].id
	// 		    		classname = $scope.current_module.items[0].class_name
	// 				}
	// 		 	}
	// 		    if($scope.current_module && $scope.current_item){	
	// 		    	var params = {'module_id': $scope.current_module.id}	
	// 		    	params[classname+'_id'] = $scope.current_item
	// 				$state.go('course.module.courseware.'+classname, params)
	// 			}
	//     	});
	// }

	// $scope.showModule = function(module){
	// 	$scope.current_module = module
	// 	Module.getLastWatched(
	// 		{course_id: $stateParams.course_id, module_id: module.id}, function(data){
	// 			if(data.last_watched != -1){
	// 				$state.go('course.module.courseware.lecture', {'module_id': module.id, 'lecture_id': data.last_watched})
	// 				$scope.current_item = data.last_watched
	// 			}
	// 			else{
	// 				$state.go('course.module.courseware.quiz', {'module_id': module.id, 'quiz_id': module.quizzes[0].id})
	// 				$scope.current_item = module.quizzes[0].id
	// 			}
	// 		}
	// 	)		
	// }

	// $scope.$watch('current_module', function(){
	// 	if($scope.current_module)
	// 		$scope.spacing = 80/$scope.current_module.quizzes.concat($scope.current_module.lectures).length
	// })

	
	
  }]);
