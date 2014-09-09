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
                scope.choices= [{text:$translate('discussion.private_discussion'),value:0},{text:$translate('discussion.public_discussion'), value:1}];
                scope.privacy = scope.choices[$rootScope.current_user.discussion_pref];   
                $('.text_block').focus();

                scope.postQuestion=function(item){
                    scope.$emit("question_updated")
                    if(scope.current_question && scope.current_question.length && scope.current_question.trim()!=""){
                        if($rootScope.current_user.discussion_pref != scope.privacy.value){
                            $rootScope.current_user.discussion_pref = scope.privacy.value;                                
                            User.alterPref({},{privacy: scope.privacy.value})
                        }

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
                    scope.$emit("question_updated")
                    scope.$emit('update_timeline', question)
                }

                shortcut.add("enter", function(){
                    scope.postQuestion(scope.item)
                    scope.$apply()
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
        scope:{
            seek:'&',
            item:'=',
            delete:'&'
        },
        templateUrl:'/views/forum/discussion_timeline.html',
        link: function(scope, element, attrs) {
            scope.current_user = $rootScope.current_user
            
            scope.deleteDiscussion = function(discussion){
                Forum.deletePost(
                    {post_id: discussion.data.id}, 
                    function(response){
                        scope.error_message = null
                        scope.$emit('update_timeline', discussion)
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
                        console.log("failure");
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
                        console.log("failure");
                    }
                )
            }

            scope.deleteComment = function(comment, post_id){
                Forum.deleteComment({comment_id: comment.comment.id, post_id: scope.item.data.id}, function(response){
                    var index=scope.item.data.comments.indexOf(comment);
                    scope.item.data.comments.splice(index, 1);
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
}]).directive('discussionComment',["Forum","Timeline","$translate",'$rootScope', function(Forum, Timeline, $translate, $rootScope) {
    return {
        restrict:"E",
        scope:{
            item:'=',
            delete:'&'
        },
        templateUrl:'/views/forum/discussion_comment.html',
        link: function(scope, element, attrs) {
            scope.current_user = $rootScope.current_user

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

            scope.upvoteComment= function(){
                Forum.voteComment(
                    {comment_vote:{vote: parseInt(scope.item.comment.user_vote)+1, comment_id:scope.item.comment.id}}, 
                    function(response){
                        scope.item.comment.user_vote=1;
                        scope.item.comment.votes_count++;
                    }, 
                    function(){
                        console.log("failure");
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
                        console.log("failure");
                    }
                )

            }
        }
    }
}]).directive('votingButton', function(){
    return{
        restrict: 'E',
        scope:{            
            votes_count: '=votesCount',
            voted: '=',
            up: '=',
            down: '=',
            direction: '@',

        },
        templateUrl: '/views/forum/like_button.html',
        link: function(scope, element){
            if(scope.direction == 'horizontal')
                scope.display_style= 'inline-block'
            else
                scope.display_style= 'block'
        }
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
            var template =  "<div style='color:#6e6e6e;font-size:12px'>"+
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
                            "<br /><b>Notes: </b><br />"+
                            "<a href='' ng-click='$parent.exportNotes()'>{{'lectures.download_notes' | translate}}</a>"+
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
                // var textarea = element.find('textarea')
                // textarea[0].focus()
                // console.log(textarea[0].focus())
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
            if(event.which === 13){
                if(event.shiftKey == false) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });     
                    event.preventDefault();
                }
            }
        });
    };
});
