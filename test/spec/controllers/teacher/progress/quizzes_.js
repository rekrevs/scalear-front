'use strict';

describe('Controller: TeacherProgressQuizzesCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherProgressQuizzesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherProgressQuizzesCtrl = $controller('TeacherProgressQuizzesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
