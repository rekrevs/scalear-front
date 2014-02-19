angular.module('scalearAngularApp')
  .controller('forumCtrl',['$scope', 'Kpi','$translate', 'Forum', function ($scope, Kpi,$translate, Forum) {

        $scope.createComment = function(){
            Forum.createComment({content: $scope.comment}, function(response){
                console.log("success");
            }, function(){
                console.log("failure")
            })
        }


  }]);
