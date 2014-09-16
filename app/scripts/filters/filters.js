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
  }).filter("formatFormattedTime",function (){

      return function(time, format){
          
          var hr  = time.split(':')[0]
          var min = time.split(':')[1]
          var sec = time.split(':')[2]

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
  }).filter('timeAgo', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    }
  }).filter("inclass",function(){
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
  .filter("currentCourse", function(){
    var now = new Date();
    return function(course){
        var end_date = start_date.setDate(start_date.getDate()+(duration * 7));
        if (now > end_date){
            return course
        }
    }
  })
  .filter("formatURL", function(){
    return function(url){
      // if(url)
        if (!url.match(/^[a-zA-Z]+:\/\//)){
            url = 'http://' + url;
        }
      return url
    }
  })
  .filter('saveStateFormatter',
    function () {
      return function (state) {
          if (state == EditorState.DIRTY) {
              return 'You have unsaved changes';
          } else if (state == EditorState.SAVE) {
              return 'Saving in Google Drive...';
          } else if (state == EditorState.LOAD) {
              return 'Loading...';
          } else if (state == EditorState.READONLY) {
              return "Read only"
          } else {
              return 'Video and notes saved in Google Drive';
          }
      };
  })
  .filter('bytes',
    function () {
      return function (bytes) {
          bytes = parseInt(bytes);
          if (isNaN(bytes)) {
              return "...";
          }
          var units = [' bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
          var p = bytes > 0 ? Math.floor(Math.log(bytes) / Math.LN2 / 10) : 0;
          var u = Math.round(bytes / Math.pow(2, 10 * p));
          return u + units[p];
      }
  })
  .filter("capitalize", function(){
    return function(s){
      return s[0].toUpperCase() + s.slice(1);
    }
  })
  .filter("courseActive", ['$state', '$filter', function($state, $filter){
    return function(id){
      return $state.includes('**.course.**') && $state.params.course_id == id
      // var inside = $filter('includedByState')('**.course.**');
      // return inside && $state.params.course_id == id
    }
  }]).filter('reverse', function() {
  return function(items) {
    console.log(items)
     if(items)
      return items.slice().reverse();
  };
});;
