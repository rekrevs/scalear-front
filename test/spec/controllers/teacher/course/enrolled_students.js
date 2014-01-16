'use strict';

describe('Controller: TeacherCourseEnrolledStudentsCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherCourseEnrolledStudentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherCourseEnrolledStudentsCtrl = $controller('TeacherCourseEnrolledStudentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
