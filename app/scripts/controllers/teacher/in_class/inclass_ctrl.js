'use strict';

angular.module('scalearAngularApp')
  .controller('inclassCtrl', ['$scope', '$translate', 'ContentNavigator','Page','CourseModel', function ($scope, $translate, ContentNavigator, Page, CourseModel) {

    $scope.course = CourseModel.getSelectedCourse()

    Page.setTitle($translate.instant('navigation.in_class') + ': ' + $scope.course.name);
  		ContentNavigator.open()
  }]);
