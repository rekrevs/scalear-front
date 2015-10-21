'use strict';

angular.module('scalearAngularApp')
.directive('version', ['scalear_api',function(scalear_api) {
    return {
        restrict: 'E',
        template: '<div style="font-size:10px;color:lightgray;font-weight: 200">v' + scalear_api.version + '</div>'
    };
}]).directive('scalearFooter', ['scalear_api',function(scalear_api) {
    return {
        restrict: 'E',
        template: '<div class="row size-12" style="text-align: center; line-height: 12px;">' +
            
            '&copy; ' + new Date().getFullYear() + ' <span tooltip-html-unsafe="{{tooltip_text}}">ScalableLearning</span> | ' +
            '<a ui-sref="about" class="color-green" translate="footer.about"></a> | ' +
            '<a ui-sref="privacy" class="color-green" translate="footer.privacy"></a>'+                
            '</div>',
        link:function(scope){
                scope.tooltip_text = '<div style="font-size:10px;color:lightgray;font-weight: 200">build: v' + scalear_api.version + '</div>'
        }
    };
}]).directive('reportTechnical', ['Home', '$location', '$log','$stateParams','$interval','$translate', '$rootScope', '$modal',
    function(Home, $location, $log, $stateParams,$interval,$translate, $rootScope, $modal) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                scope.toggleTechnicalDisplay = function() {
                    angular.element('.btn').blur()
                    $modal.open({
                        templateUrl: '/views/report_technical.html',
                        controller: "ReportTechnicalCtrl"
                    })
                }
            }
        };
    }
])