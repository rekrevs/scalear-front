'use strict';

angular.module('scalearAngularApp')
  .controller('lectureProgressCtrl', ['$scope','$stateParams','$timeout','Module','$log', function ($scope, $stateParams, $timeout, Module, $log) {
  	
  	 $scope.lectureProgressTab = function(){
        // $scope.tabState(3)
        // enableInfinitScrolling() 
        if($scope.lecture_offset == null)
            $scope.getAllItemsProgress(0,20)
        enableInfinitScrolling()     
    }

  	$scope.getAllItemsProgress = function(offset, limit){
        $scope.lecture_limit =  limit
        $scope.lecture_offset = offset
        $scope.loading_lectures=true 
        disableInfinitScrolling()
        Module.getAllItemsProgress(
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

                obj.lecture_students = obj.lecture_students.concat(JSON.parse(data.students));
                angular.extend(obj.solved_count,  data.solved_count)
                angular.extend(obj.lecture_status,data.lecture_status)
                angular.extend(obj.late_lectures, data.late_lectures)

                $log.debug(obj)

                angular.extend($scope, obj)

                $timeout(function(){
            		enableInfinitScrolling()
                    $scope.loading_lectures=false
                    // $('.student').tooltip({"placement": "left", container: 'body'})
                    // $('.state').tooltip({"placement": "top", container: 'body'}) 
                })
                    
            },
            function(){
                //alert('Could not load data, please check your internet connection')
            }
        );
    }    

    $scope.getRemainingLectureProgress = function(){
        $log.debug("getting remaining")
        $log.debug($scope.total)
        $log.debug($scope.lecture_offset)
        $log.debug($scope.lecture_limit)

        if($scope.lecture_offset+$scope.lecture_limit<=parseInt($scope.total))
            $scope.getAllItemsProgress($scope.lecture_offset+$scope.lecture_limit,$scope.lecture_limit) 
        else{
            $log.debug("no more")
        	disableInfinitScrolling()
        }
    }

 	var enableInfinitScrolling = function(){
        // if($scope.tabState() == 3){
            $scope.lecture_scroll_disable = false
            // $scope.quiz_scroll_disable = true
            // $scope.chart_scroll_disable= true
            // $scope.survey_scroll_disable = true
        // }
       
    }

    var disableInfinitScrolling = function(){
        // if($scope.tabState() == 3){
            $scope.lecture_scroll_disable = true
            // $scope.quiz_scroll_disable = true
            // $scope.chart_scroll_disable= true
            // $scope.survey_scroll_disable = true
        // }
       
    }

  }]);
