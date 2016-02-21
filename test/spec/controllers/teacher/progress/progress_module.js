'use strict';

describe('Controller: TeacherProgressProgressModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherProgressProgressModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherProgressProgressModuleCtrl = $controller('TeacherProgressProgressModuleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
