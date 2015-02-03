'use strict';

angular.module('scalearAngularApp')
  .controller('StudentGettingStartedCtrl', ['$scope', '$location', '$anchorScroll','$rootScope','Page', 'UserSession', function ($scope, $location, $anchorScroll, $rootScope,Page, UserSession) {
   	Page.setTitle('help.getting_started')
  	$rootScope.subheader_message = "Getting Started"
	$scope.video_url = "https://www.youtube.com/watch?v=9u8U2NoXC7c?theme=light&controls=1"
  	$scope.video = Popcorn.HTMLYouTubeVideoElement('#intro_videoo');
	$scope.player = Popcorn($scope.video)
	$scope.video.src = $scope.video_url

    $scope.scrollTo = function (id) {
    	$location.hash(id);
    	$anchorScroll();
    }
 //    UserSession.getRole().then(function(result) {
	// 	$scope.role= result
	// 	if($scope.role == 2){
	// 	}

	// 	$scope.video = Popcorn.HTMLYouTubeVideoElement('#intro_videoo');
	// 	$scope.player = Popcorn($scope.video)
	// 	$scope.video.src = $scope.video_url
	// 	// $scope.player.on( "canplay", function(){
	// 	// 	$scope.player.play();
	// 	// });
	// })
  }]);
