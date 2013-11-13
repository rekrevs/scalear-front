'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['$scope','Course',function ($scope, Course) {

   		Course.getCourse({},
			function(data){
				$scope.groups = data.groups
				console.log(data)
			}, 
			function(){

			})
			console.log("Progress ")

			
  }]);
