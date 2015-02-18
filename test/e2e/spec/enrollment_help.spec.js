var Header = require('./pages/header');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var Students = require('./pages/teacher/students');
var AccountInformation = require('./pages/account_information');
var refresh = require('./lib/utils').refresh;
var Login = require('./pages/login');
var params = browser.params;

var login_page = new Login()
var header = new Header()
var course_info = new CourseInformation()
var course_list = new CourseList()
var students_page = new Students()
var account_info = new AccountInformation();

describe("Enrollment Help Check - Teacher",function(){ 
    it("should login as teacher",function(){
        login_page.sign_in(params.teacher_mail, params.password)
    })   
    it("should open course",function(){
        course_list.open()
        course_list.open_course(1)
    })
    it('should check enrollment key is correct in the enrollment message', function(){
        course_info.open()
        var enrollment_key = course_info.enrollmentkey
        students_page.open_add_student_modal()
        expect(students_page.enrollment_key).toEqual(enrollment_key)
        refresh()
    })
    it('should check teacher name is correct in the enrollment message', function(){
        account_info.open()
        var firstname = account_info.firstname
        var lastname = account_info.lastname
        course_list.open()
        course_list.open_course(1)
        students_page.open_add_student_modal()
        expect(students_page.teacher_name).toContain(firstname)
        expect(students_page.teacher_name).toContain(lastname)
        refresh()
    })
    it("should logout",function(){
        header.logout()
    })
})