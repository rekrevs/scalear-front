'use strict';

describe('Controller: UsersConfirmedCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var UsersConfirmedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsersConfirmedCtrl = $controller('UsersConfirmedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
