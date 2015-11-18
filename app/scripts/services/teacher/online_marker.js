'use strict';

angular.module('scalearAngularApp')  
.factory('OnlineMarker', ['$resource','$http','$stateParams','scalear_api','headers','$rootScope','$translate',function ($resource, $http, $stateParams, scalear_api, headers, $rootScope ,$translate){

	$http.defaults.useXDomain = true;
	return $resource(scalear_api.host+'/:lang/online_markers/:online_markers_id/:action', {lang:$translate.uses()},
    { 'update': { method: 'PUT', headers:headers},
      'destroy': { method: 'DELETE', headers:headers },
	  'getMarkerList':{method:'GET', params:{action:'get_marker_list'}, headers:headers},
	  'validateName':{method:'PUT', params:{action:'validate_name'}, headers:headers},
	});

}])