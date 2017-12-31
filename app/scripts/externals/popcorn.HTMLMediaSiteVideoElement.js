/* istanbul ignore next */
(function( Popcorn, window, document ) {

  var

  CURRENT_TIME_MONITOR_MS = 10,
  EMPTY_STRING = "",

  // Example: http://www.mediasite.com/watch?v=12345678901
  regexMediaSite = /^.*(?:\/|v=)(.{11})/,

  ABS = Math.abs;

  // Setup for MediaSite API
  // msReady = false,
  // msLoaded = false,
  // msCallbacks = [];

  // function isMediaSiteReady() {
  //   // If the MediaSite iframe API isn't injected, to it now.
  //   if( !msLoaded ) {
  //     var tag = document.createElement( "script" );
  //     var protocol = window.location.protocol === "file:" ? "http:" : "";

  //     tag.src = protocol + "//www.mediasite.com/iframe_api";
  //     var firstScriptTag = document.getElementsByTagName( "script" )[ 0 ];
  //     firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
  //     msLoaded = true;
  //   }
  //   return msReady;
  // }

  // function addMediaSiteCallback( callback ) {
  //   msCallbacks.unshift( callback );
  // }

  // An existing MediaSite references can break us.
  // Remove it and use the one we can trust.
  // if ( window.Mediasite ) {
  //   window.quarantineMediasite = window.Mediasite;
  //   window.Mediasite = null;
  // }

  // window.onMediaSiteIframeAPIReady = function() {
  //   msReady = true;
  //   var i = msCallbacks.length;
  //   while( i-- ) {
  //     msCallbacks[ i ]();
  //     delete msCallbacks[ i ];
  //   }
  // };

  function HTMLMediaSiteVideoElement( id ) {

    // MediaSite iframe API requires postMessage
    if( !window.postMessage || !window.JSON ) {
      throw "ERROR: HTMLMediaSiteVideoElement requires window.postMessage";
    }

    var self = this,
      parent = typeof id === "string" ? document.querySelector( id ) : id,
      elem = document.createElement( "div" ),
      elemId = "mediaSiteVideoId",
      impl = {
        src: EMPTY_STRING,
        networkState: self.NETWORK_EMPTY,
        readyState: self.HAVE_NOTHING,
        seeking: false,
        autoplay: EMPTY_STRING,
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
      playerPaused = true,
      mediaReadyCallbacks = [],
      playerState = -1,
      bufferedInterval,
      lastLoadedFraction = 0,
      currentTimeInterval,
      timeUpdateInterval,
      firstPlay = false;

    // Namespace all events we'll produce
    self._eventNamespace = Popcorn.guid( "HTMLMediaSiteVideoElement::" );

    self.parentNode = parent;

    // Mark this as MediaSite
    self._util.type = "MediaSite";

    function addMediaReadyCallback( callback ) {
      mediaReadyCallbacks.unshift( callback );
    }

    function onPlayerReady( event ) {
      var onMuted = function() {
        if ( player.isMuted() ) {
          // force an initial play on the video, to remove autostart on initial seekTo.
          if ( !navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) ){
            player.play();
          }
          else{
            if ( durationReady ) {
              onFirstPlay();
            }
          }
        } else {
          setTimeout( onMuted, 0 );
        }
      };
      playerReady = true;

      // Browsers using flash will have the pause() call take too long and cause some
      // sound to leak out. Muting before to prevent this.
      player.mute();
      
      impl.duration = player.getDuration()
      self.dispatchEvent( "durationchange" );
      durationReady = true;
      // ensure we are muted.
      onMuted();
      console.log("onPlayerReady firstPlay", firstPlay )

      if ( firstPlay ) {
        onFirstPlay();
      }

    }

    function onPlayerError(event) {
      // There's no perfect mapping to HTML5 errors from MediaSite errors.
      console.log("onPlayerError", event.errorCode )
      var err = { name: "MediaError" };

      switch( event.errorCode ) {

        // invalid parameter
        case 500:
          err.message = "Invalid video parameter.";
          err.code = MediaError.MEDIA_ERR_ABORTED;
          break;

        // HTML5 Error
        case 424:
          err.message = "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.";
          err.code = MediaError.MEDIA_ERR_DECODE;
          break;
        // requested video not found
        case 510:
          err.message = "Video not found.";
          err.code = MediaError.MEDIA_ERR_NETWORK;
          break;

        // video can't be embedded by request of owner
        case 511:
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
      // addMediaReadyCallback(function() {
      //   bufferedInterval = setInterval( monitorBuffered, 50 );
      // });

      // Set initial paused state
      console.log("onFirstPlay", impl )
      if( impl.autoplay || !impl.paused ) {
        impl.paused = false;
        addMediaReadyCallback(function() {
          onPlay();
        });
      } else {
        // if a pause happens while seeking, ensure we catch it.
        // in mediasite seeks fire pause events, and we don't want to listen to that.
        // except for the case of an actual pause.
        catchRoguePauseEvent = false;
        player.pause();
      }

      // Ensure video will now be unmuted when playing due to the mute on initial load.
      if( !impl.muted ) {
        player.unMute();
      }

      impl.readyState = self.HAVE_METADATA;
      self.dispatchEvent( "loadedmetadata" );
      currentTimeInterval = setInterval( monitorCurrentTime,
                                         CURRENT_TIME_MONITOR_MS );

      self.dispatchEvent( "loadeddata" );

      impl.readyState = self.HAVE_FUTURE_DATA;
      self.dispatchEvent( "canplay" );

      mediaReady = true;
      while( mediaReadyCallbacks.length ) {
        mediaReadyCallbacks[ 0 ]();
        mediaReadyCallbacks.shift();
      }

      // We can't easily determine canplaythrough, but will send anyway.
      impl.readyState = self.HAVE_ENOUGH_DATA;
      self.dispatchEvent( "canplaythrough" );
    }

    function onPlayerStateChange( event ) {

      console.log("onPlayerStateChange", event.playState,  Mediasite.PlayState.Playing)

      switch( event.playState ) {

        // ended
        case Mediasite.PlayState.MediaEnded:
          onEnded();
          break;

        // playing
        case Mediasite.PlayState.Playing:
        console.log("playing state1 firstPlay",firstPlay)
          if( !firstPlay ) {
            // fake ready event
            firstPlay = true;

            // Duration ready happened first, we're now ready.
            console.log("playing state2 durationReady",durationReady)
            if ( durationReady ) {
              onFirstPlay();
            }
          } else if ( catchRoguePlayEvent ) {
            catchRoguePlayEvent = false;
            player.pause();
          } else {
            onPlay();
          }
          break;

        // paused
        case Mediasite.PlayState.Paused:

          // Youtube fires a paused event before an ended event.
          // We have no need for this.
          if ( player.getDuration() === player.getCurrentTime() ) {
            break;
          }

          // a seekTo call fires a pause event, which we don't want at this point.
          // as long as a seekTo continues to do this, we can safly toggle this state.
          if ( catchRoguePauseEvent ) {
            catchRoguePauseEvent = false;
            break;
          }
          onPause();
          break;

        // buffering
        case Mediasite.PlayState.Buffering:
          impl.networkState = self.NETWORK_LOADING;
          self.dispatchEvent( "waiting" );
          break;
      }

      if ( event.state !== Mediasite.PlayState.Buffering &&
           playerState === Mediasite.PlayState.Buffering ) {
        onProgress();
      }

      playerState = event.state;
    }

    function destroyPlayer() {
      if( !( playerReady && player ) ) {
        return;
      }
      player.stop();
      // player.clearVideo();
    }

    function resetPlayer(){
      if( !( playerReady && player ) ) {
        return;
      }
      durationReady = false;
      firstPlay = false;
      clearInterval( currentTimeInterval );
      clearInterval( bufferedInterval );
    }

    function destroyElement(){
      if( !( playerReady && player ) ) {
        return;
      }
      parent.removeChild( elem );
      elem = document.createElement( "div" );
      elem.setAttribute("id", elemId)
    }

    // parseDuration = function(DurationString) {
    //   var matches = DurationString.match(/^P([0-9]+Y|)?([0-9]+M|)?([0-9]+D|)?T?([0-9]+H|)?([0-9]+M|)?([0-9]+S|)?$/),
    //       result = {};

    //   if (matches) {
    //       result.year = parseInt(matches[1]) || 0;
    //       result.month = parseInt(matches[2]) || 0;
    //       result.day = parseInt(matches[3]) || 0;
    //       result.hour = parseInt(matches[4]) || 0;
    //       result.minute = parseInt(matches[5]) || 0;
    //       result.second = parseInt(matches[6]) || 0;

    //       result.toString = function() {
    //           var string = '';

    //           if (this.year) string += this.year + ' Year' + (this.year == 1 ? '': 's') + ' ';
    //           if (this.month) string += this.month + ' Month' + (this.month == 1 ? '': 's') + ' ';
    //           if (this.day) string += this.day + ' Day' + (this.day == 1 ? '': 's') + ' ';
    //           if (this.hour) string += this.hour + ' Hour' + (this.hour == 1 ? '': 's') + ' ';
    //           if (this.minute) string += this.minute + ' Minute' + (this.minute == 1 ? '': 's') + ' ';
    //           if (this.second) string += this.second + ' Second' + (this.second == 1 ? '': 's') + ' ';

    //           return string;
    //       }

    //       return result;
    //   } else {
    //       return false;
    //   }
    // }

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
      console.log("aSrc", aSrc)
      aSrc = aSrc || 'https://lecturenet.uu.nl/Site1/Play/4d777617e37a41fc824846576e8ab37a1d'
      aSrc = aSrc + (aSrc.indexOf("?") == -1 ? "?" : "&") + "player=MediasiteIntegration"

      impl.src = aSrc;

      // Make sure MediaSite is ready, and if not, register a callback
      // if( !isMediaSiteReady() ) {
      //   addMediaSiteCallback( function() { changeSrc( aSrc ); } );
      //   return;
      // }

      if( playerReady ) {
        resetPlayer();
        destroyElement();
      }
      elem.setAttribute("id", elemId)
      parent.appendChild( elem );

      // Use any player vars passed on the URL
      // var playerVars = self._util.parseUri( aSrc ).queryKey;

      // Remove the video id, since we don't want to pass it
      // delete playerVars.v;

      // Sync autoplay, but manage internally
      // impl.autoplay = playerVars.autoplay === "1" || impl.autoplay;
      // delete playerVars.autoplay;

      // Sync loop, but manage internally
      // impl.loop = playerVars.loop === "1" || impl.loop;
      // delete playerVars.loop;

      // Don't show related videos when ending
      // playerVars.rel = playerVars.rel || 0;

      // Don't show MediaSite's branding
      // playerVars.modestbranding = playerVars.modestbranding || 1;

      // Don't show annotations by default
      // playerVars.iv_load_policy = playerVars.iv_load_policy || 3;

      // Don't show video info before playing
      // playerVars.showinfo = playerVars.showinfo || 0;

      // Specify our domain as origin for iframe security
      // var domain = window.location.protocol === "file:" ? "*" :
        // window.location.protocol + "//" + window.location.host;
      // playerVars.origin = playerVars.origin || domain;

      // Show/hide controls. Sync with impl.controls and prefer URL value.
      // playerVars.controls = playerVars.controls=="1" || impl.controls ? 2 : 0;
      // impl.controls = playerVars.controls;

      // Set wmode to transparent to show video overlays
      // playerVars.wmode = playerVars.wmode || "opaque";

      // Get video ID out of mediasite url
      // aSrc = regexMediaSite.exec( aSrc )[ 1 ];

      // // var xhrURL = "https://gdata.mediasite.com/feeds/api/videos/" + aSrc + "?v=2&alt=jsonc&callback=?";
      // var xhrURL = "https://www.googleapis.com/mediasite/v3/videos?id=" + aSrc + "&part=contentDetails&key=AIzaSyAztqrTO5FZE2xPI4XDYbLeOXE0vtWoTMk&fields=items(contentDetails(duration))"
      // // Get duration value.

      // Popcorn.getJSONP( xhrURL, function( resp ) {
      //   var warning = "failed to retreive duration data, reason: ";
      //   if ( resp.error ) {
      //     console.warn( warning + resp.error.message );
      //     return ;
      //   } else if ( !resp.items || resp.items.length ==0 ) {
      //     console.warn( warning + "no response data" );
      //     return;
      //   }

      //   var duration = parseDuration(resp.items[0].contentDetails.duration)
      //   impl.duration = duration.hour*(60*60)+duration.minute*(60)+duration.second//resp.data.duration;
      //   self.dispatchEvent( "durationchange" );
      //   durationReady = true;

      //   // First play happened first, we're now ready.
      //   if ( firstPlay ) {
      //     onFirstPlay();
      //   }
      // });

      console.log("media url set", aSrc)
      player = new Mediasite.Player(elemId, {
        url: aSrc,
        events: {
          'ready': onPlayerReady,
          'error': onPlayerError,
          'playstatechanged': onPlayerStateChange
        },
        layoutOptions: {
          ShowStateMessages: false,
          Gutter: 0,
          FrameWidth:0
        } 
      });

      impl.networkState = self.NETWORK_LOADING;
      self.dispatchEvent( "loadstart" );
      self.dispatchEvent( "progress" );
    }

    function monitorCurrentTime() {
      var playerTime = player.getCurrentTime();
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

    // function monitorBuffered() {
    //   var fraction = player.getVideoLoadedFraction();

    //   if ( fraction && lastLoadedFraction !== fraction ) {
    //     lastLoadedFraction = fraction;
    //     onProgress();
    //   }
    // }

    function getCurrentTime() {
      return impl.currentTime;
    }

    function changeCurrentTime( aTime ) {
      console.log("changing to", aTime)
      impl.currentTime = aTime;
      if( !mediaReady ) {
        addMediaReadyCallback( function() {

          onSeeking();
          player.seekTo( aTime );
        });
        return;
      }

      onSeeking();
      player.seekTo( aTime );
    }

    function onTimeUpdate() {
      self.dispatchEvent( "timeupdate" );
      console.log("onTimeUpdate")
    }

    function onSeeking() {
      // a seek in mediasite fires a paused event.
      // we don't want to listen for this, so this state catches the event.
      // catchRoguePauseEvent = true;
      impl.seeking = true;
      self.dispatchEvent( "seeking" );
      console.log("onSeeking")
    }

    function onSeeked() {
      impl.ended = false;
      impl.seeking = false;
      self.dispatchEvent( "timeupdate" );
      self.dispatchEvent( "seeked" );
      self.dispatchEvent( "canplay" );
      self.dispatchEvent( "canplaythrough" );
      console.log("onSeeked")
    }

    function onPlay() {

      if( impl.ended ) {
        changeCurrentTime( 0 );
        impl.ended = false;
      }
      if(timeUpdateInterval)
        clearInterval( timeUpdateInterval );
      timeUpdateInterval = setInterval( onTimeUpdate,
                                        self._util.TIMEUPDATE_MS );
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
      console.log("onPlay")
    }

    function onProgress() {
      self.dispatchEvent( "progress" );
      console.log("onProgress")
    }

    self.play = function() {
      impl.paused = false;
      if( !mediaReady ) {
        addMediaReadyCallback( function() { self.play(); } );
        return;
      }
      player.play();
      console.log("play")
    };

    function onPause() {
      impl.paused = true;
      if ( !playerPaused ) {
        playerPaused = true;
        clearInterval( timeUpdateInterval );
        self.dispatchEvent( "pause" );
      }
      console.log("onPause")
    }

    self.pause = function() {
      impl.paused = true;
      if( !mediaReady ) {
        addMediaReadyCallback( function() { self.pause(); } );
        return;
      }
      // if a pause happens while seeking, ensure we catch it.
      // in mediasite seeks fire pause events, and we don't want to listen to that.
      // except for the case of an actual pause.
      catchRoguePauseEvent = false;
      player.pause();
    };

    self.getSpeeds = function(){
      return [1]
    };

    self.setSpeed = function(speed){
      //Not Supported by MediaSite API
    }

    self.getAvailableQuality=function(){
      return []
    }

    self.getQuality=function(){
      return "Normal"
    }

    self.setQuality=function(quality){
      //Not Supported by MediaSite API
    }

    self.destroy = function(){
      resetPlayer()
    }

    function onEnded() {
      if( impl.loop ) {
        changeCurrentTime( 0 );
        self.play();
      } else {
        impl.ended = true;

        player.pause()
        onPause();
        // MediaSite will fire a Playing State change after the video has ended, causing it to loop.
        catchRoguePlayEvent = true;
        self.dispatchEvent( "timeupdate" );
        self.dispatchEvent( "ended" );
      }
      console.log("onEnded")
    }

    function setVolume( aValue ) {
      impl.volume = aValue;
      if( !mediaReady ) {
        addMediaReadyCallback( function() {
          setVolume( impl.volume );
        });
        return;
      }
      player.setVolume( impl.volume * 100 );
      self.dispatchEvent( "volumechange" );
      console.log("setVolume")
    }

    function getVolume() {
      // MediaSite has getVolume(), but for sync access we use impl.volume
      return impl.volume;
      console.log("getVolume")
    }

    function setMuted( aValue ) {
      impl.muted = aValue;
      if( !mediaReady ) {
        addMediaReadyCallback( function() { setMuted( impl.muted ); } );
        return;
      }
      player[ aValue ? "mute" : "unMute" ]();
      self.dispatchEvent( "volumechange" );
      console.log("mute")
    }

    function getMuted() {
      // MediaSite has isMuted(), but for sync access we use impl.muted
      return impl.muted;
    }

    Object.defineProperties( self, {
      src: {
        get: function() {
          return impl.src;
        },
        set: function( aSrc ) {
          console.log("setting")
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
          // Remap from HTML5's 0-1 to MediaSite's 0-100 range
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

  HTMLMediaSiteVideoElement.prototype = new Popcorn._MediaElementProto();
  HTMLMediaSiteVideoElement.prototype.constructor = HTMLMediaSiteVideoElement;
  // HTMLMediaSiteVideoElement.prototype.getSpeed = getSpeeds();

  // Helper for identifying URLs we know how to play.
  HTMLMediaSiteVideoElement.prototype._canPlaySrc = function( url ) {
    return (/(?:http:\/\/www\.|http:\/\/|www\.|\.|^)(youtu).*(?:\/|v=)(.{11})/).test( url ) ?
      "probably" :
      EMPTY_STRING;
  };

  // We'll attempt to support a mime type of video/x-mediasite
  HTMLMediaSiteVideoElement.prototype.canPlayType = function( type ) {
    return type === "video/x-mediasite" ? "probably" : EMPTY_STRING;
  };

  Popcorn.HTMLMediaSiteVideoElement = function( id ) {
    return new HTMLMediaSiteVideoElement( id );
  };
  Popcorn.HTMLMediaSiteVideoElement._canPlaySrc = HTMLMediaSiteVideoElement.prototype._canPlaySrc;

}( Popcorn, window, document ));
