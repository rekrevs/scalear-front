'use strict';

angular.module('scalearAngularApp')
  .controller('StudentCourseListCtrl',['$scope','Course', '$modal', '$log','$rootScope','$timeout','ErrorHandler', function ($scope, Course, $modal, $log,$rootScope,$timeout, ErrorHandler) {
  	
  	console.log("in student course list")
  		var init= function(){
  			Course.index({},
			function(data){
				console.log(data)
				$scope.courses = data
			},
			function(){
				//alert("Could not get courses, please check your internet connection")
			})
  		}
  		init();
		$scope.column="name";

		$scope.order=function(column_name){
  			$scope.column = column_name
  			$scope.is_reverse = !$scope.is_reverse
  		}
  		

    	$scope.open = function () {

    	var modalInstance = $modal.open({
      		templateUrl: 'views/student/course_list/enroll_modal.html',
      		controller: "StudentEnrollModalCtrl",
      		// resolve: {
        		// items: function () {
          		// return $scope.items;
        	// }
      		//}
    	});

    	modalInstance.result.then(function (enrollment_key) {
    		//console.log(enrollment_key);
      		//$scope.selected = enrollment_key;
      		
      		$rootScope.show_alert="success";	
      		ErrorHandler.showMessage("Successfully Joined Course", 'errorMessage', 2000);
      		$timeout(function(){
      			$rootScope.show_alert="";	
      		},5000);
      		
      		init();
    	}, function () {
      		$log.info('Modal dismissed at: ' + new Date());
    	});
  	};


  }]);