angular.module('scalearAngularApp')
  .factory('Lti', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/lti/:action', { lang: $translate.use() }, {
      'embedCourseList': { method: 'GET', params: { action: 'embed_course_list' }, headers: headers },
      'sendURLtoToolConsumer':{ method: 'GET', params: { action: 'send_url_to_tool_consumer' }, headers: headers },
      'getLtiCustomSharedKey' :{ method: 'GET', params: { action: 'get_lti_custom_shared_key' }, headers: headers },
      'generateNewLtiKeys' :{ method: 'GET', params: { action: 'generate_new_lti_keys' }, headers: headers },
      'ltiToolRedirectSaveData' :{ method: 'GET', params: { action: 'lti_tool_redirect_save_data' }, headers: headers },
    });

  }])