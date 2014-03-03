'use strict';

angular.module('scalearAngularApp')
  .filter("format",function (){

    return function(secs, format){
      var hr  = Math.floor(secs / 3600);
      var min = Math.floor((secs - (hr * 3600))/60);
      var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

      if (hr < 10)  { hr    = "0" + hr; }
      if (min < 10) { min = "0" + min; }
      if (sec < 10) { sec  = "0" + sec; }
      if (hr)       { hr   = "00"; }

      if (format) {
        var formatted_time = format.replace('hh', hr);
        formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
        formatted_time = formatted_time.replace('mm', min);
        formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
        formatted_time = formatted_time.replace('ss', sec);
        formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
        return formatted_time;
      } 
      else {
        return hr + ':' + min + ':' + sec;
      }
    }
  })
    .filter("formattime",function (){

        return function(secs, format){
            var hr  = Math.floor(secs / 3600);
            var min = Math.floor((secs - (hr * 3600))/60);
            var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

            if (hr < 10)  { hr    = "0" + hr; }
            if (min < 10) { min = "0" + min; }
            if (sec < 10) { sec  = "0" + sec; }
            //if (hr)       { hr   = "00"; }

            if (format) {
                var formatted_time = format.replace('hh', hr);
                formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
                formatted_time = formatted_time.replace('mm', min);
                formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
                formatted_time = formatted_time.replace('ss', sec);
                formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
                return formatted_time;
            }
            else {
                return hr + ':' + min + ':' + sec;
            }
        }
    })
  .filter("inclass",function(){
    return function(input, display){
      if(!display) return input
      var result = {};

      angular.forEach(input, function(elem,key){
        if(elem.show)
          result[key] = elem  
      });
      return result;
    }
  })
  .filter("survey",function(){
    return function(input, display){
      if(!display) return input
      var result = [];

      angular.forEach(input, function(elem,key){
        if(!elem.hide)
          result.push(elem) 
      });
      return result;
    }
  })
  .filter("formatURL", function(){
    return function(url){
      if (!url.match(/^[a-zA-Z]+:\/\//)){
          url = 'http://' + url;
      }
      return url
    }
  })