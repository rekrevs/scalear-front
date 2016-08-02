'use strict';

angular.module('scalearAngularApp')
  .factory('UserSession', ['$rootScope', 'User', 'Home', '$q', '$log', '$translate', function($rootScope, User, Home, $q, $log, $translate) {

    var current_user = null

    function getUser(argument) {
      var deferred = $q.defer();
      var user = getCurrentUser()
      if(!user) {
        User.getCurrentUser(function(data) {
          $log.debug(data);
          if(data.signed_in) {
            user = JSON.parse(data.user);
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
            getNotifications().then(function(response) {
              user.invitation_items = response.invitations
              user.shared_items = response.shared_items
              setCurrentUser(user)
            })

          }
          deferred.resolve(user)
        })
      } else {
        deferred.resolve(user)
      }
      return deferred.promise;
    }

    function getNotifications() {
      return Home.getNotifications().$promise
    }

    function setCurrentUser(user) {
      current_user = user
      $rootScope.current_user = user
    }

    function getCurrentUser() {
      return current_user
    }

    function removeCurrentUser(){
      current_user = null
      $rootScope.current_user = null
    }

    function logout() {
      User.signOut({}, function() {
        removeCurrentUser()
      }).$promise;
    }

    return {
      getUser: getUser,
      logout: logout
    };


  }]);
