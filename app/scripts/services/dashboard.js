'use strict';

angular.module('scalearAngularApp')
.factory('Dashboard', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate) {    

  $http.defaults.useXDomain = true;
  return $resource(scalear_api.host+'/:lang/student_dashboard/:action', {lang:$translate.uses()},
    {
        'getDashboard':{ method: 'GET', params: {action: 'getDashboard'}, headers:headers}
    });

}]);