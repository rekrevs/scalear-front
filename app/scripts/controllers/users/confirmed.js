'use strict';

angular.module('scalearAngularApp')
  .controller('UsersConfirmedCtrl', ['$scope', '$rootScope', 'User', 'UserSession', '$state', '$interval', 'Page', function ($scope, $rootScope, User, UserSession, $state, $interval, Page) {
  	$scope.can_proceed = false, $scope.remaining = 5;
  	Page.setTitle('Welcome to ScalableLearning');
    $rootScope.subheader_message = "Intro Video"
  	UserSession.getRole().then(function(result) {
  		if(result == 2){
	  		$scope.video_id = "9u8U2NoXC7c"
	  	}
	  	else{
	  		$scope.video_id = "3x4ZGfzdU8Y"
	  	}
  	})
  	$scope.player_params = {
  		showinfo: 0,
  		rel: 0,
  		autohide: 1,
  		theme: 'light',
  		autoplay: 1
  	}
  	$scope.$on('youtube.player.ended', function ($event, player) {
	    $scope.can_proceed = true;
      $interval(function(){
        $scope.remaining--;
        if($scope.remaining == 0){
          $scope.watchedIntro();
        }
      }, 1000, 5)
  	});
  	$scope.watchedIntro = function(){
		User.updateIntroWatched({
			id: $rootScope.current_user.id
		},{
			intro_watched: true
		}, function(){
      console.log('SUCCEEDED')
			$rootScope.current_user.intro_watched = true;
			$state.go('course_list');
		}, function(){
      console.log('failed')
    });
  	}
  }]);