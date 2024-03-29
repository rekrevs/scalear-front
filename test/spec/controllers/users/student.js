'use strict';

describe('Controller: UsersStudentCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var UsersStudentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersStudentCtrl = $controller('UsersStudentCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
