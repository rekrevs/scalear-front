'use strict';

describe('Controller: TeacherCourseSendEmailCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherCourseSendEmailCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherCourseSendEmailCtrl = $controller('TeacherCourseSendEmailCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
