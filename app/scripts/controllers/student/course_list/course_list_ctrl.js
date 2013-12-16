'use strict';

angular.module('scalearAngularApp')
  .controller('studentCourseListCtrl',['$scope','Course', '$modal', '$log','$rootScope','$timeout','ErrorHandler', function ($scope, Course, $modal, $log,$rootScope,$timeout, ErrorHandler) {
  	
		var init= function(){
			Course.index({},
  			function(data){
  				$log.debug(data)
  				$scope.courses = data
  			},
  			function(){}
      )
		}

		$scope.order=function(column_name){
  			$scope.column = column_name
  			$scope.is_reverse = !$scope.is_reverse
		}  		

  	$scope.open = function () {
    	var modalInstance = $modal.open({
      		templateUrl: 'views/student/course_list/enroll_modal.html',
      		controller: "StudentEnrollModalCtrl",
    	})

    	modalInstance.result.then(function (enrollment_key) {
    		$rootScope.show_alert="success";	
    		ErrorHandler.showMessage("Successfully Joined Course", 'errorMessage', 2000);
    		$timeout(function(){
    			$rootScope.show_alert="";	
    		},5000);
      		
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