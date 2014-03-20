'use strict';

angular.module('scalearAngularApp')
.factory('SharedItem', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/:lang/shared_items/:shared_item_id/:action', { lang:$translate.uses()},
    {
        'create': { method: 'POST', headers:headers},
        'show': {method:'GET', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'showShared':{method:'GET',headers:headers,params:{action: 'show_shared'}},
        'accpetShared':{method:'POST',headers:headers,params:{action: 'accept_shared'}},
        'rejectShared':{method:'POST',headers:headers,params:{action: 'reject_shared'}},
        'updateSharedData':{method:'POST',headers:headers,params:{action: 'update_shared_data'}}
    });

}])