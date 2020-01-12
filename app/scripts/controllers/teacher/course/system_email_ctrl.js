'use strict';

angular.module('scalearAngularApp')
  .controller('systemEmailCtrl', ['$scope', '$state', 'Course', '$stateParams', '$log', '$window', 'Page', '$modalInstance', 'ngDialog', function($scope, $state, Course, $stateParams, $log, $window, Page, $modalInstance, ngDialog) {
    $scope.a='s'
    $window.scrollTo(0, 0);
    $scope.announcement = { emails: "" }
    $scope.updateEmailBody = function(){
      $scope.announcement.message = angular.element('#email_body')[0].innerHTML
    }
    $scope.confirmDialog = function() {
      ngDialog.open({
        template: '<div class="ngdialog-message">\
                    <h2><b><span>You are going to send a system wide email!</span></b></h2>\
                    <span translate>Are you sure you want to continue?</span>\
                    </div>\
                    <div class="ngdialog-buttons">\
                        <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)" translate>Cancel</button>\
                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-disabled="disable_send" ng-click="sendEmail()">Send</button>\
                    </div>',
        plain: true,
        className: 'ngdialog-theme-default ngdialog-dark_overlay ngdialog-theme-custom',
        showClose: false,
        scope: $scope,
        controller: ['$scope', 'Course', function($scope, Course) {
          $scope.sendEmail = function() {
            $scope.disable_send = true
            Course.systemWideEmail({}, {
              subject: $scope.announcement.subject,
              message: $scope.announcement.message,
              list_type: $scope.announcement.list_type,
              reply_to: $scope.announcement.reply_to,
              emails: $scope.announcement.emails.split(",").map(function(email) {
                return email.trim()
              })
            }, function() {
              $scope.closeThisDialog()
            })
          }
        }]
      });
    }

  }]);
