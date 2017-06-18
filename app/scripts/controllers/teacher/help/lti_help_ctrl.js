'use strict';

angular.module('scalearAngularApp')
  .controller('LtiKeyGenerateCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', 'scalear_api','$translate','Lti', '$modal',function ($scope, $location, $anchorScroll, $rootScope,Page, scalear_api, $translate, Lti, $modal) {
   	Page.setTitle('lti.lti')
    $rootScope.subheader_message = $translate.instant('lti.lti') 
    $scope.scalear_api = scalear_api
    $scope.loading_lti = true

    Lti.getLtiCustomSharedKey(
    	{
    		type: 'user',
        })
      .$promise
      .then(function(data) {
	    $scope.shared_sceret = data.shared_sceret
	    $scope.consumer_key = data.consumer_key
	    $scope.lti_url_xml = data.lti_url_xml
      $scope.lti_url_embed = data.lti_url_embed
	    $scope.loading_lti = false
      })

    $scope.generateNewLtiKeys = function() {
      Lti.generateNewLtiKeys({
      	type: 'user'
      })
      .$promise
      .then(function(data) {
  	    $scope.consumer_key = data.consumer_key
  	    $scope.shared_sceret = data.shared_sceret
      })
    }

    $scope.generateLaunchUrl = function(){
        $modal.open({
        templateUrl: '/views/teacher/course_list/lti_course_list.html',
        scope: $scope,
        controller: 'ltiCourseListCtrl'
      })
    }

    $scope.scroll=function(location){
      $('body').scrollToThis(0, {offsetTop: 0, duration: 0});
      $('body').scrollToThis('#'+location, {offsetTop: 95, duration: 0});
    }
    
  }]);
