'use strict';

angular.module('scalearAngularApp')
  .controller('displaySurveysCtrl', ['$scope','Module',function ($scope,Module) {

  	var init =function(){
  		Module.displaySurveys(
  			{module_id:34},
  			function(data){
  				console.log(data)
  			},
  			function(){

  			}
		)
  	}

  	init()

  }]);
