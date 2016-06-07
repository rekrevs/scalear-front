'use strict';

describe('Controller: UsersPasswordNewCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var UsersPasswordNewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersPasswordNewCtrl = $controller('UsersPasswordNewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
