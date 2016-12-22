'use strict';

angular.module('scalearAngularApp')
  .factory('VideoEventLogger', ['$q', 'Lecture','$log', function($q, Lecture, $log) {

    function log(course_id, lecture_id, event, from_time, to_time, in_quiz, speed, volume, fullscreen) {
      var deferred = $q.defer()
      if(from_time != null && from_time >= 0) {
        $log.debug('log video event', event)
        Lecture.logVideoEvent({
            course_id: course_id,
            lecture_id: lecture_id
          }, {
            event: event,
            from_time: from_time,
            to_time: to_time,
            in_quiz: in_quiz,
            speed: speed,
            volume: volume,
            fullscreen: fullscreen
          })
          .$promise
          .then(function(resp) {
            $log.debug("event successfully logged")
            deferred.resolve(resp)
          })
          .catch(function(resp) {
            deferred.reject(resp);
          })
      } else {
        deferred.reject();
      }
      return deferred.promise;
    }

    return {
      log: log
    }

  }])
