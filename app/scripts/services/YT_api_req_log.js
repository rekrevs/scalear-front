'use strict';

angular.module('scalearAngularApp')
    .factory('YTapiReqLogUtils', ['$resource', 'scalear_api', 'headers', '$http', '$stateParams', '$translate', function ($resource, scalear_api, headers, $http, $stateParams, $translate) {
        $http.defaults.useXDomain = true;
        return $resource(scalear_api.host + '/:lang/yt_data_api_req_logs/:action', {}, {
            "registerYtApiRequest": { method: 'POST', params: { action: 'register_YT_api_request_angular' }, headers: headers }
        });

    }]).factory("YTapiReqLog", ['YTapiReqLogUtils', function (YTapiReqLogUtils) {
        var service = {}

        service.registerRequest = function (user_id, lec_id, cause) {
            return YTapiReqLogUtils.registerYtApiRequest({
                user_id: user_id,
                lecture_id: lec_id,
                cause: cause
            }, {})
                .$promise
        }

        return service
    }])
