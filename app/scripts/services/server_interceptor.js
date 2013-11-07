'use strict';

angular.module('scalearAngularApp')
.factory('ServerInterceptor', function($q, $timeout, ErrorHandler, $http) {
  return {
    // optional method
    'request': function(config) {
      // do something on success
      console.log("successful request");
      console.log(config);
      return config || $q.when(config);
    },
 
    // optional method
   'requestError': function(rejection) {
      // do something on error
      if (canRecover(rejection)) {
        return responseOrNewPromise
      }
      return $q.reject(rejection);
    },
 
 
 
    // optional method
    'response': function(response) {
      // do something on success
      console.log("successful response");
      return response || $q.when(response);
    },
 
    // optional method
   'responseError': function(rejection) {
      // do something on error
      console.log("failed response");
      console.log(rejection);
      if(rejection.status==0) //host not reachable
      {
      	console.log("in 0");
      	if(rejection.data=="")      	
      		ErrorHandler.showMessage('Error ' + rejection.status + ': ' + "Cannot connect to server", 'errorMessage', 20000);
      	else
      		ErrorHandler.showMessage('Error ' + rejection.status + ': ' + rejection.data, 'errorMessage', 20000);
      	
      	$timeout(function()
      	{
      		$http(rejection.config);
      	},10000);
      		
      }
      //if (canRecover(rejection)) {
      //  return responseOrNewPromise
     // }
      //if(rejection.status!=422)
      	return $q.reject(rejection);
      //else
      	//return rejection //|| $q.when(rejection);
    }
  }
});