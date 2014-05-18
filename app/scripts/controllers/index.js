'use strict';

angular.module('scalearAngularApp')
    .controller('indexController', ['scalear_api', '$scope', '$timeout', '$state', 'User', '$rootScope', '$translate', '$window', '$modal', '$log', '$http', 'Page','Impersonate','$cookieStore',
        function(scalear_api, $scope, $timeout,$state, User, $rootScope, $translate, $window, $modal, $log, $http, Page, Impersonate,$cookieStore) {


            $scope.Page = Page;
            $rootScope.preview_as_student = $cookieStore.get('preview_as_student')
            
            $scope.changeLanguage = function(key) {
                $log.debug("in change language " + key);
                $translate.uses(key);
                $rootScope.current_lang = key;
                $window.moment.lang(key);
            };

            $scope.changeLanguage($translate.uses());
            

            // $scope.are_notifications = function(){
            //     return $scope.current_user && $scope.current_user.roles[0].id!=2 && ($scope.current_user.invitations || $scope.current_user.shared)
            // }

            // $scope.are_shared=function(){
            //     return $scope.current_user && $scope.current_user.roles[0].id!=2 && $scope.current_user.accepted_shared
            // }

            $scope.emptyClipboard=function(){
                $rootScope.clipboard = null
            }

            $scope.disablePreview=function(){
                if($cookieStore.get('preview_as_student')){
                  Impersonate.destroy(
                    {
                        old_user_id:$cookieStore.get('old_user_id'),
                        new_user_id:$cookieStore.get('new_user_id')
                    },
                    function(d){
                      console.log(d)
                      console.log("good")
                      var course_id = $cookieStore.get('course_id')
                      $rootScope.preview_as_student = false
                      $cookieStore.remove('preview_as_student')
                      $cookieStore.remove('old_user_id')
                      $cookieStore.remove('course_id')
                      $state.go('course.course_editor', {course_id: course_id})
                    },
                    function(){
                      console.log("bad")
                      $rootScope.preview_as_student = false
                      $cookieStore.remove('preview_as_student')
                      $cookieStore.remove('old_user_id')
                      $cookieStore.remove('course_id')
                    }
                  )
                }
            }

            $scope.login = function() {
                //$log.debug("in login");
                //window.location=scalear_api.host+"/"+$scope.current_lang+"/users/sign_angular_in?angular_redirect="+scalear_api.redirection_url; //http://localhost:9000/#/ //http://angular-edu.herokuapp.com/#/
                $state.go("login");
            }
            $scope.toggleCollapse = function(){
                $window.scrollTo(0, 0);
                $scope.$broadcast('mainMenuToggled', $rootScope.iscollapsed);
                $rootScope.iscollapsed = !$rootScope.iscollapsed
                
                console.log($rootScope.iscollapsed)
            }

            $scope.logout = function() {
                $rootScope.logging_out = true;
                $rootScope.iscollapsed = true;
                $timeout(function() {
                    User.sign_out({}, function() {
                        $rootScope.current_user = null
                        $state.go("login");
                        $rootScope.logging_out = false;
                    });
                }, 200);
                

                //window.location=scalear_api.host+"/"+$scope.current_lang+"/users/sign_out"; //http://localhost:9000/#/ //http://angular-edu.herokuapp.com/#/
            }

            $scope.coursePage = function() {
                if ($rootScope.current_user.roles[0].id == 1 || $rootScope.current_user.roles[0].id == 5) // admin
                    $state.go("course_list");
                else
                    $state.go("student_courses");
            }

            $scope.open = function() {

                var modalInstance = $modal.open({
                    templateUrl: '/views/invitation.html',
                    controller: "InvitationModalCtrl",
                    // resolve: {
                    // items: function () {
                    // return $scope.items;
                    // }
                    //}
                });

                modalInstance.result.then(function(course_id) {
                    if (course_id)
                        $state.go("course.course_editor", {
                            course_id: course_id
                        })
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };


        }
    ]);