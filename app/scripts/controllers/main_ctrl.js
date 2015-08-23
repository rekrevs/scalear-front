'use strict';

angular.module('scalearAngularApp')
  .controller('MainCtrl', ['$scope','$log','Page','$rootScope','Home','$state','$location', function ($scope, $log,Page, $rootScope, Home, $state, $location) { 
	Page.setTitle('Welcome!')
  $scope.play_teacher= false
  $scope.play_student= false
  $('a.page-scroll').bind('click', function(event) {
      $('html, body').stop().animate({scrollTop: $($(this).attr('href')).offset().top}, 1500, 'easeInOutExpo');
      event.preventDefault();
  });

	$('.navbar-collapse ul li a').click(function() {
	    $('.navbar-toggle:visible').click();
	});

  $('body').scrollspy({
    target: '.navbar-fixed-top'
  })

  $scope.goTo=function(state){
    $state.go(state)
  }

  $scope.playerTeacher=function(){
    $scope.play_teacher= true
  }

  $scope.playerStudent=function(){
    $scope.play_student= true
  }



  $scope.send_technical=function() {
    $scope.submitted = true
    if($scope.user && $scope.user.name && $scope.user.email && $scope.comment_data){
      $scope.sending_technical = true;      
      Home.contactUs({
        name: $scope.user.name,
        email: $scope.user.email,
        url: $location.url(),
        comment: $scope.comment_data,
        agent: navigator.userAgent
      },function() {
        $scope.user={}
        $scope.comment_data = null; 
        $scope.sending_technical = false; 
        $scope.show_thanks = true 
        $scope.submitted = false         
      });
    }
  }
   
}]);

