'use strict';

angular.module('scalearAngularApp')
    .controller('indexCtrl', ['$scope', '$timeout', '$state', 'User', '$rootScope', '$translate', '$window', '$modal', '$log', 'Page','Impersonate','$cookieStore','Course', 'ScalTour', 'ContentNavigator','scalear_api','MobileDetector',function($scope, $timeout, $state, User, $rootScope, $translate, $window, $modal, $log, Page, Impersonate, $cookieStore, Course, ScalTour, ContentNavigator, scalear_api, MobileDetector) {

            FastClick.attach(document.body);
            $scope.Page = Page;
            $rootScope.preview_as_student = $cookieStore.get('preview_as_student')
            $scope.ContentNavigator = ContentNavigator
            $scope.scalear_api = scalear_api

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
                $scope.current_teacher_courses = null
                $scope.current_student_courses = null
                var unwatch = $rootScope.$watch('current_user', function(){
                    if($rootScope.current_user && $rootScope.current_user.roles){
                        Course.currentCourses({},
                            function(data){
                                $scope.current_teacher_courses = data.teacher_courses
                                $scope.current_student_courses = data.student_courses
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
                $log.debug('changhing language')
                $translate.uses(key);
                $rootScope.current_lang = key;
                $window.moment.locale(key);
            };

            $scope.notificationsNumber = function(){
                if($scope.current_user){
                    return $scope.current_user.shared + $scope.current_user.invitations
                }
            }

            $scope.closeClipboard=function(){
                $rootScope.clipboard.show_msg = false
            }

            $rootScope.is_mobile= MobileDetector.isMobile()
            $scope.changeLanguage($translate.uses());
            getCurrentCourses()

            //Google Analytics
            ga('create', scalear_api.ga_token); //UA-66097980-1
            ga('send', 'pageview');

        }
    ]);
