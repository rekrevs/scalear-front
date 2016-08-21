'use strict';

describe('Controller: TeacherCourseSendEmailsCtrl', function () {

  // load the controller's module
  beforeEach(module('scalearAngularApp'));

  var TeacherCourseSendEmailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeacherCourseSendEmailsCtrl = $controller('TeacherCourseSendEmailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
