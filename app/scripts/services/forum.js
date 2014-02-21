'use strict';

angular.module('scalearAngularApp')
.factory('Forum', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/discussions/:action', {lang:$translate.uses()},
      {
        'createComment':{method: 'POST', params: {action: 'create_comment'}, headers: headers},
         'getComments':{method: 'GET', isArray: true, params: {action: 'get_comments'}, headers: headers},
          'vote':{method: 'POST', params: {action: 'vote'}, headers: headers},
          'flag':{method: 'POST', params: {action: 'flag'}, headers: headers}
      });

}]);
