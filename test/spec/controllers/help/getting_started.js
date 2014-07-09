'use strict';

describe('Controller: HelpGettingStartedCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var HelpGettingStartedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HelpGettingStartedCtrl = $controller('HelpGettingStartedCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
