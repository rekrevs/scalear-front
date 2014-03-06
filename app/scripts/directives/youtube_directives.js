(function (document, window) {
'use strict';

function loadScript(url, callback) {
        var script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        script.onerror = function () {
            throw Error('Error loading "' + url + '"');
        };

        document.getElementsByTagName('head')[0].appendChild(script);
    }

angular.module('scalearAngularApp')
	.factory('popcornApiProxy',['$rootScope','$q',function($rootScope,$q){
		var apiReady = $q.defer()
		var src = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i)? 'scripts/externals/':'http://popcornjs.org/code/dist/'
		//loadScript(src+'popcorn-complete.min.js', function(){
			//$rootScope.$apply(function () {
                apiReady.resolve();
            ///});
		//})
		return function (callback) {
            apiReady.promise.then(function () {
                callback()
            });
        };	
	}])
	.directive('youtube',['$rootScope','$log','$timeout','popcornApiProxy',function($rootScope,$log,$timeout,popcornApiProxy){
		return {
			restrict: 'E',
			replace:true, 
			scope:{
				url:'=',
				ready:'&',
				id:'@',
				player:'=',
				autoplay:'@'
			},
			link: function(scope, element){

				$log.debug("YOUTUBE " + scope.id)
				$log.debug(scope.controls);
				
				var player,
				player_controls={},
				player_events = {}

                scope.$on('$destroy', function() {
                    //alert("In destroy of:" + scope);
                    scope.kill_popcorn();
                    scope.player={};
                    scope.id="";
                    scope.ready="";
                    scope.url="";
                });


                var loadVideo = function(){
					if(player)
						Popcorn.destroy(player)
					var media = Popcorn.HTMLYouTubeVideoElement('#'+scope.id),
					url= scope.url.split('?'),
					base_url = url[0],
					query = '&'+url[1]
					media.src = base_url+"?fs=0&modestbranding=0&showinfo=0&rel=0&autohide=0&autoplay=0&controls=2&origin=https://www.youtube.com"+query;
			        player = Popcorn(media,{});
			        setupEvents()
					$log.debug("loading!!!")
					$log.debug(scope.url);
					
					$timeout(function(){
						if(player_controls.readyState() == 0)
							scope.$emit('slow')
					},15000)
					parent.focus()
				}

                scope.kill_popcorn = function(){
                    if(player)
                    {
                        player.destroy();
                    }
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

				player_controls.volume= function(value){
					player.volume(value);
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

				player_controls.readyState=function(){
					return player.readyState()
				}

				player_controls.seek = function(time){
					if(time<0)
						time = 0
					if(time > player_controls.getDuration())
						time = player_controls.getDuration()
					player.currentTime(time);
					parent.focus()
				}

				player_controls.seek_and_pause=function(time){
					player_controls.seek(time)
					player.pause()
				}

				player_controls.refreshVideo = function(){
					$log.debug("refreshVideo!")
					element.find('iframe').remove();
					//popcornApiProxy(loadVideo);
					loadVideo()
				}

				player_controls.hideControls=function(){
					player.controls( false ); 
				}

				player_controls.cue=function(time, callback){
					player.cue(time, callback)
				}

				player_controls.replay=function(){	
					player_controls.pause()		
					player_controls.seek(0)
					player_controls.play()
				}

				var setupEvents=function(){
					player.on("loadeddata", 
						function(){
							$log.debug("Video data loaded")	
							if(player_events.onReady){
								player_events.onReady();
								scope.$apply();
							}
					});

					player.on('playing',
						function(){
							parent.focus()
							if(player_events.onPlay){								
								player_events.onPlay();
								scope.$apply();
							}
					});

					player.on('pause',
						function(){
							parent.focus()

							if(player_events.onPause){								
								player_events.onPause();
								scope.$apply();
							}
					});

					player.on('loadedmetadata',function(){
						parent.focus()
						if(player_events.onMeta){
							player_events.onMeta();
							scope.$apply();
						}
					})
					player.on('canplaythrough',function(){
						parent.focus()
						if(player_events.canPlay){
							player_events.canPlay();
							scope.$apply();
						}
					})

					player.on('seeked',function(){
						parent.focus()
						if(player_events.seeked){
							player_events.seeked();
							scope.$apply();
						}
					})

					player.on('timeupdate',function(){
						parent.focus()
						if(player_events.timeUpdate){
							player_events.timeUpdate();
							scope.$apply();
						}
					})

					player.on('waiting',function(){
						parent.focus()
						if(player_events.waiting){
							player_events.waiting();
							scope.$apply();
						}
					})

					player.on('ended',function(){
						parent.focus()
						if(player_events.onEnd){
							player_events.onEnd();
							scope.$apply();
						}
					})
					scope.$on('slow',function(){
						parent.focus()
						if(player_events.onSlow){
							player_events.onSlow();
							scope.$apply();
						}
					})
				}

				$rootScope.$on('refreshVideo',function(){
					player_controls.refreshVideo()
				})

                var is_final_url= function(url){
                    return url.match(/^http:\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[\W\w]*$/);
                }

				scope.$watch('url', function(){
                    if(scope.url)
                    {
                        var matches = is_final_url(scope.url)
                         if(matches)
                         {
                            player_controls.refreshVideo();
                        }

                    }
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
}]).directive('resizableVideo', ['$window','$rootScope','$timeout','$log',function($window,$rootScope,$timeout, $log){
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
                $rootScope.changeError = false;
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
				$scope.unregister_state_event()	
			}

			$scope.resize.big = function()
			{
                $rootScope.changeError = true;
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
					"z-index": 1031
				};

				var video_height = win.height() - 35;
				var video_width = video_height*factor
				
				//var video_width = (win.height()-26)*factor
				//var video_heigt = (win.width()-400)*1.0/factor +26
				var layer={}
				if(video_width>win.width()-$scope.max_width){ // if width will get cut out.
					$log.debug("width cutt offff")
					video_height= (win.width()-$scope.max_width)*1.0/factor;
					var margin_top = (win.height() - (video_height+35))/2.0;
					layer={
						"position":"fixed",
						"top":0,
						"left":0,
						"width":win.width()-$scope.max_width,
						"height":video_height,
						"margin-top": margin_top+"px",
						"margin-left":"0px",
						"z-index": 1531
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
						"z-index": 1531
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
				$scope.unregister_state_event = $scope.$on("$stateChangeStart", function(event, next, current) {
			        $scope.resize.small() 
			        $scope.$apply()
				});
			}
		}
	}
}])

})(document, window);