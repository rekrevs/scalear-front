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
                
                '&copy; ' + new Date().getFullYear() + ' ScalableLearning | ' +
                '<span translate="footer.about"></span> | ' +
                '<a ui-sref="privacy" translate="footer.privacy"></a> ' +
                '<report_technical ng-show="current_user"/>' +
                '<br><center><version /></center>' +
                
                '</div>'
        };
    })
    .directive('reportTechnical', ['Home', '$location', '$log','$stateParams',
        function(Home, $location, $log, $stateParams) {
            return {
                restrict: 'E',
                template: '| <a style="cursor:pointer;" ng-click="toggleTechnicalDisplay()" translate="feedback.report_technical"></a>' +
                    '<span style="text-align: center;"><div ng-show="show_technical"><br>' +
                    '<div style="margin:0 auto;width:400px;" class="row toggle-demo">'+
                        '<div class="switch-toggle switch-2 well col-lg-9">'+
                            '<input id="week-d1" name="view-d" type="radio" ng-checked="issue_type==\'system\'">'+
                            '<label for="week-d1" ng-click="issue_type=\'system\'">{{"head.system"|translate}}</label>'+
                            '<input id="month-d2" name="view-d" type="radio" ng-checked="issue_type==\'content\'">'+
                            '<label for="month-d2" ng-click="issue_type=\'content\'">{{"head.content"|translate}}</label>'+
                            '<a class="btn"></a>'+
                        '</div>'+
                    '</div>'+
                    '{{"issue"|translate}} <b>{{"head."+issue_type|translate}}</b></br>'+
                    '<textarea rows="3" cols="10" style="width:400px;" ng-model="technical_data"></textarea><br />' +
                    '<a style="cursor:pointer;" ng-click="send_technical()" translate="feedback.send"></a>' +
                    '<loading size="small" show="sending_technical"/>' +
                    '</div></span>',
                link: function(scope, element) {
                    scope.issue_type="system"
                    scope.show_technical = false
                    scope.toggleTechnicalDisplay = function() {
                        scope.show_technical = !scope.show_technical
                        scope.issue_type="system";
                    }
                    scope.send_technical = function() {
                        $log.debug("in sending");
                        scope.sending_technical = true;
                        Home.technicalProblem({
                                issue_type: scope.issue_type,
                                course: $stateParams.course_id || -1,
                                module: $stateParams.module_id || -1,
                                lecture: $stateParams.lecture_id || -1,
                                quiz: $stateParams.quiz_id || -1,
                                url: $location.url(),
                                problem: scope.technical_data,
                                lang: scope.current_lang
                            },
                            function(data) {
                                scope.technical_data = "";
                                scope.sending_technical = false;
                                scope.show_technical = false;
                                scope.issue_type="system";
                            }
                        );
                    };
                }
            };
        }
    ])