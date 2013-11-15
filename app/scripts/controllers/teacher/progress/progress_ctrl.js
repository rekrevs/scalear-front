'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['$scope', '$stateParams','Course',function ($scope, $stateParams, Course) {

   		Course.getCourse({course_id:$stateParams.course_id},
			function(data){
				$scope.groups = data.groups
				console.log(data)
			}, 
			function(){

			})
			console.log("Progress ")

			
  }]);
