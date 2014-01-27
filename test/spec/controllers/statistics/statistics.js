'use strict';

describe('Controller: StatisticsStatisticsCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var StatisticsStatisticsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StatisticsStatisticsCtrl = $controller('StatisticsStatisticsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
