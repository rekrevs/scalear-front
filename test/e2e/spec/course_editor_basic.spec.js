var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()

describe("Teacher in the course editor", function(){	
	var navigator = new ContentNavigator(1)
	it("should open course",function(){
        course_list.open()
        course_list.open_course(1)
    })

	it('should sort items inside modules', function(){
		var module = navigator.module(1)
		module.open()
		module.sort_items(6,2)
		sleep(1000)
		module.sort_items(5,1)
		expect(module.items.get(0).getText()).toContain("quiz1")
		expect(module.items.get(1).getText()).toContain("lecture1 video quizzes")
		expect(module.items.get(2).getText()).toContain("survey1")
		expect(module.items.get(3).getText()).toContain("lecture2 text quizzes")
		expect(module.items.get(4).getText()).toContain("lecture3 video surveys")
		expect(module.items.get(5).getText()).toContain("quiz2")
	})

	it('should sort modules', function(){
		navigator.sort_modules(2,1)
		expect(navigator.module(1).name).toContain("module 2")
		expect(navigator.module(2).name).toContain("module 1")
	})

	it("should add and edit course links",function(){
		course_editor.add_course_link()
		expect(navigator.course_links.count()).toEqual(1)
		var link = navigator.course_link(1)
		link.edit_name("link1")
		link.edit_url("http://helloworld1.com")
		expect(link.name).toEqual("link1")
		expect(link.url).toEqual("http://helloworld1.com")

		course_editor.add_course_link()
		expect(navigator.course_links.count()).toEqual(2)
		var link = navigator.course_link(2)
		link.edit_name("link2")
		link.edit_url("http://helloworld2.com")
		expect(link.name).toEqual("link2")
		expect(link.url).toEqual("http://helloworld2.com")

		course_editor.add_course_link()
		expect(navigator.course_links.count()).toEqual(3)
		var link = navigator.course_link(3)
		link.edit_name("link3")
		link.edit_url("http://helloworld3.com")
		expect(link.name).toEqual("link3")
		expect(link.url).toEqual("http://helloworld3.com")
	})

	it('should sort course links', function(){
		navigator.sort_links()
		expect(navigator.course_link(1).name).toContain("link3")
		expect(navigator.course_link(2).name).toContain("link1")
		expect(navigator.course_link(3).name).toContain("link2")
	})

	it("should add and edit module links",function(){
		navigator.module(1).open()
		course_editor.add_module_link()
		expect(course_editor.module_links.count()).toEqual(1)
		var link = course_editor.module_link(1)
		link.edit_name("link1")
		link.edit_url("http://helloworld1.com")
		expect(link.name).toEqual("link1")
		expect(link.url).toEqual("http://helloworld1.com")

		course_editor.add_module_link()
		expect(course_editor.module_links.count()).toEqual(2)
		var link = course_editor.module_link(2)
		link.edit_name("link2")
		link.edit_url("http://helloworld2.com")
		expect(link.name).toEqual("link2")
		expect(link.url).toEqual("http://helloworld2.com")

		course_editor.add_module_link()
		expect(course_editor.module_links.count()).toEqual(3)
		var link = course_editor.module_link(3)
		link.edit_name("link3")
		link.edit_url("http://helloworld3.com")
		expect(link.name).toEqual("link3")
		expect(link.url).toEqual("http://helloworld3.com")
	})

	it('should sort moduke links', function(){
		course_editor.sort_links()
		expect(course_editor.module_link(1).name).toContain("link3")
		expect(course_editor.module_link(2).name).toContain("link1")
		expect(course_editor.module_link(3).name).toContain("link2")
	})

	it("should logout",function(){
		header.logout()
	})
})

