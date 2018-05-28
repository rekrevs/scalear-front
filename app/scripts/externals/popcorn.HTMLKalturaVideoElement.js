/* istanbul ignore next */
(function( Popcorn, window, document ) {

  var

  CURRENT_TIME_MONITOR_MS = 10,
  EMPTY_STRING = "",

  // Example: http://www.Kaltura.com/watch?v=12345678901
  regexKaltura = /^.*(?:\/|v=)(.{11})/,

  ABS = Math.abs,

  // Setup for Kaltura API
  kReady = false,
  kLoaded = false,
  kCallbacks = [];

  function isKalturaReady(url) {
    // If the Kaltura iframe API isn't injected, to it now.
    console.log(2)
    if( !kLoaded ) {//<script src="http://cdnapi.kaltura.com/p/243342/sp/24334200/embedIframeJs/uiconf_id/12905712/partner_id/243342"></script>
      console.log("isKalturaReady loading scripts");
      var tag = document.createElement( "script" );
      tag.src = url.split(" ")[1].split("=")[1].substr(1).split("?")[0]
      console.log(tag)
      var firstScriptTag = document.getElementsByTagName( "script" )[ 0 ];
      firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
      console.log(3)
      kLoaded = true;

      onKalturaAPIReady()
    }
    console.log("4 kReady:"+kReady);

    return kReady;
  };


  function extractKalturaIDs(url){
      //ex1:<iframe src="http://www.kaltura.com/p/{PARTNER_ID}/sp/{PARTNER_ID}00/embedIframeJs/uiconf_id/{UICONF_ID}/partner_id/{PARTNER_ID}?iframeembed=true&playerId={UNIQUE_OBJ_ID}&entry_id={ENTRY_ID}" width="400" height="330" allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0"></iframe>
      //ex2:<iframe src="https://cdnapisec.kaltura.com/p/1763741/sp/176374100/embedIframeJs/uiconf_id/24747631/partner_id/1763741?iframeembed=true&playerId=kplayer&entry_id=0_n8xcunnj&flashvars[streamerType]=auto" width="560" height="39 " allowfullscreen webkitallowfullscreen mozAllowFullScreen frameborder="0"></iframe>
      var kalturaIDs = {}
      var frame_src
      frame_src = url.split(" ")[1]
      var frame_src_slash_splitted = frame_src.split('/')
      kalturaIDs.partner_id = frame_src_slash_splitted[4]
      kalturaIDs.uiconf_id  = frame_src_slash_splitted[9]
      var frame_src_equal_splitted
      frame_src_equal_splitted = frame_src.split("=")

      if (frame_src_equal_splitted[4].includes("flashvars")) {//url has flash vars
        var frame_src_equal_and_splitted = frame_src_equal_splitted[4].split('&')
        kalturaIDs.entry_id   = frame_src_equal_and_splitted[0]
      }else{//url has not flash vars
        kalturaIDs.entry_id   = frame_src_equal_splitted[4]
      }
      return kalturaIDs
    }

 function getVideo(url){
   var video = document.createElement("script")
   video.src = url
   return video
 }


  function addKalturaCallback( callback ) {
    console.log(6)
    console.log(kCallbacks)
    kCallbacks.unshift( callback );
  }

  // An existing Kaltura references can break us.
  // Remove it and use the one we can trust.
  if ( window.YT ) {
    window.quarantineYT = window.YT;
    window.YT = null;
  }
  function onKalturaAPIReady(){
    kReady = true;
    console.log(7)
    console.log("k library ready callback fired kReady:"+kReady)
    var i = kCallbacks.length;
    console.log("kCallbacks:"+kCallbacks)
    while(i-- ) {
      console.log(kCallbacks[ i ])
       if (kCallbacks[ i ] instanceof Function) kCallbacks[ i ]();
      delete kCallbacks[ i ];
      console.log("8 callbackdeleted")
    }
  }

  function HTMLKalturaVideoElement( id ) {

    // Kaltura iframe API requires postMessage
    if( !window.postMessage ) {
      throw "ERROR: HTMLKalturaVideoElement requires window.postMessage";
    }

    var self = this,
      parent = typeof id === "string" ? document.querySelector( id ) : id,
      elem = document.createElement( "div" );
    elem.setAttribute('id', 'kalturaVideo')

    var impl = {
        src: EMPTY_STRING,
        networkState: self.NETWORK_EMPTY,
        readyState: self.HAVE_NOTHING,
        seeking: false,
        autoplay: false,
        preload: EMPTY_STRING,
        controls: false,
        loop: false,
        poster: EMPTY_STRING,
        volume: 1,
        muted: false,
        currentTime: 0,
        duration: NaN,
        ended: false,
        paused: true,
        error: null
      },
      playerReady = false,
      catchRoguePauseEvent = false,
      catchRoguePlayEvent = false,
      mediaReady = false,
      durationReady = false,
      loopedPlay = false,
      player,
      rawPlayer,
      videoQualities = [] ,
      playerPaused = true,
      mediaReadyCallbacks = [],
      playerState = -1,
      bufferedInterval,
      lastLoadedFraction = 0,
      currentTimeInterval,
      timeUpdateInterval,
      firstPlay = false;
      video_srcs=[];


    var parent_innerHTML = document.getElementById("lecture_video")
    // console.log(parent_innerHTML)
    // Namespace all events we'll produce
    self._eventNamespace =  Popcorn.guid( "HTMLKalturaVideoElement::" );

    self.parentNode = parent;

    // Mark this as Kaltura
    self._util.type = "Kaltura";
    // console.log(document.getElementById("lecture_video"))
    // console.log(document.getElementById("lecture_video").innerHTML)
    function addMediaReadyCallback( callback ) {

      mediaReadyCallbacks.unshift( callback );
    }


    function onPlayerReady( event ) {
      var onMuted = function() {
        if ( player.isMuted() ) {
          // force an initial play on the video, to remove autostart on initial seekTo.
          if ( !navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) )
            player.playVideo();
          else{
            if ( durationReady ) {
              // console.log(document.getElementById("lecture_video"))
              // console.log(document.getElementById("lecture_video").innerHTML)
              onFirstPlay();
            }
          }
        } else {
          setTimeout( onMuted, 0 );
        }
      };
      playerReady = true;
      // XXX: this should really live in cued below, but doesn't work.

      // Browsers using flash will have the pause() call take too long and cause some
      // sound to leak out. Muting before to prevent this.
      player.mute();

      // ensure we are muted.
      onMuted();
    }

    function onPlayerError(event) {
      // There's no perfect mapping to HTML5 errors from Kaltura errors.
      var err = { name: "MediaError" };

      switch( event.data ) {

        // invalid parameter
        case 2:
          err.message = "Invalid video parameter.";
          err.code = MediaError.MEDIA_ERR_ABORTED;
          break;

        // HTML5 Error
        case 5:
          err.message = "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.";
          err.code = MediaError.MEDIA_ERR_DECODE;

        // requested video not found
        case 100:
          err.message = "Video not found.";
          err.code = MediaError.MEDIA_ERR_NETWORK;
          break;

        // video can't be embedded by request of owner
        case 101:
        case 150:
          err.message = "Video not usable.";
          err.code = MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED;
          break;

        default:
          err.message = "Unknown error.";
          err.code = 5;
      }

      impl.error = err;
      self.dispatchEvent( "error" );
    }

    // This function needs duration and first play to be ready.
    function onFirstPlay() {
      //player.setOption('captions','reload',true);
      //player.setOption('captions','track',{});

      console.log("-------->onFirstPlay<---------")
      addMediaReadyCallback(function() {
        bufferedInterval = setInterval( monitorBuffered, 50 );
      });
      console.log("-------->onFirstPlay<------1---")

      // Set initial paused state
      console.log(impl.autoplay || !impl.paused);
      console.log(impl.autoplay );
      console.log( !impl.paused)
      if( impl.autoplay || !impl.paused ) {

        impl.paused = false;
        addMediaReadyCallback(function() {
          console.log("before onPlay")
          onPlay();
        });
        setTimeout( function(){  },2000)

      } else {

        // if a pause happens while seeking, ensure we catch it.
        // in Kaltura seeks fire pause events, and we don't want to listen to that.
        // except for the case of an actual pause.
        catchRoguePauseEvent = false;
        // console.log(document.getElementById("lecture_video").innerHTML)
        player.sendNotification("doPause");
      }
      console.log("-------->onFirstPlay<------2---")
      // Ensure video will now be unmuted when playing due to the mute on initial load.
      // if( !impl.muted ) {
      //   player.unMute();
      // }
      console.log("-------->onFirstPlay<------3---")

      impl.readyState = self.HAVE_METADATA;
      self.dispatchEvent( "loadedmetadata" );
      currentTimeInterval = setInterval( monitorCurrentTime,CURRENT_TIME_MONITOR_MS );
      //cuurentTimeInterval = player.evaluate('{video.player.currentTime}');
      console.log("-------->onFirstPlay<------4---")
      console.log("kaltura dispatch loadeddata")
      self.dispatchEvent( "loadeddata" );
      console.log("-------->onFirstPlay<------5----tamam---")
      impl.readyState = self.HAVE_FUTURE_DATA;
      self.dispatchEvent( "canplay" );

      mediaReady = true;
      //  console.log(mediaReadyCallbacks[0])
      //console.log(mediaReadyCallbacks[1])
      while( mediaReadyCallbacks.length ) {
        mediaReadyCallbacks[ 0 ]();
        mediaReadyCallbacks.shift();
      }

      // We can't easily determine canplaythrough, but will send anyway.
      impl.readyState = self.HAVE_ENOUGH_DATA;
      self.dispatchEvent( "canplaythrough" );

    }

    function onPlayerStateChange( event ) {
      //uninitialized / loading / ready / playing / paused / buffering / playbackError


      console.log("event",event)
      switch( event ) {

        // ended
        // case YT.PlayerState.ENDED:
        //   onEnded();
        //   break;

        // playing
        case "playing":
          console.log("playing 1")
          if( !firstPlay ) {
            console.log("playing 2")
            // fake ready event
            firstPlay = true;

            // Duration ready happened first, we're now ready.
            if ( durationReady ) {
              // console.log(document.getElementById("lecture_video"))
              // console.log(document.getElementById("lecture_video").innerHTML)
              console.log("playing 3")
              onFirstPlay();
            }
          } else if ( catchRoguePlayEvent ){
            console.log("playing 4")
            catchRoguePlayEvent = false;
            player.pauseVideo();
          } else {
            console.log("playing 5")
            onPlay();
          }
          break;

        // paused
        case "paused":

          // Kaltura fires a paused event before an ended event.
          // We have no need for this.
          if ( player.getDuration() === player.getCurrentTime() ) {
            onEnded();

            break;
          }


          // a seekTo call fires a pause event, which we don't want at this point.
          // as long as a seekTo continues to do this, we can safly toggle this state.
          if ( catchRoguePauseEvent ) {
            catchRoguePauseEvent = false;
            break;
          }
          console.log("---->paused<-----")
          onPause();
          break;

        // buffering
        case "buffering":
          console.log("----->here<-----")
          impl.networkState = self.NETWORK_LOADING;
          self.dispatchEvent( "waiting" );
          break;

        // video cued
        case YT.PlayerState.CUED:
          // XXX: cued doesn't seem to fire reliably, bug in Kaltura api?
          break;
      }

      if ( event.data !== YT.PlayerState.BUFFERING &&
           playerState === YT.PlayerState.BUFFERING ) {
        onProgress();
      }

      playerState = event.data;
    }

    function destroyPlayer() {
      if( !( playerReady && player ) ) {
        return;
      }
      player.stopVideo();
      player.clearVideo();
    }

    function resetPlayer(){
      if( !( playerReady && player ) ) {
        return;
      }
      durationReady = false;
      firstPlay = false;
      clearInterval( currentTimeInterval );
      clearInterval( bufferedInterval );
      player.sendNotification("cleanMedia");
    }

    function destroyElement(){
      if( !( playerReady && player ) ) {
        return;
      }
      parent.removeChild( elem );
      kWidget.destroy(id.split("#")[1]);
      elem = document.createElement( "div" );
      elem.setAttribute('id', 'kalturaVideo')
    }

    parseDuration = function(DurationString) {
      var matches = DurationString.match(/^P([0-9]+Y|)?([0-9]+M|)?([0-9]+D|)?T?([0-9]+H|)?([0-9]+M|)?([0-9]+S|)?$/),
          result = {};

      if (matches) {
          result.year = parseInt(matches[1]) || 0;
          result.month = parseInt(matches[2]) || 0;
          result.day = parseInt(matches[3]) || 0;
          result.hour = parseInt(matches[4]) || 0;
          result.minute = parseInt(matches[5]) || 0;
          result.second = parseInt(matches[6]) || 0;

          result.toString = function() {
              var string = '';

              if (this.year) string += this.year + ' Year' + (this.year == 1 ? '': 's') + ' ';
              if (this.month) string += this.month + ' Month' + (this.month == 1 ? '': 's') + ' ';
              if (this.day) string += this.day + ' Day' + (this.day == 1 ? '': 's') + ' ';
              if (this.hour) string += this.hour + ' Hour' + (this.hour == 1 ? '': 's') + ' ';
              if (this.minute) string += this.minute + ' Minute' + (this.minute == 1 ? '': 's') + ' ';
              if (this.second) string += this.second + ' Second' + (this.second == 1 ? '': 's') + ' ';

              return string;
          }

          return result;
      } else {
          return false;
      }
    }

    function changeSrc( aSrc ) {

      // if( !self._canPlaySrc( aSrc ) ) {
      //   impl.error = {
      //     name: "MediaError",
      //     message: "Media Source Not Supported",
      //     code: MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
      //   };
      //   self.dispatchEvent( "error" );
      //   return;
      // }

      impl.src = aSrc;

      // Make sure Kaltura is ready, and if not, register a callback
      // console.log(1)
      if( !isKalturaReady(aSrc) ) {
        console.log("kaltura not ready adding callback");
        return addKalturaCallback( function() { changeSrc( aSrc ); } );
      }

      console.log("kaltura is ready");


      // console.log(document.getElementById("lecture_video"))
      // console.log(document.getElementById("lecture_video").innerHTML)
      // console.log(8)
      if( playerReady ) {
        resetPlayer();
        resetPlayer();
        destroyElement();
      }


      parent.appendChild( elem );

      // var node = document.createElement("div");                 // Create a <li> node
      // var textnode = document.createTextNode(parent_innerHTML.toString());         // Create a text node
      //node.appendChild(textnode);

      // Use any player vars passed on the URL
      var playerVars = self._util.parseUri( aSrc ).queryKey;

      // Remove the video id, since we don't want to pass it
      delete playerVars.v;

      // Sync autoplay, but manage internally
      impl.autoplay = playerVars.autoplay === "1" || impl.autoplay;
      delete playerVars.autoplay;

      // Sync loop, but manage internally
      impl.loop = playerVars.loop === "1" || impl.loop;
      delete playerVars.loop;

      // Don't show related videos when ending
      playerVars.rel = playerVars.rel || 0;

      // Don't show Kaltura's branding
      playerVars.modestbranding = playerVars.modestbranding || 1;

      // Don't show annotations by default
      playerVars.iv_load_policy = playerVars.iv_load_policy || 3;

      // Don't show video info before playing
      playerVars.showinfo = playerVars.showinfo || 0;

      // Specify our domain as origin for iframe security
      var domain = window.location.protocol === "file:" ? "*" :
        window.location.protocol + "//" + window.location.host;
      playerVars.origin = playerVars.origin || domain;

      // Show/hide controls. Sync with impl.controls and prefer URL value.
      playerVars.controls = playerVars.controls=="1" || impl.controls ? 2 : 0;
      impl.controls = playerVars.controls;

      // Set wmode to transparent to show video overlays
      playerVars.wmode = playerVars.wmode || "opaque";

      // Get video ID out of Kaltura url
      //aSrc = regexKaltura.exec( aSrc )[ 1 ];

      var kalturaIDs = {}
      var frame_src
      frame_src = impl.src.split(" ")[1]
      var frame_src_slash_splitted = frame_src.split('/')
      kalturaIDs.partner_id = frame_src_slash_splitted[4]
      kalturaIDs.uiconf_id  = frame_src_slash_splitted[9]
      var frame_src_equal_splitted
      frame_src_equal_splitted = frame_src.split("=")

      if (frame_src_equal_splitted[4].includes("flashvars")) {//url has flash vars
        var frame_src_equal_and_splitted = frame_src_equal_splitted[4].split('&')
        kalturaIDs.entry_id   = frame_src_equal_and_splitted[0]
      }else{//url has not flash vars
        kalturaIDs.entry_id   = frame_src_equal_splitted[4]
      }
      var targetId = id.split("#")[1]

      setTimeout(function(){
        kWidget.embed({
          'targetId': 'kalturaVideo',
          'wid':  '_'+kalturaIDs.partner_id,
          'uiconf_id' : kalturaIDs.uiconf_id,
          'entry_id' : kalturaIDs.entry_id,
          'flashvars':{
                'autoPlay':false,
                'controlBarContainer.plugin': true,
  	            'largePlayBtn.plugin': false,
  	            'loadingSpinner.plugin': false,
                "sourceSelector": {
          				"plugin" : true,
          				"switchOnResize" : false,
          				"simpleFormat" : true,
          				"displayMode" : "size"
          			},
                "closedCaptions": {
          				"layout" : "ontop",
          				"useCookie" : true,
          				"fontFamily" : "Arial",
          				"fontsize" : "12",
          				"fontColor" : "0xFFFFFF",
          				"bg" : "0x335544",
          				"useGlow" : false,
          				"glowBlur" : "4",
          				"glowColor" : "0x133693",
          				"defaultLanguageKey" : "en",
          				"hideWhenEmpty" : true,
          				"whiteListLanguagesCodes" : "en,es,fr,jp"
          			},
                "playbackRateSelector": {
          				"plugin" : true,
          				"position" : "after",
          				"loadingPolicy" : "onDemand",
          				"defaultSpeed" : "1",
          				"speeds" : ".5,.75,1,1.5,2",
          				"relativeTo" : "PlayerHolder"
          			}
              },
          readyCallback: function( playerId ){
            console.log("playerId", playerId);
            player = document.getElementById( playerId );
            rawPlayer = player.firstChild.contentWindow.document.getElementById(playerId);
            player.kBind("playerReady",function(){
                var duration_secs = parseInt(player.evaluate(" {duration} "));
                impl.duration = duration_secs
                self.dispatchEvent( "durationchange" );
                durationReady = true;
                onFirstPlay();

                var audioAndVideoSources = rawPlayer.plugins.sourceSelector.getSources()
                for(i in audioAndVideoSources){
                   var temp_size = rawPlayer.plugins.sourceSelector.getSourceTitleSize(audioAndVideoSources[i])
                   if (temp_size) {
                    audioAndVideoSources[i].size =temp_size
                    video_srcs.push(audioAndVideoSources[i])
                   }
                }
            });
            player.kBind("playerStateChange",onPlayerStateChange);
         }
        });
      },3000)
    //  console.log(parent_innerHTML)

      // console.log(document.getElementById("lecture_video"))
      // console.log(document.getElementById("lecture_video").innerHTML)
      impl.networkState = self.NETWORK_LOADING;
      self.dispatchEvent( "loadstart" );
      self.dispatchEvent( "progress" );
    }


    function monitorCurrentTime() {
      //console.log("monitor current time")
      var playerTime = getCurrentTime();

      if ( !impl.seeking ) {
        if ( ABS( impl.currentTime - playerTime ) > CURRENT_TIME_MONITOR_MS ) {

          onSeeking();
          onSeeked();
        }
        impl.currentTime = playerTime;
      } else if ( ABS( playerTime - impl.currentTime ) < 1 ) {
        onSeeked();
      }
    }

    function getVideoSrc(srcs,quality){
      console.log(srcs)
      quality = quality.toLowerCase()
      for(i in srcs){
        if (srcs[i].size == quality)
            break;
      }
      return  srcs[i]
    }

    function monitorBuffered() {
      var fraction;
      player.kBind('bufferProgress', function(event){
				fraction=player.evaluate("{video.buffer.percent}")
	    })
      if ( fraction && lastLoadedFraction !== fraction ) {
        lastLoadedFraction = fraction;
        onProgress();
      }
    }

    function getCurrentTime() {
      var t = rawPlayer.evaluate('{video.player.currentTime}');
      impl.currentTime = t;
      return impl.currentTime;
    }

    function changeCurrentTime( aTime ) {
      impl.currentTime = aTime;
      if( !mediaReady ) {
        addMediaReadyCallback( function() {
          onSeeking();
        });
        return;
      }
      onSeeking();
      player.sendNotification("doSeek", aTime);
    }

    function onTimeUpdate() {

      self.dispatchEvent( "timeupdate" );
    }

    function onSeeking() {
      // a seek in Kaltura fires a paused event.
      // we don't want to listen for this, so this state catches the event.
      // catchRoguePauseEvent = true;
      impl.seeking = true;
      self.dispatchEvent( "seeking" );
    }

    function onSeeked() {
      impl.ended = false;
      impl.seeking = false;
      self.dispatchEvent( "timeupdate" );
      self.dispatchEvent( "seeked" );
      self.dispatchEvent( "canplay" );
      self.dispatchEvent( "canplaythrough" );
    }

    function onPlay() {
      console.log("onPlay")
      if( impl.ended ) {
        changeCurrentTime( 0 );
        impl.ended = false;
        console.log("on play")
      }
      if(timeUpdateInterval)
        clearInterval( timeUpdateInterval );
      timeUpdateInterval = setInterval( onTimeUpdate,
                                        self._util.TIMEUPDATE_MS );
      console.log("timeUpdateInterval",timeUpdateInterval)
      impl.paused = false;
      if( playerPaused ) {
        playerPaused = false;
        // Only 1 play when video.loop=true
        if ( ( impl.loop && !loopedPlay ) || !impl.loop ) {
          loopedPlay = true;
          self.dispatchEvent( "play" );
        }
        self.dispatchEvent( "playing" );
      }
    }

    function onProgress() {
      self.dispatchEvent( "progress" );
    }

    self.play = function() {
      impl.paused = false;
      console.log("in play function")
      // if( !mediaReady ) {
      //   addMediaReadyCallback( function() { self.play(); } );
      //   return;
      // }
      // player.playVideo();
      player.sendNotification("doPlay");
    };

    function onPause() {

      impl.paused = true;
      if ( !playerPaused ) {
        playerPaused = true;
        clearInterval( timeUpdateInterval );
        self.dispatchEvent( "pause" );

      }
    }

    self.pause = function() {
      impl.paused = true;
      if( !mediaReady ) {
        addMediaReadyCallback( function() { player.sendNotification("doPause"); } );
        return;
      }
      // if a pause happens while seeking, ensure we catch it.
      // in Kaltura seeks fire pause events, and we don't want to listen to that.
      // except for the case of an actual pause.
      catchRoguePauseEvent = false;
      //player.pauseVideo();
      player.sendNotification("doPause");
    };

    self.getSpeeds = function(){
      console.log("in getgetSpeeds")
      var speed_temp  = player.evaluate('{playbackRateSelector.speeds}')
      return speed_temp.split(",")
    };

    self.setSpeed = function(speed){
      console.log("speed");
      player.sendNotification('playbackRateChangeSpeed', speed );
    }

    self.getAvailableQuality=function(){
          videoQualities =  rawPlayer.plugins.sourceSelector.sourcesList
          for (i in videoQualities ) {videoQualities[i]=videoQualities[i].toLowerCase()}


          return videoQualities
    }

    self.getQuality=function(){
      var videoQualities =  rawPlayer.plugins.sourceSelector.sourcesList
      console.log("-----+videoQualities+-----")
      console.log(videoQualities)
      return videoQualities
    }

    self.setQuality=function(quality){
      //to get actual video source
      //raw.mediaElement.selectedSource
      //to get actual video quality
      //raw.plugins.sourceSelector.getSourceSizeName(raw.mediaElement.selectedSource)
      //to set quality, we must provide corresponding source

      console.log("in set quality")
      console.log(video_srcs)
      console.log(quality)
      var videoSrcOfChosenQuality = getVideoSrc(video_srcs,quality)
      console.log(videoSrcOfChosenQuality)
      rawPlayer.mediaElement.setSource(videoSrcOfChosenQuality)
      console.log("rawPlayer.mediaElement.selectedSource:")
      console.log(rawPlayer.mediaElement.selectedSource)


      changeCurrentTime(getCurrentTime())
      // player.playVideo();
    }

    self.destroy = function(){
      resetPlayer()
    }
    self.getCaptionTracks = function(){

        //  var rawPlayer = player.firstChild.contentWindow.document.getElementById('lecture_video');
          var captionLanguages = []
          var captionObjects   = rawPlayer.plugins.closedCaptions.textSources
          var l = captionObjects.length
          while (l--){
            if(captionObjects[l].loaded){
              captionLanguages.push({'displayName': captionObjects[l].label})
            }
          }
          return captionLanguages
    }

    self.setCaptionTrack = function(track){
      player.sendNotification('showClosedCaptions')
      if(Object.values(track ).length == 0 ) {
        self.unsetCaptionTrack() }
    }
    self.unsetCaptionTrack = function(){
      player.sendNotification('hideClosedCaptions')
    }
    self.showControlBar = function(){
      rawPlayer.plugins.controlBarContainer.show()
      rawPlayer.$interface.prevObject[0].style.height = ''
      rawPlayer.plugins.controlBarContainer.$el[0].style.display = 'inline'
    }
    self.hideControlBar = function (divId){
      console.log("self.hideControlBar")

      rawPlayer.plugins.controlBarContainer.hide()
      rawPlayer.$interface.prevObject[0].style.height = '100%'
      rawPlayer.plugins.controlBarContainer.$el[0].style.display = 'none'
    }
    function onEnded() {
      if( impl.loop ) {
        changeCurrentTime( 0 );
        self.play();
      } else {
        impl.ended = true;

        player.pauseVideo()
        onPause();
        // Kaltura will fire a Playing State change after the video has ended, causing it to loop.
        catchRoguePlayEvent = true;
        self.dispatchEvent( "timeupdate" );
        self.dispatchEvent( "ended" );
      }
    }

    function setVolume( aValue ) {
      impl.volume = aValue;

      player.sendNotification("changeVolume",aValue);
      // if( !mediaReady ) {
      //   addMediaReadyCallback( function() {
      //     setVolume( impl.volume );
      //   });
      //   return;
      // }
      // player.setVolume( impl.volume * 100 );
      // self.dispatchEvent( "volumechange" );
    }

    function getVolume() {
      // Kaltura has getVolume(), but for sync access we use impl.volume
      // setTimeout(function(){
      //   return player.evaluate('{video.volume}')
      // },7000);

    }

    function setMuted( aValue ) {
      // impl.muted = aValue;
      // if( !mediaReady ) {
      //   addMediaReadyCallback( function() { setMuted( impl.muted ); } );
      //   return;
      // }
      // player[ aValue ? "mute" : "unMute" ]();
      // self.dispatchEvent( "volumechange" );


      player.sendNotification("changeVolume",0);
    }

    function getMuted() {
      // Kaltura has isMuted(), but for sync access we use impl.muted
      return impl.muted;
    }

    Object.defineProperties( self, {
      src: {
        get: function() {
          return impl.src;
        },
        set: function( aSrc ) {
          if( aSrc && aSrc !== impl.src ) {
            changeSrc( aSrc );
          }
        }
      },

      autoplay: {
        get: function() {
          return impl.autoplay;
        },
        set: function( aValue ) {
          impl.autoplay = self._util.isAttributeSet( aValue );
        }
      },

      loop: {
        get: function() {
          return impl.loop;
        },
        set: function( aValue ) {
          impl.loop = self._util.isAttributeSet( aValue );
        }
      },

      width: {
        get: function() {
          return self.parentNode.offsetWidth;
        }
      },

      height: {
        get: function() {
          return self.parentNode.offsetHeight;
        }
      },

      currentTime: {
        get: function() {
          return getCurrentTime();
        },
        set: function( aValue ) {
          changeCurrentTime( aValue );
        }
      },

      duration: {
        get: function() {
          return impl.duration;
        }
      },

      ended: {
        get: function() {
          return impl.ended;
        }
      },

      paused: {
        get: function() {
          return impl.paused;
        }
      },

      seeking: {
        get: function() {
          return impl.seeking;
        }
      },

      readyState: {
        get: function() {
          return impl.readyState;
        }
      },

      networkState: {
        get: function() {
          return impl.networkState;
        }
      },

      volume: {
        get: function() {
          // Remap from HTML5's 0-1 to Kaltura's 0-100 range
          var volume = getVolume();
          return volume / 100;
        },
        set: function( aValue ) {
          if( aValue < 0 || aValue > 1 ) {
            throw "Volume value must be between 0.0 and 1.0";
          }
          setVolume( aValue );
        }
      },

      muted: {
        get: function() {
          return getMuted();
        },
        set: function( aValue ) {
          setMuted( self._util.isAttributeSet( aValue ) );
        }
      },

      error: {
        get: function() {
          return impl.error;
        }
      },

      buffered: {
        get: function () {
          var timeRanges = {
            start: function( index ) {
              if ( index === 0 ) {
                return 0;
              }

              //throw fake DOMException/INDEX_SIZE_ERR
              throw "INDEX_SIZE_ERR: DOM Exception 1";
            },
            end: function( index ) {
              if ( index === 0 ) {
                if ( !impl.duration ) {
                  return 0;
                }

                return impl.duration * lastLoadedFraction;
              }

              //throw fake DOMException/INDEX_SIZE_ERR
              throw "INDEX_SIZE_ERR: DOM Exception 1";
            }
          };

          Object.defineProperties( timeRanges, {
            length: {
              get: function() {
                return 1;
              }
            }
          });

          return timeRanges;
        }
      }
    });
  }

  HTMLKalturaVideoElement.prototype = new Popcorn._MediaElementProto();
  HTMLKalturaVideoElement.prototype.constructor = HTMLKalturaVideoElement;
  // HTMLKalturaVideoElement.prototype.getSpeed = getSpeeds();

  // Helper for identifying URLs we know how to play.
  HTMLKalturaVideoElement.prototype._canPlaySrc = function( url ) {
    return (/(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(youtu).*(?:\/|v=)(.{11})/).test( url ) ?
      "probably" :
      EMPTY_STRING;
  };

  // We'll attempt to support a mime type of video/x-Kaltura
  // HTMLKalturaVideoElement.prototype.canPlayType = function( type ) {
  //   return type === "video/x-Kaltura" ? "probably" : EMPTY_STRING;
  // };


  Popcorn.HTMLKalturaVideoElement = function( id ) {
    return new HTMLKalturaVideoElement( id );
  };
  // Popcorn.HTMLKalturaVideoElement._canPlaySrc = HTMLKalturaVideoElement.prototype._canPlaySrc;
  Popcorn.getKalturaPlayer = function(IDs){
    return new getPlayer(IDs);
  }
  // Popcorn.getKalturaVideo = function(url){
  //   console.log("getKalturaVideo")
  //   return new getKalturaVideo(url);
  // }
}( Popcorn, window, document ));
