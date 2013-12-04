'use strict';

describe('Controller: TeacherInClassReviewSurveysCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherInClassReviewSurveysCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherInClassReviewSurveysCtrl = $controller('TeacherInClassReviewSurveysCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
