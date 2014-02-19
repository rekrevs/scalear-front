'use strict';

angular.module('scalearAngularApp')
.factory('Forum', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope', '$translate',function($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/discussions/:action', {lang:$translate.uses()},
      {
        'createComment':{method: 'POST', params: {action: 'create_comment'}, headers: headers}
      });

}]);
