'use strict';

angular.module('scalearAngularApp')
    .directive('version', function(scalear_api) {
        return {
            restrict: 'E',
            template: '<div style="font-size:10px">v' + scalear_api.version + '</div>'
        };
    })
    .directive('scalearFooter', function() {
        return {
            restrict: 'E',
            template: '<div class="row" style="text-align: center; line-height: 13px;">' +
                
                '&copy; ' + new Date().getFullYear() + ' <a ui-sref="home">ScalableLearning</a> | ' +
                '<span translate="footer.about"></span> | ' +
                '<a ui-sref="privacy" translate="footer.privacy"></a> | ' +
                '<report_technical />' +
                '<br><center><version /></center>' +
                
                '</div>'
        };
    })
    .directive('reportTechnical', ['Home', '$location', '$log','$stateParams','$interval','$translate', '$rootScope', '$modal',
        function(Home, $location, $log, $stateParams,$interval,$translate, $rootScope, $modal) {
            return {
                restrict: 'E',
                template: '<a style="cursor:pointer;" ng-click="toggleTechnicalDisplay()" translate="feedback.report_technical"></a>',
                link: function(scope, element) {
                    scope.toggleTechnicalDisplay = function() {
                        angular.element('.btn').blur()
                        var modalInstance = $modal.open({
                            templateUrl: '/views/report_technical.html',
                            controller: "ReportTechnicalCtrl",
                        })
                    }
                }
            };
        }
    ])