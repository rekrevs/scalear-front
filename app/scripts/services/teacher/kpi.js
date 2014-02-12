'use strict';

angular.module('scalearAngularApp')
.factory('Kpi', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate){
  
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/kpis/:document_id/:action', {lang:$translate.uses()},
      { 'create': { method: 'POST', headers:headers },
        'index': { method: 'GET', isArray: true, headers:headers},
        'update': { method: 'PUT', headers:headers},
        'destroy': { method: 'DELETE', headers:headers },
        'show':{method: 'GET', headers:headers},
        'readData':{method: 'GET', headers:headers, params: {action: 'read_data'} },
        'readTotals':{method: 'GET', headers:headers, params: {action: 'read_totals'} },
        'readSeries':{method: 'GET', headers:headers, params: {action: 'read_series'} },
        //per course stats
        'readCourseData':{method: 'GET', headers:headers, params:{action: 'read_course_data'}},
        'readCourseTotals':{method: 'GET', headers:headers, params:{action: 'read_course_totals'}},
        'readCourseSeries':{method: 'GET', headers:headers, params:{action: 'read_course_series'}}
      });

}])