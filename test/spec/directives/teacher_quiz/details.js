'use strict';

describe('Directive: teacherQuiz/details', function () {

  // load the directive's module
  beforeEach(module('scalearAngularApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<teacher-quiz/details></teacher-quiz/details>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the teacherQuiz/details directive');
  }));
});
