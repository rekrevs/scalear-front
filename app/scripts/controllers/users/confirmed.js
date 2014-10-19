'use strict';

angular.module('scalearAngularApp')
	.controller('UsersConfirmedCtrl', ['$scope', '$rootScope', 'User', 'UserSession', '$state', '$interval', 'Page', function ($scope, $rootScope, User, UserSession, $state, $interval, Page) {
		$scope.can_proceed = false 
		$scope.remaining = 5;
		Page.setTitle('Welcome to ScalableLearning');
		$rootScope.subheader_message = "Intro Video (3 minutes)"
		UserSession.getRole().then(function(result) {
			$scope.role= result
			if($scope.role == 2){
				$scope.video_url = "https://www.youtube.com/watch?v=9u8U2NoXC7c?theme=light&autoplay=1&controls=1"
			}
			else{
				$scope.video_url = "https://www.youtube.com/watch?v=3x4ZGfzdU8Y?theme=light&autoplay=1&controls=1"
			}
			$scope.video = Popcorn.HTMLYouTubeVideoElement('#intro_video');
			$scope.player = Popcorn($scope.video)
			$scope.video.src = $scope.video_url
			$scope.player.on( "canplay", function(){
				$scope.player.play();
			});
			$scope.player.on('ended', function(){
				$scope.can_proceed = true;
				$interval(function(){
					$scope.remaining--;
					if($scope.remaining == 0){
						$scope.watchedIntro();
					}
				}, 1000, 5)
			})
		})
		
		$scope.watchedIntro = function(){
			var completion = $rootScope.current_user.completion_wizard
			completion['intro_watched'] = true;
			User.updateCompletionWizard(
				{id: $rootScope.current_user.id},
				{completion_wizard: completion}, 
				function(){
					console.log('SUCCEEDED')
					$rootScope.current_user.completion_wizard.intro_watched = true;
					$state.go('course_list');
				}, function(){
					console.log('failed')
				});
			}
	}]);