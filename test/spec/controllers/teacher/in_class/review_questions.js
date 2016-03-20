'use strict';

describe('Controller: TeacherInClassReviewQuestionsCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherInClassReviewQuestionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherInClassReviewQuestionsCtrl = $controller('TeacherInClassReviewQuestionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
