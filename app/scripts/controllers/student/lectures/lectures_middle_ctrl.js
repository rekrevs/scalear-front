'use strict';

angular.module('scalearAngularApp')
    .controller('studentLectureMiddleCtrl', ['$anchorScroll','$scope', 'Course', '$stateParams', 'Lecture', '$window', '$interval', '$translate', '$state', '$log', 'CourseEditor','$location','$timeout','doc','Page', '$filter','Forum','OnlineQuiz','scalear_utils', '$tour', 'ContentNavigator', 'TimelineNavigator' ,function($anchorScroll,$scope, Course, $stateParams, Lecture, $window, $interval, $translate, $state, $log, CourseEditor, $location, $timeout,doc,Page, $filter,Forum, OnlineQuiz, scalear_utils, $tour, ContentNavigator, TimelineNavigator) {

    console.log("lect mid ctlr")
    $scope.checkModel={quiz:true,confused:true, discussion:true, note:true};
    $scope.video_layer = {}
    $scope.quiz_layer = {}
    $scope.lecture_player={}
    $scope.lecture_player.controls={}
    $scope.lecture_player.events={}
    $scope.resize = {}
    $scope.tabs=[true,false,false]
    $scope.editors={}
    $scope.blink_class = "";

    $scope.TimelineNavigator = TimelineNavigator
    $scope.ContentNavigator = ContentNavigator
    $scope.ContentNavigator.open()
    $scope.delayed_timeline_open = $scope.TimelineNavigator.getStatus()
    $scope.$on('$destroy', function() {
        if($scope.course && $scope.course.warning_message)
            $scope.course.warning_message=null
        shortcut.remove("c");
        shortcut.remove("q");
        shortcut.remove("n");
        shortcut.remove("f");
    });
    $scope.$on("export_notes",function(){
        $scope.exportNotes()
    })

    $scope.$on('take_note', function(){
        console.log('taking note')
        $scope.addNote();
    })

    $scope.$on('mark_confused', function(){
        $scope.addConfused();
    })

    $scope.$on('toggle_fullscreen', function(){
        $scope.toggleFullscreen();
    })

    $scope.$on('lecture_filter_update',function(ev,filters){
        $scope.checkModel=filters
        $timeout(function(){
            $scope.scrollIntoView()
        },200)
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
        if($scope.lecture_player.controls.pause)
            $scope.lecture_player.controls.pause()
    })

    var isiPad=function(){
        var iOS = false,
            iDevice = ['iPad', 'iPhone', 'iPod','Android'];
        for ( var i = 0; i < iDevice.length ; i++ ) {
            if( navigator.platform === iDevice[i] ){ iOS = true; break; }
        }
        return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) || iOS
    }

    var initVariables=function(){
        $scope.studentAnswers = {}
        $scope.explanation = {}
        $scope.fullscreen = false
        $scope.current_time = 0
        $scope.total_duration = 0
        $scope.elapsed_width =0
        $scope.slow = false
        $scope.course.warning_message=null
        $scope.video_class = 'flex-video'
        $scope.container_class=''
        $scope.play_pause_class = 'play'
        $scope.should_play = false
        $scope.passed_requirments = true
        $scope.lecture = null
        $scope.video_ready=false
    }

    var init = function() {            
        initVariables()      
        
        if(!isiPad()){
            document.addEventListener(screenfull.raw.fullscreenchange, function () {
                if(!screenfull.isFullscreen){
                    goSmallScreen()
                }
            });
        }
        else{
            $('#lecture_container').addClass('ipad')
            $('.main_view').addClass('ipad')
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
            $scope.$emit('toggle_fullscreen');
            $scope.$apply()
        }, {"disable_in_input" : true});
    }

    var goToLecture=function(id){
        if($scope.timeline){ 
            $timeout(function(){
                $scope.lecture = $scope.timeline['lecture'][id].meta
                Page.setTitle('head.lectures',': '+$scope.lecture.name); 
            })

            $scope.$parent.$parent.current_item= id
            initVariables()
            clearQuiz()
            $scope.closeReviewNotify()
            
            Lecture.getLectureStudent(
            {
                course_id: $state.params.course_id,
                lecture_id: id,
            },
            function(data) {
                var lec = data.lecture
                $scope.next_item = data.next_item 
                $scope.alert_messages = data.alert_messages;
                for(var key in $scope.alert_messages){
                    if(key=="due")
                        $scope.course.warning_message = $translate("controller_msg.due_date_passed")+" - "+$scope.alert_messages[key][0]+" ("+$scope.alert_messages[key][1]+" "+$translate("controller_msg."+$scope.alert_messages[key][2])+") "+$translate("controller_msg.ago")
                    else if(key=="today")
                        $scope.course.warning_message = $translate("controller_msg.due")+" "+ $translate("controller_msg.today")+" "+ $translate("at")+" "+$filter("date")($scope.alert_messages[key],'shortTime')
                }
                               
                if(!$scope.preview_as_student){
                    for(var item in lec.requirements){
                        for(var id in lec.requirements[item]){
                            var group_index= scalear_utils.getIndexById($scope.course.groups, $stateParams.module_id)//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
                            var item_index= scalear_utils.getIndexById($scope.course.groups[group_index].items, lec.requirements[item][id])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
                            if(item_index!=-1 && group_index!=-1)
                                if(!$scope.course.groups[group_index].items[item_index].is_done)
                                    $scope.passed_requirments = false
                        }
                    }
                }

                $scope.should_play = $scope.passed_requirments
                if($scope.should_play)
                    setShortcuts()

                if(isiPad()){
                    $scope.video_ready=true
                }
                $timeout(function(){
                    $scope.scrollIntoView()
                },500)
            })
        }
    }

     $scope.lecture_player.events.onReady = function() {
        $scope.slow = false
        $scope.total_duration = $scope.lecture_player.controls.getDuration() - 1
        var duration_milestones = [25, 75]
        $scope.lecture.online_quizzes.forEach(function(quiz) {
            $scope.lecture_player.controls.cue(quiz.time-0.15, function() {                
                $scope.seek(quiz.time)   
                $scope.lecture_player.controls.pause()          
                $scope.closeReviewNotify()
                $scope.studentAnswers[quiz.id] = {}
                $scope.selected_quiz = quiz                              
                $scope.quiz_mode = true
                
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
                $scope.last_quiz = quiz
                $scope.backup_quiz = angular.copy(quiz)  
            })
        })

        duration_milestones.forEach(function(milestone){
            $scope.lecture_player.controls.cue(($scope.total_duration*milestone)/100, function(){
                updateViewPercentage(milestone)
            })
        })

        $scope.video_ready=true
        var time =$state.params.time        
        if(time){
            $scope.seek(parseInt(time));
            $timeout(function(){
                $scope.scrollIntoView()
            },500)
        }
    }

    var updateViewPercentage = function(milestone) {
        $scope.not_done_msg = false
        Lecture.updatePercentView({
            course_id:$state.params.course_id, 
            lecture_id:$state.params.lecture_id
        },
        {percent:milestone},function(data){
            $scope.last_navigator_state = $scope.ContentNavigator.getStatus()
            if(data.done && !$scope.lecture.is_done){            
                $scope.course.markDone($state.params.module_id,$state.params.lecture_id)
                $scope.lecture.is_done = data.done
            }
            else if(milestone == 100)
                $scope.not_done_msg = true
        })
    }

    $scope.scrollIntoView=function(){
        console.log("scroll to view")
        if($scope.lecture && !isiPad()){
            console.log($('.student_timeline'))
            $('.student_timeline').scrollToThis('#outline_'+$scope.lecture.id, {offsetTop: $('.student_timeline').offset().top, duration: 400});
        }
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
            $scope.play_pause_class = "pause"
        },500)
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
            if(time >=0)
                $scope.lecture_player.controls.seek(time)
        }
        else{
            $state.go("course.module.courseware.lecture", {lecture_id:lecture_id}, {reload:false, notify:false});  
            goToLecture(lecture_id)
            $scope.go_to_time =time
        }
        $scope.video_end = false
    }

    $scope.seek_and_pause=function(time,lecture_id){
        console.log($scope.lecture_player)
        if($scope.lecture_player.controls.getTime() != time)
            clearQuiz()
        $scope.seek(time,lecture_id)
        $scope.lecture_player.controls.pause()
        $scope.play_pause_class = "play"
    }

    $scope.progress_seek=function(time){
        $scope.seek(time)
        checkIfQuizSolved()            
    }

    $scope.submitPause= function(){
        Lecture.pause(
            {
                course_id:$state.params.course_id, 
                lecture_id:$state.params.lecture_id
            },
            {time:$scope.lecture_player.controls.getTime()});
    }

    var checkIfQuizSolved=function(){
        if($scope.quiz_mode && !$scope.selected_quiz.is_quiz_solved) {
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
        $scope.seek(time)
        $scope.lecture_player.controls.pause()
        $scope.play_pause_class = "play"
        showNotification('groups.answer_question')
    }

    $scope.lecture_player.events.onPlay = function() {  
        console.log("playing ")
        $scope.play_pause_class = 'pause'  
        checkIfQuizSolved()
        $scope.video_end = false
    }

    $scope.lecture_player.events.onPause= function(){
        console.log("pausing")
        $scope.play_pause_class = "play"
        if(!$scope.quiz_mode && !$scope.preview_as_student) //not a quiz
            $scope.submitPause();
    }

    $scope.lecture_player.events.timeUpdate = function(){
        $scope.current_time = $scope.lecture_player.controls.getTime()
        $scope.elapsed_width = (($scope.current_time/$scope.total_duration)*100) + '%'
    }

    $scope.lecture_player.events.onEnd= function() {
        $scope.video_end = true
        updateViewPercentage(100)
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

    $scope.addConfused= function(){
        console.log("caosdnsakn")
        console.log($state.params.lecture_id)
        var time=$scope.lecture_player.controls.getTime()
        Lecture.confused(
        {
            course_id:$state.params.course_id, 
            lecture_id:$state.params.lecture_id
        },
        {time:time}, 
        function(data){
            console.log(data)
            if(data.msg=="ask"){
                showNotification("controller_msg.really_confused_use_question")
            }
            if(!data.flag){ //first time confused in these 15 seconds            
                $scope.timeline['lecture'][$state.params.lecture_id].add(time, "confused", data.item)
            }
            if(data.flag && data.msg!="ask"){ // confused before but not third time - very confused            
                var elem=$scope.timeline['lecture'][$state.params.lecture_id].search_by_id(data.id, "confused");
                $scope.timeline['lecture'][$state.params.lecture_id].items[elem].data.very=true;            
            }
        });
    }
    

    $scope.toggleFullscreen=function(){
        $scope.fullscreen? goSmallScreen() : goFullscreen() 
    }

    var goFullscreen=function(){
        isiPad()? goMobileFullscreen() : goDesktopFullscreen()
    }

    var goSmallScreen=function(){
        isiPad()? goMobileSmallScreen() : goDesktopSmallScreen()
        $scope.lecture_player.controls.pause();
    }

    var goDesktopSmallScreen=function(){
        console.log("going small")
        $scope.resize.small()
        $scope.fullscreen= false
         console.log($scope.fullscreen)
        $scope.video_class = 'flex-video'
        $scope.container_class=""
        $timeout(function(){$scope.$emit("updatePosition")})
        if($scope.quiz_mode == true){
            $scope.quiz_mode = false
            $timeout(function(){$scope.quiz_mode = true},200)
        }
    }

    var goDesktopFullscreen=function(){
        console.log("going fullscreen")
        $scope.resize.big()
        $scope.fullscreen= true
        $scope.video_class = 'video_class_full'
        $scope.container_class="black"
    }

    var goMobileSmallScreen=function(){
        console.log("close fullscreen")
        $scope.video_class = 'flex-video'
        $scope.container_class=''
        $scope.video_layer ={}
        $scope.quiz_layer.width="100%"
        $scope.quiz_layer.height="100%"
        $scope.quiz_layer.position="absolute"
        $scope.quiz_layer.marginTop=""
        $scope.fullscreen= false
        $timeout(function(){$scope.$emit("updatePosition")})
        if($scope.quiz_mode == true){
            $scope.quiz_mode = false
            $timeout(function(){$scope.quiz_mode = true},200)
        }
    }

    var goMobileFullscreen=function(){
        $scope.video_class = ''
        $scope.container_class='mobile_video_full'
        $scope.video_layer ={'width':'100%','height': '86%', 'position': 'relative'}
        $scope.resize.big()
        $scope.fullscreen= true
        $timeout(function(){$scope.$emit("updatePosition")})
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
        $scope.last_play_state = $scope.play_pause_class;
        $scope.last_timeline_state = $scope.TimelineNavigator.getStatus()
        goSmallScreen()
        openTimeline()
        $scope.checkModel.discussion = true
        
    };

    $scope.addNote=function(){
        var time=$scope.lecture_player.controls.getTime()
        console.log($scope.timeline['lecture'][$state.params.lecture_id])
        $scope.timeline['lecture'][$state.params.lecture_id].add(time, "note",  null);
        $scope.last_fullscreen_state = $scope.fullscreen;
        $scope.last_play_state = $scope.play_pause_class;
        $scope.last_timeline_state = $scope.TimelineNavigator.getStatus()
        goSmallScreen()
        openTimeline()
        $scope.checkModel.note = true
    }    

    $scope.$on('video_back',function(ev, time){
        console.log(time)
        Lecture.back(
            {
                course_id:$state.params.course_id, 
                lecture_id:$state.params.lecture_id
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
                showNotification("groups.choose_correct_answer")
                return      
            }

            if($scope.selected_quiz.question_type == "OCQ" && selected_answers.length==1)
                selected_answers = selected_answers[0]
        }
        else{ //DRAG
            selected_answers={}
            selected_answers = $scope.studentAnswers[$scope.selected_quiz.id]
            var count = 0
            for (var el in selected_answers)
                if(selected_answers[el])
                    count++
            if(count<$scope.selected_quiz.online_answers.length){
                showNotification("groups.must_place_items")
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
            if(data.msg=="Successfully Submitted"){
                $scope.$broadcast("blink_blink");
            }
        },
        function(){}
        )
    }

    var displayResult=function(data){
        if(data.msg!="Empty"){  // he chose sthg
            if($scope.selected_quiz.quiz_type == 'survey' || ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION' && data.review) ){                
                $scope.selected_quiz.is_quiz_solved=true;
                showNotification('thank_you_answer')
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
                    sub_message  = 'lectures.hover_for_details'
                showNotification(verdict, sub_message, middle_msg)

                $scope.selected_quiz.is_quiz_solved=true;
            }
            reviewInclass() 

            // if(data.done[2] && !$scope.lecture.is_done){
            //     $scope.not_done_msg = false
            //     $scope.course.markDone(data.done[1],data.done[0])
            //     $scope.lecture.is_done = data.done[2]
            // }
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
            console.log("review inclass")
            $scope.review_inclass_inprogress = true
            var time = max_time
            var next_time = getNextQuizTime($scope.selected_quiz.time, max_time)
            if(next_time)
                time = (next_time-$scope.selected_quiz.time)/2
            else if ($scope.total_duration - $scope.selected_quiz.time <= max_time)
                time = ($scope.total_duration - $scope.selected_quiz.time)/2
            $interval(function(){
                $scope.review_inclass_inprogress = false
                $( "#review_inclass" ).fadeIn( "fast")
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
        console.log("vote review")
        OnlineQuiz.voteForReview(
        {online_quizzes_id:$scope.last_quiz.id},{},
        function(res){
            if(res.done){
                if(!$scope.last_quiz.reviewed){
                    $scope.last_quiz.reviewed = true
                    $scope.last_quiz.votes_count++
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
        console.log("close")
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
          else{
            //Broswer has blocked it
            alert('Please allow popups for Scalable Learning');
          }
        },function(){

        })
    }

    $scope.$on('note_updated',function(){
        returnToState()
    })

    $scope.$on('discussion_updated',function(ev, canceled){
        returnToState()
    })

    var returnToState=function(){
        if($scope.last_fullscreen_state && !$scope.fullscreen){
            goFullscreen();
        }

        if($scope.last_play_state == "pause" && ($scope.play_pause_class != "pause" && !$scope.quiz_mode)){
            $scope.lecture_player.controls.play();
        }

        if($scope.last_timeline_state == false && $scope.TimelineNavigator.getStatus()){
            $timeout(function(){
               $scope.TimelineNavigator.close() 
           },400)
        }

        $scope.last_fullscreen_state = null
        $scope.last_play_state = null
    }

    init();
}]);