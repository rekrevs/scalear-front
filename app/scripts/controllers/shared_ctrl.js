'use strict';

angular.module('scalearAngularApp')
  .controller('sharedCtrl',['$scope','Page','SharedItem','Module','Lecture','Quiz', function ($scope,Page,SharedItem,Module,Lecture,Quiz) {
  	Page.setTitle('sharing.view')

  	var init=function(){
  		SharedItem.showShared(
  			{},
  			function(data){
  				console.log(data)
  				$scope.shared_items = data.all_shared
  				$scope.courses = data.courses
  			},function(){}
		)
  	}
  	init()
  }]);