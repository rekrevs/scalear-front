'use strict';

angular.module('scalearAngularApp')
  .controller('UsersEditCtrl', ['$rootScope', '$scope', 'User', '$state', '$modal', 'Page', '$translate','UserSession', function($rootScope, $scope, User, $state, $modal, Page, $translate, UserSession) {

    Page.setTitle('navigation.account_information')
    $scope.dayNamesOption = [{
      id: 0,
      name: full_calendar_en["dayNames"][0]
    }, {
      id: 1,
      name: full_calendar_en["dayNames"][1]
    }, {
      id: 2,
      name: full_calendar_en["dayNames"][2]
    }, {
      id: 3,
      name: full_calendar_en["dayNames"][3]
    }, {
      id: 4,
      name: full_calendar_en["dayNames"][4]
    }, {
      id: 5,
      name: full_calendar_en["dayNames"][5]
    }, {
      id: 6,
      name: full_calendar_en["dayNames"][6]
    }]
    $rootScope.subheader_message = $translate('navigation.account_information')

    UserSession.getCurrentUser()
      .then(function(user) {
        $scope.user = {
          screen_name: user.screen_name,
          name: user.name,
          last_name: user.last_name,
          university: user.university,
          email: user.email,
          link: user.link,
          bio: user.bio,
          saml: user.saml,
          first_day: $scope.dayNamesOption[user.first_day],

        }
      })

    $rootScope.$watch('current_lang', function(newval, oldval) {
      if(newval != oldval)
        delete $scope.user.errors
    });

    $scope.confirmDelete = function() {
      $modal.open({
        templateUrl: '/views/users/confirm_delete.html',
        controller: "ConfirmDeleteCtrl",
        resolve: {
          user_new: function() {
            return $scope.user;
          }
        }
      })
    }

    $scope.openRequirePassword = function() {
      delete $scope.user.errors
      if(!$scope.user.saml) {
        $modal.open({
          templateUrl: '/views/users/update_account_info.html',
          controller: 'SaveAccountCtrl',
          resolve: {
            user_new: function() {
              return $scope.user;
            }
          }
        })
      } else {
        $scope.user.first_day = $scope.user.first_day.id
        User.update_account({}, {
            user: $scope.user
          },
          function() {},
          function(response) {
            $scope.user.errors = response.data.errors
          })
      }
    }
  }]);
