'use strict';

describe('Controller: StudentCourseCourseInformationCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var StudentCourseCourseInformationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StudentCourseCourseInformationCtrl = $controller('StudentCourseCourseInformationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
