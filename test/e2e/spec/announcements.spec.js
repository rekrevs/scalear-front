var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var Announcement = require('./pages/Announcement');
var NewCourse = require('./pages/new_course');
var Dashboard = require('./pages/dashboard');
var ContentNavigator = require('./pages/content_navigator');
var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_info = new CourseInformation()
var course_list = new CourseList()
var announcement = new Announcement()
var	new_course = new NewCourse()
var dashboard = new Dashboard()

describe("Teacher",function(){
	it("should open course",function(){
        course_list.open()
        course_list.open_course(1)
    })
	it('should go make announcements', function(){
		announcement.open()
		announcement.create("announcement 1")
		announcement.create("announcement 2")
		announcement.create("announcement 3")
		expect(announcement.posts.count()).toEqual(3)
	})
	it('should another create course', function(){
		new_course.open()
		new_course.create("short_name", "course_name", "15", params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	it('should go make announcements', function(){
		announcement.open()
		announcement.create("announcement 4")
		announcement.create("announcement 5")
		announcement.create("announcement 6")
		expect(announcement.posts.count()).toEqual(3)
	})
	it('should get the enrollment key and enroll student', function(){
		course_info.open()
		var enrollment_key = course_info.enrollmentkey
		header.logout()
		login_page.sign_in(params.student_mail, params.password)
		header.join_course(enrollment_key)
	})
})
describe("Student",function(){
	it('should check announcements in dashboard', function(){
		course_list.open()
		dashboard.open()
		expect(dashboard.events.count()).toEqual(6)
		expect(dashboard.events.get(0).getText()).toContain("announcement 6")
		expect(dashboard.events.get(1).getText()).toContain("announcement 5")
		expect(dashboard.events.get(2).getText()).toContain("announcement 4")
		expect(dashboard.events.get(3).getText()).toContain("announcement 3")
		expect(dashboard.events.get(4).getText()).toContain("announcement 2")
		expect(dashboard.events.get(5).getText()).toContain("announcement 1")
	})
	var navigator = new ContentNavigator(0)
	it('should check announcements in first course information', function(){
		course_list.open()
		course_list.open_course(1)
		navigator.open()
		course_info.open()
		expect(announcement.posts.count()).toEqual(3)
		expect(announcement.posts.get(0).getText()).toContain("announcement 1")
		expect(announcement.posts.get(1).getText()).toContain("announcement 2")
		expect(announcement.posts.get(2).getText()).toContain("announcement 3")
	})

	it('should check announcements in second course information', function(){
		course_list.open()
		course_list.open_course(2)
		expect(announcement.posts.count()).toEqual(3)
		expect(announcement.posts.get(0).getText()).toContain("announcement 4")
		expect(announcement.posts.get(1).getText()).toContain("announcement 5")
		expect(announcement.posts.get(2).getText()).toContain("announcement 6")
	})
	it('should logout',function(){
		header.logout()
	})
})

describe("Teacher",function(){
	it('should sign in',function(){		
		login_page.sign_in(params.teacher_mail, params.password)		
	})
	it('should check announcements in dashboard', function(){
		expect(dashboard.events.count()).toEqual(6)
		expect(dashboard.events.get(0).getText()).toContain("announcement 6")
		expect(dashboard.events.get(1).getText()).toContain("announcement 5")
		expect(dashboard.events.get(2).getText()).toContain("announcement 4")
		expect(dashboard.events.get(3).getText()).toContain("announcement 3")
		expect(dashboard.events.get(4).getText()).toContain("announcement 2")
		expect(dashboard.events.get(5).getText()).toContain("announcement 1")
	})
	it("should go to first course",function(){
		course_list.open()
		course_list.open_course(1)
	})
	it('should delete announcement', function(){		
		announcement.open()
		announcement.delete(3)
		expect(announcement.posts.count()).toEqual(2)
	})
	it('should logout',function(){
		header.logout()
	})
})

describe("Student",function(){
	it("should sign in ",function(){
		login_page.sign_in(params.student_mail, params.password)
	})
	it('should check announcements in dashboard', function(){		
		expect(dashboard.events.count()).toEqual(5)
		expect(dashboard.events.get(0).getText()).toContain("announcement 6")
		expect(dashboard.events.get(1).getText()).toContain("announcement 5")
		expect(dashboard.events.get(2).getText()).toContain("announcement 4")
		expect(dashboard.events.get(3).getText()).toContain("announcement 3")
		expect(dashboard.events.get(4).getText()).toContain("announcement 2")
	})
	var navigator = new ContentNavigator(0)
	it('should check announcements in first course information', function(){
		course_list.open()
		course_list.open_course(1)
		navigator.open()
		course_info.open()
		expect(announcement.posts.count()).toEqual(2)
		expect(announcement.posts.get(0).getText()).toContain("announcement 2")
		expect(announcement.posts.get(1).getText()).toContain("announcement 3")
	})
	it('should check announcements in second course information', function(){
		course_list.open()
		course_list.open_course(2)
		expect(announcement.posts.count()).toEqual(3)
		expect(announcement.posts.get(0).getText()).toContain("announcement 4")
		expect(announcement.posts.get(1).getText()).toContain("announcement 5")
		expect(announcement.posts.get(2).getText()).toContain("announcement 6")
	})
	it('should logout',function(){
		header.logout()
	})
})

describe("Revert Changes - Teacher",function(){
	it('should sign in',function(){
		login_page.sign_in(params.teacher_mail, params.password)
	})
	it('should check announcements in dashboard', function(){		
		expect(dashboard.events.count()).toEqual(5)
		expect(dashboard.events.get(0).getText()).toContain("announcement 6")
		expect(dashboard.events.get(1).getText()).toContain("announcement 5")
		expect(dashboard.events.get(2).getText()).toContain("announcement 4")
		expect(dashboard.events.get(3).getText()).toContain("announcement 3")
		expect(dashboard.events.get(4).getText()).toContain("announcement 2")
	})
	it("should go to first course",function(){
		course_list.open()
		course_list.open_course(1)
	})
	it('should delete announcement', function(){		
		announcement.open()
		announcement.delete(2)
		expect(announcement.posts.count()).toEqual(1)
		announcement.delete(1)
		expect(announcement.posts.count()).toEqual(0)
	})
	it('should go to course list',function(){
		course_list.open()
	})
	it('should delete second course', function(){
		course_list.delete_course(2)
		expect(course_list.courses.count()).toEqual(1)
	})
})