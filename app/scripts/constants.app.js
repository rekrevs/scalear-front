angular.module('scalearAngularApp') 

.value('headers',( function(){ 
    // var userSession = angular.injector(['ng','scalearAngularApp']).get('UserSession'); 
    // console.log(userSession)
    return { 
    'withCredentials': true, 
    'X-Requested-With': 'XMLHttpRequest', 
    // 'access-token': header && header['access-token'], 
    // 'Client': header && header['client'], 
    // 'Expiry':header && header['expiry'], 
    // 'Uid': header && header['uid'], 
    // 'Token-type': header  && header['token-type'], 
    // 'Cache-control': header && header['cache-control'] 
    } 
})() 
) 