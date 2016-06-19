'use strict';
angular.module('scalearAngularApp')
.directive('questionBlock',['$log','$translate','Forum','$state', '$rootScope','User',function($log,$translate,Forum,$state, $rootScope, User){
    return{
        restrict:"E",
        templateUrl:"/views/forum/question_block.html",
        scope:{
            item:'=',
            pref: '='
        },
        link:function(scope,element,attrs){
            scope.preview_as_student = $rootScope.preview_as_student
            scope.ask_button_clicked = false
            scope.choices= [{text:$translate('discussion.private_discussion'),value:0},{text:$translate('discussion.public_discussion'), value:1}];
            scope.privacy = scope.choices[$rootScope.current_user.discussion_pref];   
            $('.text_block').focus();

            if(scope.item.data && scope.item.data.isEdit){
                scope.privacy = (scope.item.data.privacy == 0)? scope.choices[0] : scope.choices[1]
                scope.current_question = scope.item.data.content
            }

            scope.postQuestion=function(item){
                if(scope.current_question && scope.current_question.length && scope.current_question.trim()!=""){
                    if($rootScope.current_user.discussion_pref != scope.privacy.value){
                        $rootScope.current_user.discussion_pref = scope.privacy.value;                                
                        User.alterPref({},{privacy: scope.privacy.value})
                    }
                    scope.ask_button_clicked = true
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
                            $log.debug("success");
                            item.data= response.post
                            scope.error_message=null
                            scope.current_question = ''
                            scope.$emit("discussion_updated")
                        }, 
                        function(){
                            $log.debug("failure")
                        }
                    )
                }
                else
                    scope.$emit('remove_from_timeline', item)
            }

            scope.updateQuestion= function(question){
                if(scope.current_question && scope.current_question.length && scope.current_question.trim()!=""){
                    Forum.updatePost({post_id: question.id},
                        {content: scope.current_question},                    
                        function(){
                            question.content = scope.current_question
                            question.updated_at = new Date()
                            question.edited = true
                            question.isEdit = false
                            scope.error_message=null
                            scope.current_question = ''
                        }
                    )
                }
                else
                    question.isEdit = false
            }

            scope.cancelQuestion=function(question){
                scope.$emit("discussion_updated")
                scope.$emit('remove_from_timeline', question)
            }

            scope.$on('post_question', function(ev, item) {
               if(!item.data || !item.data.isEdit)
                    scope.postQuestion(item)
                else
                    scope.updateQuestion(item.data)
            });

            shortcut.add("enter", function(){
                if(!scope.item.data || !scope.item.data.isEdit)
                    scope.postQuestion(scope.item)
                else
                    scope.updateQuestion(scope.item.data)
                scope.$apply()
            }, {"disable_in_input" : false});

            scope.$on('$destroy', function() {
              shortcut.remove("enter");
            });
        }
    }
}]).directive('discussionTimeline',["Forum","Timeline","$translate",'$rootScope','$filter','$log',"$window","MobileDetector", function(Forum, Timeline, $translate, $rootScope,$filter, $log,$window,MobileDetector) {
    return {
        restrict:"A",
        scope:{
            seek:'&',
            data:'&'
        },
        templateUrl:'/views/forum/discussion_timeline.html',
        link: function(scope, element, attrs) {
            scope.turncatingcount = 30
            if(MobileDetector.isiPad()){
                scope.turncatingcount = 15
            }
            scope.item = scope.data()
            scope.current_user = $rootScope.current_user
            scope.preview_as_student = $rootScope.preview_as_student
            scope.formattedTime = $filter('format','hh:mm:ss')(scope.item.time)
            scope.private_text = $translate("discussion.private_post")
            scope.public_text = $translate("discussion.public_post")
            scope.deleteDiscussion = function(discussion){
                Forum.deletePost(
                    {post_id: discussion.data.id}, 
                    function(response){
                        scope.error_message = null
                        scope.$emit('remove_from_timeline', discussion)
                    }, 
                    function(){}
                )
            }            

            scope.flagPost = function(){
                Forum.flagPost(
                    {post_id: scope.item.data.id}, 
                    function(response){
                        scope.item.data.user_flag=1;
                        scope.item.data.flags_count++;
                    },
                    function(){
                        $log.debug("failure");
                    }
                )
            }
            scope.unflagPost = function(){
                Forum.flagPost(
                    {post_id: scope.item.data.id}, 
                    function(response){
                        scope.item.data.user_flag = 0;
                        scope.item.data.flags_count--;
                    }, 
                    function(){
                        $log.debug("failure");
                    }
                )
            }

            scope.upvotePost= function(){
                Forum.votePost(
                    {
                        vote: parseInt(scope.item.data.user_vote)+1, 
                        post_id:scope.item.data.id
                    }, 
                    function(response){
                        scope.item.data.user_vote=1;
                        scope.item.data.votes_count++;
                    }, 
                    function(){
                        $log.debug("failure");
                    }
                )
            }

            scope.downvotePost = function(){
                Forum.votePost(
                    {
                        vote: parseInt(scope.item.data.user_vote)-1, 
                        post_id:scope.item.data.id
                    }, 
                    function(response){
                        scope.item.data.user_vote=0;    
                        scope.item.data.votes_count--;
                    }, 
                    function(){
                        $log.debug("failure");
                    }
                )
            }

            scope.deleteComment = function(comment){
                Forum.deleteComment({comment_id: comment.comment.id, post_id: scope.item.data.id}, function(response){
                    var index=scope.item.data.comments.indexOf(comment);
                    scope.item.data.comments.splice(index, 1);
                    scope.error_message = null
                },
                function(){
                    $log.debug("failure");
                })
            }

            scope.reply=function(discussion, current_reply){
                if (current_reply && current_reply.length && current_reply.trim()!=""){
                    scope.error_message = null
                    $log.debug("discussion", discussion)
                    Forum.createComment({comment: {content: current_reply, post_id:discussion.data.id, lecture_id:discussion.data.lecture_id}}, function(response){
                        if(discussion.data.comments)
                            discussion.data.comments.push(response)
                        else
                            discussion.data.comments=[response]
                        current_reply=""
                    }, function(){})
                }
                else{
                    scope.error_message = $translate("discussion.cannot_be_empty")
                }
                angular.element('.btn').blur()
            }
        }
    }
}]).directive('discussionComment',["Forum","Timeline","$translate",'$rootScope','$log', function(Forum, Timeline, $translate, $rootScope, $log) {
    return {
        restrict:"E",
        scope:{
            item:'=',
            delete:'&'
        },
        templateUrl:'/views/forum/discussion_comment.html',
        link: function(scope, element, attrs) {
            scope.current_user = $rootScope.current_user
            scope.preview_as_student = $rootScope.preview_as_student
            scope.flagComment = function(){
                Forum.flagComment(
                    {comment_flag:{comment_id: scope.item.comment.id}}, 
                    function(response){
                        scope.item.comment.user_flag=1;
                        scope.item.comment.flags_count++;
                    }, 
                    function(){
                        $log.debug("failure");
                    }
                )
            }
            scope.unflagComment = function(){
                Forum.flagComment(
                    {comment_flag:{comment_id: scope.item.comment.id}}, 
                    function(response){
                        scope.item.comment.user_flag = 0;
                        scope.item.comment.flags_count--;
                    }, 
                    function(){
                        $log.debug("failure");
                    }
                )
            }

            scope.upvoteComment= function(){
                Forum.voteComment(
                    {comment_vote:{vote: parseInt(scope.item.comment.user_vote)+1, comment_id:scope.item.comment.id}}, 
                    function(response){
                        scope.item.comment.user_vote=1;
                        scope.item.comment.votes_count++;
                    }, 
                    function(){
                        $log.debug("failure");
                    }
                )
            }

            scope.downvoteComment= function(){
                Forum.voteComment(
                    {comment_vote:{vote: parseInt(scope.item.comment.user_vote)-1, comment_id:scope.item.comment.id}}, 
                    function(response){
                        scope.item.comment.user_vote=0;
                        scope.item.comment.votes_count--;
                    }, 
                    function(){
                        $log.debug("failure");
                    }
                )

            }
        }
    }
}]).directive('votingButton', ['$translate', '$log',function($translate, $log){
    return{
        restrict: 'E',
        scope:{            
            votes_count: '=votesCount',
            voted: '=',
            up: '&',
            down: '&',
            direction: '@'

        },
        templateUrl: '/views/forum/like_button.html',
        link: function(scope, element){
            scope.like_text= $translate('discussion.like')
            scope.unlike_text= $translate('discussion.unlike')
            angular.element(element.find('.looks-like-a-link')).css('display',  scope.direction == 'horizontal'? 'inline-block' : 'block')
        }
    }
}]).directive('flagButton', ['$translate', '$log',function($translate, $log){
    return{
        restrict: 'E',
        scope:{
            flagged: '=',
            flag: '&',
            unflag: '&',
        },
        templateUrl: '/views/forum/flag_button.html',
        link: function(scope, element){
            scope.flag_text=$translate("discussion.flag_post")
            scope.unflag_text=$translate("discussion.unflag_post")
        }
    }
}]).directive('commentBox', ['$log',function($log){
    return{
        restrict: 'E',
        scope:{            
            discussion: '&',
            submit:"&"
        },
        templateUrl: '/views/forum/comment_box.html',
        link: function(scope, element){
            scope.showfield = false;
            scope.submitComment = function(){
                scope.submit()(scope.discussion(), scope.comment);
                scope.comment = null;
                scope.hideField();
                $log.debug(scope.showfield)
            }
            scope.toggleField = function(){
                scope.showfield = !scope.showfield
            }
            scope.hideField = function(){
                if(!scope.comment && scope.showfield){
                    scope.toggleField();
                }
            }
        }
    }
}])
