'use strict';

angular.module('scalearAngularApp')
  .factory('Kpi', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function ($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/kpis/:document_id/:action', { lang: $translate.use() },
      {
        'readData': { method: 'GET', headers: headers, params: { action: 'read_data' } }, // Not DONE
        'readTotals': { method: 'GET', headers: headers, params: { action: 'read_totals' } }, // Not DONE
        'readSeries': { method: 'GET', headers: headers, params: { action: 'read_series' } }, // Not DONE
        'readTotalsForDuration': { method: 'GET', headers: headers, params: { action: 'read_totals_for_duration' } },
        'getReportDataCourseDuration': { method: 'POST', headers: headers, params: { action: 'get_report_data_course_duration' } },
        'exportSchoolStatistics': { method: 'GET', headers: headers, params: { action: 'export_school_statistics' } }, // Not DONE
        'getAllYoutubeData': { method: 'GET', headers: headers, params: { action: 'get_all_youtube_data' } },
        'getAllYoutubeVideoUrls': { method: 'GET', headers: headers, params: { action: 'get_all_youtube_urls' }, isArray: true }
      });
  }])
