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
    // if (hr)       { hr   = "00"; }

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
}).filter("formattime",function (){
  return function(secs, format){
    if(secs > 0){
      var hr  = Math.floor(secs / 3600);
      var min = Math.floor((secs - (hr * 3600))/60);
      var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
      if(secs < 60){
        min = 1
        sec = 0
      }
      if (hr == 0){
        format =format.replace('hh:', "").replace('h:', "")
      }
      else if(hr < 10){ hr  = "0" + hr; }
      if (min < 10) { min = "0" + min; }
      if (sec < 10) { sec = "0" + sec; }

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
    else{
      return '0:00'
    }
  }
}).filter("roundedformattime",function (){
  return function(secs, format){
    if(secs > 0){
      var hr  = Math.floor(secs / 3600);
      var min = Math.floor((secs - (hr * 3600))/60);
      var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
      if(sec > 0){
        min+= 1
        sec = 0
      }
      if (hr < 10)  { hr  = "0" + hr; }
      if (min < 10) { min = "0" + min; }
      if (sec < 10) { sec  = "0" + sec; }

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
    else{
      return '0:00'
    }
  }
}).filter('fromNow', function() {
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
}).filter("survey",function(){
  return function(input, display){
    if(!display) return input
    var result = [];
    angular.forEach(input, function(elem,key){
      if(!elem.student_hide)
        result.push(elem)
    });
    return result;
  }
}).filter("currentCourse", function(){
  var now = new Date();
  return function(course){
    var end_date = start_date.setDate(start_date.getDate()+(duration * 7));
    if (now > end_date){
        return course
    }
  }
}).filter("formatURL", function(){
  return function(url){
      if (!url.match(/^[a-zA-Z]+:\/\//)){
          url = 'http://' + url;
      }
    return url
  }
}).filter('saveStateFormatter',
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
}).filter('bytes',
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
}).filter("capitalize", function(){
  return function(s){
    if(s && s.length > 0 )
      return s[0].toUpperCase() + s.slice(1);
  }
}).filter("anonymous", function(){
  return function(s, role){
    // if(role == 'student'){
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() +'-'+(md5(s).substring(0,4).toUpperCase())
    // }
  }
}).filter("courseActive", ['$state', function($state){
  return function(id){
    return $state.includes('**.course.**') && $state.params.course_id == id
  }
}]).filter('reverse', function() {
return function(items) {
   if(items)
    return items.slice().reverse();
};
}).filter('href', ["$state", function($state) {
  return function(state) {
     if(state)
      return $state.href(state, {}, {absolute: true})
  };
}]).filter('visible', function() {
  return function(appearance_time) {
     if(appearance_time)
      return new Date(appearance_time) <= new Date()
  };
}).filter('inclassMenuFilter', function() {
  return function(items) {
    return items.filter(function (item) {
      if(item.data)
        return (item.type!='discussion')? item.data.show : true
      return false
    })
  };
});
