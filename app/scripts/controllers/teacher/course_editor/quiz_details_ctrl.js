'use strict';

angular.module('scalearAngularApp')
  .controller('quizDetailsCtrl',['$stateParams','$rootScope','$scope','Quiz','quiz','$q', function ($stateParams, $rootScope,$scope, Quiz,quiz,$q) {
    
    console.log("state params detilas quiz is ");
    console.log($stateParams);
    $scope.quiz = quiz.data
    
    $scope.$emit('accordianUpdate',$scope.quiz.group_id);

    $scope.updateQuiz = function() {   		
     		var sending=angular.copy($scope.quiz);
     		delete sending["created_at"];
     		delete sending["updated_at"];
     		delete sending["id"];   		
      	Quiz.update({quiz_id:$scope.quiz.id},{quiz:sending},function(data){
  				$scope.quiz= data.quiz;
          $scope.$emit('detailsUpdate');
  				$scope.$emit('accordianUpdate',$scope.quiz.group_id);
  				return true;
  		  }
      );	
  	};

    $scope.validateQuiz = function(column,data) {
      var d = $q.defer();
      var quiz={}
      quiz[column]=data;
      Quiz.validateQuiz({quiz_id:$scope.quiz.id},quiz,function(data){
        d.resolve()
      },function(data){
        console.log(data.status);
        console.log(data);
        if(data.status==422)
          d.resolve(data.data[column].join());
        else
          d.reject('Server Error');
        }
      )
      return d.promise;
    }; 
    
  }]);
