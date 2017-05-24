'use strict';

angular.module('scalearAngularApp')
  .controller('FaqCtrl',['$scope','Page','$rootScope','$translate', function ($scope,Page,$rootScope,$translate) {
  	Page.setTitle('faq')
  	$rootScope.subheader_message = $translate.instant("faq")  	
  	$scope.questions_count= new Array(6)
  }]);
