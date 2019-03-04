/* istanbul ignore next */
(function (Popcorn, window, document) {

  var

    CURRENT_TIME_MONITOR_MS = 10,
    EMPTY_STRING = "",
    ABS = Math.abs,

    // Setup for Kaltura API
    kReady = false,
    kLoaded = false,
    kCallbacks = [];

  function isKalturaReady(url) {
    if (!kLoaded) {//<script src="http://cdnapi.kaltura.com/p/243342/sp/24334200/embedIframeJs/uiconf_id/12905712/partner_id/243342"></script>
      var tag = document.createElement("script");
      var kalturaIDs = extractKalturaIDs(url)
      tag.src = url.toString().split('src="')[1].split("?") //"http://cdnapi.kaltura.com/p/"+kalturaIDs.partner_id+"/sp/"+kalturaIDs.partner_id+"00/embedIframeJs/uiconf_id/"+kalturaIDs.uiconf_id+"/partner_id/"+kalturaIDs.partner_id
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      kLoaded = true;
      kWidgetInterval = setInterval(function () {
        if (window.kWidget) {
          onKalturaAPIReady();
          clearInterval(kWidgetInterval);
        }
      }, 500)
    }
    return kReady;
  };

  function extractKalturaIDs(url) {
    var temp_url = url.toString()
    var kalturaIDs = {}

    kalturaIDs.partner_id = url.match("\/p\/([0-9]+)")[1]
    kalturaIDs.uiconf_id = url.match("\/uiconf_id\/([0-9]+)")[1]
    kalturaIDs.entry_id = url.match("\&entry_id\=([0-9]_[a-z0-9]+)\&")[1]

    return kalturaIDs
  }

  function addKalturaCallback(callback) {
    kCallbacks.unshift(callback);
  }

  function onKalturaAPIReady() {
    kReady = true;
    var i = kCallbacks.length;
    while (i--) {
      if (kCallbacks[i] instanceof Function) kCallbacks[i]();
      delete kCallbacks[i];
    }
  }

  function HTMLKalturaVideoElement(id) {
    // Kaltura iframe API requires postMessage
    if (!window.postMessage) {
      throw "ERROR: HTMLKalturaVideoElement requires window.postMessage";
    }

    var self = this,
      parent = typeof id === "string" ? document.querySelector(id) : id,
      elem = document.createElement("div");
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
      videoQualities = [],
      playerPaused = true,
      mediaReadyCallbacks = [],
      playerState = -1,
      bufferedInterval,
      lastLoadedFraction = 0,
      currentTimeInterval,
      timeUpdateInterval,
      firstPlay = false;
    video_srcs = [];

    // Namespace all events we'll produce
    self._eventNamespace = Popcorn.guid("HTMLKalturaVideoElement::");

    self.parentNode = parent;

    // Mark this as Kaltura
    self._util.type = "Kaltura";

    function addMediaReadyCallback(callback) {
      mediaReadyCallbacks.unshift(callback);
    }

    function onPlayerReady(event) {

      var duration_secs = parseInt(player.evaluate(" {duration} "));
      impl.duration = duration_secs
      self.dispatchEvent("durationchange");
      durationReady = true;
      firstPlay=true
      onFirstPlay();

      var audioAndVideoSources = rawPlayer.plugins.sourceSelector.getSources()
      for (i in audioAndVideoSources) {
        var temp_size = rawPlayer.plugins.sourceSelector.getSourceTitleSize(audioAndVideoSources[i])
        if (temp_size) {
          audioAndVideoSources[i].size = temp_size
          video_srcs.push(audioAndVideoSources[i])
        }
      }

      var onMuted = function () {
        if (player.isMuted()) {
          // force an initial play on the video, to remove autostart on initial seekTo.
          if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i))
            player.sendNotification("doPlay")
          else {
            if (durationReady) {
              onFirstPlay();
            }
          }
        } else {
          setTimeout(onMuted, 0);
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

      switch (event.data) {

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
      self.dispatchEvent("error");
    }

    // This function needs duration and first play to be ready.
    function onFirstPlay() {
      addMediaReadyCallback(function () {
        bufferedInterval = setInterval(monitorBuffered, 50);
      });

      // Set initial paused state
      if (impl.autoplay || !impl.paused) {
        impl.paused = false;
        addMediaReadyCallback(function () {
          onPlay();
        });
      } else {
        catchRoguePauseEvent = false;
        player.sendNotification("doPause");
      }

      impl.readyState = self.HAVE_METADATA;
      self.dispatchEvent("loadedmetadata");
      currentTimeInterval = setInterval(monitorCurrentTime, CURRENT_TIME_MONITOR_MS);
      //cuurentTimeInterval = player.evaluate('{video.player.currentTime}');

      self.dispatchEvent("loadeddata");

      impl.readyState = self.HAVE_FUTURE_DATA;
      self.dispatchEvent("canplay");

      mediaReady = true;
      while (mediaReadyCallbacks.length) {
        mediaReadyCallbacks[0]();
        mediaReadyCallbacks.shift();
      }

      // We can't easily determine canplaythrough, but will send anyway.
      impl.readyState = self.HAVE_ENOUGH_DATA;
      // self.dispatchEvent( "canplaythrough" );

    }

    function onPlayerStateChange(event) {
      //uninitialized / loading / ready / playing / paused / buffering / playbackError
      switch (event) {
        // playing
        case "playing":

          if (!firstPlay) {
            // fake ready event
            firstPlay = true;
            // Duration ready happened first, we're now ready.
            if (durationReady) {
              onFirstPlay();
            }

          } else if (catchRoguePlayEvent) {
            catchRoguePlayEvent = false;
            player.sendNotification("doPause");
          } else {
            onPlay();
          }
          break;

        // paused
        case "paused":

          if (player.getDuration() === rawPlayer.evaluate('{video.player.currentTime}')) {
            onEnded();
            break;
          }

          // a seekTo call fires a pause event, which we don't want at this point.
          // as long as a seekTo continues to do this, we can safly toggle this state.
          if (catchRoguePauseEvent) {
            catchRoguePauseEvent = false;
            break;
          }

          onPause();
          break;

        // buffering
        case "buffering":
          impl.networkState = self.NETWORK_LOADING;
          self.dispatchEvent("waiting");
          break;
      }

      if (event.data !== "buffering" &&
        playerState === "buffering") {
        onProgress();
      }

      playerState = event.data;
    }

    function destroyPlayer() {
      if (!(playerReady && player)) {
        return;
      }
      player.sendNotification("doStop");
      player.sendNotification("cleanMedia");
    }

    function resetPlayer() {
      if (!(playerReady && player)) {
        return;
      }
      durationReady = false;
      firstPlay = false;
      clearInterval(currentTimeInterval);
      clearInterval(bufferedInterval);
      player.sendNotification("cleanMedia");
    }

    function destroyElement() {
      if (!(playerReady && player)) {
        return;
      }
      parent.removeChild(elem);
      kWidget.destroy(id.split("#")[1]);
      elem = document.createElement("div");
      elem.setAttribute('id', 'kalturaVideo')
    }


    function changeSrc(aSrc) {
      impl.src = aSrc;

      if (!isKalturaReady(aSrc)) {
        return addKalturaCallback(function () { changeSrc(aSrc); });
      }

      if (playerReady) {
        resetPlayer();
        resetPlayer();
        destroyElement();
      }

      parent.appendChild(elem);

      var kalturaIDs = extractKalturaIDs(aSrc)

      kWidget.embed({
        'targetId': 'kalturaVideo',
        'wid': '_' + kalturaIDs.partner_id,
        'uiconf_id': kalturaIDs.uiconf_id,
        'entry_id': kalturaIDs.entry_id,
        'flashvars': {
          'autoPlay': false,
          'controlBarContainer.plugin': true,
          'largePlayBtn.plugin': false,
          'loadingSpinner.plugin': false,
          "sourceSelector": {
            "plugin": true,
            "switchOnResize": false,
            "simpleFormat": true,
            "displayMode": "size"
          },
          "closedCaptions": {
            "layout": "ontop",
            "useCookie": true,
            "fontFamily": "Arial",
            "fontsize": "12",
            "fontColor": "0xFFFFFF",
            "bg": "0x335544",
            "useGlow": false,
            "glowBlur": "4",
            "glowColor": "0x133693",
            "defaultLanguageKey": "en",
            "hideWhenEmpty": true,
            "whiteListLanguagesCodes": "en,es,fr,jp,pt"
          },
          "playbackRateSelector": {
            "plugin": true,
            "position": "after",
            "loadingPolicy": "onDemand",
            "defaultSpeed": "1",
            "speeds": ".5,.75,1,1.5,2",
            "relativeTo": "PlayerHolder"
          },
          "KalturaClipDescription": {
            "startTime": 30
          },
          "operationAttributes": {
            "offset": 2000,
            "duration": 10000
          }
        },
        readyCallback: function (playerId) {
          player = document.getElementById(playerId);
          rawPlayer = player.firstChild.contentWindow.document.getElementById(playerId);

          player.kBind("playerReady", onPlayerReady);
          player.kBind("playerPlayEnd", onEnded);
          player.kBind("playerStateChange", onPlayerStateChange);
          player.kBind("mediaError", onPlayerError)
        }
      });
      impl.networkState = self.NETWORK_LOADING;
      self.dispatchEvent("loadstart");
      self.dispatchEvent("progress");
    }


    function monitorCurrentTime() {
      var playerTime = rawPlayer.evaluate('{video.player.currentTime}');
      if (!impl.seeking) {
        if (ABS(impl.currentTime - playerTime) > CURRENT_TIME_MONITOR_MS) {
          onSeeking();
          onSeeked();
        }
        impl.currentTime = playerTime;
      } else if (ABS(playerTime - impl.currentTime) < 1) {
        onSeeked();
      } else if (playerTime == impl.currentTime) {
        onEnded()
      }
    }

    function getVideoSrc(srcs, quality) {
      quality = quality.toLowerCase()
      for (i in srcs) {
        if (srcs[i].size == quality)
          break;
      }
      return srcs[i]
    }

    function monitorBuffered() {
      var fraction = player.evaluate("{video.buffer.percent}")

      if (fraction && lastLoadedFraction !== fraction) {
        lastLoadedFraction = fraction;
        onProgress();
      }
    }

    function getCurrentTime() {
      return impl.currentTime;
    }

    function changeCurrentTime(aTime) {
      impl.currentTime = aTime;
      if (!mediaReady) {
        addMediaReadyCallback(function () {
          onSeeking();
        });
        return;
      }
      onSeeking();
      player.sendNotification("doSeek", aTime);
    }

    function onTimeUpdate() {
      self.dispatchEvent("timeupdate");
    }

    function onSeeking() {
      // a seek in Kaltura fires a paused event.
      // we don't want to listen for this, so this state catches the event.
      // catchRoguePauseEvent = true;
      impl.seeking = true;
      self.dispatchEvent("seeking");
    }

    function onSeeked() {
      impl.ended = false;
      impl.seeking = false;
      self.dispatchEvent("timeupdate");
      self.dispatchEvent("seeked");
      self.dispatchEvent("canplay");
      self.dispatchEvent("canplaythrough");
    }

    function onPlay() {
      if (impl.ended) {
        changeCurrentTime(0);
        impl.ended = false;
      }
      if (timeUpdateInterval)
        clearInterval(timeUpdateInterval);
      timeUpdateInterval = setInterval(onTimeUpdate,
        self._util.TIMEUPDATE_MS);
      impl.paused = false;
      if (playerPaused) {
        playerPaused = false;
        // Only 1 play when video.loop=true
        if ((impl.loop && !loopedPlay) || !impl.loop) {
          loopedPlay = true;
          self.dispatchEvent("play");
        }
        self.dispatchEvent("play");
      }
    }

    function onProgress() {
      self.dispatchEvent("progress");
    }

    self.play = function () {
      impl.paused = false;
      if (!mediaReady) {
        addMediaReadyCallback(function () { self.play(); });
        return;
      }
      player.sendNotification("doPlay");
    };

    function onPause() {
      impl.paused = true;
      if (!playerPaused) {
        playerPaused = true;
        clearInterval(timeUpdateInterval);
        self.dispatchEvent("pause");
      }
    }
    self.pauseAfterSeek = function (time) {      
      rawPlayer.seek(time,true)
      impl.paused = true;
    };

    self.pause = function () {
      impl.paused = true;
      if (!mediaReady) {
        addMediaReadyCallback(function () { self.pause(); });
        return;
      }
      // if a pause happens while seeking, ensure we catch it.
      // in youtube seeks fire pause events, and we don't want to listen to that.
      // except for the case of an actual pause.
      catchRoguePauseEvent = false;
      player.sendNotification("doPause")
    };

    self.getSpeeds = function () {
      var speed_temp = player.evaluate('{playbackRateSelector.speeds}')
      return speed_temp.split(",")
    };

    self.setSpeed = function (speed) {
      player.sendNotification('playbackRateChangeSpeed', speed);
    }

    self.getAvailableQuality = function () {
      videoQualities = rawPlayer.plugins.sourceSelector.sourcesList
      for (i in videoQualities) {
        videoQualities[i] = videoQualities[i].toLowerCase()
      }
      return videoQualities
    }

    self.getQuality = function () {
      var videoQualities = rawPlayer.plugins.sourceSelector.sourcesList
      return videoQualities
    }

    self.setQuality = function (quality) {
      var videoSrcOfChosenQuality = getVideoSrc(video_srcs, quality)
      rawPlayer.mediaElement.setSource(videoSrcOfChosenQuality)
      changeCurrentTime(getCurrentTime())
      // player.playVideo();
    }

    self.destroy = function () {
      resetPlayer()
    }
    self.getCaptionTracks = function(){
      var captionLanguages = []
      rawPlayer.plugins.closedCaptions.textSources.forEach(function(textSource){        
        captionLanguages.push({'displayName': textSource.title})
      })
      return captionLanguages
    }

    self.setCaptionTrack = function (track) {
      if (Object.values(track).length == 0) {
        self.unsetCaptionTrack()
      } else {
        var closedCaptionPlugin = rawPlayer.plugins.closedCaptions
        closedCaptionPlugin.textSources.forEach(function (textSource) {
          if (textSource.title == track.displayName) {
            closedCaptionPlugin.selectSource(textSource)
            player.sendNotification('showClosedCaptions')
            return;
          }
        })
      }
    }

    self.unsetCaptionTrack = function () {
      player.sendNotification('hideClosedCaptions')
    }

    self.showControlBar = function () {
      rawPlayer.plugins.controlBarContainer.show()
      rawPlayer.getVideoHolder()[0].style.height = ''
      rawPlayer.getControlBarContainer()[0].style.display = "inline"
    }

    self.hideControlBar = function () {
      rawPlayer.plugins.controlBarContainer.hide()
      rawPlayer.getVideoHolder()[0].style.height = '100%'
      rawPlayer.getControlBarContainer()[0].style.display = "none"
    }

    function onEnded() {
      if (impl.loop) {
        changeCurrentTime(0); 
        self.play();
      } else {
        impl.ended = true;
        onPause();
        // Kaltura will fire a Playing State change after the video has ended, causing it to loop.
        catchRoguePlayEvent = true;
        self.dispatchEvent("timeupdate");
        self.dispatchEvent("ended");
      }
    }

    function setVolume(aValue) {
      impl.volume = aValue;
      player.sendNotification("changeVolume", aValue);
      self.dispatchEvent("volumechange");
    }

    function getVolume() {
      return impl.volume;
    }

    function setMuted(aValue) {
      impl.muted = aValue;
      if (!mediaReady) {
        addMediaReadyCallback(function () { setMuted(impl.muted); });
        return;
      }
      player.sendNotification("changeVolume", 0);
      self.dispatchEvent("volumechange");
    }

    function getMuted() {
      return impl.muted;
    }

    Object.defineProperties(self, {
      src: {
        get: function () {
          return impl.src;
        },
        set: function (aSrc) {
          if (aSrc && aSrc !== impl.src) {
            changeSrc(aSrc);
          }
        }
      },

      autoplay: {
        get: function () {
          return impl.autoplay;
        },
        set: function (aValue) {
          impl.autoplay = self._util.isAttributeSet(aValue);
        }
      },

      loop: {
        get: function () {
          return impl.loop;
        },
        set: function (aValue) {
          impl.loop = self._util.isAttributeSet(aValue);
        }
      },

      width: {
        get: function () {
          return self.parentNode.offsetWidth;
        }
      },

      height: {
        get: function () {
          return self.parentNode.offsetHeight;
        }
      },

      currentTime: {
        get: function () {
          return getCurrentTime();
        },
        set: function (aValue) {

          changeCurrentTime(aValue);
        }
      },

      duration: {
        get: function () {
          return impl.duration;
        }
      },

      ended: {
        get: function () {
          return impl.ended;
        }
      },

      paused: {
        get: function () {
          return impl.paused;
        }
      },

      seeking: {
        get: function () {
          return impl.seeking;
        }
      },

      readyState: {
        get: function () {
          return impl.readyState;
        }
      },

      networkState: {
        get: function () {
          return impl.networkState;
        }
      },

      volume: {
        get: function () {
          // Remap from HTML5's 0-1 to Kaltura's 0-100 range
          var volume = getVolume();
          return volume / 100;
        },
        set: function (aValue) {
          if (aValue < 0 || aValue > 1) {
            throw "Volume value must be between 0.0 and 1.0";
          }
          setVolume(aValue);
        }
      },

      muted: {
        get: function () {
          return getMuted();
        },
        set: function (aValue) {
          setMuted(self._util.isAttributeSet(aValue));
        }
      },

      error: {
        get: function () {
          return impl.error;
        }
      },

      buffered: {
        get: function () {
          var timeRanges = {
            start: function (index) {
              if (index === 0) {
                return 0;
              }
              //throw fake DOMException/INDEX_SIZE_ERR
              throw "INDEX_SIZE_ERR: DOM Exception 1";
            },
            end: function (index) {
              if (index === 0) {
                if (!impl.duration) {
                  return 0;
                }

                return impl.duration * lastLoadedFraction;
              }

              //throw fake DOMException/INDEX_SIZE_ERR
              throw "INDEX_SIZE_ERR: DOM Exception 1";
            }
          };

          Object.defineProperties(timeRanges, {
            length: {
              get: function () {
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

  Popcorn.HTMLKalturaVideoElement = function (id) {
    return new HTMLKalturaVideoElement(id);
  };

}(Popcorn, window, document));
