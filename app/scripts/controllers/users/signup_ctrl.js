'use strict';

angular.module('scalearAngularApp')
  .controller('UsersSignUpCtrl', ['$scope', 'User', '$state', 'Page', '$filter', '$location', 'ngDialog', '$modal', '$rootScope', function($scope, User, $state, Page, $filter, $location, ngDialog ,$modal, $rootScope) {
    Page.setTitle('account.sign_up')

    var setupScreenName = function() {
      $scope.user.screen_name = $filter('anonymous')((Math.random() * 10) + $scope.user.email, 'user')
      // $scope.user.role_ids = role_id
    }

    var init = function() {
      $scope.user = {}
      $scope.saml_user = {}
      angular.forEach($location.$$search, function(value, key) {
        this[key] = value.replace(/\+/g, ' ')
      }, $scope.saml_user)

      $scope.is_saml = $scope.saml_user.saml
      $scope.user.email = $scope.saml_user.mail || $state.params.input1 || ""
      $scope.user.name = $scope.saml_user.givenName || ""
      $scope.user.last_name = $scope.saml_user.sn || ""
      $scope.user.university = $scope.saml_user.o || ""
      $scope.user.password = $state.params.input2 || ""
      setupScreenName()
    }

    init()

    $scope.signUp = function() {
      User.validateUser({},$scope.user,function(response){
        $scope.privacyPopover();
      }, function(response){
        $scope.user.errors = response.data.errors
      })
    }

    $scope.$watch('user.password',function(newVal,oldVal,scope){
      scope.user.errors = {};
      if(/^(?=.*[a-z])(?=.*\d)/.test(newVal) && newVal.length >7){
        delete scope.user.errors;
      } else if(newVal.length >0) {
        scope.user.errors.password = ["must include at least one lowercase letter and one digit and at least 8 characters"];
      }
    });

    $scope.$watch('user.email', function(){
        setupScreenName()
    });

    $scope.privacyPopover = function() {
      ngDialog.openConfirm({
          template: '/views/privacy_popover.html',
          className: 'ngdialog-theme-default dialogwidth800',
          showClose: false,
          scope: $scope
        })
        .then(function(value) { //user agree to privacy policy terms
           if ($scope.is_saml) {
             $scope.user.saml = $scope.is_saml;
             User.samlSignup({}, { user: $scope.user }, function(response) {
                 User.agreeToPrivacyPolicy( { id: response.user.id },{},function() {
                     $state.go("login",{"access-token":response.token['access-token'],uid:response.token.uid,client:response.token.client});
                   }
                 );
               }, function(response) {
                 $scope.user.errors = response.data.errors;
               });
           } else {
              if (!$scope.user.password_confirmation) {
                $scope.user.password_confirmation = " ";
              }
              delete $scope.user.errors;
              User.signUp({}, $scope.user, function(response) {
                User.agreeToPrivacyPolicy({ id: response.data.id },{},function(){
                  $state.go('thanks_for_registering',{ email : $scope.user.email});
                });
              }, function(response) {
                if(response.data.errors.school_provider){
                  $modal.open({
                    templateUrl: '/views/school_provider_modal.html',
                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
                      $scope.close = function () {
                        $modalInstance.dismiss();
                      };
                    }],
                    scope: $scope
                  })
                }
                else
                {
                  $scope.user.errors = response.data.errors
                }
              })
           }
        });
    }
  }]);
