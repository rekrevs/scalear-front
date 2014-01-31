'use strict';

angular.module('scalearAngularApp')
	.directive('youtube',['$rootScope','$log',function($rootScope,$log){
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
            template:"<div></div>",
			link: function(scope, element){

				$log.debug("YOUTUBE " + scope.id)
				$log.debug(scope.controls);
				
				var player

				var player_controls={}
				var player_events = {}


				var loadVideo = function(){
					if(player)
						Popcorn.destroy(player)
                    var matches = getVideoId(scope.url)
                    if(matches) //youtube
                    {
                        player = Popcorn.smart( '#'+scope.id, "http://www.youtube.com/watch?v="+matches[1]+'&fs=0&showinfo=0&rel=0&autohide=1&vq=hd720&autoplay=1',{ width: 500, controls: 0});
                    }
                    else{
                        player = Popcorn.smart( '#'+scope.id, scope.url,{ width: '100%', height:'100%', controls: 0});
                        //player.controls(0);

//                        element.append('<div id="video-controls">' +
//                            '<button type="button" id="play-pause" class="btn" style="margin-right:2%; width:10%">Play</button>' +
//                            '<input  type="range" id="seek-bar" value="0" style="margin-right:2%;width:60%">' +
//                            '<button type="button" id="mute" class="btn" style="margin-right:2%;width:10%">Mute</button>' +
//                            '<input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1" style="width:10%">' +
//                            '</div>');
                    }
                   // console.log(player);
                   // console.log(player.video.videoWidth);
                   // player.video.videoWidth=500;
					$log.debug("loading!!!")
					$log.debug(scope.url);
					setupEvents()
					parent.focus()
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
                    console.log("time in seek isssss "+time);
					player.currentTime(time);
                    console.log(player.currentTime());
					//player_controls.play();
					parent.focus()
				}

				player_controls.seek_and_pause=function(time){
					player_controls.seek(time)
					player.pause()
				}

				player_controls.refreshVideo = function(){
					$log.debug("refreshVideo!")
                    console.log("in refresh");
					element.find('iframe').remove();
                    element.find('video').remove();
			  		loadVideo();
				}

				player_controls.hideControls=function(){
					player.controls( false ); 
				}

				player_controls.cue=function(time, callback){
					player.cue(time, callback)
				}

				player_controls.replay=function(){					
					player_controls.seek(0)
					player_controls.play()
				}

				var setupEvents=function(){
					player.on("loadeddata", 
						function(){
							//player_controls.replay()
							$log.debug("Video data loaded")	

							if(player_events.onReady){
								player_events.onReady();
								scope.$apply();
							}
					});

					player.on('play',
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
                                console.log("in pause event");
								player_events.onPause();
								scope.$apply();
							}
					});

                    player.on('timeupdate',
                        function(){
                            parent.focus()

                            if(player_events.timeUpdate){
                                player_events.timeUpdate();
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
				}

				$rootScope.$on('refreshVideo',function(){
					player_controls.refreshVideo()
				})

                var is_final_url= function(url){
                    return url.match(/^http:\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[&controls=0]*$/);
                }

                var getVideoId= function(url){
                    return url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]{11})/);
                }

				scope.$watch('url', function(){

                    if(scope.url)
                    {
                        console.log("in url watch")
                      //  var matches = is_final_url(scope.url)
                        // if(matches)
                         //{
                            player_controls.refreshVideo();
                         //}

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
            ontop_layer:'=ontopLayer',
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
                angular.extend($scope.ontop_layer, layer)
                angular.extend($scope.ontop_layer, {"z-index":0})
				
				$timeout(function(){$scope.$emit("updatePosition")})
				$scope.unregister_back_event()		
			}

			$scope.resize.big = function()
			{
                $rootScope.changeError = true;
				//var factor= $scope.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
				var factor=16.0/9.0
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

				var video_height = win.height();// -30;
				var video_width = video_height*factor
				
				//var video_width = (win.height()-26)*factor
				//var video_heigt = (win.width()-400)*1.0/factor +26
				var layer={}
				if(video_width>win.width()-$scope.max_width){ // if width will get cut out.
					$log.debug("width cutt offff")
					video_height= (win.width()-$scope.max_width)*1.0/factor;
					var margin_top = (win.height() - (video_height))/2.0; //+30
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
                angular.extend($scope.ontop_layer, layer)
                angular.extend($scope.ontop_layer,{"z-index":1031});

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
.directive('progressBar',['$rootScope','$log',function($rootScope,$log){
    return {
        restrict: 'E',
        replace:true,
//        scope:{
//            url:'=',
//            ready:'&',
//            id:'@',
//            player:'=',
//            autoplay:'@'
//        },
        templateUrl:"/views/progress_bar.html",
        link: function(scope, element){

        }
    }
}]);