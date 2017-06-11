'use strict';

angular.module('scalearAngularApp')
.factory('Dashboard', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {    

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/:lang/dashboard/:action', {lang:$translate.use()},
    {
        'getDashboard':{ method: 'GET', params: {action: 'get_dashboard'}, headers:headers}
    });

}]);