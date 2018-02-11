'use strict';

angular.module('scalearAngularApp')
  .factory('TokenServerInterceptor', ["Token", function(Token) {

  return {
    request: function (config) {
        var tokenHeaders = Token.getToken(); 
        if(tokenHeaders){
          config.headers['access-token']   = tokenHeaders['access-token'], 
          config.headers['client'] = tokenHeaders['client'], 
          config.headers['expiry'] = tokenHeaders['expiry'], 
          config.headers['uid'] = tokenHeaders['uid'], 
          config.headers['token-type'] = tokenHeaders['token-type']
        }
    
      return config;
    }
  };

     
  }]);
