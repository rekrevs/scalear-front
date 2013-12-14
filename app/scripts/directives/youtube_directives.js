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
}]).directive('resizableVideo', ['$window', '$timeout',function($window, $timeout){
	return{
		restrict:'A',
		scope:{
			video_layer:'=videoLayer',
			quiz_layer:'=quizLayer',
			aspect_ratio:'=aspectRatio',
			fullscreen:'=active',
			resize:'=',
			max_width:'=maxWidth'
		},
		link: function($scope){

			angular.element($window).bind('resize',
				function(){
					if($scope.fullscreen){
						$scope.resize.big(); 
						$scope.$apply()
					}
				}
			)

			$scope.resize.small = function()
			{	
				var factor= $scope.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
				$scope.fullscreen = false

				angular.element(".sidebar").removeClass('sidebar').addClass('quiz_list')//.children().appendTo(".quiz_list");
				angular.element("body").css("overflow","auto");
				angular.element("body").css("position","");


				var video={
					"top":"",
					"left":"",
					"position":"",
					"width":'',
					"height":"",//(500*1.0/factor +30) +'px',
					"z-index": 0
				};

				var layer={		
					"top":"",
					"left":"",
					"position":"absolute",
					"width":"",
					"height":"",//(500*1.0/factor)+ 'px',
					"margin-left": "0px",
					"margin-top": "0px",
					"z-index":2
				}

				angular.extend($scope.video_layer, video)
				angular.extend($scope.quiz_layer, layer)
				
				$timeout(function(){$scope.$emit("updatePosition")})
				$scope.unregister_back_event()		
			}

			$scope.resize.big = function()
			{	
				var factor= $scope.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
				var win = angular.element($window)

				$scope.fullscreen = true
				angular.element(".quiz_list").removeClass('quiz_list').addClass('sidebar')//.children().appendTo(".sidebar");
				angular.element("body").css("overflow","hidden");
				angular.element("body").css("position","fixed")

				win.scrollTop("0px")

				var video={
					"top":0, 
					"left":0, 
					"position":"fixed",
					"width":win.width()-$scope.max_width,
					"height":win.height(),
					"z-index": 1030
				};

				var video_height = win.height() -30;
				var video_width = video_height*factor
				
				//var video_width = (win.height()-26)*factor
				//var video_heigt = (win.width()-400)*1.0/factor +26
				var layer={}
				if(video_width>win.width()-$scope.max_width){ // if width will get cut out.
					console.log("width cutt offff")
					video_height= (win.width()-$scope.max_width)*1.0/factor;
					var margin_top = (win.height() - (video_height+30))/2.0;
					layer={
						"position":"fixed",
						"top":0,
						"left":0,
						"width":win.width()-$scope.max_width,
						"height":video_height,
						"margin-top": margin_top+"px",
						"margin-left":"0px",
						"z-index": 1031
					}		
				}
				else{		
					var margin_left= ((win.width()-$scope.max_width) - video_width)/2.0;
					layer={
						"position":"fixed",
						"top":0,
						"left":0,
						"width":video_width,
						"height":video_height,
						"margin-left": margin_left+"px",
						"margin-top":"0px",
						"z-index": 1031
					}		
				 }
				angular.extend($scope.video_layer, video)
				angular.extend($scope.quiz_layer, layer)

			 	$timeout(function(){$scope.$emit("updatePosition")})

			 	$scope.unregister_back_event = $scope.$on("$locationChangeStart", function(event, next, current) {
			        event.preventDefault()
			        $scope.resize.small() 
			        $scope.$apply()
				});
			}
		}
	}
}])