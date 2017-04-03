angular.module('scalearAngularApp')
  .factory('Lti', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/lti/:action', { lang: $translate.use() }, {
      'embedCourseList': { method: 'GET', params: { action: 'embed_course_list' }, headers: headers },
      'sendURLtoToolConsumer':{ method: 'GET', params: { action: 'send_url_to_tool_consumer' }, headers: headers },
    });

  }])