describe("Student", function(){
	it("should login", function(){
		login_page.sign_in(params.student_mail, params.password)
	})
	var navigator = new ContentNavigator(0)
	it('should have correct number of modules and lectures with same order', function(){
		course_list.open()
		course_list.open_course(1)
		navigator.open()
		expect(navigator.modules.count()).toEqual(2)
		var module1 = navigator.module(1)
		expect(module1.items.count()).toEqual(6)
		expect(module1.name).toContain("module 2")
		expect(module1.items.get(0).getText()).toContain("lecture4 video quizzes")
		expect(module1.items.get(1).getText()).toContain("lecture5 text quizzes")
		expect(module1.items.get(2).getText()).toContain("lecture6 video surveys")
		expect(module1.items.get(3).getText()).toContain("quiz3")
		expect(module1.items.get(4).getText()).toContain("quiz4")
		expect(module1.items.get(5).getText()).toContain("survey2")

		expect(student_lec.timeline_items.count()).toEqual(6)

		var module2 = navigator.module(2)
		module2.open()
		expect(module2.name).toContain("module 1")
		expect(module2.items.count()).toEqual(6)
		expect(module2.items.get(0).getText()).toContain("quiz1")
		expect(module2.items.get(1).getText()).toContain("lecture1 video quizzes")
		expect(module2.items.get(2).getText()).toContain("survey1")
		expect(module2.items.get(3).getText()).toContain("lecture2 text quizzes")
		expect(module2.items.get(4).getText()).toContain("lecture3 video surveys")
		expect(module2.items.get(5).getText()).toContain("quiz2")
		expect(student_lec.timeline_items.count()).toEqual(6)
	})

	it("should have correct number of course links and order",function(){
		navigator.open_course_links()
		expect(navigator.course_links.count()).toEqual(3)
		expect(navigator.course_link(1).link_name).toContain("link3")
		expect(navigator.course_link(2).link_name).toContain("link1")
		expect(navigator.course_link(3).link_name).toContain("link2")
	})

	it("should have correct number of module links and order",function(){
		var module1 = navigator.module(1)
		module1.open()
		expect(module1.links.count()).toEqual(3)
		expect(module1.links.get(0).getText()).toContain("link3")
		expect(module1.links.get(1).getText()).toContain("link1")
		expect(module1.links.get(2).getText()).toContain("link2")
	})

	it("should logout",function(){
		header.logout()
	})
	 
})
	
describe("Revert Changes - Teacher", function(){
	it("should sign in and navigate to course",function(){
		login_page.sign_in(params.teacher_mail, params.password)
		course_list.open()
		course_list.open_course(1)
	})
	var navigator = new ContentNavigator(1)
	it('should delete course links', function(){
		navigator.course_link(3).delete()
		expect(navigator.course_links.count()).toEqual(2)
		navigator.course_link(2).delete()
		expect(navigator.course_links.count()).toEqual(1)
		navigator.course_link(1).delete()
		expect(navigator.course_links.count()).toEqual(0)
	})
	it('should delete module links', function(){
		var module = navigator.module(1)
		module.open()
		course_editor.module_link(3).delete()
		expect(course_editor.module_links.count()).toEqual(2)
		course_editor.module_link(2).delete()
		expect(course_editor.module_links.count()).toEqual(1)
		course_editor.module_link(1).delete()
		expect(course_editor.module_links.count()).toEqual(0)
	})

	it('should revert modules sort', function(){
		navigator.sort_modules(2,1)
		expect(navigator.module(1).name).toContain("module 1")
		expect(navigator.module(2).name).toContain("module 2")
	})
	it("should revert items sort",function(){
		var module = navigator.module(1)
		module.open()
		module.sort_items(3,2)
		module.sort_items(6,2)	
		module.sort_items(6,1)
		module.sort_items(6,1)
		module.sort_items(6,1)
		expect(module.items.get(0).getText()).toContain("lecture1 video quizzes")
		expect(module.items.get(1).getText()).toContain("lecture2 text quizzes")
		expect(module.items.get(2).getText()).toContain("lecture3 video surveys")
		expect(module.items.get(3).getText()).toContain("quiz1")
		expect(module.items.get(4).getText()).toContain("quiz2")
		expect(module.items.get(5).getText()).toContain("survey1")
	})
})