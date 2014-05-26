'use strict';

angular.module('scalearAngularApp')
.service('util', ['$rootScope',function ($rootScope) {
  return {

    getKeys: function( obj ) {
    return Object.keys ? Object.keys( obj ) : (function( obj ) {
      var item,
          list = [];

      for ( item in obj ) {
        if ( hasOwn.call( obj, item ) ) {
          list.push( item );
        }
      }
      return list;
    })( obj );
  },

  safeApply: function(fn) {
      var phase = $rootScope.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
              fn();
          }
      } else {
          $rootScope.$apply(fn);
      }
  },

  hour12: function(hour){
    //var hours = new Date().getHours();
    var hours = hour%24; 
    var mid='AM';
    if(hours==0)
      hours=12;    
    else if(hours>12){
      hours=hours%12;
      mid='PM';
    }
    return hours+' '+mid
  },

  toObjectById:function(arr){ //convert array to objec with IDs as keys
    var obj={}
    if(arr instanceof Array){      
      arr.forEach(function(item){
          obj[item.id] = item;
      });
    }
    return obj
  },

  urlWithProtocol:function(url){
    if(url)
        return url.match(/^http/)? url: 'http://'+url;
    else
        return url;
  },

  getIndexById:function(arr, id) {// returns index of an object in an array by searching for its id
    for(var elem in arr){
      if(arr[elem].id==id)
        return elem
    }
    return -1
  },

  capitalize: function(s){
    return s[0].toUpperCase() + s.slice(1);
  },


}

}]);
