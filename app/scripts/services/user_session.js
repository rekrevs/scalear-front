'use strict';

angular.module('scalearAngularApp')
  .factory('UserSession', ['$rootScope', 'User', 'Home', '$q', '$log', '$translate', function($rootScope, User, Home, $q, $log, $translate) {

    var current_user = null;
    var deferred_current_user = null;

    function getCurrentUser(argument) {
      if(!deferred_current_user) {
        deferred_current_user = $q.defer();
        User.getCurrentUser()
          .$promise
          .then(function(data) {
            if(data.signed_in) {
              var user = JSON.parse(data.user);
              if(!user.last_name) {
                user.last_name = ''
              }
              user.roles = user.roles.map(function(r) {
                return r.id
              })
              user.profile_image = data.profile_image
              user.invitations = data.invitations
              user.shared = data.shared
              user.accepted_shared = data.accepted_shared
              setCurrentUser(user)
              deferred_current_user.resolve(current_user)
              return getNotifications()
            } else {
              deferred_current_user.reject()
              removeCurrentUser()
            }
          })
          .then(function(response) {
            if(response) {
              current_user.invitation_items = response.invitations
              current_user.shared_items = response.shared_items
            }
          })
          .catch(function() {
            removeCurrentUser()
          })
      }
      return deferred_current_user.promise;
    }

    function getNotifications() {
      return Home.getNotifications().$promise
    }

    function setCurrentUser(user) {
      current_user = user
      $rootScope.current_user = user
    }

    function removeCurrentUser() {
      current_user = null
      deferred_current_user = null
      $rootScope.current_user = null
    }

    function allowRefetchOfUser() {
      deferred_current_user = null
    }

    function logout() {
      return User.signOut({}, function() {
        removeCurrentUser()
      }).$promise;
    }

    function deleteUser(pass) {
      return User.delete_account({ password: pass }, {})
        .$promise
        .then(function() {
          removeCurrentUser()
        })
    }

    return {
      getCurrentUser: getCurrentUser,
      logout: logout,
      allowRefetchOfUser: allowRefetchOfUser,
      deleteUser:deleteUser
    };


  }]);
