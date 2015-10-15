// angular.module('scalearAngularApp')
//   .controller('forumCtrl',['$scope', 'Kpi','$translate', 'Forum','$log', function ($scope, Kpi,$translate, Forum, $log){
//         $scope.getComments= function(){
//             Forum.getComments({},function(response){
//                 $log.debug(response);
//                 $scope.comments=response;
//             }, function(){
//                  $log.debug("failure");
//             });
//         }

//         $scope.vote= function(vote, comment){
//             $log.debug(vote);
//             $log.debug(parseInt(comment.user_vote)||0)
//             var new_vote= vote+(parseInt(comment.user_vote)||0);
//             $log.debug("neW vote is "+new_vote)
//             if(new_vote > 1 || new_vote<-1)
//                 $log.debug("outside limit")
//             else{
//                 comment.user_vote=new_vote
//                 Forum.vote({
//                         vote: comment.user_vote, 
//                         post_id:comment.id
//                     }, 
//                     function(response){
//                         comment.votes_count+=vote;
//                     }, 
//                     function(){
//                         $log.debug("failure");
//                     }
//                 )
//             }
//         }

//         $scope.flag= function(comment){            
//             Forum.flag({post_id:comment.id},function(){
//                 comment.user_flag=1-comment.user_flag
//             })
//         }


//         $scope.createComment = function(){
//             Forum.createComment({content: $scope.comment}, function(response){
//                 $log.debug("success");
//                 //$scope.getComments();
//                 var post={"post": {email: $scope.current_user.email, content: $scope.comment, votes_count: 0, id:response.post.id, user_flag:0}}
//                 $scope.comments.push(post);
//                 $scope.comment="";
//             }, function(){
//                 $log.debug("failure")
//             })
//         }

//         $scope.getComments();
//   }]);
