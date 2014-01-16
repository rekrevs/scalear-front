'use strict';

describe('Controller: TeacherNavigationCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherNavigationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherNavigationCtrl = $controller('TeacherNavigationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
