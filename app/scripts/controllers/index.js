'use strict';

angular.module('scalearAngularApp')
    .controller('indexController', ['scalear_api', '$scope', '$state', 'User', '$rootScope', '$translate', '$window', '$modal', '$log', '$http',
        function(scalear_api, $scope, $state, User, $rootScope, $translate, $window, $modal, $log, $http) {

            $scope.changeLanguage = function(key) {
                $log.debug("in change language " + key);
                $translate.uses(key);
                $rootScope.current_lang = key;
                $window.moment.lang(key);
            };

            $scope.changeLanguage($translate.uses());

            $scope.are_notifications = function(){

                if($scope.current_user && $scope.current_user.roles[0].id!=2 && ($scope.current_user.invitations.length!=0 || $scope.current_user.shared_items.length!=0))
                {
                   return true;
                }
                else
                    return false;
            }
            $scope.login = function() {
                //$log.debug("in login");
                //window.location=scalear_api.host+"/"+$scope.current_lang+"/users/sign_angular_in?angular_redirect="+scalear_api.redirection_url; //http://localhost:9000/#/ //http://angular-edu.herokuapp.com/#/
                $state.go("login");
            }

            $scope.logout = function() {
                $rootScope.logging_out = true;
                User.sign_out({}, function() {
                    $rootScope.current_user = null
                    $state.go("login");
                    $rootScope.logging_out = false;
                });

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