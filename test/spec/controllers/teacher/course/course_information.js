'use strict';

describe('Controller: TeacherCourseCourseInformationCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherCourseCourseInformationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherCourseCourseInformationCtrl = $controller('TeacherCourseCourseInformationCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
