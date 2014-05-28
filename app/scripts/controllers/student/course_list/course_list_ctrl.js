'use strict';

angular.module('scalearAngularApp')
  .controller('studentCourseListCtrl',['$scope','Course', '$modal', '$log','$rootScope','$timeout','ErrorHandler', '$window','Page', 'NewsFeed','$translate', function ($scope, Course, $modal, $log,$rootScope,$timeout, ErrorHandler, $window,Page, NewsFeed, $translate) {

  	$window.scrollTo(0, 0);
    Page.setTitle('navigation.courses');
    
		var init= function(){
			Course.index({},
  			function(data){
  				$log.debug(data)
  				$scope.courses = data
  			},
  			function(){}
      )

      NewsFeed.index({}, function(data){
        $scope.events = []
        $scope.latest_events = data.latest_events
        $scope.latest_announcements = data.latest_announcements
        $scope.latest_events.forEach(function(event){
          event.timestamp = event.appearance_time;
          $scope.events.push(event);
        })
        $scope.latest_announcements.forEach(function(announcement){
          announcement.timestamp = announcement.updated_at;
          $scope.events.push(announcement);
        })
        // $scope.coming_up = data.coming_up
        console.log('got these')
        console.log($scope.events)
      }, function(){
        console.log('Couldn\'t get the data');
      })
		}

		$scope.order=function(column_name){
  			$scope.column = column_name
  			$scope.is_reverse = !$scope.is_reverse
		}  		

  	$scope.open = function () {
      angular.element('.btn').blur()
    	var modalInstance = $modal.open({
      		templateUrl: '/views/student/course_list/enroll_modal.html',
      		controller: "StudentEnrollModalCtrl",
    	})

    	modalInstance.result.then(function (enrollment_key) {
      //   console.log($scope.course)
    		// $rootScope.show_alert="success";	
    		// ErrorHandler.showMessage($translate('controller_msg.enrolled_in', {course: $scope.course.name}), 'errorMessage', 2000);
    		// $timeout(function(){
    		// 	$rootScope.show_alert="";	
    		// },5000);
      		
    		init();

    	},
      function () {
      		$log.info('Modal dismissed at: ' + new Date());
    	})
  	}

    $log.debug("in student course list")
    init();
    $scope.column="name";



  }]);