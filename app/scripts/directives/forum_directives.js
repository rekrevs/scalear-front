'use strict';

angular.module('scalearAngularApp')
    .directive('discussion',["$timeout","$stateParams","Forum","Timeline","Lecture","editor", function($timeout, $stateParams, Forum, Timeline, Lecture,editor) {
    return {
        restrict:"E",
        templateUrl:'/views/forum/discussion.html',
        link: function(scope, elem, attrs, ngModel) {
            console.log("here@!!!!")
            scope.choices= [{text:'Private',value:0},{text:'Public', value:1}];
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
                    //console.log("hna2")
                }, function(){
                    console.log("failure");
                })
            }

            scope.flagPost = function(id, lecture_id, discussion){
                Forum.flagPost({post_id: id}, function(response){
                    discussion.data.user_flag=1-discussion.data.user_flag;
                }, function(){
                    console.log("failure");
                })
            }

            scope.votePost= function(id, lecture_id, discussion){
                discussion.data.user_vote=1-discussion.data.user_vote;
                Forum.votePost({vote: discussion.data.user_vote, post_id:id}, function(response){
                    if(discussion.data.user_vote == 0)
                        discussion.data.votes_count-=1;
                    else
                        discussion.data.votes_count+=1;
                }, function(){
                    console.log("failure");
                })

            }

            scope.flagComment = function(id,q_id, lecture_id, answer){
                Forum.flagComment({comment_flag:{comment_id: id}}, function(response){
                    answer.data.user_flag=1-answer.data.user_flag;
                }, function(){
                    console.log("failure");
                })
            }

            scope.voteComment= function(id,q_id, lecture_id, answer){
                answer.data.user_vote=1-answer.data.user_vote;
                Forum.voteComment({comment_vote:{vote: answer.data.user_vote, comment_id:id}}, function(response){
                    if(answer.data.user_vote == 0)
                        answer.data.votes_count-=1;
                    else
                        answer.data.votes_count+=1;
                }, function(){
                    console.log("failure");
                })

            }

            scope.deleteAnswer = function(id,q_id, lecture_id, answer){
                Forum.deleteComment({id: id, post_id: q_id}, function(response){
                    //console.log("begin")
                    var index=scope.timeline['lecture'][lecture_id][q_id].items.indexOf(answer);
                    //console.log(index)
                    //scope.timeline['discussion'][lecture_id][id]={}
                    //console.log("hna")
                    scope.timeline['lecture'][lecture_id][q_id].items.splice(index, 1);
                    //console.log("hna2")
                }, function(){
                    console.log("failure");
                })
            }

            scope.reply = function(discussion){
                Forum.createComment({comment: {content: scope.current_reply[discussion.data.id], post_id:discussion.data.id, lecture_id:discussion.data.lecture_id}}, function(response){
                    if(!scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id])
                        scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id]= new Timeline();

                    console.log(response);
                    scope.timeline['lecture'][discussion.data.lecture_id][discussion.data.id].add(discussion.data.time, "comment", response.comment);
                    scope.show_reply[discussion.data.id]=false
                    scope.current_reply[discussion.data.id]=""
                    scope.lecture_player.controls.play();
                }, function(){
                    console.log("failure")
                })
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
}]);