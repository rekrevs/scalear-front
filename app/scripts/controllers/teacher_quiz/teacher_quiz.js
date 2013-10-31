'use strict';

angular.module('scalearAngularApp')
  .controller('TeacherQuizTeacherQuizCtrl',['$scope', '$rootScope', '$state', '$stateParams', 'Course', function ($scope, $rootScope, $state, $stateParams, Course) {
    
    console.log($stateParams);
    console.log("in teacher quiz");
    $scope.open_id="-1";
    $scope.open={};
    $scope.oneAtATime = true;
    var init = function(){
 		Course.get_course_editor(function(data){
	 		$scope.course=data.course
	 		$scope.groups=data.groups
		  	$scope.groups.forEach(function(group,index){
		  		group.items = data.items[index]
		  		group.items.forEach(function(item,ind){
		  			item.className= data.className[index][ind]
		  		});  		
		  	});
	 		console.log($scope.groups);
	    });
 	}

 	init();
	
	$rootScope.$on('accordianUpdate', function(event, message) {
		$scope.open_id=message;
		$scope.open[message]= true;
	});

 	$scope.moduleSortableOptions={
 		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle',
		cursor: 'crosshair',
		items: 'li.modules',
		opacity: 0.4,
		scroll: true
 	}

 	$scope.itemSortableOptions={
		axis: 'y',
		dropOnEmpty: false,
		handle: '.handle2',
		cursor: 'crosshair',
		items: 'li.last-child',
		opacity: 0.4,
		scroll: true
 	}

 	$scope.$on("update", function(event, args) {
  		init();
  		//console.log("event emitted: title in left bar");
    })
  }]);
