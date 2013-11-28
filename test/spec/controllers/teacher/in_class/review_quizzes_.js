'use strict';

describe('Controller: TeacherInClassReviewQuizzesCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherInClassReviewQuizzesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherInClassReviewQuizzesCtrl = $controller('TeacherInClassReviewQuizzesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
