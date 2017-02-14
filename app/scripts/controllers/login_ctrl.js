'use strict';

angular.module('scalearAngularApp')
  .controller('LoginCtrl', ['$state', '$scope', '$rootScope', 'scalear_api', '$window', '$log', '$translate', 'User', 'Page', 'ErrorHandler', 'ngDialog', 'MobileDetector', 'Saml', '$location', 'SWAMID', '$cookieStore', '$timeout', 'URLInformation', 'UserSession',"$http", function($state, $scope, $rootScope, scalear_api, $window, $log, $translate, User, Page, ErrorHandler, ngDialog, MobileDetector, Saml, $location, SWAMID, $cookieStore, $timeout, URLInformation, UserSession, $http) {

    $scope.user = {}
    Page.setTitle('navigation.login')
    $('#user_email').select()
    SWAMID.list()
      $rootScope.$on("smal_list_ready", function(evt, swamid_list) {
        $scope.swamid_list = swamid_list
      })
    $scope.previous_provider = $cookieStore.get("login_provider")

    // $scope.saml = $location.$$search
    // if(Object.keys($scope.saml).length){
    //   // $scope.saml=JSON.parse($state.params.attributes)
    //   ngDialog.open({
    //     template: 'samlSignup',
    //     className: 'ngdialog-theme-default ngdialog-theme-custom',
    //     scope: $scope
    //     // preCloseCallback: function(value) {
    //     //   next(data)
    //     // }
    //   });
    // }
    $scope.toggleProviders = function() {
      $scope.show_providers ? $scope.hideProviders() : $scope.showProviders()
    }

    $scope.showProviders = function() {
      $scope.show_providers = true
      $timeout(function() {
        $("#search").select()
      })
      shortcut.add("Enter", function() {
        if ($scope.swamid[0])
          $scope.samlLogin($scope.swamid[0])

      })
    }

    $scope.hideProviders = function() {
      $scope.show_providers = false
      shortcut.remove("Enter", function() {
        $scope.samlLogin($scope.swamid[0])
      })
    }

    $scope.showLoginForm = function() {
      $scope.show_scalable_login = !$scope.show_scalable_login
      $scope.hideProviders()
    }

    $scope.login = function() {
      $scope.sending = true;
      UserSession.allowRefetchOfUser()
      User.signIn({}, { "user": $scope.user },
        function(data) {
          $cookieStore.put('login_provider', 'scalablelearning')
          $log.debug("login success")
          $scope.sending = false;
          $rootScope.$broadcast("Course:get_current_courses")
          $scope.is_mobile = MobileDetector.isMobile()
          if ($scope.is_mobile && (MobileDetector.isTablet() || MobileDetector.isPhone())) {
            ngDialog.open({
              template: 'mobileSupport',
              className: 'ngdialog-theme-default ngdialog-theme-custom',
              preCloseCallback: function(value) {
                next(data)
              }
            });
          } else
            next(data)
        },
        function() {
          $scope.sending = false;
        });
    }

    $scope.join = function() {
      User.userExist({ email: $scope.user.email },
        function(resp) {
          $state.go("signup", { input1: $scope.user.email, input2: $scope.user.password })
        })

    }

    var next = function(user) {
      if (!user.info_complete) {
        $state.go("edit_account");
        ErrorHandler.showMessage($translate("error_message.update_account_information"), 'errorMessage', null, "error");
      } else if (URLInformation.hasEnroll()) {
        $window.location.href = URLInformation.getEnrollLink()
        URLInformation.clearEnrollLink()
      } else if (URLInformation.shouldRedirect()) {
        $window.location.href = URLInformation.getRedirectLink()
        URLInformation.clearRedirectLink()
      } else {
        $state.go("dashboard");
      }
    }

    $scope.samlLogin = function(idp) {
      $cookieStore.put('login_provider', idp)
      $rootScope.busy_loading = true;
      Saml.Login({ idp: idp.entityID },
        function(resp) {
          if(resp.action == "POST"){
            $(resp.saml_url).appendTo('body').submit();
          }
          else{
            // console.log(resp.saml_url)
            window.location = resp.saml_url
          }
        },
        function() {
          $rootScope.busy_loading = false;
          ErrorHandler.showMessage('Could not reach provider', 'errorMessage', 4000, "error");
        }
      )
    }

  }]);
