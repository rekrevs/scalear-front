// 'use strict';

// angular.module('scalearAngularApp')
  // .controller('studentModulesCtrl', ['$scope','Course','$stateParams','$rootScope', '$log','$window','Module','Timeline','Lecture','editor','Page', function ($scope, Course, $stateParams, $rootScope, $log, $window, Module, Timeline, Lecture, editor,Page) {

	// Page.setTitle('head.lectures');

 //    var init = function()
 //    {
	//     Module.getStudentModule(
	//     	{course_id: $stateParams.course_id, module_id:$stateParams.module_id}, 
 //            function(data){
 //                $scope.module_lectures= JSON.parse(data.module_lectures);

 //                // arrange timeline
 //                $scope.timeline = {}
 //                $scope.timeline['lecture']={}
 //                console.log("timeline")
 //                for(var l in $scope.module_lectures)
 //                {
 //                    var lec= $scope.module_lectures[l]
 //                    $scope.timeline['lecture'][lec.id] = new Timeline()
 //                    $scope.timeline['lecture'][lec.id].meta = lec

 //                    // remove quizzes with no answers - else - add it to timeline.
 //                    for(var element=lec.online_quizzes.length-1; element>=0; element--){
 //                        if (lec.online_quizzes[element].online_answers.length == 0 && lec.online_quizzes[element].question_type!= "Free Text Question")
 //                            lec.online_quizzes.splice(element, 1);
 //                        else
 //                            $scope.timeline['lecture'][lec.id].add(lec.online_quizzes[element].time, "quiz", lec.online_quizzes[element])
 //                    }

 //                    for(var type in lec.current_confused){
 //                        $scope.timeline['lecture'][lec.id].add(lec.current_confused[type].time, "confused", lec.current_confused[type])
 //                    }

 //                    // will be the same timeline later to be able to put in one and filter. (so both will be lecture, no discussion)
 //                    for(var type in lec.posts_public){
 //                        $scope.timeline['lecture'][lec.id].add(lec.posts_public[type].post.time, "discussion", lec.posts_public[type].post)
 //                    }

 //                    for(var i in lec.notes){
 //                        $scope.timeline['lecture'][lec.id].add(lec.notes[i].time, "note", lec.notes[i])
 //                    }
 //                }
 //                console.log($scope.timeline)
                
 //            }
 //        );
	// }
	
	// init();
    
  // }]);
