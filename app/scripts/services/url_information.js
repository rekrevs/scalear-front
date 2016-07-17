'use strict'; 
 
angular.module('scalearAngularApp') 
  .factory('URLInformation', [function(){ 
    return { 
    	redirect: null,
    	history:null

    }; 
  }]);