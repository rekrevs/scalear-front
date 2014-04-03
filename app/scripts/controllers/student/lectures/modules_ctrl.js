'use strict';

angular.module('scalearAngularApp')
  .controller('studentModulesCtrl', ['$scope','Course','$stateParams','$rootScope', '$log','$window','Module','Timeline','Lecture','editor','Page', function ($scope, Course, $stateParams, $rootScope, $log, $window, Module, Timeline, Lecture, editor,Page) {

	$window.scrollTo(0, 0);
    $scope.show_reply={}
    $scope.current_reply={}
    $scope.notes={}
    $scope.tabs=[{"active":true},{"active":false}, {"active":false}]
	Page.setTitle('head.lectures');

    var init = function()
    {
    	$scope.open_id="-1";
		$scope.open={};
		$scope.oneAtATime = true;
	
	    Module.getStudentModule(
	    	{course_id: $stateParams.course_id, module_id:$stateParams.module_id}, function(data){
                $scope.module_lectures= JSON.parse(data.module_lectures);
                console.log(data)
                $scope.lecture_ids = data.lecture_ids;

                // arrange timeline
                $scope.timeline = new Timeline()
                $scope.timeline['lecture']={}

                for(var l in $scope.module_lectures)
                {
                    var lec= $scope.module_lectures[l]
                    $scope.timeline['lecture'][lec.id] = new Timeline()

                    // remove quizzes with no answers - else - add it to timeline.
                    for(var element=lec.online_quizzes.length-1; element>=0; element--) // if no answers remove it
                    {
                        if (lec.online_quizzes[element].online_answers.length == 0 && lec.online_quizzes[element].question_type!= "Free Text Question")
                            lec.online_quizzes.splice(element, 1);
                        else
                            $scope.timeline['lecture'][lec.id].add(lec.online_quizzes[element].time, "quiz", lec.online_quizzes[element])
                    }

                    //editor.create(lec.url, $scope.lecture_player);

                    //console.log(lec)

//                    for(var type in lec.online_quizzes){
//                        $scope.timeline['lecture'][lec.id].add(lec.online_quizzes[type].time, "quiz", lec.online_quizzes[type])
//                    }

                    for(var type in lec.current_confused){
                        $scope.timeline['lecture'][lec.id].add(lec.current_confused[type].time, "confused", lec.current_confused[type])
                    }

                    // will be the same timeline later to be able to put in one and filter. (so both will be lecture, no discussion)
                    for(var type in lec.posts_public){
                        $scope.timeline['lecture'][lec.id].add(lec.posts_public[type].post.time, "discussion", lec.posts_public[type].post)
                        if(!$scope.timeline['lecture'][lec.id][lec.posts_public[type].post.id])
                            $scope.timeline['lecture'][lec.id][lec.posts_public[type].post.id]= new Timeline();


                        for(var comment in lec.posts_public[type].post.comments)
                        {
                            $scope.timeline['lecture'][lec.id][lec.posts_public[type].post.id].add(lec.posts_public[type].post.time, "comment", lec.posts_public[type].post.comments[comment].comment);
                        }
                    }

                    $scope.notes[lec.id]= lec.note;
                }

            });

	}
	
	init();



    
  }]);
