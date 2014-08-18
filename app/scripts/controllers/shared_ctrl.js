'use strict';

angular.module('scalearAngularApp')
  .controller('sharedCtrl',['$scope','Page','SharedItem','Module','Lecture','Quiz','$rootScope', function ($scope,Page,SharedItem,Module,Lecture,Quiz, $rootScope) {
  	Page.setTitle('sharing.view')
    $rootScope.subheader_message = "Manage Shared"
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