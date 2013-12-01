'use strict';

describe('Controller: TeacherInClassInclassModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherInClassInclassModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherInClassInclassModuleCtrl = $controller('TeacherInClassInclassModuleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
