'use strict';

angular.module('scalearAngularApp')
    .directive('questionBlock',['$log','$translate','Forum','$state',function($log,$translate,Forum,$state){
        return{
            restrict:"E",
            templateUrl:"/views/forum/question_block.html",
            scope:{
                item:'='
            },
            link:function(scope,element,attrs){
                scope.choices= [{text:$translate('discussion.private_discussion'),value:0},{text:$translate('discussion.public_discussion'), value:1}];
                scope.privacy = scope.choices[0];
                $('.text_block').focus()
                scope.postQuestion=function(item){
                    if(scope.current_question && scope.current_question.length && scope.current_question.trim()!=""){
                        //scope.action()(scope.current_question, scope.privacy.value)
                        Forum.createPost(
                            {post: 
                                {
                                    content: scope.current_question, 
                                    time:item.time, 
                                    lecture_id:$state.params.lecture_id, 
                                    privacy:scope.privacy.value
                                }
                            }, 
                            function(response){
                                console.log("success");
                                // $scope.timeline['lecture'][$state.params.lecture_id].add($scope.current_question_time, "discussion",  response.post);
                                // $scope.toggleQuestionBlock() 
                                item.data= response.post
                                scope.error_message=null
                                scope.current_question = ''
                            }, 
                            function(){
                                console.log("failure")
                            }
                        )
                    }
                    else
                        scope.error_message = $translate("discussion.cannot_be_empty")
                }
                scope.cancelQuestion=function(question){
                    scope.$emit('update_timeline', question)
                }

                shortcut.add("enter", function(){
                    scope.postQuestion(scope.item)
                }, {"disable_in_input" : false});

                scope.$on('$destroy', function() {
                  shortcut.remove("enter");
                });
            }
        }
    }])
    .directive('discussionTimeline',["Forum","Timeline","$translate",'$rootScope', function(Forum, Timeline, $translate, $rootScope) {
    return {
        restrict:"A",
        // replace:true,
        scope:{
            seek:'&',
            item:'=',
            delete:'&'
        },
        templateUrl:'/views/forum/discussion_timeline.html',
        link: function(scope, element, attrs) {
            scope.current_user = $rootScope.current_user
            
            var initCommentSize=(function(){                
                scope.height=40
                scope.width=80
            })

            scope.onCommentFocus=function(){
                scope.height=90
                scope.width=90
                $(document).off("click")
                $(document).on("click", function (e) {
                    console.log(e.target.className)
                    if(e.target.className != 'btn btn-small' && !angular.element(e.target).is('textarea')){
                        scope.error_message = null
                        initCommentSize()
                        scope.$apply()
                        $(document).off("click")
                    }         
              });
            }

            scope.onCommentBlur=function(event){
                console.log(event)
               initCommentSize()
            }
            scope.deleteDiscussion = function(discussion){
                Forum.deletePost(
                    {post_id: discussion.data.id}, 
                    function(response){
                        //console.log("begin")
                        // var index=scope.timeline['lecture'][lecture_id].items.indexOf(discussion);
                        //console.log(index)
                        //scope.timeline['discussion'][lecture_id][id]={}
                        //console.log("hna")
                        // scope.timeline['lecture'][lecture_id].items.splice(index, 1);
                        // delete scope.item
                        scope.error_message = null
                        scope.$emit('update_timeline', discussion)
                        //console.log("hna2")
                    }, 
                    function(){}
                )
            }

            scope.flagPost = function(discussion){
                Forum.flagPost(
                    {post_id: discussion.id}, 
                    function(response){
                        discussion.user_flag=1;
                        discussion.flags_count++;
                    },
                    function(){
                        console.log("failure");
                    }
                )
            }
            scope.unflagPost = function(discussion){
                Forum.flagPost(
                    {post_id: discussion.id}, 
                    function(response){
                        discussion.user_flag = 0;
                        discussion.flags_count--;
                    }, 
                    function(){
                        console.log("failure");
                    }
                )
            }

            scope.upvotePost= function(discussion){
                Forum.votePost(
                    {
                        vote: parseInt(discussion.data.user_vote)+1, 
                        post_id:discussion.data.id
                    }, 
                    function(response){
                        discussion.data.user_vote=1;
                        discussion.data.votes_count++;
                    }, 
                    function(){
                        console.log("failure");
                    }
                )
            }

            scope.downvotePost = function(discussion){
                Forum.votePost(
                    {
                        vote: parseInt(discussion.data.user_vote)-1, 
                        post_id:discussion.data.id
                    }, 
                    function(response){
                        discussion.data.user_vote=0;    
                        discussion.data.votes_count--;
                    }, 
                    function(){
                        console.log("failure");
                    }
                )
            }

            scope.flagComment = function(comment){
                Forum.flagComment(
                    {comment_flag:{comment_id: comment.id}}, 
                    function(response){
                        comment.user_flag=1;
                        comment.flags_count++;
                    }, 
                    function(){
                        console.log("failure");
                    }
                )
            }
            scope.unflagComment = function(comment){
                Forum.flagComment(
                    {comment_flag:{comment_id: comment.id}}, 
                    function(response){
                        comment.user_flag = 0;
                        comment.flags_count--;
                    }, 
                    function(){
                        console.log("failure");
                    }
                )
            }

            scope.upvoteComment= function(comment){
                Forum.voteComment(
                    {comment_vote:{vote: parseInt(comment.user_vote)+1, comment_id:comment.id}}, 
                    function(response){
                        comment.user_vote=1;
                        comment.votes_count++;
                    }, 
                    function(){
                        console.log("failure");
                    }
                )
            }

            scope.downvoteComment= function(comment){
                Forum.voteComment(
                    {comment_vote:{vote: parseInt(comment.user_vote)-1, comment_id:comment.id}}, 
                    function(response){
                        comment.user_vote=0;
                        comment.votes_count--;
                    }, 
                    function(){
                        console.log("failure");
                    }
                )

            }

            scope.deleteComment = function(comment, post_id){
                Forum.deleteComment({comment_id: comment.comment.id, post_id: post_id}, function(response){
                    //console.log("begin")
                    var index=scope.item.data.comments.indexOf(comment);
                    //console.log(index)
                    //scope.timeline['discussion'][lecture_id][id]={}
                    //console.log("hna")
                    scope.item.data.comments.splice(index, 1);
                    //console.log("hna2")
                    // delete comment
                    scope.error_message = null
                },
                function(){
                    console.log("failure");
                })
            }

            scope.reply=function(discussion, current_reply){
                if (current_reply && current_reply.length && current_reply.trim()!=""){
                    scope.error_message = null
                    console.log("discussion")
                    console.log(discussion)
                    Forum.createComment({comment: {content: current_reply, post_id:discussion.data.id, lecture_id:discussion.data.lecture_id}}, function(response){
                        // if(!scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id])
                        //     scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id]= new Timeline();

                        console.log(response);
                        // scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id].add(discussion.data.time, "comment", response.comment);
                        // scope.show_reply[discussion.data.id]=false
                        if(discussion.data.comments)
                            discussion.data.comments.push(response)
                        else
                            discussion.data.comments=[response]
                        current_reply=""
                        initCommentSize()
                        // scope.lecture_player.controls.play();
                        
                    }, function(){})
                }
                else{
                    scope.error_message = $translate("discussion.cannot_be_empty")
                }
                angular.element('.btn').blur()
            }

            // scope.show_reply = function(discussion){
            //     if(!scope.show_reply[discussion.data.id])
            //     {
            //         scope.show_reply[discussion.data.id]=true
            //         scope.lecture_player.controls.pause();
            //     }
            //     else{
            //         scope.show_reply[discussion.data.id]=false
            //         scope.lecture_player.controls.play();
            //     }
            // }
        }
    }
}]).directive('votingButton', function(){
    return{
        restrict: 'E',
        scope:{            
            discussion: '=',
            comment: '=',
            up: '=',
            down: '=',
            direction: '@',

        },
        templateUrl: '/views/forum/like_button.html',
        link: function(scope, element){}
    }
}).directive('flagButton', function(){
    return{
        restrict: 'E',
        scope:{            
            discussion: '=',
            comment: '=',
            flag: '=',
            unflag: '=',
            type: '@',

        },
        templateUrl: '/views/forum/flag_button.html',
        link: function(scope, element){}
    }
}).directive("timelineFilters",function(){
    return{
        restrict: "E",
        scope: {
            options:'='
        },
        templateUrl: '/views/forum/timeline_filters.html',
        // template:'<div class="time_estimate" style="z-index:1">'+
        //             '<h4 translate>courses.time_estimate</h4>'+
        //             '<div style="display: inline-block;">In-class: <b>{{inclass_estimate || 0}} <span translate>minutes</span></b></div>'+
        //             '<a pop-over="popover_options">{{"more" | translate}}...</a>'+
        //         '</div>', 
        link:function(scope){
            var template = "<div style='color:#6e6e6e;font-size:12px'>"+
                            "<b>Filter Events: </b><br />"+
                            // "<div class='btn-group align-center' data-toggle='buttons'>"+
                                // "<label id='quiz_checkbox' class='btn btn-checkbox'>"+
                                    "<input type='checkbox' ng-model='options.quiz'> {{'quiz' | translate}} | "+
                                // "</label>"+
                                // "<label id='confused_checkbox'class='btn btn-checkbox'>"+
                                    "<input type='checkbox' ng-model='options.confused'> {{'lectures.confused' | translate}} | "+
                                // "</label>"+
                                // "<label id='discussion_checkbox' class='btn btn-checkbox'>"+
                                    "<input type='checkbox' ng-model='options.discussion'> {{'lectures.discussion' | translate}} | "+
                                // "</label>"+
                                 // "<label id='notes_checkbox' class='btn btn-checkbox'>"+
                                    "<input type='checkbox' ng-model='options.note'> {{'lectures.video_notes' | translate}}"+
                                // "</label>"+
                            // "</div>"+
                           "</div>"

            scope.popover_options={
                content: template,
                html:true,
                placement:"left"
            }
        }
    };
}).directive('commentBox', function(){
    return{
        restrict: 'E',
        scope:{            
            discussion: '=',
            submit: '='

        },
        templateUrl: '/views/forum/comment_box.html',
        link: function(scope, element){
            scope.showfield = false;
            scope.submitComment = function(){
                scope.submit(scope.discussion, scope.comment);
                scope.comment = null;
                scope.hideField();
                console.log(scope.showfield)
            }
            scope.toggleField = function(){
                scope.showfield = !scope.showfield
            }
            scope.hideField = function(){
                if(!scope.comment && scope.showfield == true){
                    scope.toggleField();
                }
            }
        }
    }
}).directive('ngAutoExpand', function() {
        return {
            restrict: 'A',
            link: function( $scope, elem, attrs) {
                elem.bind('keyup', function($event) {
                    var element = $event.target;

                    $(element).height(0);
                    var height = $(element)[0].scrollHeight;

                    // 8 is for the padding
                    if (height < 20) {
                        height = 28;
                    }
                    $(element).height(height-8);
                });

                // Expand the textarea as soon as it is added to the DOM
                setTimeout( function() {
                    var element = elem;

                    $(element).height(0);
                    var height = $(element)[0].scrollHeight;

                    // 8 is for the padding
                    if (height < 20) {
                        height = 28;
                    }
                    $(element).height(height-8);
                }, 0)
            }
        };
    }).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13 && event.shiftKey == false) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});
