'use strict';

angular.module('scalearAngularApp')
  .controller('sharedCtrl',['$scope','Page','SharedItem','Module','Lecture','Quiz','$rootScope','$translate','$log', function ($scope,Page,SharedItem,Module,Lecture,Quiz, $rootScope, $translate, $log) {
  	Page.setTitle('sharing.view')
    $rootScope.subheader_message = $translate("sharing.manage")
  	var init=function(){
  		SharedItem.showShared(
  			{},
  			function(data){
  				$log.debug(data)
  				$scope.shared_items = data.all_shared
  				$scope.courses = data.courses
  			},function(){}
		)
  	}
  	init()
  }]);