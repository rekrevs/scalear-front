'use strict';

angular.module('scalearAngularApp')
  .controller('quizDetailsCtrl',['$stateParams','$rootScope','$scope','$q','Quiz','quiz', function ($stateParams, $rootScope, $scope, $q, Quiz,quiz) {
    
    console.log("state params detilas quiz is ");
    console.log($stateParams);
    $scope.quiz = quiz.data
    
    $scope.$emit('accordianUpdate',$scope.quiz.group_id);

    $scope.updateQuiz = function(data,type) {   		
     		var modified_quiz=angular.copy($scope.quiz);
     		delete modified_quiz["created_at"];
     		delete modified_quiz["updated_at"];
     		delete modified_quiz["id"];  
        if(data)
          modified_quiz[type] = data.getDate()+"/"+(data.getMonth()+1)+"/"+data.getFullYear()   		
      	Quiz.update({quiz_id:$scope.quiz.id},{quiz:modified_quiz},function(data){
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
