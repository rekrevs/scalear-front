'use strict';

angular.module('scalearAngularApp')
.factory('Kpi', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate){
  
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/kpis/:document_id/:action', {lang:$translate.uses()},
      {
        'readData':{method: 'GET', headers:headers, params: {action: 'read_data'} },
        'readTotals':{method: 'GET', headers:headers, params: {action: 'read_totals'} },
        'readSeries':{method: 'GET', headers:headers, params: {action: 'read_series'} }
      });

}])