'use strict';

angular.module('scalearAngularApp')
    .controller('studentLectureMiddleCtrl', ['$anchorScroll','$scope', 'Course', '$stateParams', 'Lecture', '$window', '$interval', '$translate', '$state', '$log', 'CourseEditor','$location','$timeout','editor','doc','Page', '$filter',function($anchorScroll,$scope, Course, $stateParams, Lecture, $window, $interval, $translate, $state, $log, CourseEditor, $location, $timeout,editor,doc,Page, $filter) {


//     $scope.video_layer = {}
//     $scope.quiz_layer = {}
//     $scope.container_layer = {}
//     $scope.resize = {}
//     $scope.youtube_video=false;
   // $scope.lecture = {}
//     $scope.lecture.aspect_ratio = ""
    $scope.lecture_player = {}
    $scope.lecture_player.events = {}
    $scope.tabs=[true,false,false]
//     $scope.display_mode = false
//     $scope.studentAnswers = {}
//     $scope.explanation = {}
//     $scope.wHeight = 0;
//     $scope.wWidth = 0;
//     $scope.pHeight = 0;
//     $scope.pWidth = 0;
//     $scope.show_notification = false;
//     $scope.fullscreen = false
    
    $scope.current_time = 0
    $scope.total_duration = 0
//     $scope.ipad = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i)
    $scope.editors={}
//     $scope.progressEvents=[]

//     $scope.adjust_accordion= function(){
//         $scope.$emit('accordianUpdate', {
//             g_id: $scope.lecture.group_id,
//             type: "lecture",
//             id: $scope.lecture.id
//         });
//     }

//     var getVideoId= function(url){
//         return url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]{11})/);
//     }

//     $scope.setup_confused = function()
//     {
//         var element = angular.element('.progressBar');
//         for(var e in $scope.confused)
//         {
//             console.log((($scope.confused[e].time/$scope.total_duration)*100) + '%')
//             if($scope.confused[e].very==true)
//                 $scope.progressEvents.push([(($scope.confused[e].time/$scope.total_duration)*100) + '%', 'purple' ,'courses.really_confused', $scope.confused[e].id]);
//             else
//                 $scope.progressEvents.push([(($scope.confused[e].time/$scope.total_duration)*100) + '%', 'red' ,'courses.confused', $scope.confused[e].id]);
//             console.log($scope.progressEvents)
//         }

//         console.log($scope.progressEvents)
//     //finish here.. will need to add elements!
//     }

//     $scope.setup_student_questions = function()
//     {
//         var element = angular.element('.progressBar');
//         console.log("questions are");
//         console.log($scope.student_questions);

//         for(var e in $scope.student_questions)
//         {
//             console.log((($scope.student_questions[e].time/$scope.total_duration)*100) + '%')
//             $scope.progressEvents.push([(($scope.student_questions[e].time/$scope.total_duration)*100) + '%', 'yellow' ,'courses.you_asked', $scope.student_questions[e].id, $scope.student_questions[e].question]);
//         }

//         console.log($scope.progressEvents)
//         //finish here.. will need to add elements!
//     }

//     $scope.load_player = function(time){
        $scope.lecture_player.events.onReady = function() {
            $scope.total_duration = $scope.lecture_player.controls.getDuration()
//             // $scope.lecture_player.controls.pause()
//             $scope.lecture_player.controls.seek(0)
//             $scope.lecture_player.controls.volume(0.8);
//             // $scope.lecture_player.controls.play()
//             if(time!=0){
//                 console.log("seeking")
//                 $scope.lecture_player.controls.seek_and_pause(time);
//                 console.log($scope.lecture_player.controls.getTime())
//             }
//             else{
//                 $scope.lecture_player.controls.play()
//             }
//             $scope.slow = false
//             $scope.loading_video = false;
//             //editor.create($scope.lecture.url, $scope.lecture_player);
//             var i= $scope.lecture_ids.indexOf($scope.lecture.id);

//             if($scope.progressEvents.length==0) // first load.
//             {
//                 $scope.setup_confused();
//                 $scope.setup_student_questions();
//             }

//             $scope.module_lectures[i].online_quizzes.forEach(function(quiz) {
//                 $scope.lecture_player.controls.cue(quiz.time, function() {
//                     $scope.studentAnswers[quiz.id] = {}
//                     $scope.selected_quiz = quiz
//                     $scope.display_mode = true
//                     $scope.lecture_player.controls.pause()
//                     if (quiz.quiz_type == 'html') {    
//                         $log.debug("HTML quiz")
//                         $scope.quiz_layer.backgroundColor = "white"
//                         $scope.quiz_layer.overflowX = 'hidden'
//                         $scope.quiz_layer.overflowY = 'auto'
//                         if (quiz.question_type.toUpperCase() == "DRAG")
//                             $scope.studentAnswers[quiz.id] = quiz.online_answers[0].answer;
//                         if (quiz.question_type.toUpperCase() == "FREE TEXT QUESTION")
//                             $scope.studentAnswers[quiz.id] = "";
//                     }
//                     else {
//                         $scope.quiz_layer.backgroundColor = ""
//                         $scope.quiz_layer.overflowX = ''
//                         $scope.quiz_layer.overflowY = ''
//                     }
//                     $scope.$apply()
//                 })
//             })
//         }
    }

     var init = function() {
//         var factor = 16/9
//         var win = angular.element($window)
//         if(win.width()/win.height() < factor){
//             console.log('yesssssssssssssssssssssss'+win.width()/win.height())
//             var video_layer_height = win.height()*0.35
//         }
//         else{
//             var video_layer_height = win.height()*0.54
//         }
        
//         var main_video_container = angular.element('#main-video-container')
//         main_video_container.css('height', video_layer_height+'px')
//         angular.element('#student-accordion').css('height', video_layer_height+39)
        

//         angular.element($window).bind('resize', function(){
//             $scope.resizeVideo();
//         })
//         $scope.loading_video = true;
            $scope.video_class = 'video_class'
            $scope.play_pause_class = 'play'
            document.addEventListener(screenfull.raw.fullscreenchange, function () {
                // console.log('Am I fullscreen? ' + (screenfull.isFullscreen ? 'Yes' : 'No'));
                if(!screenfull.isFullscreen){
                    $scope.fullscreen = false
                    $scope.video_class= 'video_class'
                    $scope.$apply()
                }
            });
            Lecture.getLectureStudent({
                    course_id: $stateParams.course_id,
                    lecture_id: $stateParams.lecture_id,
                    // time: $stateParams.time
                },
                function(data) {
//                 $scope.alert_messages = data.alert_messages;
                    $scope.lecture = JSON.parse(data.lecture);
                    console.log("this is the data ")
                    console.log($scope)
//                 if($scope.lecture.aspect_ratio == 'smallscreen'){
//                     factor = 4/3
//                 }
                
//                 if(win.width() >= 1024){
//                     $scope.initial_width = factor*main_video_container.height()/win.width()*100;
//                 }
//                 else{
//                     $scope.initial_width = 50
//                     // angular.element('#student-accordion').css('height', '44%')
//                 }
//                 main_video_container.css('width', $scope.initial_width+'%' )

//                 $scope.resizeVideo()
                
                
//                 $scope.time = data.time;
//                 $scope.confused= data.confuseds;
//                 $scope.student_questions= data.lecture_questions;
//                 $scope.youtube_video= getVideoId($scope.lecture.url);
//                 // Page.setTitle($filter('translate')('head.lectures')+': '+$scope.lecture.name);
// //                $scope.events={}
// //                $scope.events["confused"]=$scope.lecture.confuseds;
// //                $scope.events["questions"]=$scope.lecture.lecture_questions;
// //                $scope.events["quizzes"]=$scope.lecture.online_quizzes;
// //                // scroll to that lecture in outline.


//                 //$location.hash($scope.lecture.id);
//                 //$anchorScroll();
// //                $scope.module_lectures= JSON.parse(data.module_lectures);
// //                $scope.lecture_ids = data.lecture_ids;
//                 //if($scope.ipad)
//                  //   $scope.lecture.url+="&controls"
// //                for(var e=0; e<$scope.module_lectures.length; e ++)
// //                {
// //                    for(var element=$scope.module_lectures[e].online_quizzes.length-1; element>=0; element--) // if no answers remove it
// //                    {
// //                        if ($scope.module_lectures[e].online_quizzes[element].online_answers.length == 0 && $scope.module_lectures[e].online_quizzes[element].question_type!= "Free Text Question")
// //                            $scope.module_lectures[e].online_quizzes.splice(element, 1);
// //                    }
// //                }
//                 $scope.next_item = data.next_item

//                 // to scroll to correct outline position, after module has loaded.
//                 var watcher2 = $scope.$watch('module_lectures', function(newval){
//                     if ($scope.module_lectures) {
//                         $timeout(function(){
//                             console.log($scope.module_lectures.length)
//                             var to="outline_"+$scope.lecture.id.toString()
//                             var to2="notes_"+$scope.lecture.id.toString()
//                             document.getElementById(to).scrollIntoView();
//                             document.getElementById(to2).scrollIntoView();
//                             watcher2();
//                         }, 500);

                    // }
                });

//                 var watcher = $scope.$watch('course', function(newval) {
//                     if ($scope.$parent.course) {
//                         var group_index = CourseEditor.get_index_by_id($scope.$parent.course.groups, data.done[1])
//                         var lecture_index = CourseEditor.get_index_by_id($scope.$parent.course.groups[group_index].lectures, data.done[0])
//                         if (lecture_index != -1 && group_index != -1)
//                             $scope.$parent.course.groups[group_index].lectures[lecture_index].is_done = data.done[2]
//                         watcher();
//                     }
//                 })

//                 //$log.debug($scope.lecture.online_quizzes)
//                 $scope.load_player($scope.time);
//                 $scope.adjust_accordion();

//             }
//         );
     }


//     $scope.resizeVideo = function(){
//         console.log('resizing the video')
//         var flag_width = false;
//         var factor = 9/16;
//         if($scope.lecture.aspect_ratio == 'smallscreen'){
//             factor = 3/4
//         }
//         var win = angular.element($window)
//         // var video_layer_height = win.height()*0.6
//         var main_video_container = angular.element('#main-video-container')
//         if(win.width() <= 1024){
//             main_video_container.css('width', 100+'%');
//             var flag_width = false;
//         }
//         else if(flag_width == false && win.width() > 1024){
//             main_video_container.css('width', $scope.initial_width+'%');
//             flag_width = true;
//         }
//         var video_layer_height = main_video_container.width()*factor
//         var ontop_layer = angular.element('.ontop')
//         main_video_container.css('height', video_layer_height+'px')
//         // main_video_container.css('width', (main_video_container.height()/factor)/win.width+'%')
//         // angular.element('#student-accordion').css('height', main_video_container.height()+39)
        
//         // main_video_container.css('width', (factor*main_video_container.height())+'px')
//         ontop_layer.css('width', main_video_container.width())
//         ontop_layer.css('height', main_video_container.height())
//         $timeout(function(){$scope.$emit("updatePosition")})
//         $timeout(function(){angular.element('#controls').css('top', '')})
//         // console.log('the value is '+100-main_video_container.width()-6)
//         // angular.element('#student-accordion').css('width', 100-main_video_container.width()-6+'%')
//     }

//     $scope.nextItem=function(){
//         if ($scope.next_item.id) {
//             var next_state = "course.courseware.module." + $scope.next_item.class_name
//             var s = $scope.next_item.class_name + "_id"
//             var to = {}
//             to[s] = $scope.next_item.id
//             to["module_id"]=$scope.next_item.group_id
//             $state.go(next_state, to);
//         }
//     }

//     $scope.replay=function(){
//         $scope.lecture.url +=" "
//         $scope.end_buttons = false
//     }

    $scope.seek = function(time, lecture_id) { // must add condition where lecture is undefined could be coming from progress bar
//         $scope.selected_quiz = '';
//         $scope.display_mode = false;
        if(!lecture_id || lecture_id == $scope.lecture.id){ //if current lecture
            $scope.lecture_player.controls.seek(parseInt(time))
        }
//         else{

//             $state.go("course.courseware.module.lecture", {"lecture_id":lecture_id, "time":time});
// //            $state.go()
// //            Lecture.switchQuiz({course_id:$stateParams.course_id, lecture_id:lecture_id, time:time}, function(data){
// //                $scope.alert_messages = data.alert_messages;
// //                $scope.lecture = JSON.parse(data.lecture)
// //                if($scope.ipad)
// //                    $scope.lecture.url+="&controls"
// //                $scope.next_item = data.next_item
// //
// //                var watcher = $scope.$watch('course', function(newval) {
// //                    if ($scope.$parent.course) {
// //                        var group_index = CourseEditor.get_index_by_id($scope.$parent.course.groups, data.done[1])
// //                        var lecture_index = CourseEditor.get_index_by_id($scope.$parent.course.groups[group_index].lectures, data.done[0])
// //                        if (lecture_index != -1 && group_index != -1)
// //                            $scope.$parent.course.groups[group_index].lectures[lecture_index].is_done = data.done[2]
// //                        watcher();
// //                    }
// //                })
// //                $scope.load_player(time);
// //                $scope.adjust_accordion();
//             //});
//         }
    }



//     $scope.playBtn = function(){
//       if($scope.play_pause_class == "play"){
//         $scope.lecture_player.controls.play()
//       }
//       else{
//         $scope.lecture_player.controls.pause()
//       }
//     }

//     $scope.submitPause= function()
//     {
//         Lecture.pause({course_id:$stateParams.course_id, lecture_id:$stateParams.lecture_id},{time:$scope.lecture_player.controls.getTime()}, function(data){});
//     }

//     var returnToQuiz=function(time){
//         $log.debug("in notification")
//         $scope.lecture_player.controls.pause();
//         $scope.lecture_player.controls.seek(time)
//         $scope.show_notification = $translate('groups.answer_question');
//         $interval(function() {
//             $scope.show_notification = false;
//         }, 2000, 1);
//     }

    $scope.lecture_player.events.onPlay = function() {
        $scope.play_pause_class = 'pause'
//         if ($scope.display_mode && !$scope.selected_quiz.is_quiz_solved) {
//             if($scope.lecture_player.controls.getTime() >= $scope.selected_quiz.time)
//                 returnToQuiz($scope.selected_quiz.time)
//             else {
//                 $scope.selected_quiz = '';
//                 $scope.display_mode = false;
//             }
//         }
//         else if($scope.display_mode && $scope.selected_quiz.is_quiz_solved){
//             $scope.display_mode = false;
//         }
    }

    $scope.lecture_player.events.onPause= function(){
//         $log.debug("in here");
        $scope.play_pause_class = "play"
//         if($scope.display_mode!=true) //not a quiz
//             $scope.submitPause();
    }

    $scope.lecture_player.events.timeUpdate = function(){
        $scope.current_time = $scope.lecture_player.controls.getTime()
        $scope.elapsed_width = (($scope.current_time/$scope.total_duration)*100) + '%'
    }

//     $scope.lecture_player.events.onEnd= function() {
//         if($scope.fullscreen)
//             $scope.resize.small()
//         $scope.end_buttons = true
//     }

//     $scope.lecture_player.events.onSlow=function(){
//         $scope.slow = true
//     }
    
    var switchToTab=function(tab){
        for(var i in $scope.tabs)
            $scope.tabs[i] = false
        $scope.tabs[tab] = true
    }

    $scope.addConfused= function(){
        console.log("caosdnsakn")
        
        var time=$scope.lecture_player.controls.getTime()
        Lecture.confused(
        {
            course_id:$stateParams.course_id, 
            lecture_id:$stateParams.lecture_id
        },
        {time:time}, 
        function(data){
            if(data.msg=="ask"){
                $scope.show_notification=$translate("controller_msg.really_confused_use_question");
                // $scope.notify_position={"left":($scope.pWidth - 180) + "px"}
                $interval(function(){
                    // $scope.notify_position={"left":"240px"};
                    $scope.show_notification=false;
                }, 6000, 1)
            }
            if(!data.flag) //first time confused in these 15 seconds
            {
                $scope.timeline['lecture'][$stateParams.lecture_id].add(time, "confused", data.item)
            }

            if(data.flag && data.msg!="ask") // confused before but not third time - very confused
            {
                var elem=$scope.timeline['lecture'][$stateParams.lecture_id].search_by_id(data.id, "confused");
                $scope.timeline['lecture'][$stateParams.lecture_id].items[elem].data.very=true;            
            }
        });
    }

    $scope.toggleFullscreen=function(){
        $scope.fullscreen = !$scope.fullscreen
        $scope.video_class= $scope.fullscreen? 'video_class_full' : 'video_class'
    }

    $scope.toggleQuestionBlock= function(){
        $scope.show_question_block=!$scope.show_question_block;        
        if($scope.show_question_block){
            $scope.current_question_time=$scope.lecture_player.controls.getTime();
            $scope.lecture_player.controls.pause();
            switchToTab(0);
        }
        // else
        //     $scope.lecture_player.controls.play();
    };

    $scope.$on('video_back',function(ev, time){
        console.log(time)
        Lecture.back(
            {
                course_id:$stateParams.course_id, 
                lecture_id:$stateParams.lecture_id
            },
            {time:time}, 
            function(data){}
        );
    })

    var showNotification=function(msg){
        $scope.notification_message=$translate(msg);
        $scope.notification_submessage=$translate(msg);
        $interval(function(){
            removeNotification()
        }, 2000, 1);
    }

     var removeNotification = function(){
        $scope.show_notification=null;
        window.onmousemove = null
        //reviewInclass()          
        $scope.$apply()
    }

    $scope.checkAnswer = function(){            
        $log.debug("check answer "+$scope.solution);
        if($scope.selected_quiz.quiz_type=="html"){              
            sendHtmlAnswers()
        }
        else{
            sendAnswers()
        };
    }

    var sendHtmlAnswers=function(){
        if(!$scope.answer_form.$error.atleastone && !($scope.selected_quiz.question_type=='Free Text Question' && $scope.answer_form.$error.required)){
            $log.debug("valid form")
            $scope.submitted=false;
            Lecture.saveHtml(
            {
                course_id: $stateParams.course_id, 
                lecture_id:$stateParams.lecture_id
            },
            {
                quiz:$scope.selected_quiz.id, 
                answer:$scope.studentAnswers[$scope.selected_quiz.id]
            }, 
            function(data){
                displayResult(data);
            });
        }
        else{
            $log.debug("invalid form")
            $scope.submitted=true;
        }
    }

    var sendAnswers=function(){
        var selected_answers
        if($scope.selected_quiz.question_type == "OCQ" || $scope.selected_quiz.question_type == "MCQ"){
            selected_answers=[]
            $scope.selected_quiz.online_answers.forEach(function(answer){
                if(answer.selected)
                    selected_answers.push(answer.id)
            })
            if(selected_answers.length == 0){
                showNotification("groups.choose_correct_answer")
                return      
            }

            if($scope.selected_quiz.question_type == "OCQ" && selected_answers.length==1)
                selected_answers = selected_answers[0]
        }
        else //DRAG
        {
            selected_answers={}
            selected_answers = $scope.studentAnswers[$scope.selected_quiz.id]
            var count = 0
            for (var el in selected_answers)
                if(selected_answers[el])
                    count++
            if(count<$scope.selected_quiz.online_answers.length)
            {
                showNotification("groups.must_place_items")
                return
            }
        }
        Lecture.saveOnline(
        {
            course_id:$stateParams.course_id,
            lecture_id:$stateParams.lecture_id
        },
        {
            quiz: $scope.selected_quiz.id,
            answer:selected_answers
        },
        function(data){
            displayResult(data)
        },
        function(){}
        )
    }

    var displayResult=function(data, done){
        for(var el in data.detailed_exp)
            $scope.explanation[el]= data.detailed_exp[el];

        // $scope.verdict=data.correct? $translate("lectures.correct"): $translate("lectures.incorrect")
        // $scope.show_notification=true;
        console.log(data)
        if($scope.selected_quiz.quiz_type == 'survey' || ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION' && data.review) ){
            if(data.msg!="Empty"){
                $scope.selected_quiz.is_quiz_solved=true;
                showNotification('thank_you_answer')
                // $scope.show_notification=$translate('thank_you_answer')//'Thank you for your answer';
            }
        }
        else{
        // if(data.review)
        //   $scope.verdict= $translate("lectures.reviewed");
        // else
            var verdict=data.correct? "lectures.correct": "lectures.incorrect"
            var sub_message = ''
            if (!(selected_quiz.quiz_type=='html' && (selected_quiz.question_type.toUpperCase()=='DRAG' || selected_quiz.question_type.toUpperCase()=='FREE TEXT QUESTION')))
                sub_message  = 'lectures.hover_for_details'
            showNotification(verdict, sub_message)
            // $scope.show_notification=true;

            if(data.msg!="Empty") // he chose sthg
            {
            // here need to update $scope.$parent.$parent
                
            /*************************/
                // var group_index= CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
                // var lecture_index= CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                // if(lecture_index!=-1 && group_index!=-1)
                //     $scope.$parent.$parent.course.groups[group_index].lectures[lecture_index].is_done= data.done[2]
            /*************************/

                $scope.selected_quiz.is_quiz_solved=true;

            }
        }

        $interval(function(){
            window.onmousemove = removeNotification
        }, 600, 1);

    }

    var reviewInclass =function(){
        if(!$scope.selected_quiz.reviewed)
            $scope.review_inclass= true 
    }

    $scope.voteForReview=function(){
        OnlineQuiz.voteForReview(
        {online_quizzes_id:$scope.selected_quiz.id},{},
        function(res){
            if(res.done)
                $scope.closeReviewNotify()
        })
    }

    $scope.closeReviewNotify=function(){
        $scope.review_inclass= false 
    }

    $scope.retryQuiz=function(){
        $scope.seek($scope.selected_quiz.time, $scope.selected_quiz.lecture_id)
        $scope.closeReviewNotify()
    }

    $scope.saveNote = function(){
        for(var e in $scope.editors){
            if($scope.editors[e].doc.dirty)
                $scope.editors[e].save();
        }
    }
//
    $scope.disableSaveNote= function(){
        for(var e in $scope.editors){
            if($scope.editors[e].doc.dirty)
                return false;
        }
        return true;
    }

     $scope.saveQuestion = function(current_question, privacy_value){
        Forum.createPost(
            {post: 
                {
                    content: current_question, 
                    time:$scope.current_question_time, 
                    lecture_id:$stateParams.lecture_id, 
                    privacy:privacy_value
                }
            }, 
            function(response){
                console.log("success");
                $scope.timeline['lecture'][$stateParams.lecture_id].add($scope.current_question_time, "discussion",  response.post);
                $scope.editors[$stateParams.lecture_id].insert($scope.current_question_time, current_question);
                $scope.toggleQuestionBlock()
                // $scope.lecture_player.controls.play();
            }, 
            function(){
                console.log("failure")
            }
        )
    }

    // $scope.submitQuestion = function()
    // {
    //     $log.debug("will submit "+$scope.question_asked);
    //     var time=$scope.lecture_player.controls.getTime()
    //     if($scope.question_asked!=""){
    //         Lecture.confusedQuestion(
    //         {
    //             course_id:$stateParams.course_id, 
    //             lecture_id:$stateParams.lecture_id
    //         },
    //         {
    //             time:time, 
    //             ques: $scope.question_asked
    //         }, 
    //         function(data){
    //             $scope.progressEvents.push([((time/$scope.total_duration)*100) + '%', 'yellow', 'courses.you_asked',data.id, $scope.question_asked ]);
    //             $scope.question_asked="";
    //             $scope.show_question=false;
    //             $scope.lecture_player.controls.play(); 
    //         });
    //     }
    //     else{
    //         $scope.show_question=false;
    //         $scope.lecture_player.controls.play(); 
    //     }

    // };

    init();


}]);