'use strict';

angular.module('scalearAngularApp')
  .controller('AboutCtrl',['$scope','Page','$rootScope','$translate', function ($scope,Page,$rootScope,$translate) {
  	Page.setTitle('footer.about')
  	$rootScope.subheader_message =$translate.instant("footer.about")
  }]);
