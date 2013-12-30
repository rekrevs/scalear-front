'use strict';

angular.module('scalearAngularApp')
  .controller('quizzesProgressCtrl', ['$scope','$stateParams','$timeout','Module','$log', function ($scope, $stateParams, $timeout, Module, $log) {
    
    $scope.quizzesProgressTab = function(){
        $scope.tabState(4)
        enableQuizzesProgressScrolling()
        if($scope.quizzes_offset === null)
            getQuizzesProgress(0,20)            
    }
    var getQuizzesProgress = function(offset, limit){
        $scope.quizzes_limit  = limit
        $scope.quizzes_offset = offset
        $scope.loading_quizzes=true 
        $scope.disableInfinitScrolling()

        Module.getQuizzesProgress(
            { 
                course_id: $stateParams.course_id,
                module_id: $stateParams.module_id, 
                offset:$scope.quizzes_offset, 
                limit: $scope.quizzes_limit
            },
            function(data){
                $log.debug(data)
                var obj={}

                obj.quizzes_names = data.quizzes_names
                obj.total = data.total

                obj.quizzes_students = $scope.quizzes_students || []
                obj.quizzes_status= $scope.quizzes_status|| {}
                obj.late_quizzes = $scope.late_quizzes || {}

                obj.quizzes_students = obj.quizzes_students.concat(data.students);
                angular.extend(obj.quizzes_status,data.quizzes_status)
                angular.extend(obj.late_quizzes, data.late_quizzes)

                angular.extend($scope, obj)

                $timeout(function(){
                	enableQuizzesProgressScrolling()
                    $scope.loading_quizzes=false
                    $('.student').tooltip({"placement": "left", container: 'body'})
                    $('.state').tooltip('disable') 
                },0)
                    
            },
            function(){
                //alert('Could not load data, please check your internet connection')
            }
        );
    }    

    $scope.getRemainingQuizzesProgress = function(){
        if($scope.quizzes_offset+$scope.quizzes_limit<=parseInt($scope.total))
            getQuizzesProgress($scope.quizzes_offset+$scope.quizzes_limit,$scope.quizzes_limit)
        else
        	$scope.disableInfinitScrolling()
    }

    var enableQuizzesProgressScrolling = function(){
        if($scope.tabState() == 4){
            $scope.lecture_scroll_disable = true
            $scope.quiz_scroll_disable = false
            $scope.chart_scroll_disable= true
        }
    	
    }

  }]);
