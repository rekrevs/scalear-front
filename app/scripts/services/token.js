'use strict';

angular.module('scalearAngularApp')
  .factory('Token', ['$cookieStore', function($cookieStore) {

    var token = null;


    function setToken(recievedToken){
      console.log(recievedToken)
      token = recievedToken;
      $cookieStore.put('token', recievedToken)
    }

    function getToken(){
      if(token){
        return token;
      } else if ($cookieStore.get('token')){
        console.log("using cookie")
        token = $cookieStore.get('token');
        return token;
      } else {
        return false;
      }
    }

    return {
      getToken: getToken,
      setToken: setToken
    };


  }]);
