'use strict';

angular.module('scalearAngularApp')
  .controller('MainCtrl', ['$scope', '$stateParams' ,'Course', function ($scope, $stateParams ,Course) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    Course.get_course_editor(
    	{course_id: 13},
    	function(data){
    		console.log(data)
    	},
    	function(){
    		console.log("error")
    	}
	);

  }]);
