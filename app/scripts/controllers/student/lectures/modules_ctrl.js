'use strict';

angular.module('scalearAngularApp')
  .controller('studentModulesCtrl', ['$scope','Course','$stateParams','$rootScope', '$log','$window','Module','Timeline','Lecture', function ($scope, Course, $stateParams, $rootScope, $log, $window, Module, Timeline, Lecture) {

	$window.scrollTo(0, 0);
    $scope.show_reply={}
    $scope.current_reply={}
	
    var init = function()
    {
    	$scope.open_id="-1";
		$scope.open={};
		$scope.oneAtATime = true;
	
	    Module.getStudentModule(
	    	{course_id: $stateParams.course_id, module_id:$stateParams.module_id}, function(data){
                $scope.module_lectures= JSON.parse(data.module_lectures);
                $scope.lecture_ids = data.lecture_ids;

                for(var e=0; e<$scope.module_lectures.length; e ++)
                {
                    for(var element=$scope.module_lectures[e].online_quizzes.length-1; element>=0; element--) // if no answers remove it
                    {
                        if ($scope.module_lectures[e].online_quizzes[element].online_answers.length == 0 && $scope.module_lectures[e].online_quizzes[element].question_type!= "Free Text Question")
                            $scope.module_lectures[e].online_quizzes.splice(element, 1);
                    }
                }


                // arrange timeline
                $scope.timeline = new Timeline()
                $scope.timeline['lecture']={}
                $scope.timeline['discussion']={}

                for(var l in $scope.module_lectures)
                {
                    var lec= $scope.module_lectures[l]
                    //console.log(lec)
                    $scope.timeline['lecture'][lec.id] = new Timeline()
                    $scope.timeline['discussion'][lec.id] = new Timeline()
                    for(var type in lec.online_quizzes){
                        $scope.timeline['lecture'][lec.id].add(lec.online_quizzes[type].time, "quiz", lec.online_quizzes[type])
                    }

                    for(var type in lec.current_confused){
                        $scope.timeline['lecture'][lec.id].add(lec.current_confused[type].time, "confused", lec.current_confused[type])
                    }

                    // will be the same timeline later to be able to put in one and filter. (so both will be lecture, no discussion)
                    for(var type in lec.posts){
                        $scope.timeline['discussion'][lec.id].add(lec.posts[type].post.time, "discussion", lec.posts[type].post)
                        if(!$scope.timeline['discussion'][lec.id][lec.posts[type].post.id])
                            $scope.timeline['discussion'][lec.id][lec.posts[type].post.id]= new Timeline();


                        for(var comment in lec.posts[type].post.comments)
                        {
                            $scope.timeline['discussion'][lec.id][lec.posts[type].post.id].add(lec.posts[type].post.time, "comment", lec.posts[type].post.comments[comment].comment);
                        }
                    }
                }

            });

	}
	
	init();

    $scope.deleteConfused = function(confused_id, lecture_id, c){
        Lecture.deleteConfused({lecture_id: lecture_id, confused_id: confused_id}, function(response){
            console.log("deleted");
            // now want to remove from list (both l.confuseds and $scope.timeline..)
            var index=$scope.timeline['lecture'][lecture_id].items.indexOf(c);
            $scope.timeline['lecture'][lecture_id].items.splice(index, 1)
        });
    }

    
  }]);
