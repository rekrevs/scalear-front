'use strict';

angular.module('scalearAngularApp')
    .directive('discussion',["$timeout","$stateParams","Forum","Timeline","Lecture","editor","$translate", function($timeout, $stateParams, Forum, Timeline, Lecture,editor, $translate) {
    return {
        restrict:"E",
        templateUrl:'/views/forum/discussion.html',
        link: function(scope, element, attrs, ngModel) {
            console.log("here@!!!!")
            scope.choices= [{text:$translate('discussion.private_discussion'),value:0},{text:$translate('discussion.public_discussion'), value:1}];
            scope.privacy = scope.choices[0];
            scope.checkModel={quiz:true,confused:false, discussion:false};

            scope.checkEmpty= function(item){

                return  item.type!=''

            }

            scope.filterType= function(item){
                var condition=false;
                for(var e in scope.checkModel)
                {
                    if(scope.checkModel[e])
                        condition = (condition || item.type==e)
                }
                var x = item.type!='' && condition

                return x;

            }

            scope.saveQuestion = function(){

                Forum.createPost({post: {content: scope.current_question, time:scope.current_question_time, lecture_id:$stateParams.lecture_id, privacy:scope.privacy.value}}, function(response){
                    console.log("success");
                    scope.timeline['lecture'][$stateParams.lecture_id].add(scope.current_question_time, "discussion",  response.post);
                    // also add to notes.
                    //console.log(scope.editors);
                    scope.editors[$stateParams.lecture_id].insert(scope.current_question_time, scope.current_question);
                    scope.show_question=false;
                    scope.current_question="";
                    scope.lecture_player.controls.play();
                }, function(){
                    console.log("failure")
                })



            }
            scope.deleteDiscussion = function(id, lecture_id, discussion){
                Forum.deletePost({post_id: id}, function(response){
                    //console.log("begin")
                    var index=scope.timeline['lecture'][lecture_id].items.indexOf(discussion);
                    //console.log(index)
                    //scope.timeline['discussion'][lecture_id][id]={}
                    //console.log("hna")
                    scope.timeline['lecture'][lecture_id].items.splice(index, 1);
                    scope.error_message = null
                    //console.log("hna2")
                }, function(){
                    console.log("failure");
                })
            }

            scope.flagPost = function(id, lecture_id, discussion){
                Forum.flagPost({post_id: id}, function(response){
                    discussion.data.user_flag=1-discussion.data.user_flag;
                    discussion.data.flags_count++;
                }, function(){
                    console.log("failure");
                })
            }
            scope.unflagPost = function(id, lecture_id, discussion){
                Forum.flagPost({post_id: id}, function(response){
                    discussion.data.user_flag = 0;
                    discussion.data.flags_count--;
                }, function(){
                    console.log("failure");
                })
            }

            scope.upvotePost= function(lecture_id, discussion){
                Forum.votePost({vote: discussion.data.user_vote, post_id:discussion.data.id}, function(response){
                    discussion.data.user_vote=1-discussion.data.user_vote;
                    discussion.data.votes_count+=1;
                }, function(){
                    console.log("failure");
                })

            }
            scope.downvotePost = function(lecture_id, discussion){
                Forum.votePost({vote: discussion.data.user_vote, post_id:discussion.data.id}, function(response){
                    discussion.data.user_vote=1-discussion.data.user_vote;    
                    discussion.data.votes_count--;
                }, function(){
                    console.log("failure");
                })
            }

            scope.flagComment = function(id,q_id, lecture_id, answer){
                Forum.flagComment({comment_flag:{comment_id: id}}, function(response){
                    answer.data.user_flag=1-answer.data.user_flag;
                    answer.data.flags_count++;
                }, function(){
                    console.log("failure");
                })
            }
            scope.unflagComment = function(id,q_id, lecture_id, answer){
                Forum.flagComment({comment_flag:{comment_id: id}}, function(response){
                    answer.data.user_flag = 0;
                    answer.data.flags_count--;
                }, function(){
                    console.log("failure");
                })
            }

            scope.upvoteComment= function(q_id, lecture_id, answer){
                Forum.voteComment({comment_vote:{vote: answer.data.user_vote, comment_id:answer.data.id}}, function(response){
                    answer.data.user_vote=1-answer.data.user_vote;
                    answer.data.votes_count+=1;
                }, function(){
                    console.log("failure");
                })

            }
            scope.downvoteComment= function(q_id, lecture_id, answer){
                Forum.voteComment({comment_vote:{vote: answer.data.user_vote, comment_id:answer.data.id}}, function(response){
                    answer.data.user_vote=1-answer.data.user_vote;
                    answer.data.votes_count-=1;
                }, function(){
                    console.log("failure");
                })

            }

            scope.deleteAnswer = function(id,q_id, lecture_id, answer){
                Forum.deleteComment({comment_id: id, post_id: q_id}, function(response){
                    //console.log("begin")
                    var index=scope.timeline['lecture'][lecture_id][q_id].items.indexOf(answer);
                    //console.log(index)
                    //scope.timeline['discussion'][lecture_id][id]={}
                    //console.log("hna")
                    scope.timeline['lecture'][lecture_id][q_id].items.splice(index, 1);
                    //console.log("hna2")
                    scope.error_message = null
                }, function(){
                    console.log("failure");
                })
            }

            scope.reply = function(discussion){
                if (scope.current_reply[discussion.data.id] && scope.current_reply[discussion.data.id].length && scope.current_reply[discussion.data.id].trim()!=""){
                    Forum.createComment({comment: {content: scope.current_reply[discussion.data.id], post_id:discussion.data.id, lecture_id:discussion.data.lecture_id}}, function(response){
                        if(!scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id])
                            scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id]= new Timeline();

                        console.log(response);
                        scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id].add(discussion.data.time, "comment", response.comment);
                        scope.show_reply[discussion.data.id]=false
                        scope.current_reply[discussion.data.id]=""
                        scope.lecture_player.controls.play();
                        scope.error_message = null
                    }, function(){
                        console.log("failure")
                    })
                }
                else{
                    console.log("hello")
                    scope.error_message = "Cannot be empty"
                }
                angular.element('.btn').blur()
            }

            scope.show_reply = function(discussion){
                if(!scope.show_reply[discussion.data.id])
                {
                    scope.show_reply[discussion.data.id]=true
                    scope.lecture_player.controls.pause();
                }
                else{
                    scope.show_reply[discussion.data.id]=false
                    scope.lecture_player.controls.play();
                }
            }

            scope.deleteConfused = function(confused_id, lecture_id, c){
                Lecture.deleteConfused({lecture_id: lecture_id, confused_id: confused_id}, function(response){
                    console.log("deleted");
                    // now want to remove from list (both l.confuseds and $scope.timeline..)
                    var index=scope.timeline['lecture'][lecture_id].items.indexOf(c);
                    scope.timeline['lecture'][lecture_id].items.splice(index, 1)
                });
            }
        }
    }
}]).directive('notes',["$stateParams","editor", function( $stateParams, editor) {
        return {
            restrict:"E",
            templateUrl:'/views/forum/notes.html',
            link: function(scope, elem, attrs, ngModel) {

            }
        }
}]).directive('votingButton', function(){
    return{
        restrict: 'E',
        scope:{
            lectureid: '=',
            discussion: '=',
            comment: '=',
            up: '=',
            down: '='

        },
        templateUrl: '/views/forum/like_button.html',
        link: function(scope, element){
        }
    }
});