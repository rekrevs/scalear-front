'use strict';

angular.module('scalearAngularApp')
    .directive('version', ['scalear_api',function(scalear_api) {
        return {
            restrict: 'E',
            template: '<div style="font-size:10px;color:lightgray;font-weight: 200">v' + scalear_api.version + '</div>'
        };
    }])
    .directive('scalearFooter', function() {
        return {
            restrict: 'E',
            template: '<div class="row size-12" style="text-align: center; line-height: 12px;">' +
                
                '&copy; ' + new Date().getFullYear() + ' <span >ScalableLearning</span> | ' +
                '<a ui-sref="home" class="color-green" translate="footer.about"></a> | ' +
                '<a ui-sref="privacy" class="color-green" translate="footer.privacy"></a>'+
                '<br><center ><version /></center>' +
                
                '</div>'
        };
    })
    .directive('reportTechnical', ['Home', '$location', '$log','$stateParams','$interval','$translate', '$rootScope', '$modal',
        function(Home, $location, $log, $stateParams,$interval,$translate, $rootScope, $modal) {
            return {
                restrict: 'A',
                // template: '<a style="cursor:pointer;" ng-click="toggleTechnicalDisplay()" translate="feedback.report_technical"></a>',
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