'use strict';

angular.module('scalearAngularApp')
    .controller('studentLectureMiddleCtrl', ['$scope', '$stateParams', 'Lecture', '$interval', '$translate', '$state', '$log','$timeout','Page', '$filter','OnlineQuiz','scalear_utils', 'ContentNavigator', 'TimelineNavigator', '$rootScope','TimelineFilter','$window', function($scope, $stateParams, Lecture, $interval, $translate, $state, $log, $timeout,Page, $filter, OnlineQuiz, scalear_utils, ContentNavigator, TimelineNavigator, $rootScope, TimelineFilter, $window) {

    $log.debug("lect mid ctlr")
    $scope.video_layer = {}
    $scope.quiz_layer = {}
    $scope.lecture_player={}
    $scope.lecture_player.controls={}
    $scope.lecture_player.events={}
    $scope.resize = {}

    $scope.TimelineNavigator = TimelineNavigator
    $scope.ContentNavigator = ContentNavigator
    $scope.ContentNavigator.open()
    if($scope.preview_as_student){
        $scope.TimelineNavigator.open()
    }
    $scope.delayed_timeline_open = $scope.TimelineNavigator.getStatus()

    $scope.$on("export_notes",function(){
        $scope.exportNotes()
    })

    $scope.$on('timeline_navigator_change',function(ev, status){
        if(!status){
            $timeout(function(){
                $scope.delayed_timeline_open = false
            },400)
        }
        else
            $scope.delayed_timeline_open = status
    })

    $scope.$on('exit_preview',function(){
        if($scope.lecture_player.element)
            $scope.lecture_player.controls.pause()
    })

    // angular.element($window)
    // .bind('focus', function() {
    //     if($scope.lecture_player.element && $scope.last_video_state)
    //         $scope.lecture_player.controls.play()        
    // })
    // .bind('blur', function() {
    //     if($scope.lecture_player.element){
    //         $scope.last_video_state = !$scope.lecture_player.controls.paused()
    //         $scope.lecture_player.controls.pause()
    //     }            
    // });    

    var initVariables=function(){
        $scope.studentAnswers = {}
        $scope.explanation = {}
        $scope.fullscreen = false
        $scope.total_duration = 0
        $scope.elapsed_width =0
        $scope.slow = false
        $scope.course.warning_message=null
        $scope.video_class = 'flex-video'
        $scope.container_class=''
        $scope.passed_requirments = true
        $scope.lecture = null
        $scope.video_ready=false
        $scope.show_progressbar = false
        removeShortcuts()        
    }

    var init = function() {            
        initVariables()      
        
        if(!$rootScope.is_mobile){
            document.addEventListener(screenfull.raw.fullscreenchange, function () {
                if(!screenfull.isFullscreen){
                    goSmallScreen()
                    $scope.$apply()
                }
            });
        }
       else{
            $('#lecture_container').addClass('ipad')
            $('.container').addClass('ipad')
        }

        $scope.$watch('timeline',function(){
            if($scope.timeline){
                goToLecture($state.params.lecture_id) 
            }
        })

        $scope.$on('remove_from_timeline', function(ev, item){ // used for deleting items from directives like confused and discussions
            if($scope.timeline){
                var lec_id = item.data? item.data.lecture_id : $state.params.lecture_id
                var index=$scope.timeline['lecture'][lec_id].items.indexOf(item)
                $scope.timeline['lecture'][lec_id].items.splice(index, 1)
            }
        })
    }

    var setShortcuts = function(){
        shortcut.add("c", function(){
            $scope.addConfused();
            $scope.$apply()
        }, {"disable_in_input" : true});
        shortcut.add("q", function(){
            $scope.addQuestionBlock();
            $scope.$apply()
        }, {"disable_in_input" : true});
        shortcut.add("n", function(){
            $scope.addNote();
            $scope.$apply()
        }, {"disable_in_input" : true});
        shortcut.add("f", function(){
            $scope.toggleFullscreen();
            $scope.$apply()
        }, {"disable_in_input" : true});
    }

    var removeShortcuts=function(){
        shortcut.remove("c");
        shortcut.remove("q");
        shortcut.remove("n");
        shortcut.remove("f");
    }

    var goToLecture=function(id){
        if($scope.timeline){ 
            $timeout(function(){
                $scope.lecture = $scope.timeline['lecture'][id].meta
                Page.setTitle('navigation.lectures',': '+$scope.lecture.name); 
            })

            $scope.$parent.$parent.current_item= id
            initVariables()
            clearQuiz()
            $scope.closeReviewNotify()
            
            Lecture.getLectureStudent(
            {
                course_id: $state.params.course_id,
                lecture_id: id
            },
            function(data) {
                var lec = data.lecture
                $scope.next_item = data.next_item 
                $scope.alert_messages = data.alert_messages;
                for(var key in $scope.alert_messages){
                    if(key=="due")
                        $scope.course.warning_message = $translate("events.due_date_passed")+" - "+$scope.alert_messages[key][0]+" ("+$scope.alert_messages[key][1]+" "+$translate("time."+$scope.alert_messages[key][2])+") "+$translate("time.ago")
                    else if(key=="today")
                        $scope.course.warning_message = $translate("events.due")+" "+ $translate("time.today")+" "+ $translate("at")+" "+$filter("date")($scope.alert_messages[key],'shortTime')
                }
                               
                if(!$scope.preview_as_student){
                    for(var item in lec.requirements){
                        for(var id in lec.requirements[item]){
                            var group_index= scalear_utils.getIndexById($scope.course.groups, $stateParams.module_id)//CourseEditor.getIndexById($scope.$parent.$parent.course.groups, data.done[1])
                            var item_index= scalear_utils.getIndexById($scope.course.groups[group_index].items, lec.requirements[item][id])//CourseEditor.getIndexById($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                            if(item_index!=-1 && group_index!=-1)
                                if(!$scope.course.groups[group_index].items[item_index].is_done)
                                    $scope.passed_requirments = false
                        }
                    }
                }

                if($scope.passed_requirments)
                    setShortcuts()
                $timeout(function(){
                    $scope.scrollIntoView()
                },500)
            })
        }
    }

     $scope.lecture_player.events.onReady = function() {
        $scope.slow = false
        $scope.total_duration = $scope.lecture_player.controls.getDuration()
        // if($scope.lecture_player.controls.youtube)
        //     $scope.total_duration-=1
        var duration_milestones = [25, 75]
        var quiz_time_offset = 0
        $scope.lecture.online_quizzes.forEach(function(quiz) {
            if(quiz.time >= $scope.total_duration-2){
                quiz.time = ($scope.total_duration-2) + quiz_time_offset
                quiz_time_offset+=0.2
            }
            $scope.lecture_player.controls.cue($scope.lecture.start_time + (quiz.time-0.1), function(){
                $scope.seek(quiz.time)
                $scope.lecture_player.controls.pause()
                $scope.closeReviewNotify()
                $scope.studentAnswers[quiz.id] = {}
                $scope.selected_quiz = quiz                              
                $scope.quiz_mode = true
                $scope.check_answer_title = "lectures.button.check_answer"
                if(quiz.quiz_type == 'html') {    
                    $log.debug("HTML quiz")
                    $scope.quiz_layer.backgroundColor = "white"
                    $scope.quiz_layer.overflowX = 'hidden'
                    $scope.quiz_layer.overflowY = 'auto'
                    if(quiz.question_type.toUpperCase() == "DRAG")
                        $scope.studentAnswers[quiz.id] = quiz.online_answers[0].answer;
                }
                else {
                    $scope.quiz_layer.backgroundColor = ""
                    $scope.quiz_layer.overflowX = ''
                    $scope.quiz_layer.overflowY = ''
                }

                if(quiz.question_type.toUpperCase() == "FREE TEXT QUESTION")
                    $scope.studentAnswers[quiz.id] = "";

                if(quiz.quiz_type == 'survey' || quiz.question_type.toUpperCase() == "FREE TEXT QUESTION")
                    $scope.check_answer_title = "lectures.button.submit"
                
                $scope.last_quiz = quiz
                $scope.backup_quiz = angular.copy(quiz)
                $scope.$apply()
            })
        })

        $scope.lecture.annotated_markers.forEach(function(marker){
            if(marker.annotation){
                $scope.lecture_player.controls.cue(marker.time,function(){
                    showAnnotation(marker.annotation)
                })
                $scope.lecture_player.controls.cue(marker.time+5,function(){
                    $scope.dismissAnnotation()
                })
            }            
        })

        duration_milestones.forEach(function(milestone){
            $scope.lecture_player.controls.cue(($scope.total_duration*milestone)/100, function(){
                updateViewPercentage(milestone)
            })
        })

        $scope.video_ready=true
        if(!($scope.lecture_player.controls.youtube && $rootScope.is_mobile))
            $scope.show_progressbar = true
        var time =$state.params.time        
        if(time){
            $scope.seek(parseInt(time));
            $timeout(function(){
                $scope.scrollIntoView()
            },500)
        }
        else{
            $scope.lecture_player.controls.seek(0)
            $scope.lecture_player.controls.pause()
        }
    }

    var updateViewPercentage = function(milestone) {
        var lecture = $scope.lecture // in case request callback got delayed and lecture has changed
        $scope.not_done_msg = false
        Lecture.updatePercentView({
            course_id:$state.params.course_id, 
            lecture_id:$state.params.lecture_id
        },
        {percent:milestone},
        function(data){
            $scope.last_navigator_state = $scope.ContentNavigator.getStatus()
            if(data.lecture_done && !lecture.is_done){            
                $scope.course.markDone(lecture.group_id,lecture.id)
                $scope.timeline['lecture'][lecture.id].meta.is_done = data.lecture_done
            }
            else if(milestone == 100)
            $scope.not_done_msg = true            
            $log.debug("Watched:"+data.watched+"%"+" solved:"+data.quizzes_done[0]+" total:"+data.quizzes_done[1])
        })
    }

    $scope.scrollIntoView=function(){
        if($scope.lecture)
            $('.student_timeline').scrollToThis('#outline_'+$scope.lecture.id, {offsetTop: $('.student_timeline').offset().top, duration: 400});
        
    }

    $scope.nextItem=function(){
        if ($scope.next_item.id) {
            if(!$scope.last_navigator_state)
                ContentNavigator.close()
            if($scope.next_item.class_name == 'lecture')
                $scope.seek(null, $scope.next_item.id)
            else{
                var next_state = "course.module.courseware." + $scope.next_item.class_name
                var s = $scope.next_item.class_name + "_id"
                var to = {}
                to[s] = $scope.next_item.id
                to["module_id"]=$scope.next_item.group_id
                $state.go(next_state, to);
            }
        }
    }

    $scope.replay=function(){
        $scope.seek(0)
        $timeout(function(){
            $scope.lecture_player.controls.play()
        },1000)
    }

     $scope.refreshVideo=function(){
        $scope.slow=false
        var temp_url = $scope.lecture.url
        $scope.lecture.url =""
        $timeout(function(){
            $scope.lecture.url = temp_url
        })
    }

    $scope.seek = function(time, lecture_id) { // must add condition where lecture is undefined could be coming from progress bar
        $scope.closeReviewNotify()
        if(!lecture_id || lecture_id == $scope.lecture.id){ //if current lecture
            if(time >=0 && $scope.show_progressbar){
                $scope.lecture_player.controls.seek(time)
                var percent_view = Math.round((($scope.lecture_player.controls.getTime()/$scope.total_duration)*100))
                $log.debug("current watched: "+percent_view)
                updateViewPercentage(percent_view)
            }
        }
        else{
            $state.go("course.module.courseware.lecture", {lecture_id:lecture_id}, {reload:false, notify:false});  
            goToLecture(lecture_id)
            $scope.go_to_time =time
        }
        $scope.video_end = false
    }

    $scope.seek_and_pause=function(time,lecture_id){
        if($scope.lecture_player.controls.getTime() != time)
            clearQuiz()
        $scope.seek(time,lecture_id)
        $scope.lecture_player.controls.pause()
    }

    $scope.progressSeek=function(time){
        $scope.seek(time)
        checkIfQuizSolved()            
    }

    $scope.submitPause= function(time, quiz_mode){
        if(time && time > 0){
            Lecture.pause(
                {course_id:$state.params.course_id, 
                 lecture_id:$state.params.lecture_id},
                {time:time,
                 quiz_mode:quiz_mode}
            );
        }
    }

    var checkIfQuizSolved=function(){
        if($scope.quiz_mode){
            if(!$scope.selected_quiz.is_quiz_solved && $scope.lecture_player.controls.getTime() >= $scope.selected_quiz.time)
                returnToQuiz($scope.selected_quiz.time)
            else{
                if($scope.display_review_message){
                    reviewInclass()
                    $scope.display_review_message = false
                }
                clearQuiz()
            }
        }
    }

    var clearQuiz=function(){
        $scope.selected_quiz = '';
        $scope.quiz_mode = false;
        $scope.quiz_layer.backgroundColor = ""
        $scope.quiz_layer.overflowX = ''
        $scope.quiz_layer.overflowY = ''
    }

    var returnToQuiz=function(time){
        $scope.seek(time)
        $scope.lecture_player.controls.pause()
        showNotification('lectures.answer_question')
    }

    $scope.lecture_player.events.onPlay = function() {  
        $log.debug("playing ") 
        checkIfQuizSolved()
        $scope.video_end = false
    }

    $scope.lecture_player.events.onPause= function(){
        $log.debug("pausing")
        var current_time = $scope.lecture_player.controls.getTime()
        var percent_view = Math.round(((current_time/$scope.total_duration)*100))
        $log.debug("current watched: "+percent_view)        
        $scope.submitPause(current_time, $scope.quiz_mode);
        updateViewPercentage(percent_view)
    }

    $scope.lecture_player.events.onEnd= function() {
        $scope.video_end = true
        updateViewPercentage(100)
    }

    $scope.lecture_player.events.onSlow=function(is_youtube){
        $log.debug("youtube is")
        $log.debug(is_youtube)
        $scope.is_youtube = is_youtube
        $scope.slow = true
    }

    $scope.lecture_player.events.canPlay=function(){
        if($scope.go_to_time && !$rootScope.is_mobile){
            $log.debug("can play")
            if($scope.go_to_time >=0)
                $scope.seek_and_pause($scope.go_to_time)
            $scope.go_to_time = null
        }
    } 

    $scope.lecture_player.events.waiting=function(){
        if($rootScope.is_mobile){
            $scope.video_ready=true
            $scope.show_progressbar=true
        }
    }

    var showNotification=function(msg, sub_msg, middle_msg){
        $scope.notification_message=$translate(msg);
        $scope.notification_middle_message=$translate(middle_msg);
        $scope.notification_submessage=$translate(sub_msg);
        $interval(function(){
            removeNotification()
        }, 3000, 1);
    }

     var removeNotification = function(){
        if($scope.notification_message){
            $scope.notification_message=null;
            window.onmousemove = null  
        }
    }

    $scope.toggleFullscreen=function(){
        $scope.fullscreen? goSmallScreen() : goFullscreen() 
    }

    var goFullscreen=function(){        
        $scope.video_class = ''
        $scope.fullscreen= true
        $scope.resize.big()
        if($rootScope.is_mobile){
            $scope.container_class='mobile_video_full'
            $scope.video_layer ={'width':'100%','height': angular.element($window).height()-70, 'position': 'relative'}
            $(window).bind('orientationchange', function(event) {
                $scope.video_layer['height'] = angular.element($window).height()-70
                $scope.resize.big()
                $scope.$apply()
            });
        }
    }

    var goSmallScreen=function(){        
        $scope.video_class = 'flex-video'
        $scope.fullscreen= false
        $scope.resize.small()
        if($rootScope.is_mobile){
            $scope.container_class=""
            $scope.video_layer ={}
            $(window).off('orientationchange');
        }
        // $scope.video_layer ={height: "",left: "",position: "",top: "",width: "",zIndex: 0}
        // if($scope.quiz_mode == true){
        //     $scope.quiz_mode = false
        //     $timeout(function(){$scope.quiz_mode = true},200)
        // }
    }

    var openTimeline=function(){
        $scope.TimelineNavigator.open()
        $timeout(function(){
            $scope.scrollIntoView()
        })
    }

    $scope.addQuestionBlock= function(){
        var time=$scope.lecture_player.controls.getTime()
        if($scope.last_discussion){
            var discussion = $scope.timeline['lecture'][$state.params.lecture_id].items[$scope.last_discussion]
            $scope.last_discussion = null
            $scope.$broadcast("post_question", discussion)
        }
        $scope.last_discussion = $scope.timeline['lecture'][$state.params.lecture_id].add(time, "discussion",  null);
        $scope.last_fullscreen_state = $scope.fullscreen;
        $scope.last_video_state = !$scope.lecture_player.controls.paused()//$scope.play_pause_class;
        $scope.last_timeline_state = $scope.TimelineNavigator.getStatus()
        TimelineFilter.set('discussion', true)
        $scope.lecture_player.controls.pause()       
        goSmallScreen()
        openTimeline()        
    };

    $scope.addConfused= function(){
        var time=$scope.lecture_player.controls.getTime()
        Lecture.confused(
            {
                course_id:$state.params.course_id, 
                lecture_id:$state.params.lecture_id
            },
            {time:time}, 
            function(data){
                if(data.msg=="ask"){
                    showNotification("lectures.messages.really_confused_use_question")
                }
                if(!data.flag){ //first time confused in these 15 seconds            
                    $scope.timeline['lecture'][$state.params.lecture_id].add(time, "confused", data.item)
                }
                if(data.flag && data.msg!="ask"){ // confused before but not third time - very confused            
                    var elem_index=$scope.timeline['lecture'][$state.params.lecture_id].getIndexById(data.id, "confused");
                    $scope.timeline['lecture'][$state.params.lecture_id].items[elem_index].data.very=true;            
                }
            }
        )
    }

    $scope.addNote=function(){
        var time=$scope.lecture_player.controls.getTime()
        $log.debug($scope.timeline['lecture'][$state.params.lecture_id])
        $scope.timeline['lecture'][$state.params.lecture_id].add(time, "note",  null);
        $scope.last_fullscreen_state = $scope.fullscreen
        
        $scope.last_video_state = !$scope.lecture_player.controls.paused()//$scope.play_pause_class;
        $scope.last_timeline_state = $scope.TimelineNavigator.getStatus()
        TimelineFilter.set('note', true)
        $scope.lecture_player.controls.pause()
        goSmallScreen()
        openTimeline()
    }    

    $scope.$on('video_back',function(ev, time){
        Lecture.back(
            {
                course_id:$state.params.course_id, 
                lecture_id:$state.params.lecture_id
            },
            {time:time}
        );
    })

    $scope.checkAnswer = function(){
        $scope.selected_quiz.quiz_type=="html"? sendHtmlAnswers() : sendAnswers()
    }

    var sendHtmlAnswers=function(){
        if(!$scope.answer_form.$error.atleastone && !($scope.selected_quiz.question_type=='Free Text Question' && $scope.answer_form.$error.required)){
            $log.debug("valid form")
            $scope.submitted=false;
            Lecture.saveHtml(
            {
                course_id: $state.params.course_id, 
                lecture_id:$state.params.lecture_id
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
                showNotification("lectures.choose_correct_answer")
                return      
            }

            if($scope.selected_quiz.question_type == "OCQ" && selected_answers.length==1)
                selected_answers = selected_answers[0]
        }
        else if($scope.selected_quiz.question_type == "Free Text Question"){
            selected_answers= $scope.studentAnswers[$scope.selected_quiz.id]
            if(!selected_answers){
                showNotification("global.required")
                return
            }
        }
        else{ //DRAG
            selected_answers={}
            selected_answers = $scope.studentAnswers[$scope.selected_quiz.id]
            var count = 0
            for (var el in selected_answers)
                if(selected_answers[el])
                    count++
            if(count<$scope.selected_quiz.online_answers.length){
                showNotification("lectures.must_place_items")
                return
            }
        }
        Lecture.saveOnline(
            {
                course_id:$state.params.course_id,
                lecture_id:$state.params.lecture_id
            },
            {
                quiz: $scope.selected_quiz.id,
                answer:selected_answers
            },
            function(data){
                displayResult(data)
            }
        )
    }

    var displayResult=function(data){
        if(data.msg!="Empty"){  // he chose sthg
            if($scope.selected_quiz.quiz_type == 'survey' || ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION' && data.review) ){                
                $scope.selected_quiz.is_quiz_solved=true;
                showNotification('lectures.messages.thank_you_answer')
            }
            else{
                for(var el in data.detailed_exp)
                    $scope.explanation[el]= data.detailed_exp[el];
                var verdict=data.correct? "lectures.correct": "lectures.incorrect"
                var sub_message = ''
                var middle_msg = ''
                if (!($scope.selected_quiz.quiz_type=='html' && ($scope.selected_quiz.question_type.toUpperCase()=='DRAG' || $scope.selected_quiz.question_type.toUpperCase()=='FREE TEXT QUESTION')))
                    if($scope.selected_quiz.question_type.toUpperCase()=='MCQ' && !data.correct)
                        middle_msg = 'lectures.multiple_correct'
                    sub_message  = $rootScope.is_mobile?'lectures.click_for_details':'lectures.hover_for_details'
                showNotification(verdict, sub_message, middle_msg)

                $scope.selected_quiz.is_quiz_solved=true;
            }
            $scope.display_review_message= true
            var percent_view = Math.round((($scope.lecture_player.controls.getTime()/$scope.total_duration)*100))
            $log.debug("current watched: "+percent_view)
            updateViewPercentage(percent_view)
        }

        $interval(function(){
            window.onmousemove = function(){
                removeNotification()
                $scope.$apply()
            }
        }, 1500, 1);

    }

    var reviewInclass =function(){
        var max_time = 10
        var close_time= 7.5
        if($scope.selected_quiz.quiz_type != 'survey' && !$scope.review_inclass && !$scope.review_inclass_inprogress){
            $log.debug("review inclass")
            $scope.review_inclass_inprogress = true
            var time = max_time
            var next_time = getNextQuizTime($scope.selected_quiz.time, max_time)
            if(next_time)
                time = (next_time-$scope.selected_quiz.time)/2
            else if ($scope.total_duration - $scope.selected_quiz.time <= max_time)
                time = ($scope.total_duration - $scope.selected_quiz.time)/2
            $interval(function(){
                $scope.review_inclass_inprogress = false
                $("#review_inclass").fadeIn( "fast")
                $interval(function(){
                    $scope.closeReviewNotify()
                },close_time*1000,1)
            },time*1000,1)
        }
    }

    var getNextQuizTime=function(time,max_time){
        for (var i in $scope.lecture.online_quizzes){
            if($scope.lecture.online_quizzes[i].time > time && $scope.lecture.online_quizzes[i].time <= time+max_time){
                return $scope.lecture.online_quizzes[i].time
            }
        }
    }

    $scope.voteForReview=function(){
        $log.debug("vote review")
        OnlineQuiz.voteForReview(
        {online_quizzes_id:$scope.last_quiz.id},{},
        function(res){
            if(res.done){
                if(!$scope.last_quiz.reviewed){
                    $scope.last_quiz.reviewed = true
                    $scope.last_quiz.votes_count+=1
                }
                $scope.closeReviewNotify()
            }
        })
    }

    $scope.unvoteForReview=function(){
        OnlineQuiz.unvoteForReview(
        {online_quizzes_id:$scope.last_quiz.id},{},
        function(res){
            if(res.done){
                if($scope.last_quiz.reviewed){
                    $scope.last_quiz.reviewed = false
                    $scope.last_quiz.votes_count--
                }
                $scope.closeReviewNotify()
            }
        })
    }

    $scope.closeReviewNotify=function(){
        $( "#review_inclass" ).fadeOut( "fast" )
    }

    $scope.retryQuiz=function(){
        $scope.explanation={}
        $scope.selected_quiz = $scope.backup_quiz
        $scope.seek_and_pause($scope.backup_quiz.time)
        $scope.closeReviewNotify()
    }


    $scope.exportNotes = function(){
        Lecture.exportNotes({course_id: $state.params.course_id, lecture_id:$state.params.lecture_id},function(n){
          var notes = angular.fromJson(n);
          var temp;
          var all_module_notes= [];
          for (var i = 0; i < notes.notes.length; i++) {
            if(notes.notes[i].length>2){
                temp = angular.fromJson(notes.notes[i])
                all_module_notes.push(temp);
            }
          }
          $scope.Notes = all_module_notes;

          var url = document.URL;
          var baseurl = url.split('lectures')[0];
          var win = window.open('', '_blank');
          if(win){ 
            win.focus();

            var doc = '<html><head><title>ScalableLearning - Export Notes</title>'+
                        '<style>body{font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;}.table {width: 100%;margin-bottom: 20px; margin: 0 auto;background: white;border: 1px solid lightgrey;}.table td {padding: 8px;line-height: 20px;text-align: left;vertical-align: top;border-top: 1px solid #dddddd; border-right: 1px solid #dddddd;}'+
                        '.table th {font-weight: bold;}.table thead th {vertical-align: bottom;} a{color: green; text-decoration: none;} a:hover{color: darkgreen;}</style>'+
                        '</head><body>';
              
            for (var i = 0; i < all_module_notes.length; i++) {
                doc +=('<table class="table" style="width:90%">');
                doc +=("<h3>"+all_module_notes[i][0].lecture.name+"</h3>");
                for (var j = 0; j < all_module_notes[i].length; j++) {  
                    doc +=("<tr>");
                    doc +=('<td>' + $filter('formattime')(all_module_notes[i][j].time, 'hh:mm:ss') + '</td>');
                    doc +=('<td>' + all_module_notes[i][j].data + '</td>');
                    doc +=('<td><a target="_blank" href="' + baseurl+ 'lectures/'+ all_module_notes[i][j].lecture.id+'?time='+all_module_notes[i][j].time+ '">'+  'go to video' +'</a></td>');
                    doc +=("</tr>");
                }
                doc +=("</table>");
            };

              doc +=('<br /><a href='+"'"+'data:Application/octet-stream,'+encodeURIComponent(doc)+"'"+ 'Download = "Notes.html">Download Notes</a>');
              doc +=('</body></html>');
              win.document.write(doc);
              win.document.close();
          }
        },function(){

        })
    }

    $scope.$on('note_updated',function(){
        returnToState()
    })

    $scope.$on('discussion_updated',function(){
        returnToState()
    })

    var returnToState=function(){
        if($scope.last_fullscreen_state && !$scope.fullscreen){
            goFullscreen()
        }
        if($scope.last_video_state && $scope.lecture_player.controls.paused() && !$scope.quiz_mode){
            $scope.lecture_player.controls.play()
        }
        if(!$scope.last_timeline_state && $scope.TimelineNavigator.getStatus()){
            $timeout(function(){
               $scope.TimelineNavigator.close() 
           },400)
        }
        // $scope.last_fullscreen_state = null
        // $scope.last_video_state = null
        // $scope.last_timeline_state = null
    }

    $scope.dismissAnnotation=function(){
        $scope.annotation = null
    }

    var showAnnotation=function(annotation){
        $scope.annotation = annotation
    }

    init();
}]);