'use strict';

angular.module('scalearAngularApp')
	.directive('notificationItem', ['$rootScope', 'Home', 'SharedItem', '$state', function($rootScope, Home, SharedItem, $state){
	  return{
	    restrict: 'E',
	    scope:{
	      id: '=',
	      notification: '=',
	      type: '='
	    },
	    templateUrl: '/views/notification_item.html',
	    link: function(scope, element){
	      scope.accept = function(){
	        Home.acceptCourse({},{invitation : scope.id},function(data){
	          $rootScope.current_user.invitations = data.invitations
	          delete $rootScope.current_user.invitation_items[scope.id]
	          $state.go('course.course_editor', {course_id: scope.notification.course_id});
	        }, function(response){
	        })
	      }

	      scope.reject = function(){
	        Home.rejectCourse({},{invitation : scope.id},
	        function(data){
	          $rootScope.current_user.invitations = data.invitations  
	          delete $rootScope.current_user.invitation_items[scope.id]
	        }, 
	        function(response){
	        })
	      }
	    }
	  }
	}]).directive('sharedItemNotification', ['$rootScope', 'Home', 'SharedItem', '$state', function($rootScope, Home, SharedItem, $state){
	  return{
	    restrict: 'E',
	    scope:{
	      id: '=',
	      notification: '=',
	      type: '='
	    },
	    templateUrl: '/views/shared_item_notification.html',
	    link: function(scope, element){
	      scope.accept = function(){
	        SharedItem.accpetShared(
	          {shared_item_id: scope.notification.id},{},
	          function(data){
	            $rootScope.current_user.shared = data.shared_items
	            delete $rootScope.current_user.shared_items[scope.id]
	            $state.transitionTo('show_shared')
	          },
	          function(){}
	        )
	      }

	      scope.reject = function(){
	        SharedItem.rejectShared(
	          {shared_item_id: scope.notification.id},{},
	          function(data){
	            $rootScope.current_user.shared = data.shared_items
	            delete $rootScope.current_user.shared_items[scope.id]
	          },
	          function(){}
	        )
	      }
	    }
	  }
	}]);