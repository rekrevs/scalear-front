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
            template: '<div class="row"><div class="span12" >' +
                '<center>' +
                '&copy; ' + new Date().getFullYear() + ' ScalableLearning | ' +
                '<span translate="footer.about"></span> | ' +
                '<a ui-sref="privacy" translate="footer.privacy"></a> ' +
                '<report_technical ng-show="current_user"/>' +
                '<br><center><version /></center>' +
                '</center>' +
                '</div>'
        };
    })
    .directive('reportTechnical', ['Home', '$location', '$log','$stateParams','$interval','$translate',
        function(Home, $location, $log, $stateParams,$interval,$translate) {
            return {
                restrict: 'E',
                template: '| <a style="cursor:pointer;" ng-click="toggleTechnicalDisplay()" translate="feedback.report_technical"></a>' +
                    '<div class="well" style="width:500px;background:wheat;padding:10px 0" ng-show="show_technical"><br>' +
                        // '<div style="margin-left:3px;width:400px;" class="row toggle-demo">'+
                        //     '<div class="switch-toggle switch-2 well col-lg-9">'+
                        //         '<input id="week-d1" name="view-d" type="radio" ng-checked="issue_type==\'system\'">'+
                        //         '<label for="week-d1" ng-click="issue_type=\'system\'">{{"head.system"|translate}}</label>'+
                        //         '<input id="month-d2" name="view-d" type="radio" ng-checked="issue_type==\'content\'">'+
                        //         '<label for="month-d2" ng-click="issue_type=\'content\'">{{"head.content"|translate}}</label>'+
                        //         '<a class="btn"></a>'+
                        //     '</div>'+
                        // '</div>'+
                        // '{{"issue"|translate}} <b>{{"head."+issue_type|translate}}</b></br>'+
                        '<div style="width:82%;margin-bottom: 15px;color: brown;font-family: monospace;text-align: left;"><span translate>feedback.instructions</span>'+
                            '<br><br>'+
                            '<div style="color: #0088cc;"><b translate>feedback.problem_is</b>: <select ng-model="selected_type" ng-options=\"type.text for type in issue_types\">...</select> </div>'+
                        '</div>'+
                        '<div ng-show="no_text" class="alert-error" style="width:50%">{{no_text}}</div>'+
                        '<textarea rows="5" cols="12" style="width:400px;" ng-model="technical_data"></textarea><br />' +
                        '<a style="cursor:pointer;" ng-click="send_technical()" translate="feedback.send"></a> | ' +
                        '<a style="cursor:pointer;" ng-click="cancel()" translate="feedback.cancel"></a>' +
                        '<loading size="small" show="sending_technical"/>' +
                    '</div>',
                link: function(scope, element) {
                    scope.issue_types=[{value:"system", text:$translate('head.system')}, {value:"content", text:$translate('head.content')}]//"ScalableLearning Website", "Course Content"]
                    scope.show_technical = false
                    scope.toggleTechnicalDisplay = function() {
                        scope.show_technical = !scope.show_technical
                        scope.selected_type=scope.issue_types[0];
                        scope.sending_technical = false;
                    }
                    scope.cancel=function(){
                        scope.selected_type=scope.issue_types[0];
                        scope.technical_data =null
                        scope.no_text=null
                    }

                    scope.send_technical = function() {
                        $log.debug("in sending");
                        if(scope.technical_data && scope.technical_data.trim() !=""){
                            scope.sending_technical = true;
                            Home.technicalProblem({
                                    issue_type: scope.selected_type.value,
                                    course: $stateParams.course_id || -1,
                                    module: $stateParams.module_id || -1,
                                    lecture: $stateParams.lecture_id || -1,
                                    quiz: $stateParams.quiz_id || -1,
                                    url: $location.url(),
                                    problem: scope.technical_data,
                                    lang: scope.current_lang
                                },
                                function(data) {
                                    scope.technical_data = null;                                    
                                    scope.toggleTechnicalDisplay()
                                }
                            );
                        }
                        else
                            scope.no_text = "Please provide more description"
                    };
                }
            };
        }
    ])