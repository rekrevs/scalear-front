'use strict';

describe('Controller: TeacherQuizMiddleCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherQuizMiddleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherQuizMiddleCtrl = $controller('TeacherQuizMiddleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
