'use strict';

describe('Controller: StudentLecturesCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var StudentLecturesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudentLecturesCtrl = $controller('StudentLecturesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
