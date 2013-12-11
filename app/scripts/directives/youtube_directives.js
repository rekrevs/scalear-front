'use strict';

angular.module('scalearAngularApp')
	.directive('youtube',['$rootScope',function($rootScope){
		return {
			restrict: 'E',
			replace:true, 
			scope:{
				url:'=',
				ready:'&',
				id:'@',
				player:'='
			},
			link: function(scope, element){

				console.debug("YOUTUBE " + scope.id)
				console.log(scope.controls);
				
				var player

				var player_controls={}
				var player_events = {}


				var loadVideo = function(){
					if(player)
						Popcorn.destroy(player)
					player = Popcorn.youtube( '#'+scope.id, scope.url+"&fs=0&html5=True&showinfo=0&rel=0&autoplay=1&autohide=0" ,{ width: 500, controls: 0});
					console.log("loading!!!")
					console.log(scope.url);
					setupEvents()

				}
			
				player_controls.play=function(){
					player.play();
				}

				player_controls.pause = function(){
					player.pause();
				}

				player_controls.mute = function(){
					player.mute();
				}

				player_controls.unmute = function(){
					player.unmute();
				}
				
				player_controls.paused = function(){
					return player.paused();
				}
				
				player_controls.getTime=function(){
					return player.currentTime()
				}

				player_controls.getDuration=function(){
					return player.duration()
				}

				player_controls.seek = function(time){
					if(time<0)
						time = 0
					if(time > player_controls.getDuration())
						time = player_controls.getDuration()
					player.currentTime(time);
				}

				player_controls.seek_and_pause=function(time){
					player_controls.seek(time)
					player.pause()
				}

				player_controls.refreshVideo = function(){
					console.log("refreshVideo!")
					element.find('iframe').remove();
			  		loadVideo();
				}

				player_controls.hideControls=function(){
					player.controls( false ); 
				}

				player_controls.cue=function(time, callback){
					player.cue(time, callback)
				}

				var setupEvents=function(){
					player.on("loadeddata", 
						function(){
							console.debug("Video data loaded")
							if(player_events.onReady){
								player_events.onReady();
								scope.$apply();
							}
					});

					player.on('play',
						function(){
							if(player_events.onPlay){
								player_events.onPlay();
								scope.$apply();
							}
					});

					player.on('pause',
						function(){
							if(player_events.onPause){
								player_events.onPause();
								scope.$apply();
							}
					});
				}

				$rootScope.$on('refreshVideo',function(){
					player_controls.refreshVideo()
				})

				scope.$watch('url', function(){
					if(scope.url)
						player_controls.refreshVideo();
				})
				scope.$watch('player', function(){
					if(scope.player){
						scope.player.controls=player_controls
					}
					if(scope.player && scope.player.events)
						player_events = scope.player.events
				})

		    }
		};
}])