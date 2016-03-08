var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;
var ContentItems = require('./pages/content_items');
var SubHeader = require('./pages/sub_header');

var params = browser.params;

var header = new Header()
var sub_header = new SubHeader()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()
var content_items= new ContentItems()

describe("Teacher in the course editor", function(){
	it("should login as teacher",function(){
		login_page.sign_in(params.teacher_mail, params.password)
	})
	var navigator = new ContentNavigator(1)
	it("should open course",function(){
        course_list.open()
        course_list.open_course(1)
    })

	it("should go to edit mode",function(){
		sub_header.open_edit_mode()
	})
	
	it('should open first module', function(){
		navigator.module(1).open()
	})

	it("should add and edit course links",function(){
		var module = navigator.module(1)
		
		module.open_content_items()
		content_items.add_link()
		expect(module.items.count()).toEqual(7)

		//exchange change_item_url with rename_item incase error is rasied 
		course_editor.change_item_url_link("http://google.com")
		course_editor.rename_item("link1")
		expect(module.item(7).name).toEqual("link1")

		module.open_content_items()
		content_items.add_link()
		expect(module.items.count()).toEqual(8)
		course_editor.change_item_url_link("http://helloworld2.com")
		course_editor.rename_item("link2")
		expect(module.item(8).name).toEqual("link2")
	})

	it('should sort items inside modules', function(){
		var module = navigator.module(1)
		module.sort_items(7,2)
		sleep(1000)
		module.sort_items(5,1)
		sleep(1000)
		module.sort_items(5,4)
		expect(module.item(1).name).toContain("quiz1")
		expect(module.item(2).name).toContain("lecture1 video quizzes")
		expect(module.item(3).name).toContain("link1")
		expect(module.item(4).name).toContain("lecture3 video surveys")
		expect(module.item(5).name).toContain("lecture2 text quizzes")
		expect(module.item(6).name).toContain("quiz2")
		expect(module.item(7).name).toContain("survey1")
		expect(module.item(8).name).toContain("link2")
	})

	it('should sort modules', function(){
		navigator.sort_modules(2,1)
		expect(navigator.module(1).name).toContain("module 2")
		expect(navigator.module(2).name).toContain("module 1")
	})

	it("should logout",function(){
		header.logout()
	})
})

describe("Student", function(){
	it("should login", function(){
		login_page.sign_in(params.student_mail, params.password)
	})
	var navigator = new ContentNavigator(1)
	it('should have correct number of modules and lectures with same order', function(){
		course_list.open()
		course_list.open_course(1)
		expect(navigator.modules.count()).toEqual(2)
		var module1 = navigator.module(1)
		module1.open()
		expect(module1.items.count()).toEqual(6)
		expect(module1.name).toContain("module 2")
		expect(module1.item(1).text).toContain("lecture4 video quizzes")
		expect(module1.item(2).text).toContain("lecture5 text quizzes")
		expect(module1.item(3).text).toContain("lecture6 video surveys")
		expect(module1.item(4).text).toContain("quiz3")
		expect(module1.item(5).text).toContain("quiz4")
		expect(module1.item(6).text).toContain("survey2")

		expect(student_lec.timeline_items.count()).toEqual(6)

		var module2 = navigator.module(2)
		module2.open()
		expect(module2.name).toContain("module 1")
		expect(module2.items.count()).toEqual(8)
		expect(module2.item(1).text).toContain("quiz1")
		expect(module2.item(2).text).toContain("lecture1 video quizzes")
		expect(module2.item(3).text).toContain("link1")
		expect(module2.item(4).text).toContain("lecture3 video surveys")
		expect(module2.item(5).text).toContain("lecture2 text quizzes")
		expect(module2.item(6).text).toContain("quiz2")
		expect(module2.item(7).text).toContain("survey1")
		expect(module2.item(8).text).toContain("link2")
		expect(student_lec.timeline_items.count()).toEqual(8)
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
	it("should go to edit mode",function(){
		sub_header.open_edit_mode()
	})
	var navigator = new ContentNavigator(1)
	it('should revert modules sort', function(){
		var module = navigator.module(2)
		module.open()
		navigator.sort_modules(2,1)
		expect(navigator.module(1).name).toContain("module 1")
		expect(navigator.module(2).name).toContain("module 2")
	})

	it('should delete links', function(){
		var module = navigator.module(1)
		module.open()
		module.item(3).delete()
		module.item(7).delete()
		expect(module.items.count()).toEqual(6)
	})

	it("should revert items sort",function(){
		var module = navigator.module(1)
		module.open()
		module.sort_items(2,1)
		module.sort_items(4,2)
		module.sort_items(4,3)
		expect(module.items.get(0).getText()).toContain("lecture1 video quizzes")
		expect(module.items.get(1).getText()).toContain("lecture2 text quizzes")
		expect(module.items.get(2).getText()).toContain("lecture3 video surveys")
		expect(module.items.get(3).getText()).toContain("quiz1")
		expect(module.items.get(4).getText()).toContain("quiz2")
		expect(module.items.get(5).getText()).toContain("survey1")
	})
	it("should logout",function(){
		header.logout()
	})
})