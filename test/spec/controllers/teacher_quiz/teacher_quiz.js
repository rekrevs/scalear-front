'use strict';

describe('Controller: TeacherQuizTeacherQuizCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherQuizTeacherQuizCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherQuizTeacherQuizCtrl = $controller('TeacherQuizTeacherQuizCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
