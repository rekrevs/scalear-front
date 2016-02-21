'use strict';

describe('Controller: TeacherProgressFreetexttableCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherProgressFreetexttableCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherProgressFreetexttableCtrl = $controller('TeacherProgressFreetexttableCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
