'use strict';

angular.module('scalearAngularApp')
  .directive('teacher/courseList/courseListDirectives', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the teacher/courseList/courseListDirectives directive');
      }
    };
  });
