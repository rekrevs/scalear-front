'use strict';

angular.module('scalearAngularApp')
    .controller('studentLectureMiddleCtrl', ['$anchorScroll','$scope', 'Course', '$stateParams', 'Lecture', '$window', '$interval', '$translate', '$state', '$log', 'CourseEditor','$location','$timeout','editor','doc','Page', '$filter','Forum','OnlineQuiz','util',function($anchorScroll,$scope, Course, $stateParams, Lecture, $window, $interval, $translate, $state, $log, CourseEditor, $location, $timeout,editor,doc,Page, $filter,Forum, OnlineQuiz, util) {

    console.log("lect mid ctlr")
    $scope.checkModel={quiz:true,confused:true, discussion:true};
    $scope.video_layer = {}
    $scope.quiz_layer = {}
    $scope.lecture_player={}
    $scope.lecture_player.controls={}
    $scope.lecture_player.events={}
//     $scope.container_layer = {}
    $scope.resize = {}
//     $scope.youtube_video=false;
   // $scope.lecture = {}
//     $scope.lecture.aspect_ratio = ""
    // $scope.lecture_player = {}
    // $scope.lecture_player.events = {}
    $scope.tabs=[true,false,false]
//     $scope.quiz_mode = false
//     $scope.studentAnswers = {}
//     $scope.explanation = {}
// //     $scope.wHeight = 0;
// //     $scope.wWidth = 0;
// //     $scope.pHeight = 0;
// //     $scope.pWidth = 0;
// //     $scope.show_notification = false;
//     $scope.fullscreen = false
    
//     $scope.current_time = 0
//     $scope.total_duration = 0
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

    // }

    var isiPad=function(){
        var i = 0,
            iOS = false,
            iDevice = ['iPad', 'iPhone', 'iPod','Android'];

        for ( ; i < iDevice.length ; i++ ) {
            if( navigator.platform === iDevice[i] ){ iOS = true; break; }
        }
        return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) || iOS
    }


    var initVariables=function(){
        console.log("ionit variavle")
        $scope.studentAnswers = {}
        $scope.explanation = {}
        $scope.fullscreen = false
        $scope.current_time = 0
        $scope.total_duration = 0
        $scope.elapsed_width =0
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
            
            initVariables()
            $scope.video_class = 'video_class'
            $scope.play_pause_class = 'play'
            $scope.container_style={float: 'left'}
            if(!isiPad()){
                document.addEventListener(screenfull.raw.fullscreenchange, function () {
                    // console.log('Am I fullscreen? ' + (screenfull.isFullscreen ? 'Yes' : 'No'));
                    if(!screenfull.isFullscreen){
                        console.log("cool")
                        $scope.resize.small()
                        $scope.fullscreen = false
                        $scope.video_class= 'video_class'
                        $scope.container_style={float: 'left'}
                        $scope.$apply()
                    }
                });
            }

            
            $scope.$watch('timeline',function(){
                if($scope.timeline){

                    goToLecture($stateParams.lecture_id) 
                    $scope.scrollIntoView('outline')
                    $scope.scrollIntoView('notes')
                    // $location.hash('outline_'+$scope.lecture.id);
                    // $anchorScroll();
                    // if($state.params.tab){
                    //     console.log("timeline afdgadgad-----------")    
                    //     console.log($state.params.tab)
                    //     switchToTab($state.params.tab)
                    // }

                }
            })


            $scope.$on('update_timeline', function(ev, item){ // used for deleting items from directives like confused and discussions
                if($scope.timeline){
                    var index=$scope.timeline['lecture'][item.data.lecture_id].items.indexOf(item)
                    $scope.timeline['lecture'][item.data.lecture_id].items.splice(index, 1)
                }
            })
                    // console.log("this is the data ")
                    // console.log($scope)
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
                    
// //                $scope.events={}
// //                $scope.events["confused"]=$scope.lecture.confuseds;
// //                $scope.events["questions"]=$scope.lecture.lecture_questions;
// //                $scope.events["quizzes"]=$scope.lecture.online_quizzes;
// //                // scroll to that lecture in outline.


                
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
//                 
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
                // });

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

    var goToLecture=function(id){
        if($scope.timeline){
            if(isiPad()){
                angular.element('#lecture_video')[0].scrollIntoView()
            }
            $scope.lecture = $scope.timeline['lecture'][id].meta
            Page.setTitle('head.lectures',': '+$scope.lecture.name); 
            $scope.$parent.$parent.current_item= id
            $scope.slow = false
            initVariables()
            clearQuiz()
            
            Lecture.getLectureStudent(
            {
                course_id: $stateParams.course_id,
                lecture_id: id,
                // time: $stateParams.time
            },
            function(data) {
                // $scope.lecture = JSON.parse(data.lecture)
                console.log("lecture")
                console.log(data)
                $scope.alert_messages = data.alert_messages;
                $scope.next_item = data.next_item
            })
        }
    }

     $scope.lecture_player.events.onReady = function() {
        $scope.slow = false
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
//             
//             $scope.loading_video = false;
//             //editor.create($scope.lecture.url, $scope.lecture_player);
//             var i= $scope.lecture_ids.indexOf($scope.lecture.id);

//             if($scope.progressEvents.length==0) // first load.
//             {
//                 $scope.setup_confused();
//                 $scope.setup_student_questions();
//             }
        $scope.cue_events={}
        $scope.lecture.online_quizzes.forEach(function(quiz) {
            $scope.cue_events[quiz.id] = $scope.lecture_player.controls.cue(quiz.time, function() {
                $scope.closeReviewNotify()
                $scope.studentAnswers[quiz.id] = {}
                $scope.selected_quiz = quiz
                
                $scope.quiz_mode = true
                $scope.lecture_player.controls.pause()
                if(quiz.quiz_type == 'html') {    
                    $log.debug("HTML quiz")
                    $scope.quiz_layer.backgroundColor = "white"
                    $scope.quiz_layer.overflowX = 'hidden'
                    $scope.quiz_layer.overflowY = 'auto'
                    if(quiz.question_type.toUpperCase() == "DRAG")
                        $scope.studentAnswers[quiz.id] = quiz.online_answers[0].answer;
                    if(quiz.question_type.toUpperCase() == "FREE TEXT QUESTION")
                        $scope.studentAnswers[quiz.id] = "";
                }
                else {
                    $scope.quiz_layer.backgroundColor = ""
                    $scope.quiz_layer.overflowX = ''
                    $scope.quiz_layer.overflowY = ''
                }
                $scope.$apply()
            })
        })
        


        // $timeout(function(){
        //     angular.element('#outline_'+$scope.lecture.id)[0].scrollIntoView()
        //     angular.element('#editor_'+$scope.lecture.id)[0].scrollIntoView()

        // })
       
        $scope.video_ready=true
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

    $scope.scrollIntoView=function(tab, fast){
        if($scope.lecture && !isiPad()){
            // $timeout(function(){angular.element('#'+tab+'_'+$scope.lecture.id)[0].scrollIntoView()})
            if(fast){
                $timeout(function(){
                    $location.hash(tab+'_'+$scope.lecture.id);
                    $anchorScroll();    
                }, 0)
            }
            else{
                $timeout(function(){
                    $location.hash(tab+'_'+$scope.lecture.id);
                    $anchorScroll();    
                }, 1000)
            }
            
        }
    }

    $scope.nextItem=function(){
        if ($scope.next_item.id) {
            var next_state = "course.courseware.module." + $scope.next_item.class_name
            var s = $scope.next_item.class_name + "_id"
            var to = {}
            to[s] = $scope.next_item.id
            to["module_id"]=$scope.next_item.group_id
            $state.go(next_state, to);
        }
    }

    $scope.replay=function(){
        $scope.seek(0)
        $scope.lecture_player.controls.play()
    }

    $scope.seek = function(time, lecture_id) { // must add condition where lecture is undefined could be coming from progress bar
//         $scope.selected_quiz = '';
//         $scope.quiz_mode = false;
        console.log("sseekgggg")
        console.log(time)
        console.log(lecture_id)
        $scope.closeReviewNotify()
        if(!lecture_id || lecture_id == $scope.lecture.id){ //if current lecture
            if(time >=0)
                $scope.lecture_player.controls.seek(time)
        }
        else{
            $state.go("course.courseware.module.lecture", {lecture_id:lecture_id}, {reload:false, notify:false});  
            goToLecture(lecture_id)
            $scope.go_to_time =time
            // $location.search({'lecture_id': lecture_id})          
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
        $scope.end_buttons = false
    }

    $scope.seek_and_pause=function(time,lecture_id){
        $scope.seek(time,lecture_id)
        $scope.lecture_player.controls.pause()
        $scope.play_pause_class = "play"
    }

    $scope.progress_seek=function(time){
        $scope.seek(time)
        checkIfQuizSolved()            
    }



//     $scope.playBtn = function(){
//       if($scope.play_pause_class == "play"){
//         $scope.lecture_player.controls.play()
//       }
//       else{
//         $scope.lecture_player.controls.pause()
//       }
//     }

    $scope.submitPause= function(){
        Lecture.pause(
            {
                course_id:$stateParams.course_id, 
                lecture_id:$stateParams.lecture_id
            },
            {time:$scope.lecture_player.controls.getTime()});
    }

    var checkIfQuizSolved=function(){
        if($scope.quiz_mode && !$scope.selected_quiz.is_quiz_solved) {
            console.log($scope.lecture_player.controls.getTime())
            console.log($scope.selected_quiz.time)
            console.log($scope.lecture_player.controls.getTime() >= $scope.selected_quiz.time)
            if($scope.lecture_player.controls.getTime() >= $scope.selected_quiz.time)
                returnToQuiz($scope.selected_quiz.time)
            else {
                clearQuiz()
            }
        }
        else if($scope.quiz_mode && $scope.selected_quiz.is_quiz_solved){            
             clearQuiz()
        }
    }

    var clearQuiz=function(){
        $scope.selected_quiz = '';
        $scope.quiz_mode = false;
    }

    var returnToQuiz=function(time){
        $scope.seek_and_pause(time)
        // $scope.lecture_player.controls.pause();
        // $scope.play_pause_class = "play"
        // $scope.lecture_player.controls.seek(time)
        showNotification('groups.answer_question') //= $translate();
        // $interval(function() {
        //     $scope.show_notification = false;
        // }, 2000, 1);
    }

    $scope.lecture_player.events.onPlay = function() {  
        console.log("playing ")
        $scope.play_pause_class = 'pause'  
        checkIfQuizSolved()
        $scope.end_buttons = false
        // console.log($scope.quiz_mode)    
        // console.log($scope.selected_quiz) 

        
    }

    $scope.lecture_player.events.onPause= function(){
//         $log.debug("in here");
        console.log("pausing")
        $scope.play_pause_class = "play"
        if(!$scope.quiz_mode) //not a quiz
            $scope.submitPause();
    }

    $scope.lecture_player.events.timeUpdate = function(){
        $scope.current_time = $scope.lecture_player.controls.getTime()
        $scope.elapsed_width = (($scope.current_time/$scope.total_duration)*100) + '%'
    }

    $scope.lecture_player.events.onEnd= function() {
        // if($scope.fullscreen)
        //     $scope.resize.small()
        $scope.end_buttons = true
    }

    $scope.lecture_player.events.onSlow=function(is_youtube){
        console.log("youtube is")
        console.log(is_youtube)
        $scope.is_youtube = is_youtube
        $scope.slow = true
    }

    $scope.lecture_player.events.canPlay=function(){
        if($scope.go_to_time){
            console.log("can play")
            if($scope.go_to_time >=0)
                $scope.seek_and_pause($scope.go_to_time)
            $scope.go_to_time = null
        }
    }    

    var showNotification=function(msg, sub_msg){
        $scope.notification_message=$translate(msg);
        $scope.notification_submessage=$translate(sub_msg);
        $interval(function(){
            removeNotification()
        }, 2000, 1);
    }

     var removeNotification = function(){
        if($scope.notification_message){
            $scope.notification_message=null;
            window.onmousemove = null  
        }       
        // $scope.$apply()
    }

    
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
            console.log(data)
            if(data.msg=="ask"){
                showNotification("controller_msg.really_confused_use_question")
                // $scope.show_notification=$translate("");
                // $scope.notify_position={"left":($scope.pWidth - 180) + "px"}
                // $interval(function(){
                //     // $scope.notify_position={"left":"240px"};
                //     $scope.show_notification=false;
                // }, 6000, 1)
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
        // $scope.fullscreen = !$scope.fullscreen
        // $scope.video_class= $scope.fullscreen? 'video_class_full' : 'video_class'
        // var float = $scope.fullscreen? 'none' : 'left'
        // $scope.container_style={float: float}
        if(!$scope.fullscreen){
            console.log("going fullscreen")
            $scope.resize.big()
            $scope.fullscreen= true
            console.log($scope.fullscreen)
            $scope.video_class = 'video_class_full'
            $scope.container_style={float: 'none'}
        }
        else{
             console.log("going small")
            $scope.resize.small()
            $scope.fullscreen= false
             console.log($scope.fullscreen)
            $scope.video_class = 'video_class'
            $scope.container_style={float: 'left'}
        }
    }

    $scope.toggleQuestionBlock= function(){
        $scope.show_question_block=!$scope.show_question_block;        
        if($scope.show_question_block){
            $scope.current_question_time=$scope.lecture_player.controls.getTime();
            $scope.lecture_player.controls.pause();
            $scope.fullscreen= false
            // switchToTab(0);
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

    var displayResult=function(data){
        if(data.msg!="Empty"){  // he chose sthg
            for(var el in data.detailed_exp)
                $scope.explanation[el]= data.detailed_exp[el];

            // $scope.verdict=data.correct? $translate("lectures.correct"): $translate("lectures.incorrect")
            // $scope.show_notification=true;
            console.log(data)
            if($scope.selected_quiz.quiz_type == 'survey' || ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION' && data.review) ){                
                $scope.selected_quiz.is_quiz_solved=true;
                showNotification('thank_you_answer')
                // $scope.show_notification=$translate('thank_you_answer')//'Thank you for your answer';
            }
            else{
                // if(data.review)
                //   $scope.verdict= $translate("lectures.reviewed");
                // else
              
                // $scope.show_notification=true;

                var verdict=data.correct? "lectures.correct": "lectures.incorrect"
                var sub_message = ''
                if (!($scope.selected_quiz.quiz_type=='html' && ($scope.selected_quiz.question_type.toUpperCase()=='DRAG' || $scope.selected_quiz.question_type.toUpperCase()=='FREE TEXT QUESTION')))
                    sub_message  = 'lectures.hover_for_details'
                showNotification(verdict, sub_message)

                $scope.selected_quiz.is_quiz_solved=true;
            }
            reviewInclass() 
            /*************************/
            var group_index= util.getIndexById($scope.course.groups, data.done[1])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
            var lecture_index= util.getIndexById($scope.course.groups[group_index].lectures, data.done[0])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
            if(lecture_index!=-1 && group_index!=-1)
                $scope.course.groups[group_index].lectures[lecture_index].is_done= data.done[2]

            //     $scope.$parent.$parent.course.groups[group_index].lectures[lecture_index].is_done= data.done[2]
        /*************************/
        }

        $interval(function(){
            window.onmousemove = function(){
                removeNotification()
                $scope.$apply()
            }
        }, 600, 1);

    }

    var reviewInclass =function(){
        console.log($scope.selected_quiz)
        if(!$scope.selected_quiz.reviewed && $scope.selected_quiz.quiz_type != 'survey' && !$scope.review_inclass){
            var time = 10
            var next_time = getNextQuizTime($scope.selected_quiz.time)
            if(next_time)
                time = (next_time-$scope.selected_quiz.time)/2
            else if ($scope.total_duration - $scope.selected_quiz.time <= 10)
                time = ($scope.total_duration - $scope.selected_quiz.time)/2
            $interval(function(){
                $scope.review_inclass= true
                 $interval(function(){
                    $scope.review_inclass= false
                },5000,1)
            },time*1000,1)
        }
    }

    var getNextQuizTime=function(time){
        for (var i in $scope.lecture.online_quizzes){
            if($scope.lecture.online_quizzes[i].time > time && $scope.lecture.online_quizzes[i].time <= time+10){
                return $scope.lecture.online_quizzes[i].time
            }
        }
    }

    $scope.voteForReview=function(){
        OnlineQuiz.voteForReview(
        {online_quizzes_id:$scope.selected_quiz.id},{},
        function(res){
            if(res.done){
                $scope.selected_quiz.reviewed = true
                $scope.closeReviewNotify()
            }
        })
    }

    $scope.closeReviewNotify=function(){
        console.log("close")
        $scope.review_inclass= false 
    }

    $scope.retryQuiz=function(){
        $scope.seek_and_pause($scope.selected_quiz.time)
        // $scope.seek($scope.selected_quiz.time)
        $scope.closeReviewNotify()
    }

    $scope.saveNote = function(){
        for(var e in $scope.editors){
            if($scope.editors[e].doc.dirty)
                $scope.editors[e].save();
        }
    }

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
                // $scope.editors[$stateParams.lecture_id].insert($scope.current_question_time, current_question);
                $scope.toggleQuestionBlock()
                // $scope.lecture_player.controls.play();
            }, 
            function(){
                console.log("failure")
            }
        )
    }


    init();


}]);