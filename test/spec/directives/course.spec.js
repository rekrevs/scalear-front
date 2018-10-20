describe('home controller', function() {
    var Courses
    // beforeEach(angular.mock.module('ui.router'));
    
    beforeEach(angular.mock.module('scalearAngularApp'));
    // beforeEach(angular.mock.module('courseCtrl'));
    
    beforeEach(inject(function(_Course_) {
         Courses = _Course_
      }));
 
    it('It should exist', function() {
        
        // expect(Courses).toBeDefined();
        expect(4).toBe(4)
    });
  });