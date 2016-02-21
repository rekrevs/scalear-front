'use strict';

describe('Controller: UsersProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var UsersProfileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersProfileCtrl = $controller('UsersProfileCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
