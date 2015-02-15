'use strict';

angular.module('scalearAngularApp')
	.controller('UsersConfirmedCtrl', ['$scope', '$rootScope', 'User', 'UserSession', '$state', '$interval', 'Page','scalear_api','$translate', function ($scope, $rootScope, User, UserSession, $state, $interval, Page, scalear_api, $translate) {
		$scope.can_proceed = false 
		$scope.remaining = 5;
		$scope.player={}
	    $scope.player.controls={}
	    $scope.player.events={}
		Page.setTitle('Welcome to ScalableLearning');
		$rootScope.subheader_message = $translate("intro.title")
		UserSession.getRole().then(function(result) {
			$scope.role= result
			if($scope.role == 2){
				$scope.intro_url = scalear_api.student_welcom_video
			}
			else{
				$scope.intro_url = scalear_api.teacher_welcome_video
			}
			// $scope.video = Popcorn.HTMLYouTubeVideoElement('#intro_video');
			// $scope.player = Popcorn($scope.video)
			// $scope.video.src = $scope.video_url
			// $scope.player.on( "canplay", function(){
			// 	$scope.player.play();
			// });
			// $scope.player.on('ended', function(){
			$scope.player.events.onEnd = function() {
				$scope.can_proceed = true;
				$interval(function(){
					$scope.remaining--;
					if($scope.remaining == 0){
						$scope.watchedIntro();
					}
				}, 1000, 5)
			}
		})
		
		$scope.watchedIntro = function(){
			var completion = {}
			completion['intro_watched'] = true;
			User.updateCompletionWizard(
				{id: $rootScope.current_user.id},
				{completion_wizard: completion}, 
				function(){
					console.log('SUCCEEDED')
					$rootScope.current_user.completion_wizard = {}
					$rootScope.current_user.completion_wizard.intro_watched = true;
					$state.go('course_list');
				}, function(){
					console.log('failed')
				});
			}
	}]);