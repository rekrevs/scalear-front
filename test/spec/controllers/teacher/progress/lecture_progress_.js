'use strict';

describe('Controller: TeacherProgressLectureProgressCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherProgressLectureProgressCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherProgressLectureProgressCtrl = $controller('TeacherProgressLectureProgressCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
