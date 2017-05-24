'use strict';

angular.module('scalearAngularApp')
  .factory('NewsFeed', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope,$translate) {
    
    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host+'/:lang/news_feed/:action', {lang:$translate.use()},
    { 
      'index': { method: 'GET', isArray: false , headers:headers}
    });
  }]);
