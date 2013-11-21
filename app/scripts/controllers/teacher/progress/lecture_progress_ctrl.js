'use strict';

angular.module('scalearAngularApp')
  .controller('lectureProgressCtrl', ['$scope','$stateParams','$timeout','Module', function ($scope, $stateParams, $timeout, Module) {
  	
  	 $scope.lectureProgressTab = function(){
        $scope.tabState(3)
        enableLectureProgressScrolling() 
        if($scope.lecture_offset == null)
            $scope.getLectureProgress(0,20)    
    }

  	$scope.getLectureProgress = function(offset, limit){
        $scope.lecture_limit =  limit
        $scope.lecture_offset = offset
        $scope.loading_lectures=true 
        $scope.disableInfinitScrolling()
        Module.getLectureProgress(
            {
                course_id: $stateParams.course_id,
                module_id: $stateParams.module_id, 
                offset:$scope.lecture_offset, 
                limit: $scope.lecture_limit
            },
            function(data){
                var obj={}

                obj.lecture_names = data.lecture_names
                obj.total_lec_quiz = data.total_lec_quiz
                obj.total = data.total

                obj.lecture_students = $scope.lecture_students || []
                obj.solved_count  = $scope.solved_count  || {}
                obj.lecture_status= $scope.lecture_status|| {}
                obj.late_lectures = $scope.late_lectures || {}

                obj.lecture_students = obj.lecture_students.concat(data.students);
                angular.extend(obj.solved_count,  data.solved_count)
                angular.extend(obj.lecture_status,data.lecture_status)
                angular.extend(obj.late_lectures, data.late_lectures)

                console.log(obj)

                angular.extend($scope, obj)

                $timeout(function(){
            		enableLectureProgressScrolling()
                    $scope.loading_lectures=false
                    $('.student').tooltip({"placement": "left", container: 'body'})
                    $('.state').tooltip({"placement": "left", container: 'body'}) 
                })
                    
            },
            function(){
                alert('Could not load data, please check your internet connection')
            }
        );
    }    

    $scope.getRemainingLectureProgress = function(){
        if($scope.lecture_offset+$scope.lecture_limit<=parseInt($scope.total))
            $scope.getLectureProgress($scope.lecture_offset+$scope.lecture_limit,$scope.lecture_limit) 
        else
        	$scope.disableInfinitScrolling()
    }

 	var enableLectureProgressScrolling = function(){
        if($scope.tabState() == 3){
             $scope.lecture_scroll_disable = false
            $scope.quiz_scroll_disable = true
            $scope.chart_scroll_disable= true
        }
       
    }

  }]);
