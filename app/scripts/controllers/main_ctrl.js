'use strict';

angular.module('scalearAngularApp')
  .controller('MainCtrl', ['$scope','$log','Page','$rootScope','$timeout', function ($scope, $log,Page, $rootScope, $timeout) {   
	Page.setTitle('Home')
	$rootScope.subheader_message = null
	$scope.show_content = true
 	// $scope.$on('$viewContentLoaded', function(){

 		
  // 	});
  	// $('.body').ready(function(){
 		// $timeout(function(){$scope.show_content = true},1000)
  	// })

    $('a.page-scroll').bind('click', function(event) {
        $('html, body').stop().animate({scrollTop: $($(this).attr('href')).offset().top}, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

	$('.navbar-collapse ul li a').click(function() {
	    $('.navbar-toggle:visible').click();
	});
   
  }]);

