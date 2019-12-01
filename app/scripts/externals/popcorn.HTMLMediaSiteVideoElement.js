/* istanbul ignore next */
(function( Popcorn, window, document ) {

  var
  CURRENT_TIME_MONITOR_MS = 10,
  EMPTY_STRING = "",

  ABS = Math.abs;

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
      clickMeRemoved = false,
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

      if ( firstPlay ) {
        onFirstPlay();
      }

    }

    function onPlayerError(event) {
      // There's no perfect mapping to HTML5 errors from MediaSite errors.
      var err = { name: "MediaError" };

      switch( event.errorCode ) {

        // invalid parameter
        case 500:
          err.message = "Invalid video parameter.";
          err.code = event.errorCode;
          break;

        // HTML5 Error
        case 424:
          err.message = "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.";
          err.code = event.errorCode;
          break;
        // requested video not found
        case 510:
          err.message = "Video not found.";
          err.code = event.errorCode;
          break;

        // video can't be embedded by request of owner
        case 511:
          err.message = "Video not usable.";
          err.code = event.errorCode;
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
      // Set initial paused state
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
     
      if (!clickMeRemoved){
        document.getElementById('clickMe').setAttribute('style','display:none;')
        clickMeRemoved = true
      }
     
      switch( event.playState ) {

        // ended
        case Mediasite.PlayState.MediaEnded:
          onEnded();
          break;

        // playing
        case Mediasite.PlayState.Playing:
          if( !firstPlay ) {
            // fake ready event
            firstPlay = true;

            // Duration ready happened first, we're now ready.
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

    function changeSrc( aSrc ) {
      if( !self._canPlaySrc( aSrc ) ) {
        impl.error = {
          name: "MediaError",
          message: "Media Source Not Supported",
          code: 511
        };
        self.dispatchEvent( "error" );
        return;
      }
      aSrc = aSrc + (aSrc.indexOf("?") == -1 ? "?" : "&") + "player=MediasiteIntegration"

      impl.src = aSrc;

      if( playerReady ) {
        resetPlayer();
        destroyElement();
      }
      elem.setAttribute("id", elemId)
      appendPlayButton(parent)
      parent.appendChild( elem );
      
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
    function appendPlayButton(parent){
      var play_button_container = document.createElement('DIV')
      play_button_container.className = 'media_site_play_button'
      play_button_container.id = 'clickMe'
      play_button_container.innerHTML = "<button class='media_site_button'>Play</button>";

      parent.appendChild(play_button_container);
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

    function getCurrentTime() {
      return impl.currentTime;
    }

    function changeCurrentTime( aTime ) {
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
    }

    function onSeeking() {
      // a seek in mediasite fires a paused event.
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
    }

    function onProgress() {
      self.dispatchEvent( "progress" );
    }

    self.play = function() {
      impl.paused = false;
      if( !mediaReady ) {
        addMediaReadyCallback( function() { self.play(); } );
        return;
      }
      player.play();
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
    }

    function getVolume() {
      // MediaSite has getVolume(), but for sync access we use impl.volume
      return impl.volume;
    }

    function setMuted( aValue ) {
      impl.muted = aValue;
      if( !mediaReady ) {
        addMediaReadyCallback( function() { setMuted( impl.muted ); } );
        return;
      }
      player[ aValue ? "mute" : "unMute" ]();
      self.dispatchEvent( "volumechange" );
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

  // Helper for identifying URLs we know how to play.
  HTMLMediaSiteVideoElement.prototype._canPlaySrc = function( url ) {
    return (/^(http|https):\/\/.*(\/Play\/)/).test( url ) ?
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
