'use strict';

angular.module('scalearAngularApp')
  .factory('VideoInformation', ['$http', '$q', '$interval', function($http, $q, $interval) {

    var service = {
      youtube_video_information: {},
      duration: 0,
      current_time: 0,
      volume: 0.8,
      speed: 1,
      quality: "720p"
    }

    function generateYoutubeApiVideoUrl(id) {
      return "https://www.googleapis.com/youtube/v3/videos?id=" +
        id +
        "&key=AIzaSyAztqrTO5FZE2xPI4XDYbLeOXE0vtWoTMk" +
        "&callback=JSON_CALLBACK" +
        "&part=status,contentDetails,snippet"
    }

    service.requestInfoFromYoutube=function(id) {
      var deferred = $q.defer();
      var url = generateYoutubeApiVideoUrl(id)
      if(!service.youtube_video_information[url]) {
        $http.jsonp(url).then(function(resp) {
          service.youtube_video_information[url] = resp.data
          deferred.resolve(service.youtube_video_information[url])
        })
        .catch(function(resp){
          emptyCachedInfo()
          deferred.reject(resp)
        })
      } else {
        deferred.resolve(service.youtube_video_information[url])
      }
      return deferred.promise;
    }

    service.emptyCachedInfo=function(){
      service.youtube_video_information = {}
    }
    service.isYoutube=function(url) {
      var match = url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)([^\s&]{11})/);
      if(!match)
        return url.match(/(?:https?:\/{2})?(?:w{3}\.)?(?:youtu|y2u)(?:be)?\.(?:com|be)(?:\/watch\?v=|\/).*(?:v=)?([^\s&]{11})/);
      else return match
    }
    service.isFinalUrl=function(url) {
      return url.match(/^(http|https):\/\/www\.youtube\.com\/watch\?v=[^\s]{11}[\W\w]*$/);
    }
    service.getFinalUrl = function(id) {
      return "https://www.youtube.com/watch?v=" + id;
    }
    service.isMP4 = function (url) {
      return url.match(/(.*mp4$)/) || url.match(/(.*m4v$)/);
    }
    service.isHTML5 = function (url) {
      return url.match(/(.*webm$)/) || url.match(/(.*ogv$)/)
    }
    service.isMediaSite = function (url) {
      return url.match(/^(http|https):\/\/.*(\/Play\/)/)
    }
    service.isKaltura=function(url) {
      return url.match(/https?:\/\/.*\/[a-zA-Z]+\/[0-9]+\/[a-zA-Z]+\/[0-9]+00\/[a-zA-Z]+\/uiconf_id\/([0-9]+)\/partner_id\/([0-9]+).*&entry_id=(.+)(&.*)?/)
    }
    service.invalidUrl=function(url) {
      return (url.trim().length <= 0 || (!service.isMP4(url) && !service.isYoutube(url) && !service.isMediaSite(url) && !service.isKaltura(url) && !service.isHTML5(url)) )
    }
    service.setDuration=function(newDuration) {
      service.duration = newDuration
    }
    service.waitForDurationSetup=function() {
      var deferred = $q.defer();
      var watchDuration = $interval(function(){
        if(service.duration){ 
          deferred.resolve(service.duration)
          $interval.cancel(watchDuration); 
        }
      }, 500)
      return deferred.promise;
    }

    service.resetValues=function() {
      service.duration= 0
      service.current_time= 0
      service.volume= 0.8
      service.speed= 1
      service.quality= "720p";
    }
    return service;

  }]);
