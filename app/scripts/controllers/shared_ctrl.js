'use strict';

angular.module('scalearAngularApp')
  .controller('sharedCtrl',['$scope','Page','SharedItem','Module','Lecture','Quiz','$rootScope','$translate', function ($scope,Page,SharedItem,Module,Lecture,Quiz, $rootScope, $translate) {
  	Page.setTitle('sharing.view')
    $rootScope.subheader_message = $translate("sharing.manage")
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