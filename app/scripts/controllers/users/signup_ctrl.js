'use strict';

angular.module('scalearAngularApp')
  .controller('UsersSignUpCtrl', ['$scope', 'User', '$state', 'Page', '$filter', '$location', 'ngDialog', '$modal', function($scope, User, $state, Page, $filter, $location, ngDialog ,$modal) {
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
      if($scope.is_saml) {
        $scope.user.saml = $scope.is_saml
        User.samlSignup({}, {
          user: $scope.user,
          // role_id: $scope.user.role_ids
        }).$promise
        .then(function(data) {
          $state.go('confirmed');
        })
        .catch(function(response){
          $scope.user.errors = response.data.errors
        })
      } else {
        if(!$scope.user.password_confirmation) {
          $scope.user.password_confirmation = ' '
        }
        delete $scope.user.errors
        User.signUp({}, $scope.user, function() {
          $state.go('thanks_for_registering',{ email : $scope.user.email});
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
    }

    $scope.$watch('user.email', function(){
        setupScreenName()
    })
    // $scope.sign_up = function() {
    //     $scope.sending = true;
    //     $scope.final_user = angular.copy($scope.user)
    //     if(!$scope.final_user.password_confirmation){
    //         $scope.final_user.password_confirmation = ' '
    //     }
    //     delete $scope.final_user.errors
    //     User.sign_up({}, {
    //         user: $scope.final_user
    //     }, function() {
    //         $scope.sending = false;
    //         $state.go('thanks_for_registering',{type:1});
    //     }, function(response) {
    //         $scope.user.errors = response.data.errors
    //         $scope.sending = false;
    //     })
    // }

    // $scope.$watch('current_lang', function(newval, oldval) {
    //     if (newval != oldval)
    //         delete $scope.user.errors
    // });
  }]);
