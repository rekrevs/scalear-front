'use strict';

angular.module('scalearAngularApp')
  .factory('VideoInformation', [function(){
    return {
      totalDuration: 0,
      volume: 0.8,
      speed: 1,
      quality: "720p"
    };
  }]);
