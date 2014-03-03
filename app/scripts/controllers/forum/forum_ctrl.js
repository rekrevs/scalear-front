angular.module('scalearAngularApp')
  .controller('forumCtrl',['$scope', 'Kpi','$translate', 'Forum', function ($scope, Kpi,$translate, Forum) {

        $scope.getComments= function(){
            Forum.getComments({},function(response){
                console.log(response);
                $scope.comments=response;
            }, function(){
                 console.log("failure");
            });
        }

        $scope.vote= function(vote, comment){
            console.log(vote);
            console.log(parseInt(comment.user_vote)||0)
            var new_vote= vote+(parseInt(comment.user_vote)||0);
            console.log("neW vote is "+new_vote)
            if(new_vote > 1 || new_vote<-1)
                console.log("outside limit")
            else
            {
                comment.user_vote=new_vote

                Forum.vote({vote: comment.user_vote, post_id:comment.id}, function(response){
                    comment.votes_count+=vote;
            }, function(){
                console.log("failure");
            })
            }
        }

        $scope.flag= function(comment){
                comment.user_flag=1-comment.user_flag

                Forum.flag({post_id:comment.id}, function(response){
                    console.log("success")
                }, function(){
                    console.log("failure");
                })

        }


        $scope.createComment = function(){
            Forum.createComment({content: $scope.comment}, function(response){
                console.log("success");
                //$scope.getComments();
                var post={"post": {email: $scope.current_user.email, content: $scope.comment, votes_count: 0, id:response.post.id, user_flag:0}}
                $scope.comments.push(post);
                $scope.comment="";
            }, function(){
                console.log("failure")
            })
        }

        $scope.getComments();


  }]);
