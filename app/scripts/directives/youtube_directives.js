'use strict';

angular.module('scalearAngularApp')

.directive("videoContainer",function(){
	return{
		transclude: true,
		replace:true,
		restrict: "E",
		template: '<div class="videoborder panel widescreen " style="padding:0; border:none; margin:0" ng-transclude></div>' //style="border:4px solid" 
	};
}).directive('youtube',['$rootScope','$log','$timeout','$window', '$cookieStore','$interval', function($rootScope,$log,$timeout,$window, $cookieStore, $interval){
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
            controls: '@'
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
			
			var player,
			player_controls={},
			player_events = {}

			var loadVideo = function(){
				scope.kill_popcorn()
				player_controls.youtube = false
                if(!scope.controls || scope.controls==undefined)
                    scope.controls=0;   
                if(!scope.autoplay || scope.autoplay==undefined)
                    scope.autoplay=0; 
                if($rootScope.is_mobile)
                	scope.autoplay=1; 

                if(isYoutube(scope.url)){
                	$log.debug("youtube")
                	player_controls.youtube = true
                	var video = Popcorn.HTMLYouTubeVideoElement('#'+scope.id)
                	player = Popcorn(video);
                	video.src = formatYoutubeURL(scope.url, scope.vq, scope.start_time, scope.autoplay, scope.controls)
                	$log.debug(video.src)
                }
                else if(isVimeo(scope.url)){
                	$log.debug("vimeo")
                    player = Popcorn.smart( '#'+scope.id, scope.url+"?autoplay=true&controls=0&portrait=0&byline=0&title=0&fs=0",{ width: '100%', height:'100%', controls: 0});
                    player.controls(scope.controls);
                    player.autoplay(scope.autoplay);
                }
                else if(isMP4(scope.url)){
                	$log.debug("mp4")
                    var video = Popcorn.HTMLVideoElement('#'+scope.id)//Popcorn.smart( '#'+scope.id, scope.url)//, scope.url,{ width: '100%', height:'100%', controls: 0});
                    player = Popcorn(video,{});
                    video.src = scope.url
                    player.video.className = "fit-inside"
                    if($rootScope.is_mobile || scope.controls == "default")
                    	player.controls(true);
                    player.autoplay(false);
                }
                if(scope.player)
                	scope.player.element= player
				setupEvents()
				parent.focus()
				scope.timeout_promise = $interval(function(){
					if(player_controls.readyState() == 0 && !$rootScope.is_mobile)
						scope.$emit('slow', isYoutube(scope.url))
				},15000, 1)
			}

			var formatYoutubeURL=function(url,vq,time, autoplay, controls){
				var short_url = isShortYoutube(url)
				var base_url, query
				if(short_url){
					base_url = 'https://www.youtube.com/watch'
					query = '&v='+short_url[1]
				}
				else{
					var splitted_url= url.split('?')
					base_url = splitted_url[0]
					query = '&'+splitted_url[1]	
				}//
				return base_url+"?start="+time+"&vq="+vq+"&modestbranding=0&showinfo=0&rel=0&autohide=0&autoplay="+autoplay+"&controls="+controls+"&origin=https://www.youtube.com&theme=light"+query;
			}

            scope.kill_popcorn = function(){
                if(player){
                     Popcorn.destroy( player );
                     if(player.media.destroy)
                     	player.media.destroy()
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
				$log.debug("entering sekking")
				if(time<0)
					time = 0
				if(time > player_controls.getDuration())
					time = player_controls.getDuration()
				if(player_controls.readyState() == 0 && !(scope.start_time || scope.start_time == 0)){
					player.on("loadeddata", 
					function(){
						$log.debug("seek after load")
						player.currentTime(time);
					});
				}
				else{
					$log.debug("seeking now")
					player.currentTime(time);
				}
				parent.focus()

			}

			player_controls.seek_and_pause=function(time){
				player_controls.seek(time)
				player.pause()
			}

			player_controls.setStartTime=function(time){
				scope.start_time = Math.round(time)
			}

			player_controls.refreshVideo = function(){
				$log.debug("refreshVideo!")
				scope.kill_popcorn()				
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

			player_controls.changeSpeed = function(speed){
				if(scope.player.controls.youtube){
					if(player_controls.getSpeeds().indexOf(speed) != -1){
						player.media.setSpeed(speed)
					}
				}
				else{
					player.video.playbackRate = speed
				}
			}

			player_controls.getAvailableQuality = function(){
      			return player.media.getAvailableQuality();
			}

			player_controls.getQuality = function(){
      			return player.media.getQuality();
			}

			player_controls.changeQuality = function(quality){
				if(player_controls.getAvailableQuality().indexOf(quality) != -1 && player_controls.getQuality() != quality){
					var paused = player_controls.paused()
					player.media.setQuality(quality)
					if(paused)
						player_controls.pause()
				}
			}

			var setupEvents=function(){
				player.on("loadeddata", 
					function(){
						$log.debug("Video data loaded and ready")
						if($rootScope.is_mobile)
							player.controls(false);
						if(player_events.onReady){
							player_events.onReady();
							scope.$apply();
						}
				});

				player.on('playing',
					function(){
						$log.debug("youtube playing")							
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
						// scope.$apply();
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
                    scope.player.element= player
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
			aspect_ratio:'=aspectRatio',
			fullscreen:'=active',
			resize:'=',
			max_width:'=maxWidth'
		},
		link: function($scope, element){
			$scope.resize.small = function(){
				$scope.fullscreen = false

				angular.element("body").css("overflow","");
				angular.element("body").css("position","");


				var container={
					"top":"",
					"left":"",
					"position":"",
					"width":'',
					"height":"",
					"z-index": 0
				};

				var video=angular.copy(container)

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
				if($scope.unregister_back_event)
					$scope.unregister_back_event()
				if($scope.unregister_state_event)	
					$scope.unregister_state_event()	
			}

			$scope.resize.big = function(){
				$log.debug("resizing big")
				var factor= $scope.aspect_ratio=="widescreen"? 16.0/9.0 : 4.0/3.0;
	            var win = angular.element($window) 
				$scope.fullscreen = true
				angular.element("body").css("overflow","hidden");
				angular.element("body").css("position","fixed")

				if($rootScope.is_mobile){
					var progressbar_height = 70
					var window_height= win.height()
					var window_width = win.width()
				}            	
	            else{
					var progressbar_height = 80
					var window_height= screen.height
					var window_width = screen.width
	            }

				win.scrollTop("0px")

				var container={
					"top":0, 
					"left":0, 
					"position":"fixed",
					"width":window_width-$scope.max_width,
					"height":window_height,
					"z-index": 1031
				};

				var video=angular.copy(container)
				video["height"]-=progressbar_height
				video["width"]-="auto"
				video["position"]=""


				var video_height = window_height-progressbar_height;
				var video_width = video_height*factor
				
				var layer={}
				if(video_width>window_width-$scope.max_width){ // if width will get cut out.
					$log.debug("width cutt offff")
					video_height= (window_width-$scope.max_width)*1.0/factor;
					var margin_top = ((window_height-progressbar_height) - (video_height))/2.0; //+30

					layer={
						"position":"fixed",
						"top":0,
						"left":0,
						"width":window_width-$scope.max_width,
						"height":video_height,
						"margin-top": margin_top+"px",
						"margin-left":"0px"
					}		
				}
				else{		
					$log.debug("height cutt offff")
					$log.debug(window_width)
					$log.debug(video_width)
					$log.debug(((window_width-$scope.max_width) - video_width)/2.0)
					var margin_left= ((window_width-$scope.max_width) - video_width)/2.0;
					if($rootScope.is_mobile){
						margin_left=0
						video_width="100%"
					}
					layer={
						"position":"fixed",
						"top":0,
						"left":0,
						"width":video_width,
						"height":video_height,
						"margin-left":  margin_left+"px",
						"margin-top":"0px"
					}		
				 }
				if($scope.container)
					angular.extend($scope.container, container)
				if($scope.video_layer)
					angular.extend($scope.video_layer, video)
				if($scope.quiz_layer)
					angular.extend($scope.quiz_layer, layer)
			}
		}
	}
}]).directive('progressBar',['$rootScope','$log','$window', '$cookieStore','$timeout',function($rootScope,$log, $window, $cookieStore, $timeout){
	return {
		transclude:true,
	    restrict: 'E',
	    replace:false,
	    scope:{
	        player:'=',
	        seek: "&",
	        timeline: '='
	    },
	    templateUrl:"/views/progress_bar.html",
	    link: function(scope, element, attrs){
	    	var player = scope.player.element
			var progress_bar= angular.element('.progressBar');
			var playhead= document.getElementsByClassName("playhead")[0]
			var elapsed_bar = document.getElementsByClassName("elapsed")[0]
			var onplayhead = false;
	    	scope.current_time=0
	    	scope.volume_class="mute";
	        scope.quality=false;
	  		scope.chosen_quality='hd720';
	  		scope.chosen_speed=1
	  		scope.is_mobile = $rootScope.is_mobile
	  		$timeout(function(){
	  			scope.duration = scope.player.controls.getDuration() -1;	
	  		})
			scope.play_class = scope.is_mobile? "pause":"play";
	      	
	   		scope.quality_names ={
	   			"auto":"Auto",
	   			"tiny":"144p",
	   			"small":"240p",
	   			"medium":"360p",
	   			"large":"480p",
	   			"hd720":"720p (HD)",
	   			"hd1080":"1080p (HD)",
	   			"highres":"High"
			}	      	

			scope.setSpeed = function(speed){
		        $log.debug('setting youtube speed to '+speed)
		        scope.player.controls.changeSpeed(speed)
		        scope.chosen_speed = speed;
	        	$cookieStore.put(scope.player.controls.youtube? 'youtube_speed': 'mp4_speed', scope.chosen_speed)
			}

			scope.showPlayhead=function(event) {
				if(scope.playhead_timeout)
					$timeout.cancel(scope.playhead_timeout)
				scope.playhead_class="playhead_big"
				scope.$apply()
			}

			scope.hidePlayhead=function(event) {
				if(!onplayhead){
					scope.playhead_timeout = $timeout(function(){
						scope.playhead_class=""
						scope.playhead_timeout= null
						scope.$apply()
					},1000)
				}
			}
			
			scope.playHeadMouseDown=function(event) {
				onplayhead = true;
				scope.showPlayhead()
				window.addEventListener('mousemove', scope.moveplayhead, true);
				window.addEventListener('mouseup', scope.playHeadMouseUp, false);

				window.addEventListener('touchmove', scope.moveplayhead, true);
				window.addEventListener('touchend', scope.playHeadMouseUp, false);

				scope.$apply()
			}

			scope.playHeadMouseUp=function(event){
				if (onplayhead == true) {
					onplayhead = false;
					scope.hidePlayhead()
					window.removeEventListener('mousemove', scope.moveplayhead, true);
					window.removeEventListener('touchmove', scope.moveplayhead, true);

					window.removeEventListener('mouseup', scope.moveplayhead, true);
					window.removeEventListener('touchend', scope.moveplayhead, true);
					scope.progressSeek(event)
				}
				scope.$apply()
			}
			
			scope.moveplayhead=function(event) {
		        var ratio= (event.pageX-progress_bar.offset().left)/progress_bar.outerWidth()
		        var position = ratio*100 
				if (position >= 0 && position <= 100){
					scope.elapsed_head = position>99.4? 99.4 : position
					scope.elapsed_width= position+0.45
					scope.current_time = scope.duration* ratio
				}
				if (position < 0){
					scope.elapsed_head = 0;
					scope.elapsed_width= 0
					scope.current_time = 0
				}
				if (position > 100){
					scope.elapsed_head = 99.4;
					scope.elapsed_width= 100
					scope.current_time = scope.duration
				}
				scope.$apply()
			}

			scope.play=function(){
				if (scope.player.controls.paused()) {
					scope.player.controls.play()
					scope.play_class = "pause";
				} else {
					scope.player.controls.pause()
					scope.play_class = "play";
				}
			}

			elapsed_bar.addEventListener('mouseenter', scope.showPlayhead, false);
			elapsed_bar.addEventListener('mouseleave', scope.hidePlayhead, false);

			playhead.addEventListener('mousedown', scope.playHeadMouseDown, false);
			playhead.addEventListener('touchstart', scope.playHeadMouseDown, false);

			player.on('timeupdate', function(){
				if (onplayhead == false) {
					scope.current_time = player.currentTime()
					scope.elapsed_width = ((scope.current_time/scope.duration)*100)
			        scope.elapsed_head = scope.elapsed_width>0.5? scope.elapsed_width-0.45 : scope.elapsed_width - 0.2
			        scope.elapsed_head = scope.elapsed_head>99.4? 99.4 : scope.elapsed_head
			    }
				scope.$apply()
		    })

		    player.on('ended',function(){
		    	//for some reason youtube requires clicking the
		    	//play button twice to play after video end
		    	//simulating first click on play
		    	scope.player.controls.seek(0)
		        $timeout(function(){
		        	scope.player.controls.play();
		            scope.player.controls.pause();
		            scope.play_class = "play";
		        },1000)
		    	
		    	scope.$apply()
		    })

		    player.on('pause',function(){
		    	scope.play_class = "play";
		    	scope.$apply()
		    })

		    // player.on('playing',function(){
		    // 	scope.play_class = "pause";
		    // 	scope.$apply()
		    // })

	        scope.muteToggle = function(){
	        	scope.volume_class=="mute"? scope.mute():scope.unmute()
	        }

	        var unwatchMute = scope.$watch("volume",function(){
	            if(scope.volume){	                
	                if(scope.volume!=0){
	                	if(scope.volume_class=="unmute")
	                		scope.player.controls.unmute();
	                    scope.volume_class="mute";
	                }
	                else
	                	scope.volume_class="unmute";
                	scope.player.controls.volume(scope.volume);	                    
	            }
	        });

	        scope.mute= function(){
	            scope.player.controls.mute();
	            scope.volume_class="unmute";
	            scope.volume=0;
	        }

	        scope.unmute = function(){
	            scope.player.controls.unmute();
	            scope.volume_class="mute";
	            scope.volume=0.8;
	        }

	        scope.progressSeek = function(event){
		        var element = angular.element('.progressBar');
		        var ratio = (event.pageX-element.offset().left)/element.outerWidth(); 
		        scope.seek()(scope.duration*ratio)
		        if(scope.timeline)
		        	scrollToNearestEvent(scope.duration*ratio)
	        }

	      	scope.showQuality = function(){
	      		scope.quality=!scope.quality
	      	}

	  		scope.setQuality = function(quality){
				scope.player.controls.changeQuality(quality)
		        scope.chosen_quality = quality;
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
	  			$log.debug(time)
	  			$log.debug(scope.timeline.getNearestEvent(time))
	  			var nearest_item= scope.timeline.getNearestEvent(time)
	  			if(nearest_item.data && Math.abs(nearest_item.time - time) <=30)
	  				scrollToItem(nearest_item.type, nearest_item.data.id)
	  		}

	    //   	if(scope.player.controls.youtube){
	    //         scope.speeds = scope.player.controls.getSpeeds();            
	    //         scope.chosen_speed = $cookieStore.get('youtube_speed') || 1;
	    //         scope.qualities = ["auto","small", "medium", "large"]
	    //         // scope.chosen_quality = scope.player.controls.getQuality()
	    //         $timeout(function(){
	    //         	scope.qualities = scope.player.controls.getAvailableQuality().reverse()
	    //         	scope.setQuality(scope.chosen_quality)
	    //         	scope.chosen_quality = scope.player.controls.getQuality()
	    //         },2000)
	    //   	}
	    //   	else{
	    //   		scope.qualities = ["auto"]
	    //   		scope.chosen_quality = scope.qualities[0]
	    //   		scope.setQuality(scope.chosen_quality)
	    //         scope.speeds = [0.8,1,1.2,1.5,1.8]
	    //         scope.chosen_speed = $cookieStore.get('mp4_speed') || 1
	    //   	}

	  		// scope.setSpeed(scope.chosen_speed)

  		player.on('playing',function(){
	    	scope.chosen_quality = scope.player.controls.getQuality()
	    	scope.play_class = "pause";
	    	scope.$apply()
	    })

      	if(scope.player.controls.youtube){
            scope.speeds = scope.player.controls.getSpeeds();            
            scope.chosen_speed = $cookieStore.get('youtube_speed') || 1;
            scope.qualities = ["auto","small", "medium", "large"]
            // scope.chosen_quality = scope.player.controls.getQuality()
           
            $timeout(function(){
           		scope.qualities = scope.player.controls.getAvailableQuality().reverse() 	
            },2000)
      	}
      	else{
            scope.speeds = [0.8,1,1.2,1.5,1.8]
            scope.chosen_speed = $cookieStore.get('mp4_speed') || 1
            scope.qualities = ["auto"]
      		scope.chosen_quality = scope.qualities[0]
      		// scope.setQuality(scope.chosen_quality)
      	}

  	 	scope.setQuality(scope.chosen_quality)
  		scope.setSpeed(scope.chosen_speed)
	  		

	        shortcut.add("Space",function(){
	        	scope.play()				
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
				unwatchMute()
				playhead.removeEventListener('mousedown', scope.playHeadMouseDown, false);
				playhead.removeEventListener('touchstart', scope.playHeadMouseDown, false);

				elapsed_bar.removeEventListener('mouseenter', scope.showPlayhead, false);
				elapsed_bar.removeEventListener('mouseleave', scope.hidePlayhead, false);
	      	});
	    }
	}
}])