'use strict';

angular.module('scalearAngularApp')
.factory('TimelineNavigator', ['$rootScope',function($rootScope) {
   return {
     status: false,
     getStatus: function() { return this.status; },
     setStatus: function(stat){ 
     	this.status = stat
     	$rootScope.$broadcast('timeline_navigator_change', this.status)
     },
     open: function(){
     	this.setStatus(true)
     },
     close: function(){
     	this.setStatus(false)
     }
   };
}])
.factory('TimelineFilter', ['$rootScope',function($rootScope) {
    var filter_settings={}
    if ($rootScope.preview_as_student)
        filter_settings={quiz:true,confused:false, discussion:false, note:false};
    else
        filter_settings={quiz:true,confused:true, discussion:true, note:true};
    return {
        get:function(type){return filter_settings[type]},
        set:function(type, val){filter_settings[type] = val},
        toggle:function(type){filter_settings[type] = !filter_settings[type]},
        get_filter:function(){return filter_settings}
    }
}])