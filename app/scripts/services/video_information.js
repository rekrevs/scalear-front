'use strict';

angular.module('scalearAngularApp')
  .factory('VideoInformation', ['$http', '$q', '$interval', function($http, $q, $interval) {

    var youtube_video_information = {},
    duration= 0,
    current_time= 0, 
    volume= 0.8,
    speed= 1,
    quality= "720p";

    function generateYoutubeApiVideoUrl(id) {
      return "https://www.googleapis.com/youtube/v3/videos?id=" +
        id +
        "&key=AIzaSyAztqrTO5FZE2xPI4XDYbLeOXE0vtWoTMk" +
        "&callback=JSON_CALLBACK" +
        "&part=status,contentDetails,snippet"
    }

    function requestInfoFromYoutube(id) {
      var deferred = $q.defer();
      var url = generateYoutubeApiVideoUrl(id)
      if(!youtube_video_information[url]) {
        $http.jsonp(url).then(function(resp) {
          youtube_video_information[url] = resp.data
          deferred.resolve(youtube_video_information[url])
        })
        .catch(function(resp){
          emptyCachedInfo()
          deferred.reject(resp)
        })
      } else {
        deferred.resolve(youtube_video_information[url])
      }
      return deferred.promise;
    }

    function emptyCachedInfo(){
      youtube_video_information = {}
    }

    function isYoutube(url) {
      var match = url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)([^\s&]{11})/);
      if(!match)
        return url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)?([^\s&]{11})/);
      else return match
    }

    function isFinalUrl(url) {
      return url.match(/^(http|https):\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[\W\w]*$/);
    }

    function getFinalUrl(id) {
      return "https://www.youtube.com/watch?v=" + id;
    }

    function isMP4(url) {
      return url.match(/(.*mp4$)/);
    }

    function isMediaSite(url) {
      return url.match(/(\/Play\/)/)
    }

    function invalidUrl(url) {
      return(url.trim().length <= 0 && !isMP4(url) && !isYoutube(url) && !isMediaSite(url))
    }

    function setDuration(newDuration) {
      duration = newDuration
    }

    function waitForMediaSiteDurationSetup() {
      var deferred = $q.defer();
      var watchDuration = $interval(function(){
        if(duration){
          deferred.resolve(duration)
          $interval.cancel(watchDuration);
        }
      }, 500)
      return deferred.promise;
    }

    function resetValues(argument) {
      duration= 0
      current_time= 0 
      volume= 0.8
      speed= 1
      quality= "720p";
    }


    return {
      duration: duration,
      current_time: current_time, 
      volume: volume,
      speed: speed,
      quality: quality,
      requestInfoFromYoutube: requestInfoFromYoutube,
      isFinalUrl: isFinalUrl,
      isMP4: isMP4,
      invalidUrl: invalidUrl,
      getFinalUrl: getFinalUrl,
      isYoutube: isYoutube,
      emptyCachedInfo: emptyCachedInfo,
      waitForMediaSiteDurationSetup: waitForMediaSiteDurationSetup,
      setDuration: setDuration,
      resetValues: resetValues,
      isMediaSite: isMediaSite
    };

  }]);
