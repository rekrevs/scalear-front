// (function (document, window) {
'use strict';

// function loadScript(url, callback) {
//         var script = document.createElement('script');
//         script.src = url;
//         script.onload = callback;
//         script.onerror = function () {
//             throw Error('Error loading "' + url + '"');
//         };

//         document.getElementsByTagName('head')[0].appendChild(script);
//     }

angular.module('scalearAngularApp')
	// .factory('popcornApiProxy',['$rootScope','$q',function($rootScope,$q){
	// 	var apiReady = $q.defer()
	// 	var src = navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i)? 'scripts/externals/':'http://popcornjs.org/code/dist/'
	// 	//loadScript(src+'popcorn-complete.min.js', function(){
	// 		//$rootScope.$apply(function () {
 //                apiReady.resolve();
            
	// 	return function (callback, quality) {
 //            apiReady.promise.then(function () {
 //                callback(quality)
 //            });
 //        };	
	// }])
	.directive("videoContainer",function(){
		return{
			transclude: true,
			replace:true,
			restrict: "E",
			template: '<div class="videoborder panel widescreen " style="padding:0; border:none; margin:0" ng-transclude></div>' //style="border:4px solid" 
		};
	})
	.directive('youtube',['$rootScope','$log','$timeout','$window', '$cookieStore', function($rootScope,$log,$timeout,$window, $cookieStore){
		return {
			transclude: true,
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
            template:"<div><div ng-transclude></div></div>",
			link: function(scope, element){

                scope.vq='hd720';
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
                    if(!scope.autoplay || scope.autoplay==undefined)
                        scope.autoplay=0; 
                    if(isiPad())
                    	scope.autoplay=1; 

                    //var matches = 
                    //var vimeo= scope.url.match(/vimeo/)  // improve this..
                    if(isYoutube(scope.url)){
                    	console.log("youtube")
                    	player_controls.youtube = true
                    	var video = Popcorn.HTMLYouTubeVideoElement('#'+scope.id)
                    	player = Popcorn(video,{});
                    	video.src = formatYoutubeURL(scope.url, scope.vq, scope.start_time)						
                        // player = Popcorn.smart( '#'+scope.id, "http://www.youtube.com/watch?v="+matches[1]+'&fs=0&showinfo=0&rel=0&autohide=0&vq='+vq+'&autoplay=1');
                    }
                    else if(isVimeo(scope.url)){
                    	console.log("vimeo")
                        player = Popcorn.smart( '#'+scope.id, scope.url+"?autoplay=true&controls=0&portrait=0&byline=0&title=0&fs=0",{ width: '100%', height:'100%', controls: 0});
                        player.controls(scope.controls);
                        player.autoplay(scope.autoplay);
                    }
                    else if(isMP4(scope.url)){
                    	console.log("mp4")
                        var video = Popcorn.HTMLVideoElement('#'+scope.id)//Popcorn.smart( '#'+scope.id, scope.url)//, scope.url,{ width: '100%', height:'100%', controls: 0});
                        player = Popcorn(video,{});
                        video.src = scope.url
                        player.video.className = "fit-inside"
                        if(isiPad() || scope.controls == "default")
                        	player.controls(true);
                        player.autoplay(false);
                    }
					$log.debug("loading!!!")
					$log.debug(scope.url);
					setupEvents()

					parent.focus()

					scope.timeout_promise = $timeout(function(){
						if(player_controls.readyState() == 0 && !(isiPad() && isMP4(scope.url)))
							scope.$emit('slow', isYoutube(scope.url))
					},15000)
				}

			   	var isiPad=function(){
			        var i = 0,
			            iOS = false,
			            iDevice = ['iPad', 'iPhone', 'iPod','Android'];

			        for ( ; i < iDevice.length ; i++ ) {
			            if( navigator.platform === iDevice[i] ){ iOS = true; break; }
			        }
			        return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) || iOS
			    }

				var formatYoutubeURL=function(url,vq,time){
					var short_url = isShortYoutube(url)
					var base_url, query
					if(short_url){
						base_url = 'http://www.youtube.com/watch'
						query = '&v='+short_url[1]
					}
					else{
						var splitted_url= url.split('?')
						base_url = splitted_url[0]
						query = '&'+splitted_url[1]	
					}
					return base_url+"?start="+time+"&vq="+vq+"&fs=0&modestbranding=0&showinfo=0&rel=0&autohide=0&autoplay="+scope.autoplay+"&controls&origin=http://www.youtube.com"+query;
				}

                scope.kill_popcorn = function(){
                    if(player){
                         Popcorn.destroy( player );
                     }
                    element.find('iframe').remove();
                    element.find('video').remove()
                    if(scope.slow_off)
                    	scope.slow_off()
                    if(scope.timeout_promise)
                    	$timeout.cancel(scope.timeout_promise)
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
					console.log("entering sekking ")
					if(time<0)
						time = 0
					if(time > player_controls.getDuration())
						time = player_controls.getDuration()
					if(player_controls.readyState() == 0 && !(scope.start_time || scope.start_time == 0)){
						// scope.readyState = player_controls.readyState
						// var unwatch = scope.$watch('readyState()',function(){
						// 	console.log("ready state=")
						// 	console.log(scope.readyState())
						// 	if (scope.readyState() == 4){
						// 		console.log("chanign time hopefully")
						// 		player.currentTime(time);
						// 		unwatch()
						// 		scope.readyState = null
						// 	}
						// })
						player.on("loadeddata", 
						function(){
							console.log("seek after load")
							player.currentTime(time);
						});
					}
					else{
						console.log("seeking now")
						player.currentTime(time);
					}
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
					return player_controls.getCueEvent()
				}
				player_controls.getCueEvent=function(){
					return player.getTrackEvent(player.getLastTrackEventId());
				}

				player_controls.replay=function(){	
					player_controls.pause()		
					player_controls.seek(0)
					player_controls.play()
				}

				player_controls.getSpeeds = function(){
          return player.media.getSpeeds();
				}

				player_controls.changeSpeed = function(value, youtube){
          if(youtube){
            if(player_controls.getSpeeds().indexOf(value) != -1){
              player.media.setSpeed(value)
            }
          }
          else{
            player.video.playbackRate = value
          }
				}


				var setupEvents=function(){
					player.on("loadeddata", 
						function(){
							console.log("Video data loaded and ready")
							if(isiPad())
								player.controls(false);
							if(player_events.onReady){
								player_events.onReady();
								scope.$apply();
							}
					});

					player.on('playing',
						function(){
							console.log("youtube playing")							
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

					player.on('canplay',function(){
						parent.focus()
						if(player_events.canPlay){
							player_events.canPlay();
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
					scope.slow_off =scope.$on('slow',function(ev,data){
						parent.focus()
						if(player_events.onSlow){
							player_events.onSlow(data);
							scope.$apply();
						}
					})
				}

				$rootScope.$on('refreshVideo',function(){
					player_controls.refreshVideo()
				})

                var isFinalUrl= function(url){
                    return url.match(/^(http|https):\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[\W\w]*$/);
                }

                var isYoutube= function(url){
            		var video_url = url || scope.url || ""
            		var match = video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)([^\s&]{11})/);
	                if(!match)
	                    return video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)?([^\s&]{11})/);
	                else return match
                    // return video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)?([^\s&]{11})/);
                }

                var isShortYoutube= function(url){
                	var video_url = url || scope.url || ""
                    return video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)?\.be\/([^\s&]{11})/);
                }

                var isVimeo=function(url){
                	var video_url = url || scope.url || ""
                	return video_url.match(/vimeo/)
                }

              	var isMP4=function(url){
              		var video_url = url || scope.url || ""
                	return video_url.match(/(.*mp4$)/)
                }

                player_controls.isYoutube = isYoutube
                player_controls.isMP4 = isMP4


				scope.$watch('url', function(){
                    if(scope.url && ((isYoutube(scope.url) &&  isFinalUrl(scope.url)) || isVimeo(scope.url) || isMP4(scope.url)) )
                        player_controls.refreshVideo()
				})

				var unwatch=scope.$watch('player', function(){
					if(scope.player){
						scope.player.controls=player_controls
						if(scope.player.events)
                        	player_events = scope.player.events
                        scope.$emit("player ready")
                        unwatch()
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
					else{
						$scope.resize.small();
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
				angular.element("body").css("overflow","");
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
					"position":"absolute",
					"margin-left": "0px",
					"margin-top": "0px",
					"z-index":1,
					"width": "100%",
					"height": '100%',
					"top": "0px",
					"left": "0px"
				}

				if($scope.container)
					angular.extend($scope.container, container)
				if($scope.video_layer)
					angular.extend($scope.video_layer, video)
				if($scope.quiz_layer)
					angular.extend($scope.quiz_layer, layer)
                // angular.extend($scope.ontop_layer, layer)
                // angular.extend($scope.ontop_layer, {"z-index":0})
				
				$timeout(function(){$scope.$emit("updatePosition")})
				if($scope.unregister_back_event)
					$scope.unregister_back_event()
				if($scope.unregister_state_event)	
					$scope.unregister_state_event()	
			}

			$scope.resize.big = function()
			{
                $rootScope.changeError = true;
				//var factor= $scope.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
				var factor=16.0/9.0
                var win = angular.element($window)

                var progressbar_height = 80

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
				video["height"]-=progressbar_height
				video["position"]=""


				var video_height = win.height()-progressbar_height;
				var video_width = video_height*factor
				
				//var video_width = (win.height()-26)*factor
				//var video_heigt = (win.width()-400)*1.0/factor +26
				var layer={}
				if(video_width>win.width()-$scope.max_width){ // if width will get cut out.
					$log.debug("width cutt offff")
					console.log("width cutt offff")
					video_height= (win.width()-$scope.max_width)*1.0/factor;
					var margin_top = ((win.height()-progressbar_height) - (video_height))/2.0; //+30

					layer={
						"position":"fixed",
						"top":0,
						"left":0,
						"width":win.width()-$scope.max_width,
						"height":video_height,
						"margin-top": margin_top+"px",
						"margin-left":"0px",
						// "z-index": 1531
					}		
				}
				else{		
					console.log("height cutt offff")
					console.log(win.width())
					console.log(video_width)
					console.log(((win.width()-$scope.max_width) - video_width)/2.0)
					// video_width = (win.height()-progressbar_height)*factor
					var margin_left= ((win.width()-$scope.max_width) - video_width)/2.0;
					layer={
						"position":"fixed",
						"top":0,
						"left":0,
						"width":video_width,
						"height":video_height,
						"margin-left": margin_left+"px",
						"margin-top":"0px",
						// "z-index": 1531
					}		
				 }

				if($scope.container)
					angular.extend($scope.container, container)
				if($scope.video_layer)
					angular.extend($scope.video_layer, video)
				if($scope.quiz_layer)
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
.directive('progressBar',['$rootScope','$log','$window', '$cookieStore','$timeout',function($rootScope,$log, $window, $cookieStore, $timeout){
    return {
    	transclude:true,
        restrict: 'E',
        replace:false,
        scope:{
            // view:'@',
            // active:'=',
            // play_btn:'&playBtn',
            player:'=',
            play_pause_class:'=playPauseClass',
            // updateProgress:'&',
            elapsed_width: '=elapsedWidth',
            current_time: '=currentTime',
            total_duration: '=totalDuration',
            seek: "&",
            // confused_areas: '=confusedAreas',
            // progressEvents: '=',
            timeline: '=',
            videoready: '=',
            blink : "="
            // lecture: '='
           // autoplay:'@'
        },
        templateUrl:"/views/progress_bar.html",
        link: function(scope, element, attrs){
            scope.mute_unmute_class="mute";
            scope.quality=false;
      		scope.chosen_quality='hd720';
      		scope.chosen_speed=1
          scope.setSpeed = function(val){
            console.log('setting youtube speed to '+val)
            scope.player.controls.changeSpeed(val, true)
            scope.chosen_speed = val;
            $cookieStore.put('youtube_speed', scope.chosen_speed)
          }
          scope.setSpeedMp4 = function(val){
            console.log('setting mp4 speed to '+val)
            scope.player.controls.changeSpeed(val, false)
            scope.chosen_speed = val;
            $cookieStore.put('mp4_speed', scope.chosen_speed)
          }
          scope.$watch('videoready', function(){
            if(scope.videoready == true){
              if(scope.player.controls.youtube){
                scope.speeds = scope.player.controls.getSpeeds();
                scope.chosen_speed = $cookieStore.get('youtube_speed') || 1;
                console.log('the chosen speed is '+scope.chosen_speed)
                scope.setSpeed(scope.chosen_speed)
              }
              else{
                scope.speeds = [{name:'0.8', value: 0.8},
                                {name:'1', value: 1},
                                {name:'1.2', value: 1.2},
                                {name:'1.5', value: 1.5},
                                {name:'1.8', value: 1.8}]
                scope.chosen_speed = $cookieStore.get('mp4_speed') || 1
                scope.setSpeedMp4(scope.chosen_speed)
              }
            }
          })

            scope.playBtn = function(){
                if(scope.player.controls.paused()){
			        scope.player.controls.play()
			        // scope.play_pause_class = "pause"
		      	}
		      	else{
			        scope.player.controls.pause()
			        // scope.play_pause_class = "play"
		      	}
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
                if(scope.volume){
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
                scope.volume=0.8;
            }

            scope.progress = function(event){
		        var element = angular.element('.progressBar');
		        var ratio = (event.pageX-element.offset().left)/element.outerWidth(); 
		        scope.seek()(scope.total_duration*ratio)
		        scrollToNearestEvent(scope.total_duration*ratio)
            }

          	scope.showQuality = function(){
          		scope.quality=!scope.quality
	      	}

      		scope.setQuality = function(quality){
	          var time = scope.player.controls.getTime()
	          scope.player.controls.changeQuality(quality, time);
	          scope.chosen_quality=quality;
	          scope.quality=false;
      		}
      		scope.scrollEvent = function(type, id){
      			scrollToItem(type, id)
      			addHighlight(type, id)
      		}

      		var scrollToItem=function(type, id){
      			$('.student_timeline').scrollToThis('#'+type+'_'+id, {offsetTop: 100, duration: 350});
      		}
      		var addHighlight = function(type, id){
      			$('#'+type+'_'+id).animate({'backgroundColor' : '#ffff99'},"fast")
      			$('#'+type+'_'+id).animate({'backgroundColor' : '#ffffff'},2000)
      		}

      		var scrollToNearestEvent=function(time){
      			console.log(time)
      			console.log(scope.timeline.getNearestEvent(time))
      			var nearest_item= scope.timeline.getNearestEvent(time)
      			if(Math.abs(nearest_item.time - time) <=30)
      				scrollToItem(nearest_item.type, nearest_item.data.id)
      		}

            shortcut.add("Space",function(){
            	scope.playBtn()				
			},{"disable_in_input" : true});

			shortcut.add("b",function(){
              var t=scope.player.controls.getTime();
              scope.player.controls.pause();
              scope.player.controls.seek(t-10)
              scope.player.controls.play();
              scope.$emit('video_back', t-10)
			},{"disable_in_input" : true});

		   	scope.$on('$destroy', function(){
	         	shortcut.remove("b");
          		shortcut.remove("Space");
	      	});

	      	scope.$on("blink_blink", function(){
	      		scope.blink = "blink_btn";
	      		scope.timeout_f = $timeout(function(){
	      			scope.blink = "";
				},2000)
	      	})
        }
    }
}])
// })(document, window);
