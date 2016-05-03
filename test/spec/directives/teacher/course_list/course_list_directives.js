'use strict';

describe('Directive: teacher/courseList/courseListDirectives', function () {

  // load the directive's module
  beforeEach(module('scalearAngularApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<teacher/course-list/course-list-directives></teacher/course-list/course-list-directives>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the teacher/courseList/courseListDirectives directive');
  }));
});
