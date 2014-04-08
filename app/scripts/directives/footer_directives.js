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
                '<a ui-sref="privacy" translate="footer.privacy"></a> ' +
                '<report_technical />' +
                '<br><center><version /></center>' +
                
                '</div>'
        };
    })
    .directive('reportTechnical', ['Home', '$location', '$log','$stateParams','$interval','$translate', '$rootScope',
        function(Home, $location, $log, $stateParams,$interval,$translate, $rootScope) {
            return {
                restrict: 'E',
                templateUrl: '/views/report_technical.html',
                link: function(scope, element) {
                    scope.issue_types=[{value:"system", text:$translate('head.system')}, {value:"content", text:$translate('head.content')}]//"ScalableLearning Website", "Course Content"]
                    scope.show_technical = false
                    scope.toggleTechnicalDisplay = function() {
                        scope.show_technical = !scope.show_technical
                        scope.selected_type=scope.issue_types[0];
                        scope.sending_technical = false;
                    }
                    scope.cancel=function(){
                        scope.show_technical = false
                        scope.selected_type=scope.issue_types[0];
                        scope.technical_data =null
                        scope.no_text=null
                    }

                    scope.send_technical = function() {
                        $log.debug("in sending");
                        if(!$rootScope.current_user){
                            var user_name = angular.element('#report_name').val();
                            var user_email = angular.element('#report_email').val();
                        }
                        
                        if((user_name && user_email) || $rootScope.current_user){
                            if(scope.technical_data && scope.technical_data.trim() !=""){
                                scope.sending_technical = true;
                                Home.technicalProblem({
                                        name: user_name,
                                        email: user_email,
                                        issue_type: scope.selected_type.value,
                                        course: $stateParams.course_id || -1,
                                        module: $stateParams.module_id || -1,
                                        lecture: $stateParams.lecture_id || -1,
                                        quiz: $stateParams.quiz_id || -1,
                                        url: $location.url(),
                                        problem: scope.technical_data,
                                        lang: scope.current_lang,
                                        agent:navigator.userAgent
                                    },
                                    function(data) {
                                        scope.technical_data = null;                                    
                                        scope.toggleTechnicalDisplay()
                                    }
                                );
                            }
                            else
                                scope.no_text = "Please provide more description"
                        }
                        else
                            scope.no_text = "Please make sure that you provided your name and email address"                        
                    };
                }
            };
        }
    ])