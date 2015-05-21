'use strict';

angular.module('scalearAngularApp')
  .controller('surveysProgressCtrl', ['$scope','$stateParams','$timeout','Module','$log', function ($scope, $stateParams, $timeout, Module, $log) {
    
    // $scope.surveysProgressTab = function(){
    //     $scope.tabState(4)
    //     enableSurveyProgressScrolling()
    //     if($scope.surveys_offset == null)
    //         getSurveysProgress(0,20)            
    // }
    // var getSurveysProgress = function(offset, limit){
    //     $scope.surveys_limit  = limit
    //     $scope.surveys_offset = offset
    //     $scope.loading_surveys=true 
    //     $scope.disableInfinitScrolling()

    //     Module.getSurveysProgress(
    //         { 
    //             course_id: $stateParams.course_id,
    //             module_id: $stateParams.module_id, 
    //             offset:$scope.surveys_offset, 
    //             limit: $scope.surveys_limit
    //         },
    //         function(data){
    //             $log.debug(data)
    //             var obj={}

    //             obj.surveys_names = data.surveys_names
    //             obj.total = data.total

    //             obj.surveys_students = $scope.surveys_students || []
    //             obj.surveys_status= $scope.surveys_status|| {}
    //             obj.late_surveys = $scope.late_surveys || {}

    //             obj.surveys_students = obj.surveys_students.concat(JSON.parse(data.students));
    //             angular.extend(obj.surveys_status,data.surveys_status)
    //             angular.extend(obj.late_surveys, data.late_surveys)

    //             angular.extend($scope, obj)

    //             $timeout(function(){
    //             	enableSurveyProgressScrolling()
    //                 $scope.loading_surveys=false
    //                 $('.student').tooltip({"placement": "left", container: 'body'})
    //                 $('.state').tooltip('disable') 
    //             },0)
                    
    //         },
    //         function(){
    //             //alert('Could not load data, please check your internet connection')
    //         }
    //     );
    // }    

    // $scope.getRemainingSurveysProgress = function(){
    //     if($scope.surveys_offset+$scope.surveys_limit<=parseInt($scope.total))
    //         getSurveysProgress($scope.surveys_offset+$scope.surveys_limit,$scope.surveys_limit)
    //     else
    //     	$scope.disableInfinitScrolling()
    // }

    // var enableSurveyProgressScrolling = function(){
    //     if($scope.tabState() == 5){
    //         $scope.lecture_scroll_disable = true
    //         $scope.quiz_scroll_disable = true
    //         $scope.chart_scroll_disable= true
    //         $scope.survey_scroll_disable = false
    //     }
    	
    // }

  }]);
