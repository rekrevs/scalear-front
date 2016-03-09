'use strict';

describe('Controller: KpiCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var KpiCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    KpiCtrl = $controller('KpiCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
