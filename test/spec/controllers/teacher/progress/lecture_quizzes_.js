'use strict';

describe('Controller: TeacherProgressLectureQuizzesCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherProgressLectureQuizzesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherProgressLectureQuizzesCtrl = $controller('TeacherProgressLectureQuizzesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
