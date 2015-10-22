'use strict';

angular.module('scalearAngularApp')
    .controller('lectureMarkerListCtrl',['$scope', 'OnlineMarker', '$translate','$q','$log','$stateParams','$rootScope', function ($scope, OnlineMarker, $translate, $q, $log, $stateParams, $rootScope) {

	var init= function(){
		$scope.$parent.$parent.$parent.marker_list = null
		OnlineMarker.getMarkerList(
			{lecture_id:$stateParams.lecture_id},
			function(data){
				$scope.$parent.$parent.$parent.marker_list = data.markerList
			}
		);	
	}
    init()

	$scope.showMarker=function(marker){
		$rootScope.$broadcast("show_online_marker", marker)
	}

	$scope.deleteMarker=function(marker){
		$rootScope.$broadcast("delete_online_marker", marker)
	}
}]);
