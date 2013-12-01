'use strict';

describe('Controller: TeacherInClassInclassCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherInClassInclassCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherInClassInclassCtrl = $controller('TeacherInClassInclassCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
