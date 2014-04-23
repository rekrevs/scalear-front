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
  }
}

}]);
