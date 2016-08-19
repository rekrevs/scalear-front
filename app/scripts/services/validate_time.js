'use strict';

angular.module('scalearAngularApp')
.factory('ValidateTime', ['$rootScope','$translate',function($rootScope,$translate) {
   return  function(time, check_duration,totalduration) {
          var int_regex = /^\d\d:\d\d:\d\d$/; //checking format
          if (int_regex.test(time)) {
            var hhmm = time.split(':'); // split hours and minutes
            var hours = parseInt(hhmm[0]); // get hours and parse it to an int
            var minutes = parseInt(hhmm[1]); // get minutes and parse it to an int
            var seconds = parseInt(hhmm[2]);
            // check if hours or minutes are incorrect
            var calculated_duration = (hours * 60 * 60) + (minutes * 60) + (seconds);
            if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) { // display error
              return $translate('editor.incorrect_format_time')
            } 
            else if (check_duration && (totalduration) <= calculated_duration || calculated_duration <= 0) {
              return $translate('editor.time_outside_range')
            }
          } else {
            return $translate('editor.incorrect_format_time')
          }
        }

}]);