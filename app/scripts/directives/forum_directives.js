'use strict';

angular.module('scalearAngularApp')
    .directive('questionBlock',['$log','$translate','Forum',function($log,$translate,Forum){
        return{
            restrict:"E",
            templateUrl:"/views/forum/question_block.html",
            scope:{
                time:'=',
                action:'&'
            },
            link:function(scope,element,attrs){
                scope.choices= [{text:$translate('discussion.private_discussion'),value:0},{text:$translate('discussion.public_discussion'), value:1}];
                scope.privacy = scope.choices[0];
                scope.postQuestion=function(){
                    if(scope.current_question && scope.current_question.length && scope.current_question.trim()!=""){
                        scope.action()(scope.current_question, scope.privacy.value)
                        scope.error_message=null
                        scope.current_question = ''
                    }
                    else
                        scope.error_message = $translate("discussion.cannot_be_empty")
                }
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
                    {post_id: discussion.data.id}, 
                    function(response){
                        discussion.data.user_flag=1;
                        discussion.data.flags_count++;
                    },
                    function(){
                        console.log("failure");
                    }
                )
            }
            scope.unflagPost = function(discussion){
                Forum.flagPost(
                    {post_id: discussion.data.id}, 
                    function(response){
                        discussion.data.user_flag = 0;
                        discussion.data.flags_count--;
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

            scope.reply=function(discussion){
                if (scope.current_reply && scope.current_reply.length && scope.current_reply.trim()!=""){
                    scope.error_message = null
                    console.log("discussion")
                    console.log(discussion)
                    Forum.createComment({comment: {content: scope.current_reply, post_id:discussion.data.id, lecture_id:discussion.data.lecture_id}}, function(response){
                        // if(!scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id])
                        //     scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id]= new Timeline();

                        console.log(response);
                        // scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id].add(discussion.data.time, "comment", response.comment);
                        // scope.show_reply[discussion.data.id]=false
                        if(discussion.data.comments)
                            discussion.data.comments.push(response)
                        else
                            discussion.data.comments=[response]
                        scope.current_reply=""
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
            down: '='

        },
        templateUrl: '/views/forum/like_button.html',
        link: function(scope, element){}
    }
});