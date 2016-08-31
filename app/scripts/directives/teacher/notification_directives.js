'use strict';

angular.module('scalearAngularApp')
  .directive('notificationItem', ['$rootScope', 'Home', 'SharedItem', '$state', 'UserSession', function($rootScope, Home, SharedItem, $state, UserSession) {
    return {
      restrict: 'E',
      scope: {
        id: '=',
        notification: '=',
        type: '='
      },
      templateUrl: '/views/teacher/invitation/invitation_item.html',
      link: function(scope, element) {
        UserSession.getCurrentUser()
          .then(function(user) {
            scope.current_user = user
          })
        scope.accept = function() {
          Home.acceptCourse({}, { invitation: scope.id },
            function(data) {
              scope.current_user.invitations = data.invitations
              delete scope.current_user.invitation_items[scope.id]
              $state.go('course.edit_course_information', { course_id: scope.notification.course_id });
              $rootScope.$broadcast('Course:get_current_courses')
            }
          )
        }

        scope.reject = function() {
          Home.rejectCourse({}, { invitation: scope.id },
            function(data) {
              scope.current_user.invitations = data.invitations
              delete scope.current_user.invitation_items[scope.id]
            }
          )
        }
      }
    }
  }]).directive('sharedItemNotification', ['$rootScope', 'Home', 'SharedItem', '$state', 'UserSession', function($rootScope, Home, SharedItem, $state, UserSession) {
    return {
      restrict: 'E',
      scope: {
        id: '=',
        notification: '=',
        type: '='
      },
      templateUrl: '/views/teacher/sharing/shared_item_notification.html',
      link: function(scope, element) {
        UserSession.getCurrentUser()
        .then(function(user){
          scope.current_user = user
        })
        scope.accept = function() {
          SharedItem.accpetShared({ shared_item_id: scope.notification.id }, {},
            function(data) {
              scope.current_user.shared = data.shared_items
              delete scope.current_user.shared_items[scope.id]
              $state.go('show_shared', {}, { reload: true })
            }
          )
        }

        scope.reject = function() {
          SharedItem.rejectShared({ shared_item_id: scope.notification.id }, {},
            function(data) {
              scope.current_user.shared = data.shared_items
              delete scope.current_user.shared_items[scope.id]
            }
          )
        }
      }
    }
  }]);
