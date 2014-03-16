'use strict';

angular.module('scalearAngularApp')
    .controller('studentLectureMiddleCtrl', ['$anchorScroll','$scope', 'Course', '$stateParams', 'Lecture', '$window', '$interval', '$translate', '$state', '$log', 'CourseEditor','$location','$timeout','editor','doc','Page', function($anchorScroll,$scope, Course, $stateParams, Lecture, $window, $interval, $translate, $state, $log, CourseEditor, $location, $timeout,editor,doc,Page) {


    $scope.video_layer = {}
    $scope.quiz_layer = {}
    $scope.resize = {}
    $scope.lecture = {}
    $scope.lecture.aspect_ratio = ""
    $scope.$parent.lecture_player = {}
    $scope.$parent.lecture_player.events = {}
    $scope.display_mode = false
    $scope.studentAnswers = {}
    $scope.explanation = {}
    $scope.wHeight = 0;
    $scope.wWidth = 0;
    $scope.pHeight = 0;
    $scope.pWidth = 0;
    $scope.show_notification = false;
    $scope.fullscreen = false
    $scope.play_pause_class = 'play'
    $scope.current_time = 0
    $scope.total_duration = 0
    $scope.ipad = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i)
    $scope.editors={}

    

    $scope.adjust_accordion= function(){
        $scope.$emit('accordianUpdate', {
            g_id: $scope.lecture.group_id,
            type: "lecture",
            id: $scope.lecture.id
        });
    }

    $scope.load_player = function(time){
        $scope.lecture_player.events.onReady = function() {
            $scope.total_duration = $scope.lecture_player.controls.getDuration()
            //$scope.lecture_player.controls.play()
            if(time!=0){
                console.log("seeking")
                $scope.lecture_player.controls.seek_and_pause(time);
                console.log($scope.lecture_player.controls.getTime())
            }
            else{
                $scope.lecture_player.controls.play()
            }
            $scope.slow = false
            $scope.loading_video = false;
            //editor.create($scope.lecture.url, $scope.lecture_player);
            var i= $scope.lecture_ids.indexOf($scope.lecture.id);
            $scope.module_lectures[i].online_quizzes.forEach(function(quiz) {
                $scope.lecture_player.controls.cue(quiz.time, function() {
                    $scope.studentAnswers[quiz.id] = {}
                    $scope.selected_quiz = quiz
                    $scope.display_mode = true
                    $scope.lecture_player.controls.pause()
                    if (quiz.quiz_type == 'invideo') {
                        $scope.quiz_layer.backgroundColor = ""
                        $scope.quiz_layer.overflowX = ''
                        $scope.quiz_layer.overflowY = ''
                    } else {
                        $log.debug("HTML quiz")
                        $scope.quiz_layer.backgroundColor = "white"
                        $scope.quiz_layer.overflowX = 'hidden'
                        $scope.quiz_layer.overflowY = 'auto'
                        if (quiz.question_type.toUpperCase() == "DRAG")
                            $scope.studentAnswers[quiz.id] = quiz.online_answers[0].answer;
                    }
                    $scope.$apply()
                })
            })
        }
    }

    var init = function() {
        $scope.loading_video = true;
        Lecture.getLectureStudent({
                course_id: $stateParams.course_id,
                lecture_id: $stateParams.lecture_id,
                time: $stateParams.time
            },
            function(data) {
                $scope.alert_messages = data.alert_messages;
                $scope.lecture = JSON.parse(data.lecture);
                $scope.time = data.time;
                Page.setTitle($scope.lecture.name);


//                $scope.events={}
//                $scope.events["confused"]=$scope.lecture.confuseds;
//                $scope.events["questions"]=$scope.lecture.lecture_questions;
//                $scope.events["quizzes"]=$scope.lecture.online_quizzes;
//                // scroll to that lecture in outline.


                //$location.hash($scope.lecture.id);
                //$anchorScroll();
//                $scope.module_lectures= JSON.parse(data.module_lectures);
//                $scope.lecture_ids = data.lecture_ids;
                if($scope.ipad)
                    $scope.lecture.url+="&controls"
//                for(var e=0; e<$scope.module_lectures.length; e ++)
//                {
//                    for(var element=$scope.module_lectures[e].online_quizzes.length-1; element>=0; element--) // if no answers remove it
//                    {
//                        if ($scope.module_lectures[e].online_quizzes[element].online_answers.length == 0 && $scope.module_lectures[e].online_quizzes[element].question_type!= "Free Text Question")
//                            $scope.module_lectures[e].online_quizzes.splice(element, 1);
//                    }
//                }
                $scope.next_item = data.next_item

                // to scroll to correct outline position, after module has loaded.
                var watcher2 = $scope.$watch('module_lectures', function(newval){
                    if ($scope.module_lectures) {
                        $timeout(function(){
                            console.log($scope.module_lectures.length)
                            var to="outline_"+$scope.lecture.id.toString()
                            var to2="notes_"+$scope.lecture.id.toString()
                            document.getElementById(to).scrollIntoView();
                            document.getElementById(to2).scrollIntoView();
                            watcher2();
                        }, 500);

                    }
                });

                var watcher = $scope.$watch('course', function(newval) {
                    if ($scope.$parent.course) {
                        var group_index = CourseEditor.get_index_by_id($scope.$parent.course.groups, data.done[1])
                        var lecture_index = CourseEditor.get_index_by_id($scope.$parent.course.groups[group_index].lectures, data.done[0])
                        if (lecture_index != -1 && group_index != -1)
                            $scope.$parent.course.groups[group_index].lectures[lecture_index].is_done = data.done[2]
                        watcher();
                    }
                })

                //$log.debug($scope.lecture.online_quizzes)
                $scope.load_player($scope.time);
                $scope.adjust_accordion();

            }
        );
    }

    

    $scope.nextItem=function(){
        if ($scope.next_item.id) {
            var next_state = "course.lectures.module." + $scope.next_item.class_name
            var s = $scope.next_item.class_name + "_id"
            var to = {}
            to[s] = $scope.next_item.id
            to["module_id"]=$scope.next_item.group_id
            $state.go(next_state, to);
        }
    }

    $scope.replay=function(){
        $scope.lecture.url +=" "
        $scope.end_buttons = false
    }

    $scope.seek = function(time, lecture_id) {
        $scope.selected_quiz = '';
        $scope.display_mode = false;
        if(lecture_id == $scope.lecture.id){ //if current lecture
            $scope.lecture_player.controls.seek_and_pause(parseInt(time))
        }
        else{

            $state.go("course.lectures.module.lecture", {"lecture_id":lecture_id, "time":time});
//            $state.go()
//            Lecture.switchQuiz({course_id:$stateParams.course_id, lecture_id:lecture_id, time:time}, function(data){
//                $scope.alert_messages = data.alert_messages;
//                $scope.lecture = JSON.parse(data.lecture)
//                if($scope.ipad)
//                    $scope.lecture.url+="&controls"
//                $scope.next_item = data.next_item
//
//                var watcher = $scope.$watch('course', function(newval) {
//                    if ($scope.$parent.course) {
//                        var group_index = CourseEditor.get_index_by_id($scope.$parent.course.groups, data.done[1])
//                        var lecture_index = CourseEditor.get_index_by_id($scope.$parent.course.groups[group_index].lectures, data.done[0])
//                        if (lecture_index != -1 && group_index != -1)
//                            $scope.$parent.course.groups[group_index].lectures[lecture_index].is_done = data.done[2]
//                        watcher();
//                    }
//                })
//                $scope.load_player(time);
//                $scope.adjust_accordion();
            //});
        }
    }

    $scope.updateProgress=function(ev){
        var element = angular.element('.progressBar');
        var ratio = (ev.pageX-element.offset().left)/element.outerWidth();                
        $scope.elapsed_width = ratio*100+'%'
        $scope.seek($scope.total_duration*ratio, $stateParams.lecture_id)
    }

    $scope.playBtn = function(){
      if($scope.play_pause_class == "play"){
        $scope.lecture_player.controls.play()
      }
      else{
        $scope.lecture_player.controls.pause()
      }
    }

    $scope.submitPause= function()
    {
        Lecture.pause({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:$scope.lecture_player.controls.getTime()}, function(data){});
    }

    var returnToQuiz=function(time){
        $log.debug("in notification")
        $scope.lecture_player.controls.pause();
        $scope.lecture_player.controls.seek(time)
        $scope.show_notification = $translate('groups.answer_question');
        $interval(function() {
            $scope.show_notification = false;
        }, 2000, 1);
    }

    $scope.lecture_player.events.onPlay = function() {
        $scope.play_pause_class = 'pause'
        if ($scope.display_mode && !$scope.selected_quiz.is_quiz_solved) {
            if($scope.lecture_player.controls.getTime() >= $scope.selected_quiz.time)
                returnToQuiz($scope.selected_quiz.time)
            else {
                $scope.selected_quiz = '';
                $scope.display_mode = false;
            }
        }
    }

    $scope.lecture_player.events.onPause= function(){
        $log.debug("in here");
        $scope.play_pause_class = "play"
        if($scope.display_mode!=true) //not a quiz
            $scope.submitPause();
    }

    $scope.lecture_player.events.timeUpdate = function(){
        $scope.current_time = $scope.lecture_player.controls.getTime()
        $scope.elapsed_width = (($scope.current_time/$scope.total_duration)*100) + '%'
    }

    $scope.lecture_player.events.onEnd= function() {
        if($scope.fullscreen)
            $scope.resize.small()
        $scope.end_buttons = true
    }

    $scope.lecture_player.events.onSlow=function(){
        $scope.slow = true
    }

    init();


}]);