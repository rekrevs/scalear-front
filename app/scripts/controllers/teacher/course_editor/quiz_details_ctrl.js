'use strict';

angular.module('scalearAngularApp')
  .controller('quizDetailsCtrl',['$stateParams','$rootScope','$scope','$q','Quiz', function ($stateParams, $rootScope, $scope, $q, Quiz) {
    
    $scope.$watch('items_obj['+$stateParams.quiz_id+']', function(){
      if($scope.items_obj && $scope.items_obj[$stateParams.quiz_id]){
        $scope.quiz=$scope.items_obj[$stateParams.quiz_id]
      }
    })

    $scope.updateQuiz = function(data,type) {  
        if(data && data instanceof Date){ 
          data.setMinutes(data.getMinutes() + 120);
          $scope.quiz[type] = data
        }    		
     		var modified_quiz=angular.copy($scope.quiz);
        delete modified_quiz["class_name"];   
     		delete modified_quiz["created_at"];
     		delete modified_quiz["updated_at"];
        delete modified_quiz["id"];   
      	Quiz.update(
          {
            course_id:$stateParams.course_id, 
            quiz_id:$scope.quiz.id
          },
          {quiz:modified_quiz},
          function(data){
    				console.log(data)
    		  }
      );	
  	};

    $scope.validateQuiz = function(column,data) {
      var d = $q.defer();
      var quiz={}
      quiz[column]=data;
      Quiz.validateQuiz({course_id:$stateParams.course_id, quiz_id:$scope.quiz.id},quiz,function(data){
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
