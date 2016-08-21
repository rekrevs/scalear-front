'use strict';

angular.module('scalearAngularApp')
  .factory('VideoInformation', ['$http', '$q', function($http, $q) {

    var youtube_video_information = {}

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
          youtube_video_information = {}
          deferred.reject(resp)
        })
      } else {
        deferred.resolve(youtube_video_information[url])
      }
      return deferred.promise;
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

    function invalidUrl(url) {
      return(!isMP4(url) && !isYoutube(url) && url.trim().length > 0)
    }


    return {
      duration: 0,
      volume: 0.8,
      speed: 1,
      quality: "720p",
      requestInfoFromYoutube: requestInfoFromYoutube,
      isFinalUrl: isFinalUrl,
      isMP4: isMP4,
      invalidUrl: invalidUrl,
      getFinalUrl: getFinalUrl,
      isYoutube: isYoutube
    };

  }]);
