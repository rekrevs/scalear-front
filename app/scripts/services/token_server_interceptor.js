'use strict';

angular.module('scalearAngularApp')
  .factory('TokenServerInterceptor', ["Token", function(Token) {
   //server and also front end requests (requesting partials and so on..)

  return {
    request: function (config) {
      // This is just example logic, you could check the URL (for example)
      // if (config.headers.Authorization === 'Bearer') {
        var tokenHeaders = Token.getToken(); 
        if(tokenHeaders){
        
          
          config.headers['access-token']   = tokenHeaders['access-token'], 
          config.headers['client'] = tokenHeaders['client'], 
          config.headers['expiry'] = tokenHeaders['expiry'], 
          config.headers['uid'] = tokenHeaders['uid'], 
          config.headers['token-type'] = tokenHeaders['token-type'], 
          config.headers['cache-control'] = tokenHeaders['cache-control'] 
        }
      // }
      return config;
    }
  };

     
  }]);
