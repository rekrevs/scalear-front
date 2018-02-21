'use strict';

angular.module('scalearAngularApp')
  .factory('Token', ['$cookieStore','$q','$interval', function($cookieStore, $q, $interval) {

    var token = null;
    var interval = null;

    function setToken(recievedToken){
      token = recievedToken;
      $cookieStore.put('token', recievedToken)
    }

    function setTokenWithPromise(recievedToken){
      console.log("started token")
      token = recievedToken;
      $cookieStore.put('token', recievedToken)
      var deferred = $q.defer();
      var stopInterval = $interval(function(){
        if ( token.uid && $cookieStore.get('token').uid == token.uid) {
          $interval.cancel(stopInterval)
          deferred.resolve()
        }
      }, 250);
      return deferred.promise
    }

    function getToken(){
      if(token){
        return token;
      } else if ($cookieStore.get('token')){
        token = $cookieStore.get('token');
        return token;
      } else {
        return false;
      }
    }

    return {
      getToken: getToken,
      setToken: setToken,
      setTokenWithPromise: setTokenWithPromise
    };


  }]);
