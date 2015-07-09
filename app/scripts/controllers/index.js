'use strict';

angular.module('scalearAngularApp')
    .controller('indexCtrl', ['$scope', '$timeout', '$state', 'User', '$rootScope', '$translate', '$window', '$modal', '$log', 'Page','Impersonate','$cookieStore','Course', 'ScalTour', 'ContentNavigator',
        function($scope, $timeout,$state, User, $rootScope, $translate, $window, $modal, $log, Page, Impersonate,$cookieStore,Course, ScalTour, ContentNavigator) {

            FastClick.attach(document.body);
            $scope.Page = Page;
            $rootScope.preview_as_student = $cookieStore.get('preview_as_student')
            $scope.ContentNavigator = ContentNavigator
            
            
            $scope.ContentNavigator.delayed_navigator_open = $scope.ContentNavigator.status

            $scope.$on('content_navigator_change',function(ev, status){
                if(!status){
                    $scope.cancelDelay = $timeout(function(){
                        $scope.ContentNavigator.delayed_navigator_open = false
                    },300)
                }
                else{
                    if($scope.cancelDelay)
                        $timeout.cancel($scope.cancelDelay)
                    $scope.ContentNavigator.delayed_navigator_open = true
                }
            })
            

            var getCurrentCourses=function(){
                $scope.current_courses=null
                var unwatch = $rootScope.$watch('current_user', function(){
                    if($rootScope.current_user && $rootScope.current_user.roles){
                        Course.currentCourses({},
                            function(data){
                                $scope.current_courses = data
                                unwatch()
                            }
                        );
                    }
                });                
            }

            $scope.$on("get_current_courses",function(){
                getCurrentCourses()
            })
            
            $scope.changeLanguage = function(key) {
                $log.debug("in change language " + key);
                console.log('changhing language')
                $translate.uses(key);
                $rootScope.current_lang = key;
                $window.moment.locale(key);
            };

            

            $scope.notificationsNumber = function(){
                if($scope.current_user && $scope.current_user.roles[0].id!=2){
                    return $scope.current_user.shared + $scope.current_user.invitations
                }
            }
            $scope.closeClipboard=function(){
                $rootScope.clipboard.show_msg = false
            }

            // $scope.login = function() {
            //     //$log.debug("in login");
            //     //window.location=scalear_api.host+"/"+$scope.current_lang+"/users/sign_angular_in?angular_redirect="+scalear_api.redirection_url; //http://localhost:9000/#/ //http://angular-edu.herokuapp.com/#/
            //     $state.go("login");
            // }
            

            var isMobile=function(){
                var iOS = false,
                    iDevice = ['iPad', 'iPhone', 'iPod','Android'];
                for ( var i = 0; i < iDevice.length ; i++ ) {
                    if( navigator.platform === iDevice[i] ){ iOS = true; break; }
                }
                return navigator.userAgent.match(/(iPhone|iPod|iPad|Android)/i) || iOS
            }

            $rootScope.is_mobile= isMobile()
            $scope.changeLanguage($translate.uses());
            getCurrentCourses()


        }
    ]);