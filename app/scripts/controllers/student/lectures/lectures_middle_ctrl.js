'use strict';

angular.module('scalearAngularApp')
    .controller('studentLectureMiddleCtrl', ['$anchorScroll','$scope', 'Course', '$stateParams', 'Lecture', '$window', '$interval', '$translate', '$state', '$log', 'CourseEditor','$location','$timeout','editor','doc','Page', '$filter','Forum','OnlineQuiz','util',function($anchorScroll,$scope, Course, $stateParams, Lecture, $window, $interval, $translate, $state, $log, CourseEditor, $location, $timeout,editor,doc,Page, $filter,Forum, OnlineQuiz, util) {

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

    $scope.$watch('checkModel', function(){
        $scope.scrollIntoView('outline')
    },true)

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
        $scope.slow = false
    }

    var init = function() {            
        initVariables()
        $scope.video_class = 'video_class'
        $scope.play_pause_class = 'play'
        $scope.container_style={float: 'left'}
        

        
        if(!isiPad()){
            document.addEventListener(screenfull.raw.fullscreenchange, function () {
                if(!screenfull.isFullscreen){
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
                goToLecture($state.params.lecture_id) 
                $timeout(function(){
                    $scope.scrollIntoView('outline')
                },500)
            }
        })


        $scope.$on('update_timeline', function(ev, item){ // used for deleting items from directives like confused and discussions
            if($scope.timeline){
                var lec_id = item.data? item.data.lecture_id : $state.params.lecture_id
                var index=$scope.timeline['lecture'][lec_id].items.indexOf(item)
                $scope.timeline['lecture'][lec_id].items.splice(index, 1)
            }
        })
    }

    var goToLecture=function(id){
        if($scope.timeline){
            if(isiPad()){
                angular.element('#lecture_video')[0].scrollIntoView()
            }

            $scope.lecture = null

            $timeout(function(){
                $scope.should_play = true
                $scope.timeline['lecture'][id].meta.requirements.lectures.forEach(function(required_id){
                    if(!$scope.timeline['lecture'][required_id].meta.is_done){
                        $scope.should_play = false
                        return
                    }
                })
                console.log("should play")
                console.log($scope.should_play)
                $scope.lecture = $scope.timeline['lecture'][id].meta
                Page.setTitle('head.lectures',': '+$scope.lecture.name); 
            })

            $scope.$parent.$parent.current_item= id
            initVariables()
            clearQuiz()
            
            Lecture.getLectureStudent(
            {
                course_id: $state.params.course_id,
                lecture_id: id,
            },
            function(data) {
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
        $scope.cue_events={}
        $scope.lecture.online_quizzes.forEach(function(quiz) {
            // quiz.vote = $scope.voteForReview
            // quiz.unvote = $scope.unvoteForReview
            $scope.cue_events[quiz.id] = $scope.lecture_player.controls.cue(quiz.time, function() {
                $scope.closeReviewNotify()
                $scope.studentAnswers[quiz.id] = {}
                $scope.selected_quiz = quiz
                $scope.last_quiz = quiz
                
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

        $scope.video_ready=true
        var time = $location.search();
        
        if(time){
            console.log('time aho');
            console.log(time);
            //goToLecture(lecture_id)
            $scope.seek(parseInt(time.time));
        }

    }

    $scope.scrollIntoView=function(tab, fast){
        if($scope.lecture && !isiPad()){
            $timeout(function(){
                $location.hash(tab+'_'+$scope.lecture.id);
                $anchorScroll();    
            })
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
        }
        $scope.end_buttons = false
    }

    $scope.seek_and_pause=function(time,lecture_id){
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
        $scope.seek(time)
        $scope.lecture_player.controls.pause()
        $scope.play_pause_class = "play"
        showNotification('groups.answer_question')
    }

    $scope.lecture_player.events.onPlay = function() {  
        console.log("playing ")
        $scope.play_pause_class = 'pause'  
        checkIfQuizSolved()
        $scope.end_buttons = false
    }

    $scope.lecture_player.events.onPause= function(){
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
    }
    
    var switchToTab=function(tab){
        for(var i in $scope.tabs)
            $scope.tabs[i] = false
        $scope.tabs[tab] = true
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

    $scope.addQuestionBlock= function(){
        // $scope.show_question_block=!$scope.show_question_block;        
        // if($scope.show_question_block){
        //     $scope.current_question_time=$scope.lecture_player.controls.getTime();
        //     $scope.lecture_player.controls.pause();
        //     $scope.fullscreen= false
        // }
        var time=$scope.lecture_player.controls.getTime()
        $scope.timeline['lecture'][$state.params.lecture_id].add(time, "discussion",  null);
        $scope.lecture_player.controls.pause();
        $scope.fullscreen= false
        $scope.checkModel.discussion = true
        // $scope.timeline['lecture'][$state.params.lecture_id].add(time, "question_block", {})

    };

    $scope.addNote=function(){
        var time=$scope.lecture_player.controls.getTime()
        $scope.timeline['lecture'][$state.params.lecture_id].add(time, "note",  null);
        $scope.lecture_player.controls.pause();
        $scope.fullscreen= false
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
            course_id:$state.params.course_id,
            lecture_id:$state.params.lecture_id
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
            if($scope.selected_quiz.quiz_type == 'survey' || ($scope.selected_quiz.question_type.toUpperCase() == 'FREE TEXT QUESTION' && data.review) ){                
                $scope.selected_quiz.is_quiz_solved=true;
                showNotification('thank_you_answer')
            }
            else{
                for(var el in data.detailed_exp)
                    $scope.explanation[el]= data.detailed_exp[el];
                var verdict=data.correct? "lectures.correct": "lectures.incorrect"
                var sub_message = ''
                if (!($scope.selected_quiz.quiz_type=='html' && ($scope.selected_quiz.question_type.toUpperCase()=='DRAG' || $scope.selected_quiz.question_type.toUpperCase()=='FREE TEXT QUESTION')))
                    sub_message  = 'lectures.hover_for_details'
                showNotification(verdict, sub_message)

                $scope.selected_quiz.is_quiz_solved=true;
            }
            reviewInclass() 

            var group_index= util.getIndexById($scope.course.groups, data.done[1])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups, data.done[1])
            var lecture_index= util.getIndexById($scope.course.groups[group_index].lectures, data.done[0])//CourseEditor.get_index_by_id($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
            if(lecture_index!=-1 && group_index!=-1)
                $scope.course.groups[group_index].lectures[lecture_index].is_done= data.done[2]
            $scope.lecture.is_done = data.done[2]
        }

        $interval(function(){
            window.onmousemove = function(){
                removeNotification()
                $scope.$apply()
            }
        }, 600, 1);

    }

    var reviewInclass =function(){
        var max_time = 5
        console.log($scope.selected_quiz)
        // if(!$scope.selected_quiz.reviewed && $scope.selected_quiz.quiz_type != 'survey' && !$scope.review_inclass && !$scope.review_inclass_inprogress){
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
                // $scope.review_inclass= true
                $( "#review_inclass" ).fadeIn( "fast")
                 $interval(function(){
                    $scope.closeReviewNotify()
                    
                    // $scope.review_inclass= false
                },5000,1)
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

    // $scope.unvoteForReview=function(){
    //     console.log("unvote review")
    //     OnlineQuiz.unvoteForReview(
    //     {online_quizzes_id:$scope.last_quiz.id},{},
    //     function(res){
    //         if(res.done){
    //             if($scope.last_quiz.reviewed){
    //                 $scope.last_quiz.reviewed = false
    //                 $scope.last_quiz.votes_count--
    //             }
    //             $scope.closeReviewNotify()
    //         }
    //     })
    // }

    $scope.closeReviewNotify=function(){
        console.log("close")
        // $scope.review_inclass= false 
        $( "#review_inclass" ).fadeOut( "fast" )
    }

    $scope.retryQuiz=function(){
        $scope.seek_and_pause($scope.last_quiz.time)
        $scope.closeReviewNotify()
    }
    
    // $scope.saveNote = function(){
    //     for(var e in $scope.editors){
    //         if($scope.editors[e].doc.dirty)
    //             $scope.editors[e].save();
    //     }
    // }

    // $scope.disableSaveNote= function(){
    //     for(var e in $scope.editors){
    //         if($scope.editors[e].doc.dirty)
    //             return false;
    //     }
    //     return true;
    // }

    // $scope.saveQuestion = function(current_question, privacy_value){       
    //     Forum.createPost(
    //         {post: 
    //             {
    //                 content: current_question, 
    //                 time:$scope.current_question_time, 
    //                 lecture_id:$state.params.lecture_id, 
    //                 privacy:privacy_value
    //             }
    //         }, 
    //         function(response){
    //             console.log("success");
    //             $scope.timeline['lecture'][$state.params.lecture_id].add($scope.current_question_time, "discussion",  response.post);
    //             $scope.toggleQuestionBlock()
    //         }, 
    //         function(){
    //             console.log("failure")
    //         }
    //     )
    // }

    $scope.exportNotes = function(){
        Lecture.exportNotes({ lecture_id:$state.params.lecture_id},function(n){
          var notes = angular.fromJson(n);
          var temp;
          var all_module_notes= [];
          //console.log(notes);
          for (var i = 0; i < notes.notes.length; i++) {
            if(notes.notes[i].length>2)
            {
                // console.log(i);
                // console.log(angular.fromJson(notes.notes[i]));
                temp = angular.fromJson(notes.notes[i])
                // for (var j = 0; j < temp.length; j++) {
                //     console.log(temp.length);
                // }
                all_module_notes.push(temp);
            }
          }
          console.log(all_module_notes);
          $scope.Notes = all_module_notes;

          var url = document.URL;
          var baseurl = url.split('lectures')[0];
          console.log(baseurl);


          var win = window.open('', '_blank');
          //win.document.open();
          if(win){ 
            win.focus();
          }
          else{
            //Broswer has blocked it
            alert('Please allow popups for Scalable Learning');
          }
          var doc = '<html><head><title>ScalableLearning - Export Notes</title>'+
                    '<style>body{font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;}.table {width: 100%;margin-bottom: 20px; margin: 0 auto;background: white;border: 1px solid lightgrey;}.table td {padding: 8px;line-height: 20px;text-align: left;vertical-align: top;border-top: 1px solid #dddddd; border-right: 1px solid #dddddd;}'+
                    '.table th {font-weight: bold;}.table thead th {vertical-align: bottom;} a{color: green; text-decoration: none;} a:hover{color: darkgreen;}</style>'+
                    '</head><body>';
          
          console.log(doc);
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

        },function(){

        })
    }

    $scope.$on('note_updated',function(){
        if(!$scope.quiz_mode)
            $scope.lecture_player.controls.play();
    })

    init();
}]);