'use strict';

describe('Controller: TeacherStatisticsStatisticsCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherStatisticsStatisticsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherStatisticsStatisticsCtrl = $controller('TeacherStatisticsStatisticsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
