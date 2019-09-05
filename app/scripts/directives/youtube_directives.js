'use strict';

angular.module('scalearAngularApp')

.directive("videoContainer", function() {
  return {
    transclude: true,
    replace: true,
    restrict: "E",
    template: '<div class="videoborder panel widescreen " style="padding:0; border:none; margin:0" ng-transclude></div>' //style="border:4px solid"
  };
}).directive('youtube', ['$rootScope', '$log', '$timeout', '$window', '$cookieStore', '$interval','VideoInformation', 'ScalearUtils', 'YTapiReqLog',function($rootScope, $log, $timeout, $window, $cookieStore, $interval,VideoInformation, ScalearUtils,YTapiReqLog) {
  return {
    transclude: true,
    restrict: 'E',
    replace: true,
    scope: {
      url: '=',
      ready: '&',
      id: '@',
      player: '=',
      autoplay: '@',
      controls: '@',
      start: "=",
      end: "=",
      lectureId: "="
    },
    template: "<div><div ng-transclude></div></div>",
    link: function(scope, element) {

      scope.vq = 'hd720';

      scope.$on('$destroy', function() {
        scope.kill_popcorn();
        scope.player = {};
        scope.id = "";
        scope.ready = "";
        scope.url = "";
      });
      var callbacks = [];
      var player,
        player_controls = {},
        player_events = {}

      var loadVideo = function() {
        scope.kill_popcorn()
        player_controls.youtube = false
        if (!scope.controls || scope.controls == undefined)
          scope.controls = 0;
        if (!scope.autoplay || scope.autoplay == undefined)
          scope.autoplay = 0;
        if ($rootScope.is_mobile)
          scope.autoplay = 1;

        if (isYoutube(scope.url)) {
          player_controls.youtube = true
          var video = Popcorn.HTMLYouTubeVideoElement('#' + scope.id)
          $log.debug("youtube")
          player = Popcorn(video);
          var aSrc = formatYoutubeURL(scope.url, scope.vq, scope.video_start || scope.start, scope.video_end ||scope.end, scope.autoplay, scope.controls)
          var savedDuration = scope.end - scope.start
          video.src = aSrc 
          video.duration = savedDuration
          console.log('$rootScope',scope.lectureId)
          video.regYtDataApiReq = YTapiReqLog.registerRequest
          video.info = {user_id:$rootScope.current_user.id,lecture_id:scope.lectureId}
          $log.debug(video.src)
        } else if (isVimeo(scope.url)) {
          var vimeo_options = {
            background: false,
            muted: false,
            autoplay:false,
            loop:false
          };
          var video = Popcorn.HTMLVimeoVideoElement('#' + scope.id,vimeo_options)
          video.src = scope.url+"?background=0&autoplay=0&muted=0&loop=0"
          player = Popcorn(video);
          player_controls.vimeo = true;
          player.controls(scope.controls);
          player.autoplay(false);
        } else if (isMP4(scope.url)) {
          $log.debug("mp4")
          var video = Popcorn.HTMLVideoElement('#' + scope.id) //Popcorn.smart( '#'+scope.id, scope.url)//, scope.url,{ width: '100%', height:'100%', controls: 0});
          player = Popcorn(video, {});
          video.src = scope.url
          player.video.className = "fit-inside"
          if ($rootScope.is_mobile || scope.controls == "default")
            player.controls(true);
          player.autoplay(false);
        } else if (isHTML5(scope.url)) {
          $log.debug("HTML5")
          player = Popcorn.smart('#' + scope.id,scope.url) //Popcorn.smart( '#'+scope.id, scope.url)//, scope.url,{ width: '100%', height:'100%', controls: 0});    
        } else if (isMediaSite(scope.url)) {
          $log.debug("mediasite")
          var video = Popcorn.HTMLMediaSiteVideoElement('#' + scope.id)
          player = Popcorn(video);
          video.src = scope.url
          $log.debug(video.src)
        }else if (isKaltura(scope.url)){
          var video = Popcorn.HTMLKalturaVideoElement('#' + scope.id);
          player = Popcorn(video);
          video.src = scope.url
          player_controls.kaltura = true;
          player_controls.setKcontrolBar()
        }

        if (scope.player){
          scope.player.element = player
        }
        setupEvents()
        parent.focus()
        scope.timeout_promise = $interval(function() {
          if (player_controls.readyState() == 0 && !$rootScope.is_mobile){
            scope.$emit('slow', isYoutube(scope.url))
          }
        }, 15000, 1)
      }

      var addCallback = function (callback){
        callbacks.unshift(callback)
      }

      var onReadyCallback = function (){
        var i = callbacks.length;
        while (i--){
          callbacks[i]()
        }
      }

      var formatYoutubeURL = function(url, vq, start, end, autoplay, controls) {
        var short_url = isShortYoutube(url)
        var base_url, query
        if (short_url) {
          base_url = 'https://www.youtube.com/watch'
          query = '&v=' + short_url[1]
        } else {
          var splitted_url = url.split('?')
          base_url = splitted_url[0]
          query = '&' + splitted_url[1]
        }
        if (start)
          query += "&start=" + start
        if (end)
          query += "&end=" + end
        if(vq)
          query += "&vq=" + vq
        return base_url + "?modestbranding=0&showinfo=0&rel=0&autohide=0&playsinline=1"+"&autoplay=" + autoplay + "&controls=" + controls + "&theme=light"+ query;
      }

      scope.kill_popcorn = function() {
        if (player) {
          Popcorn.destroy(player);
          if (player.media.destroy)
            player.media.destroy()
        }
        element.find('iframe').remove();
        element.find('video').remove()
        if (scope.slow_off)
          scope.slow_off()
        if (scope.timeout_promise)
          $timeout.cancel(scope.timeout_promise)
      }
      player_controls.play = function() {
        player.play();
      }

      player_controls.pause = function() {
        player.pause();
      }

      player_controls.mute = function() {
        player.mute();
        VideoInformation.volume = 0
      }

      player_controls.volume = function(val) {
        player.volume(val);
        VideoInformation.volume = val
      }

      player_controls.unmute = function() {
        player.unmute();
        VideoInformation.volume = 0.8
      }
      player_controls.paused = function() {
        return player.paused();
      }

      player_controls.getTime = function() {
        return player.currentTime() - scope.start
      }

      player_controls.getAbsoluteDuration = function() {
        var duration = player.duration()
        return scope.player.controls.youtube ? duration - 1 : duration
      }

      player_controls.getDuration = function() {
        // var duration
        // if(scope.start && scope.end)
        //  duration = scope.end - scope.start
        // else{
        //  duration = player_controls.getAbsoluteDuration()
        // }

        return scope.end - scope.start
      }

      player_controls.readyState = function() {
        return player.readyState()
      }

      player_controls.seek = function(time) {
        $log.debug("entering sekking", time)
        time=  parseFloat(time)
        if (time < 0){
          time = 0
        }
        if (time > player_controls.getDuration()){
          time = player_controls.getDuration()
        }
        if (player_controls.getDuration() - time < 1 ){
          time = player_controls.getDuration() - 1
        }
        time += scope.start || 0


        if (player_controls.readyState() == 0 ) {
          player.on("loadeddata",
            function() {
              $timeout(function(){
                player.currentTime(time);
              })

            });
        } else {
          $log.debug("seeking now", time)
          player.currentTime(time);
        }
        parent.focus()


      }

      player_controls.absoluteSeek = function(time) {
        player.currentTime(time);
        if (isVimeo(scope.url)) {
          player.pause()
        }

      }

      player_controls.seek_and_pause = function(time) { 
        if(isKaltura(scope.url)){
          if(time==0){
            player_controls.seek(0)
          } else {
            player.video.pauseAfterSeek(time)
          }
        } else {
          player_controls.seek(time)
          player.pause()
        }
      }

      player_controls.setStartTime = function(time) {
        scope.video_start = Math.round(time)
      }

      player_controls.setEndTime = function(time) {
        scope.video_end = Math.round(time)
      }

      player_controls.getStartTime = function() {
        return scope.video_start
      }

      player_controls.getEndTime = function() {
        return scope.video_end
      }

      player_controls.setVideoStartTime = function(time) {
        scope.start = Math.round(time)
      }

      player_controls.setVideoEndTime = function(time) {
        scope.end = Math.round(time)

      }

      player_controls.getVideoStartTime = function() {
        return scope.start
      }

      player_controls.getVideoEndTime = function() {
        return scope.end
      }

      player_controls.refreshVideo = function() {
        $log.debug("refreshVideo!")
        scope.kill_popcorn()
        loadVideo()
      }

      player_controls.hideControls = function() {
        player.controls(false);
      }

      player_controls.cue = function(time, callback) {
        player.cue(time, callback)
        return player_controls.getLastCueEvent()
      }
      player_controls.getLastCueEvent = function() {
        return player.getTrackEvent(player.getLastTrackEventId());
      }

      player_controls.removeTrackEvent = function(id){
        player.removeTrackEvent(id)
      }

      player_controls.getTrackEvents = function(){
        return player.getTrackEvents()
      }
      player_controls.removeAllTrackEvents = function(){
        player.getTrackEvents().forEach(function(track){
          player.removeTrackEvent(track.id)
        })
      }


      player_controls.replay = function() {
        player_controls.pause()
        player_controls.seek(0)
        player_controls.play()
      }

      player_controls.getSpeeds = function() {
        return player.media.getSpeeds();
      }

      player_controls.changeSpeed = function(speed) {
        if (scope.player.controls.youtube ||scope.player.controls.kaltura) {
          if (player_controls.getSpeeds().indexOf(speed) != -1) {
            player.media.setSpeed(speed)
          }
        } else {
          player.video.playbackRate = speed
        }

        VideoInformation.speed = speed
      }

      player_controls.getAvailableQuality = function() {
        return player.media.getAvailableQuality();
      }

      player_controls.getQuality = function() {
        return player.media.getQuality();
      }

      player_controls.changeQuality = function(quality) {
        if (player_controls.getAvailableQuality().indexOf(quality) != -1 && player_controls.getQuality() != quality) {
          var paused = player_controls.paused()
          player.media.setQuality(quality)
          if (paused)
            player_controls.pause()
        }
        VideoInformation.quality = quality
      }

      player_controls.setKcontrolBar = function(){
        if(scope.controls){
          addCallback(player.video.showControlBar)
        } else {
          addCallback(player.video.hideControlBar)
        }
      }

      var setupEvents = function () {
        player.on("loadeddata",
          function () { 
            $log.debug("Video data loaded and ready")
            if ($rootScope.is_mobile)
              player.controls(false);
            if (player_events.onReady) {
              player_events.onReady();
              ScalearUtils.safeApply()
            }
            var duration = (player_controls.youtube) ? player_controls.getDuration() : player_controls.getAbsoluteDuration()
            VideoInformation.setDuration(duration)
            onReadyCallback()
          });

        player.on('playing',
          function () {
            $log.debug("youtube playing")
            parent.focus()
            if (player_events.onPlay) {
              player_events.onPlay();
              ScalearUtils.safeApply()
            }
          });

        player.on('pause',
          function() {
            parent.focus()
            if (player_events.onPause) {
              player_events.onPause();
              scope.$apply();
            }
          });

        player.on('timeupdate',
          function() {
            if (player_events.timeUpdate) {
              player_events.timeUpdate();
              scope.$apply();
            }
          });

        player.on('loadedmetadata', function() { 
          parent.focus()
          if (player_events.onMeta) {
            player_events.onMeta();
            ScalearUtils.safeApply()
          }
        })

        player.on('canplay', function() {
          parent.focus()
          if (player_events.canPlay) {
            player_events.canPlay();
            scope.$apply();
          }
        })

        // player.on('canplaythrough', function() {
        //   parent.focus()
        //   if (player_events.canPlay) {
        //     player_events.canPlay();
        //     scope.$apply();
        //   }
        // })
        player.on('seeking', function() {
          parent.focus()
          if (player_events.seeking) {
            player_events.seeking();
            scope.$apply();
          }
        })

        player.on('seeked', function() {
          parent.focus()
          if (player_events.seeked) {
            player_events.seeked();
            scope.$apply();
          }
        })

        player.on('waiting', function() {
          parent.focus()
          if (player_events.waiting) {
            player_events.waiting();
            scope.$apply();
          }
        })

        player.on('ended', function() {
          parent.focus()
          if (player_events.onEnd) {
            player_events.onEnd();
            scope.$apply();
          }
        })
        scope.slow_off = scope.$on('slow', function(ev, data) { 
          parent.focus()
          if (player_events.onSlow) {
            player_events.onSlow(data);
          }
        })
      }

      $rootScope.$on('refreshVideo', function() {
        player_controls.refreshVideo()
      })

      var isFinalUrl = function(url) {
        return url.match(/^(http|https):\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[\W\w]*$/);
      }

      var isYoutube = function(url) {
        var video_url = url || scope.url || ""
        var match = video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)([^\s&]{11})/);
        if (!match)
          return video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)?([^\s&]{11})/);
        else return match
      }

      var isShortYoutube = function(url) {
        var video_url = url || scope.url || ""
        return video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)?\.be\/([^\s&]{11})/);
      }

      var isVimeo = function (url) {
        var video_url = url || scope.url || ""
        return video_url.match(/(http|https):\/\/player.vimeo.com\/video\/[0-9]*/) || url.match(/(http|https):\/\/vimeo.com\/[0-9]*/)
      }

      var isMP4 = function(url) {
        var video_url = url || scope.url || ""
        return video_url.match(/(.*mp4$)/) || video_url.match(/(.*m4v$)/)  
      }

      var isHTML5= function(url){
        var video_url = url || scope.url || ""
        return video_url.match(/(.*webm$)/) || video_url.match(/(.*ogv$)/)  
      }

      var isKaltura = function (iframe) {
        var url
        if (iframe) {
          if (iframe.match('src\=(.*)[a-z]\"')) {
            url = iframe.match('src\=(.*)[a-z]\"')[0]
          }

          var video_url = url || scope.url.split(" ")[1] || ""

          return video_url.match(/https?:\/\/.*\/[a-zA-Z]+\/[0-9]+\/[a-zA-Z]+\/[0-9]+00\/[a-zA-Z]+\/uiconf_id\/([0-9]+)\/partner_id\/([0-9]+).*&entry_id=(.+)[a-z]*\&flashvars(&.*)?/)
        }
      }
      var isMediaSite = function(url) {
        var video_url = url || scope.url || ""
        return video_url.match(/^(http|https):\/\/.*(\/Play\/)/)
      }

      player_controls.isYoutube = isYoutube
      player_controls.isMP4  = isMP4
      player_controls.isKaltura = isKaltura
      player_controls.isHTML5 = isHTML5
      player_controls.isVimeo = isVimeo

      scope.$watch('url', function() {
        if (scope.url && ((isYoutube(scope.url) && isFinalUrl(scope.url)) || isVimeo(scope.url) || isMP4(scope.url) || isKaltura(scope.url)|| isMediaSite(scope.url) || isHTML5(scope.url))){
          player_controls.refreshVideo()
        }
      })

      var unwatch = scope.$watch('player', function() {
        if (scope.player) {
          scope.player.controls = player_controls
          if (scope.player.events){
            player_events = scope.player.events
          }
          scope.player.element = player
          scope.$emit("player ready")
          unwatch()
        }
      })



    }
  };
}]).directive('resizableVideo', ['$window', '$rootScope', '$timeout', '$log', function($window, $rootScope, $timeout, $log) {
  return {
    restrict: 'A',
    scope: {
      container: '=',
      quiz_layer: '=quizLayer',
      video_layer: '=videoLayer',
      aspect_ratio: '=aspectRatio',
      fullscreen: '=active',
      resize: '=',
      max_width: '=maxWidth'
    },
    link: function($scope, element) {
      $scope.resize.small = function() {
        $scope.fullscreen = false

        angular.element("body").css("overflow", "");
        angular.element("body").css("position", "");


        var container = {
          "top": "",
          "left": "",
          "position": "",
          "width": '',
          "height": "",
          "z-index": 0
        };

        var video = angular.copy(container)

        var layer = {
          "position": "absolute",
          "margin-left": "0px",
          "margin-top": "0px",
          "z-index": 1,
          "width": "100%",
          "height": '100%',
          "top": "0px",
          "left": "0px"
        }

        if ($scope.container)
          angular.extend($scope.container, container)
        if ($scope.video_layer)
          angular.extend($scope.video_layer, video)
        if ($scope.quiz_layer)
          angular.extend($scope.quiz_layer, layer)
        if ($scope.unregister_back_event)
          $scope.unregister_back_event()
        if ($scope.unregister_state_event)
          $scope.unregister_state_event()
      }

      $scope.resize.big = function() {
        $log.debug("resizing big")
        var factor = $scope.aspect_ratio == "smallscreen" ? 4.0 / 3.0 : 16.0 / 9.0;
        var win = angular.element($window)
        $scope.fullscreen = true
        angular.element("body").css("overflow", "hidden");
        angular.element("body").css("position", "fixed")

        if ($rootScope.is_mobile) {
          var progressbar_height = 70
          var window_height = win.height()
          var window_width = win.width()
        } else {
          var progressbar_height = 80
          var window_height = screen.height
          var window_width = screen.width
        }

        win.scrollTop("0px")

        var container = {
          "top": 0,
          "left": 0,
          "position": "fixed",
          "width": window_width - $scope.max_width,
          "height": window_height,
          "z-index": 1031
        };

        var video = angular.copy(container)
        video["height"] -= progressbar_height
        video["width"] = "auto"
        video["position"] = ""


        var video_height = video["height"]
        var video_width = video_height * factor

        var layer = {}
        if (video_width > window_width - $scope.max_width) { // if width will get cut out.
          $log.debug("width cutt offff")
          video_height = (window_width - $scope.max_width) * 1.0 / factor;
          var margin_top = ((window_height - progressbar_height) - (video_height)) / 2.0; //+30

          layer = {
            "position": "fixed",
            "top": 0,
            "left": 0,
            "width": window_width - $scope.max_width,
            "height": video_height,
            "margin-top": margin_top + "px",
            "margin-left": "0px"
          }
        } else {
          $log.debug("height cutt offff")
          $log.debug(window_width)
          $log.debug(video_width)
          $log.debug(((window_width - $scope.max_width) - video_width) / 2.0)
          var margin_left = ((window_width - $scope.max_width) - video_width) / 2.0;
          // if ($rootScope.is_mobile) {
          //   margin_left = 0
          //   video_width = "100%"
          // }
          layer = {
            "position": "fixed",
            "top": 0,
            "left": 0,
            "width": video_width,
            "height": video_height,
            "margin-left": margin_left + "px",
            "margin-top": "0px"
          }
        }
        if ($scope.container)
          angular.extend($scope.container, container)
        if ($scope.video_layer)
          angular.extend($scope.video_layer, video)
        if ($scope.quiz_layer)
          angular.extend($scope.quiz_layer, layer)
      }
    }
  }
}]).directive('progressBar', ['$rootScope', '$log', '$window', '$cookieStore', '$timeout', 'VideoQuizModel','$filter', 'VideoInformation','ScalearUtils',function($rootScope, $log, $window, $cookieStore, $timeout, VideoQuizModel, $filter ,VideoInformation,ScalearUtils) {
  return {
    transclude: true,
    restrict: 'E',
    replace: false,
    scope: {
      player: '=',
      seek: "&",
      timeline: '=',
      role: '&',
      editing: "="
    },
    templateUrl: "/views/progress_bar.html",
    link: function(scope, element, attrs) {
      scope.user_role = scope.role()
      var player = scope.player.element
      var progress_bar = angular.element('.progressBar');
      var playhead = element.find('.playhead') //document.getElementsByClassName("playhead")[0]
      var elapsed_bar = element.find('.elapsed') //document.getElementsByClassName("elapsed")[0]
      var onplayhead = false;
      scope.progress_bar = $('.progressBar')
      scope.progress_width = scope.progress_bar.width()
      scope.current_time = 0
      scope.volume_class = "mute";
      scope.quality = false;
      scope.chosen_quality = 'hd720';
      scope.chosen_speed = 1
      scope.is_mobile = $rootScope.is_mobile
      $timeout(function() {
        scope.duration = scope.player.controls.getDuration();
        scope.video = {
          start_time: scope.player.controls.getVideoStartTime(),
          end_time: scope.player.controls.getVideoEndTime()
        }

        scope.$watch('editing', function() {
          if (scope.editing == 'video'){
            scope.video.start_time= scope.player.controls.getVideoStartTime();
            scope.video.end_time= scope.player.controls.getVideoEndTime();
            scope.duration = scope.player.controls.getAbsoluteDuration();
          }
          else{
            //scope.player.controls.isHTML5(scope.url)? scope.player.element.duration():
            scope.duration = scope.player.controls.getDuration();
          }
        })

        if(scope.is_mobile){
          $timeout(function(){
            document.getElementsByClassName("progressBar")[0].addEventListener("touchstart", scope.playHeadMouseDown, true)

          })
        }
      })

      var repositionQuizHandles = function() {
        if (scope.editing == 'video') {
          $(".squarebrackets_left").css("left", ((scope.video.start_time / scope.duration) * 100) + '%')
          $(".squarebrackets_right").css("left", ((scope.video.end_time / scope.duration) * 100) + '%')
          $(".repeating_green_pattern").css("left", ((scope.video.start_time / scope.duration) * 100) + '%')
        } else if (scope.editing == 'quiz') {
          // var current_quiz = scope.timeline.items.filter(function(item) {
          //   return item.data && item.data.selected
          // })[0]
          var current_quiz = VideoQuizModel.getSelectedVideoQuiz()
          if(current_quiz){
            $(".squarebrackets_left").css("left", ((current_quiz.start_time / scope.duration) * 100) + '%')
            $(".squarebrackets_right").css("left", ((current_quiz.end_time / scope.duration) * 100) + '%')
            $(".quiz_circle").css("left", ((current_quiz.time / scope.duration) * 100) - 0.51 + '%')
            $(".repeating_grey_pattern").css("left", ((current_quiz.start_time / scope.duration) * 100) + '%')
            $(".repeating_orange_pattern").css("left", ((current_quiz.time / scope.duration) * 100) + '%')
          }
        }
      }

      $(window).resize(repositionQuizHandles)

      $rootScope.$on('details_navigator_change', repositionQuizHandles)

      scope.play_class = scope.is_mobile ? "pause" : "play";

      scope.quality_names = {
        "auto": "Auto",
        "tiny": "144p",
        "small": "240p",
        "medium": "360p",
        "large": "480p",
        "hd720": "720p (HD)",
        "hd1080": "1080p (HD)",
        "highres": "High"
      }

      scope.setSpeed = function(speed) {
        $log.debug('setting youtube speed to ' + speed)
        scope.player.controls.changeSpeed(speed)
        scope.chosen_speed = speed;
        $cookieStore.put(scope.player.controls.youtube ? 'youtube_speed' : 'mp4_speed', scope.chosen_speed)
      }

      scope.showPlayhead = function(event) {
        if (scope.playhead_timeout)
          $timeout.cancel(scope.playhead_timeout)
        scope.playhead_class = "playhead_big"
          // scope.$apply()
      }

      scope.hidePlayhead = function(event) {
        if (!onplayhead) {
          scope.playhead_timeout = $timeout(function() {
            scope.playhead_class = ""
            scope.playhead_timeout = null
            scope.$apply()
          }, 1000)
        }
      }

      scope.playHeadMouseDown = function(event) {
        onplayhead = true;

        if(scope.is_mobile){
          scope.showPlayhead()
          window.addEventListener('touchmove', scope.moveplayhead, true);
          window.addEventListener("touchend", scope.playHeadMouseUp, true)
        } else{
          window.addEventListener('mousemove', scope.moveplayhead, true);
          window.addEventListener('mouseup', scope.playHeadMouseUp, true);
        }
      }

      scope.playHeadMouseUp = function(event) {
        if (onplayhead == true) {
          onplayhead = false;
          if(scope.is_mobile){
            scope.hidePlayhead()
            window.removeEventListener('touchmove', scope.moveplayhead, true);
            window.removeEventListener("touchend", scope.playHeadMouseUp, true)
          }
          else{
            window.removeEventListener('mousemove', scope.moveplayhead, true);
            window.removeEventListener('mouseup', scope.playHeadMouseUp, true);
          }

          scope.progressSeek(event)
        }

        scope.$apply()
      }

      scope.moveplayhead = function(event) {
        var ratio = (event.pageX - progress_bar.offset().left) / progress_bar.outerWidth()
        var position = ratio * 100 - 0.51
        if (position >= 0 && position <= 100) {
          scope.elapsed_head = position > 99.4 ? 99.4 : position
          scope.elapsed_width = position + 0.45
          scope.current_time = scope.duration * ratio
        }
        if (position < 0) {
          scope.elapsed_head = 0;
          scope.elapsed_width = 0
          scope.current_time = 0
        }
        if (position > 100) {
          scope.elapsed_head = 99.4;
          scope.elapsed_width = 100
          scope.current_time = scope.duration
        }

        scope.seek()(scope.current_time)
        scope.$apply()
      }

      scope.play = function() {
        if (scope.player.controls.paused()) {
          scope.player.controls.play()
          scope.play_class = "pause";
        } else {
          scope.player.controls.pause()
          scope.play_class = "play";
        }
      }

      scope.rewind= function(){
        var t = scope.player.controls.getTime();
        scope.seek()(t - 10)
      }

      scope.fastForward =function(){
        var t = scope.player.controls.getTime();
        scope.seek()(t + 10)
      }

      scope.muteToggle = function() {
        scope.volume_class == "mute" ? scope.mute() : scope.unmute()
      }

      scope.loadCaptionTracks = function(){
        if (!scope.captionTracks){          
          scope.captionTracks = player.video.getCaptionTracks();
        }
      }

      scope.setCaptionTrack = function(track){
        scope.selectedCaptionTrack = track;
        player.video.setCaptionTrack(track);
        $cookieStore.put('captionTrack',  scope.selectedCaptionTrack)
      }

      var unwatchMute = scope.$watch("volume", function() {
        if (scope.volume) {
          $cookieStore.put('volume', scope.volume)
          if (scope.volume != 0) {
            if (scope.volume_class == "unmute")
              scope.player.controls.unmute();
            scope.volume_class = "mute";
          } else
            scope.volume_class = "unmute";
          scope.player.controls.volume(scope.volume);
        }
      });

      scope.mute = function() {
        scope.player.controls.mute();
        scope.volume_class = "unmute";
        scope.volume = 0;
        $cookieStore.put('volume', scope.volume)
      }

      scope.unmute = function() {
        scope.player.controls.unmute();
        scope.volume_class = "mute";
        scope.volume = 0.8;
        $cookieStore.put('volume', scope.volume)
      }

      scope.progressSeek = function(event) {

        if (!(scope.skip_progress_seek && scope.editing == 'quiz')) {
          var progress_bar = angular.element('.progressBar');
          var ratio = (event.pageX - progress_bar.offset().left) / progress_bar.outerWidth();
          scope.seek()(scope.duration * ratio)
          hideAllQuizzesAnswers()
          if (scope.timeline && scope.user_role == 2)
            scrollToNearestEvent(scope.duration * ratio)
        }
        scope.skip_progress_seek = false
      }

      scope.showQuality = function() {
        scope.quality = !scope.quality
      }

      scope.setQuality = function(quality) {
        scope.player.controls.changeQuality(quality)
        scope.chosen_quality = quality;

      }

      scope.scrollEvent = function(type, id) {
        scrollToItem(type, id)
        addHighlight(type, id)
      }

      var scrollToItem = function(type, id) {
        $('.student_timeline').scrollToThis('#' + type + '_' + id, { offsetTop: 100, duration: 350 });
      }
      var addHighlight = function(type, id) {
        $('#' + type + '_' + id).animate({ 'backgroundColor': '#ffff99' }, "fast")
        $('#' + type + '_' + id).animate({ 'backgroundColor': '#ffffff' }, 2000)
      }

      var scrollToNearestEvent = function(time) {
        var nearest_item = scope.timeline.getNearestEvent(time)
        if (nearest_item.data && Math.abs(nearest_item.time - time) <= 30)
          scrollToItem(nearest_item.type, nearest_item.data.id)
      }

      var setupBoundaryHoverEffect = function(event, meta, item) {
        var progress_width = scope.progress_bar.width()
        var quiz_location = ((item.time / scope.duration) * progress_width)

        if (meta.position.left < quiz_location)
          angular.element(event.target).toggleClass('squarebrackets_left_hover')
        if (meta.position.left > quiz_location)
          angular.element(event.target).toggleClass('squarebrackets_right_hover')
        else
          angular.element(event.target).find('.dot_circle').toggleClass('dot_circle_hover')

        item.has_start = item.start_time != item.time
        item.has_end = item.end_time != item.time
      }

      scope.calculateQuizBoundaries = function(event, meta, item) {
        meta.position.top = -4
        var progress_width = scope.progress_bar.width()
        scope.quiz_circle_width = $(".quiz_circle").width()
        item.data.start_location = (item.data.start_time / scope.duration) * progress_width
        item.data.end_location = (item.data.end_time / scope.duration) * progress_width
        item.data.quiz_location = (item.data.time / scope.duration) * progress_width
        item.data.has_start = item.data.start_time != item.data.time
        item.data.has_end = item.data.end_time != item.data.time

        var next_quiz = scope.timeline.getNextByType(item)
        var prev_quiz = scope.timeline.getPrevByType(item)
        item.data.next_quiz_start = next_quiz ? (next_quiz.data.start_time / scope.duration) * progress_width : progress_width
        item.data.prev_quiz_end = prev_quiz ? (prev_quiz.data.end_time / scope.duration) * progress_width : 0
        setupBoundaryHoverEffect(event, meta, item.data)
      }

      scope.calculateQuizTime = function(event, meta, item) {
        meta.position.top = -4
        var start_offset = 1
        var end_offset = scope.quiz_circle_width

        if (meta.position.left > item.data.end_location - end_offset){
          if(item.data.has_end)
            meta.position.left = item.data.end_location - end_offset
          else
            meta.position.left = item.data.quiz_location - 6
        }

        if (meta.position.left < item.data.start_location + start_offset){
          if(item.data.has_start)
            meta.position.left = item.data.start_location + start_offset
          else
            meta.position.left = item.data.quiz_location - 6
        }

        item.time = ((meta.position.left + 6) / scope.progress_bar.width()) * scope.duration
        item.data.time = ((meta.position.left + 6) / scope.progress_bar.width()) * scope.duration
        item.data.hide_quiz_answers = false
        $rootScope.$broadcast("show_quiz_background", item.data)
        item.data.formatedTime = $filter('format')(item.data.time)
        scope.seek()(item.data.time)

      }

      scope.calculateStartQuizTime = function(event, meta, item) {
        meta.position.top = -4
        var start_offset = 5
        var end_offset = (scope.quiz_circle_width / 2) + 1
        if (meta.position.left > item.quiz_location - end_offset)
          meta.position.left = item.quiz_location - end_offset
        if (meta.position.left < item.prev_quiz_end + start_offset)
          meta.position.left = item.prev_quiz_end + start_offset
        item.start_time = (meta.position.left / scope.progress_bar.width()) * scope.duration
        item.hide_quiz_answers = true
        $rootScope.$broadcast("hide_quiz_background")
        scope.seek()(item.start_time)
      }

      scope.calculateEndQuizTime = function(event, meta, item) {
        meta.position.top = -4
        var start_offset = (scope.quiz_circle_width / 2) + 1
        var end_offset = 5
        if (meta.position.left > item.next_quiz_start - end_offset)
          meta.position.left = item.next_quiz_start - end_offset
        if (meta.position.left < item.quiz_location + start_offset)
          meta.position.left = item.quiz_location + start_offset
        item.end_time = (meta.position.left / scope.progress_bar.width()) * scope.duration
        item.hide_quiz_answers = true
        $rootScope.$broadcast("hide_quiz_background")
        scope.seek()(item.end_time)
      }

      scope.cleanUpDrag = function(event, meta, item) {
        setupBoundaryHoverEffect(event, meta, item.data)
      }

      scope.calculateVideoBoundaries = function(event, meta) {
        meta.position.top = -4
        var progress_width = scope.progress_bar.width()
        scope.video.start_location = (scope.video.start_time / scope.duration) * progress_width
        scope.video.end_location = (scope.video.end_time / scope.duration) * progress_width
        scope.video.progress_width = progress_width

      }

      scope.calculateVideoStartTime = function(event, meta) {
        meta.position.top = -4
        var offset = 25
        if (meta.position.left < 0)
          meta.position.left = 0
        if (meta.position.left > scope.video.end_location - offset)
          meta.position.left = scope.video.end_location - offset

        scope.video.start_time = (meta.position.left / scope.video.progress_width) * scope.duration
        scope.player.controls.setVideoStartTime(scope.video.start_time)
        scope.player.controls.absoluteSeek(scope.video.start_time)
      }

      scope.calculateVideoEndTime = function(event, meta) {

        meta.position.top = -4
        var offset = 25
        if (meta.position.left < scope.video.start_location + offset)
          meta.position.left = scope.video.start_location + offset
        if (meta.position.left > scope.video.progress_width)
          meta.position.left = scope.video.progress_width
        scope.video.end_time = (meta.position.left / scope.video.progress_width) * scope.duration
        scope.player.controls.setVideoEndTime(scope.video.end_time)
        scope.player.controls.absoluteSeek(scope.video.end_time)
      
      }

      scope.seekToQuiz = function(quiz) {
        quiz.hide_quiz_answers = false
        scope.skip_progress_seek = true
        scope.seek()(quiz.time)
        scope.player.controls.pause()
        $rootScope.$broadcast("show_quiz_background", quiz)
      }

      scope.showQuiz = function(quiz) {
        scope.seekToQuiz(quiz)
        $rootScope.$broadcast("show_online_quiz", quiz)
      }

      var hideAllQuizzesAnswers = function() {
        scope.timeline.items.forEach(function(quiz) {
          if (quiz.data && quiz.data.selected)
            quiz.data.hide_quiz_answers = true
        })
        $rootScope.$broadcast("hide_quiz_background")
      }

      var unwatchMute = scope.$watch("volume", function() {
        if (scope.volume) {
          scope.player.controls.volume(scope.volume);
          if (scope.volume != 0)
            scope.volume_class = "mute";
          else
            scope.volume_class = "unmute";
        }
      });


      player.on('timeupdate', function() {

        if (onplayhead == false && scope.editing != 'video') {
          scope.current_time = scope.player.controls.getTime()
          VideoInformation.current_time = scope.current_time
          scope.elapsed_width = ((scope.current_time / scope.duration) * 100)
          scope.elapsed_head = scope.elapsed_width > 0.5 ? scope.elapsed_width - 0.45 : 0
          scope.elapsed_head = scope.elapsed_head > 99.4 ? 99.4 : scope.elapsed_head
          if (scope.elapsed_head == 99.4 && scope.player.controls.vimeo) player.pause() 
        }

        scope.$apply()
      })

      // player.on('ended', function() {

      //   //for some reason youtube requires clicking the
      //   //play button twice to play after video end
      //   //simulating first click on play
      //   // scope.player.controls.seek(0)
      //   $timeout(function() {
      //     scope.player.controls.play();
      //     scope.player.controls.pause();
      //     scope.play_class = "play";
      //   }, 1000)

      //   scope.$apply()
      // })

      player.on('pause', function() {
        scope.play_class = "play";
        ScalearUtils.safeApply()
      })

      player.on('playing', function() {
        if (scope.player.controls.youtube)
          scope.chosen_quality = scope.player.controls.getQuality()
        scope.play_class = "pause";
        ScalearUtils.safeApply()
      })

      if (scope.player.controls.youtube || scope.player.controls.kaltura) {
        if ($cookieStore.get('captionTrack')) {
          scope.setCaptionTrack($cookieStore.get('captionTrack'))
        }
        scope.speeds = scope.player.controls.getSpeeds();
        scope.chosen_speed = $cookieStore.get('youtube_speed') || 1;
        if ($cookieStore.get('volume') != null){
          scope.volume = $cookieStore.get('volume')
          if(!scope.volume){
            scope.mute()
          }
        }
        else{
          scope.volume =  0.8
        }
        scope.qualities = ["auto", "small", "medium", "large"]
          // scope.chosen_quality = scope.player.controls.getQuality()

        $timeout(function() {
          scope.qualities = scope.player.controls.getAvailableQuality().reverse()
          }, 2000)
          scope.setQuality(scope.chosen_quality)
      } else {
        scope.speeds = [0.8, 1, 1.2, 1.5, 1.8]
        scope.chosen_speed = $cookieStore.get('mp4_speed') || 1
        scope.volume = $cookieStore.get('volume') || 0.8
        scope.qualities = ["auto"]
        scope.chosen_quality = scope.qualities[0]
      }

      scope.setSpeed(scope.chosen_speed)

      shortcut.add("Space", function() {
        scope.play()
      }, { "disable_in_input": true });

      shortcut.add("j", function() {
        scope.rewind();
        scope.$apply()
      }, { "disable_in_input": true });
      shortcut.add("k", function() {
        scope.play()
        scope.$apply()
      }, { "disable_in_input": true });
      shortcut.add("l", function() {
        scope.fastForward();
        scope.$apply()
      }, { "disable_in_input": true });

      shortcut.add("b", function() {
        var t = scope.player.controls.getTime();
        scope.player.controls.pause();
        scope.player.controls.seek(t - 10)
        scope.player.controls.play();
      }, { "disable_in_input": true });

      scope.$on('$destroy', function() {
        shortcut.remove("b");
        shortcut.remove("Space");
        shortcut.remove("j");
        shortcut.remove("k");
        shortcut.remove("l");
        // progress_bar.off('mouseenter', scope.showPlayhead);
        // progress_bar.off('mouseleave', scope.hidePlayhead);
        // progress_bar.off('touchstart', scope.showPlayhead);
        // progress_bar.off('touchleave', scope.hidePlayhead);
        unwatchMute()
        $(window).off('resize', repositionQuizHandles)
      });
    }
  }
}])
