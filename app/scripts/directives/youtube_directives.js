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
            
		return function (callback, quality) {
            apiReady.promise.then(function () {
                callback(quality)
            });
        };	
	}])
	.directive("videoContainer",function(){
		return{
			transclude: true,
			replace:true,
			restrict: "E",
			template: '<div class="videoborder" style="padding:0" ng-transclude></div>' //style="border:4px solid" 
		};
	})
	.directive('youtube',['$rootScope','$log','$timeout','$window','popcornApiProxy',function($rootScope,$log,$timeout,$window, popcornApiProxy){
		return {
			restrict: 'E',
			replace:true,
			scope:{
				url:'=',
				ready:'&',
				id:'@',
				player:'=',
				autoplay:'@',
                controls: '@',

			},
            template:"<div></div>",
			link: function(scope, element){

                scope.vq;
                scope.start_time

                scope.$on('$destroy', function() {
                    scope.kill_popcorn();
                    scope.player={};
                    scope.id="";
                    scope.ready="";
                    scope.url="";
                });

				$log.debug("YOUTUBE " + scope.id)
				
				var player,
				player_controls={},
				player_events = {}

				var loadVideo = function(){
					scope.kill_popcorn()

                    if(!scope.controls || scope.controls==undefined)
                        scope.controls=0;                   

                    //var matches = 
                    //var vimeo= scope.url.match(/vimeo/)  // improve this..
                    if(isYoutube(scope.url)){
                    	console.log("youtube")
                    	var video = Popcorn.HTMLYouTubeVideoElement('#'+scope.id)
                    	player = Popcorn(video,{});
                    	video.src = formatYoutubeURL(scope.url, scope.vq, scope.start_time)
						$timeout(function(){
							if(player_controls.readyState() == 0)
								scope.$emit('slow')
						},15000)
                        // player = Popcorn.smart( '#'+scope.id, "http://www.youtube.com/watch?v="+matches[1]+'&fs=0&showinfo=0&rel=0&autohide=0&vq='+vq+'&autoplay=1');
                    }
                    else if(isVimeo(scope.url)){
                    	console.log("vimeo")
                        player = Popcorn.smart( '#'+scope.id, scope.url+"?autoplay=true&controls=0&portrait=0&byline=0&title=0&fs=0",{ width: '100%', height:'100%', controls: 0});
                        player.controls(scope.controls);
                        player.autoplay(true);
                    }
                    else if(isMP4(scope.url)){
                    	console.log("mp4")
                        var video = Popcorn.HTMLVideoElement('#'+scope.id)//Popcorn.smart( '#'+scope.id, scope.url)//, scope.url,{ width: '100%', height:'100%', controls: 0});
                        player = Popcorn(video,{});
                        video.src = scope.url
                        player.controls(scope.controls);
                        // player.autoplay(true);
                    }
					$log.debug("loading!!!")
					$log.debug(scope.url);
					setupEvents()

					parent.focus()
				}

				var formatYoutubeURL=function(url,vq,time){
					var short_url = isShortYoutube(url)
					var base_url, query
					if(short_url){
						base_url = 'http://www.youtube.com/watch'
						query = '&v='+short_url[1]
						console.log("adfgads")
						console.log(query)
					}
					else{
						var splitted_url= url.split('?')
						base_url = splitted_url[0]
						query = '&'+splitted_url[1]	
					}
					return base_url+"?start="+time+"&vq="+vq+"&fs=0&modestbranding=0&showinfo=0&rel=0&autohide=0&autoplay=0&controls&origin=https://www.youtube.com"+query;
				}

                scope.kill_popcorn = function(){
                    if(player)
                        player.destroy();
                    element.find('iframe').remove();
                    element.find('video').remove()
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

                player_controls.volume = function(val){
                    player.volume(val);
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

				player_controls.readyState=function(){
					return player.readyState()
				}

				player_controls.seek = function(time){
					if(time<0)
						time = 0
					if(time > player_controls.getDuration())
						time = player_controls.getDuration()
						console.log(time)
					player.currentTime(time);
					parent.focus()
				}

				player_controls.seek_and_pause=function(time){
					player_controls.seek(time)
					player.pause()
				}

				player_controls.changeQuality=function(quality, time){
					scope.vq = quality
					player_controls.setStartTime(time)
					player_controls.refreshVideo()
				}

				player_controls.setStartTime=function(time){
					scope.start_time = Math.round(time)
				}

				player_controls.refreshVideo = function(){
					$log.debug("refreshVideo!")
					scope.kill_popcorn()
					
					// //popcornApiProxy(loadVideo);
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

                // var is_final_url= function(url){
                //     return url.match(/^http:\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[\W\w]*$/);
                // }

                var isYoutube= function(url){
                	console.log(url)
                	console.log(scope.url)
            		var video_url = url || scope.url
                    return video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]{11})/);
                }

                var isShortYoutube= function(url){
                	var video_url = url || scope.url
                    return video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)?\.be\/([^\s&]{11})/);
                }

                var isVimeo=function(url){
                	var video_url = url || scope.url
                	return video_url.match(/vimeo/)
                }

              	var isMP4=function(url){
              		var video_url = url || scope.url
                	return video_url.match(/(.*mp4$)/)
                }

                player_controls.isYoutube = isYoutube
                player_controls.isMP4 = isMP4


				scope.$watch('url', function(){

                    if(scope.url && (isYoutube(scope.url) || isVimeo(scope.url) || isMP4(scope.url)) )
                    {

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
                    {
                        player_events = scope.player.events
                    }

				})



		    }
		};
}]).directive('resizableVideo', ['$window','$rootScope','$timeout','$log',function($window,$rootScope,$timeout, $log){
	return{
		restrict:'A',
		scope:{
			container:'=',
			quiz_layer:'=quizLayer',
			video_layer:'=videoLayer',
            // ontop_layer:'=ontopLayer',
			aspect_ratio:'=aspectRatio',
			fullscreen:'=active',
			resize:'=',
			max_width:'=maxWidth'
		},
		link: function($scope, element){
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


				var container={
					"top":"",
					"left":"",
					"position":"",
					"width":'',
					"height":"",//(500*1.0/factor +30) +'px',
					"z-index": 0
				};

				var video=angular.copy(container)
				// video["height"]-=40

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

				angular.extend($scope.container, container)
				angular.extend($scope.video_layer, video)
				angular.extend($scope.quiz_layer, layer)
                // angular.extend($scope.ontop_layer, layer)
                // angular.extend($scope.ontop_layer, {"z-index":0})
				
				$timeout(function(){$scope.$emit("updatePosition")})
				$scope.unregister_back_event()	
				$scope.unregister_state_event()	
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

				var container={
					"top":0, 
					"left":0, 
					"position":"fixed",
					"width":win.width()-$scope.max_width,
					"height":win.height(),
					"z-index": 1031
				};

				var video=angular.copy(container)
				video["height"]-=40
				video["position"]=""


				var video_height = win.height()-40;
				var video_width = video_height*factor
				
				//var video_width = (win.height()-26)*factor
				//var video_heigt = (win.width()-400)*1.0/factor +26
				var layer={}
				if(video_width>win.width()-$scope.max_width){ // if width will get cut out.
					$log.debug("width cutt offff")
					video_height= (win.width()-$scope.max_width)*1.0/factor;
					var margin_top = ((win.height()-40) - (video_height))/2.0; //+30

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
				angular.extend($scope.container, container)
				angular.extend($scope.video_layer, video)
				angular.extend($scope.quiz_layer, layer)
                // angular.extend($scope.ontop_layer, layer)
                // angular.extend($scope.ontop_layer,{"z-index":1031});

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

			// $scope.lecturesFullScreen = function(){
			// 	var win = angular.elemen($window)
			// 	var video_layer = angular.element('#main-video-container')
			// 	var controls_bar = angular.element('#controls-bar')
			// 	var progress_bar = angular.element('player_progress_bar')
			// 	var factor = 16/9

			// 	controls_bar.css('width', win.width())
			// 	controls_bar.css('position', 'fixed')
			// 	controls_bar.css('bottom', '0')
			// 	controls_bar.css('left', '0')
			// 	controls_bar.css('right', '0')
			// 	controls_bar.css('z-index', '1531')

			// 	progress_bar.css('width', win.width())
			// 	progress_bar.css('position', 'fixed')
			// 	progress_bar.css('bottom', controls_bar.height())
			// 	progress_bar.css('right', '0')
			// 	progress_bar.css('left', '0')
			// 	progress_bar.css('z-index', '1531')

			// 	video_layer.css('height', win.height()-progress_bar.height()-controls_bar.height());
			// 	video_layer.css('width', video_layer*factor);
			// 	video_layer.css('z-index', '1531')				

			// }
		}
	}
}])
.directive('progressBar',['$rootScope','$log','$window',function($rootScope,$log, $window){
    return {
        restrict: 'E',
        replace:true,
        scope:{
            view:'@',
            active:'=',
            play_btn:'&playBtn',
            player:'=',
            play_pause_class:'=playPauseClass',
            updateProgress:'&updateProgress',
            elapsed_width: '=elapsedWidth',
            current_time: '=currentTime',
            total_duration: '=totalDuration',
            confused_areas: '=confusedAreas',
            progressEvents: '=',
            timeline: '=',
            lecture: '='
           // autoplay:'@'
        },
        templateUrl:"/views/progress_bar.html",
        link: function(scope, element, attrs){
            scope.mute_unmute_class="mute";

            $rootScope.$on('updatePosition',function(){
                setButtonsLocation()
            })

            scope.playBtn = function(){
                scope.play_btn();
            }

            scope.mute_btn = function(type)
            {
                if(type=="mute")
                    scope.mute();
                else
                    scope.unmute();
            }

            scope.$watch("volume",function()
            {
                if(scope.volume)
                {
                    scope.player.controls.volume(scope.volume);
                    if(scope.volume!=0)
                        scope.mute_unmute_class="mute";
                    else
                        scope.mute_unmute_class="unmute";
                }
            });

            scope.mute= function()
            {
                scope.player.controls.mute();
                scope.mute_unmute_class="unmute";
                scope.volume=0;
            }

            scope.unmute = function()
            {
                scope.player.controls.unmute();
                scope.mute_unmute_class="mute";
                scope.volume=0.5;
            }

            scope.progress = function(event){
                scope.updateProgress({$event:event});
            }

            var setButtonsLocation=function(){
                // if(scope.active){
                //     scope.pHeight=angular.element($window).height();
                //     //element.css("z-index",1500);
                // }
                // else{
                //     if(scope.view=="student")
                //     {scope.pHeight=490;
                //     }
                //     else{
                //         scope.pHeight=320;
                //     }
                //     //element.css("z-index",1000);
                // }

                // if(scope.view=="student")
                //     element.css("top", scope.pHeight-30+"px");
                // else
                //     element.css("top", scope.pHeight-30+"px");
                // //element.css("left", scope.pWidth-350+"px");
            }
            // setButtonsLocation();
        }
    }
}])
})(document, window);
