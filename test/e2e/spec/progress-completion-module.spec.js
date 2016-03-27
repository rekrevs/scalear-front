var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;
var refresh= require('./lib/utils').refresh;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
var ContentItems = require('./pages/content_items');
var ModuleProgress = require('./pages/module_progress');

var params = browser.params;
var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var content_items= new ContentItems()
var navigator = new ContentNavigator(1)
var module_progress = new ModuleProgress()





describe("Module Completion", function(){
	describe("Teacher", function(){
		it("should login",function(){
			login_page.sign_in(params.teacher_mail, params.password)
		})
		it("should open course",function(){
			course_list.open()
			course_list.open_course(1)
		})
		it("should go to review mode",function(){
			sub_header.open_review_mode()
		})

		describe('First Module Progress Page', function(){
			it("should open first moduel",function(){
				navigator.module(1).open()
				element(by.className('module-completion')).click()
				expect(browser.driver.getCurrentUrl()).toContain('progress/students')
			})
			it ("should check number of students", function(){
				module_progress.module_completion().students_count().then(function(coun){expect(coun).toEqual(3)})
			})
			it ("should check number of columns of table", function(){
				module_progress.module_completion().student(1).columns_count().then(function(coun){expect(coun).toEqual(6)})
			})
			it ("should check student 1 data ", function(){
				expect(module_progress.module_completion().student(1).name).toEqual('Student 2')
				expect(module_progress.module_completion().student(1).email).toEqual('student2@email.com')
				expect(module_progress.module_completion().student(1).column_item(1)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(1).column_item_tooltip(1)).toContain('3/3 quizzes solved')
				expect(module_progress.module_completion().student(1).column_item(2)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(1).column_item_tooltip(2)).toContain('3/3 quizzes solved')
				expect(module_progress.module_completion().student(1).column_item(3)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(1).column_item_tooltip(3)).toContain('2/2 quizzes solved')
				expect(module_progress.module_completion().student(1).column_item(4)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(1).column_item(5)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(1).column_item(6)).toContain('Not_Finished.png')
			})	
			it ("should check student 2 data ", function(){
				expect(module_progress.module_completion().student(2).name).toEqual('Student 3')
				expect(module_progress.module_completion().student(2).email).toEqual('student3@email.com')
				expect(module_progress.module_completion().student(2).column_item(1)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item_tooltip(1)).toContain('0/3 quizzes solved')
				expect(module_progress.module_completion().student(2).column_item(2)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item_tooltip(2)).toContain('0/3 quizzes solved')
				expect(module_progress.module_completion().student(2).column_item(3)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item_tooltip(3)).toContain('0/2 quizzes solved')
				expect(module_progress.module_completion().student(2).column_item(4)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item(5)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item(6)).toContain('Not_Finished.png')
			})
			it ("should check student 3 data ", function(){
				expect(module_progress.module_completion().student(3).name).toEqual('Test Student')
				expect(module_progress.module_completion().student(3).email).toEqual('student1@email.com')
				expect(module_progress.module_completion().student(3).column_item(1)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item_tooltip(1)).toContain('3/3 quizzes solved')
				expect(module_progress.module_completion().student(3).column_item(2)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item_tooltip(2)).toContain('3/3 quizzes solved')
				expect(module_progress.module_completion().student(3).column_item(3)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item_tooltip(3)).toContain('2/2 quizzes solved')
				expect(module_progress.module_completion().student(3).column_item(4)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item(5)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item(6)).toContain('Finished_on_Time.png')
			})
		})
		it("should go to review mode",function(){
			sub_header.open_review_mode()
		})
		describe('Second Module Progress Page', function(){
			it("should open second moduel",function(){
				navigator.module(2).open()
				element(by.className('module-completion')).click()
				expect(browser.driver.getCurrentUrl()).toContain('progress/students')
			})
			it ("should check number of students", function(){
				module_progress.module_completion().students_count().then(function(coun){expect(coun).toEqual(3)})
			})
			it ("should check number of columns of table", function(){
				module_progress.module_completion().student(1).columns_count().then(function(coun){expect(coun).toEqual(6)})
			})
			it ("should check student 1 data ", function(){
				expect(module_progress.module_completion().student(1).column_item(1)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(1).column_item_tooltip(1)).toContain('0/3 quizzes solved')
				expect(module_progress.module_completion().student(1).column_item(2)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(1).column_item_tooltip(2)).toContain('0/3 quizzes solved')
				expect(module_progress.module_completion().student(1).column_item(3)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(1).column_item_tooltip(3)).toContain('0/2 quizzes solved')
				expect(module_progress.module_completion().student(1).column_item(4)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(1).column_item(5)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(1).column_item(6)).toContain('Not_Finished.png')
			})	
			it ("should check student 2 data ", function(){
				expect(module_progress.module_completion().student(2).column_item(1)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item_tooltip(1)).toContain('0/3 quizzes solved')
				expect(module_progress.module_completion().student(2).column_item(2)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item_tooltip(2)).toContain('0/3 quizzes solved')
				expect(module_progress.module_completion().student(2).column_item(3)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item_tooltip(3)).toContain('0/2 quizzes solved')
				expect(module_progress.module_completion().student(2).column_item(4)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item(5)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item(6)).toContain('Not_Finished.png')
			})
			it ("should check student 3 data ", function(){
				expect(module_progress.module_completion().student(3).column_item(1)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item_tooltip(1)).toContain('3/3 quizzes solved')
				expect(module_progress.module_completion().student(3).column_item(2)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item_tooltip(2)).toContain('3/3 quizzes solved')
				expect(module_progress.module_completion().student(3).column_item(3)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item_tooltip(3)).toContain('2/2 quizzes solved')
				expect(module_progress.module_completion().student(3).column_item(4)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(3).column_item(5)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(3).column_item(6)).toContain('Not_Finished.png')
			})
		})
		it("should logout",function(){
			header.logout()
		})
	})
})

describe("Course Completion", function(){
	describe("Teacher", function(){
		it("should login",function(){
			login_page.sign_in(params.teacher_mail, params.password)
		})
		it("should open course",function(){
			course_list.open()
			course_list.open_course(1)
		})
		it("should go to review mode",function(){
			sub_header.open_review_mode()
		})
		describe('First Module Progress Page', function(){
			it("should open first moduel",function(){
				navigator.module(1).open()
				element(by.className('course-completion')).click()
				expect(browser.driver.getCurrentUrl()).toContain('progress')
			})
			it ("should check number of students", function(){
				module_progress.module_completion().students_count().then(function(coun){expect(coun).toEqual(3)})
			})
			it ("should check number of columns of table", function(){
				module_progress.module_completion().student(1).columns_count().then(function(coun){expect(coun).toEqual(2)})
			})
			it ("should check student 1 data ", function(){
				expect(module_progress.module_completion().student(1).name).toEqual('Student 2')
				expect(module_progress.module_completion().student(1).email).toEqual('student2@email.com')
				expect(module_progress.module_completion().student(1).column_item(1)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(1).column_item(2)).toContain('Not_Finished.png')
			})	
			it ("should check student 2 data ", function(){
				expect(module_progress.module_completion().student(2).name).toEqual('Student 3')
				expect(module_progress.module_completion().student(2).email).toEqual('student3@email.com')
				expect(module_progress.module_completion().student(2).column_item(1)).toContain('Not_Finished.png')
				expect(module_progress.module_completion().student(2).column_item(2)).toContain('Not_Finished.png')
			})
			it ("should check student 3 data ", function(){
				expect(module_progress.module_completion().student(3).name).toEqual('Test Student')
				expect(module_progress.module_completion().student(3).email).toEqual('student1@email.com')
				expect(module_progress.module_completion().student(3).column_item(1)).toContain('Finished_on_Time.png')
				expect(module_progress.module_completion().student(3).column_item(2)).toContain('Not_Finished.png')
			})
			it ("should change student 1 , 3 data ", function(){
				module_progress.module_completion().student(1).column_item_click(1,2)
				expect(module_progress.module_completion().student(1).column_item(1)).toContain('Finished_on_Time.png')
				module_progress.module_completion().student(3).column_item_click(1,3)
				expect(module_progress.module_completion().student(3).column_item(1)).toContain('Not_Finished.png')
				module_progress.module_completion().student(3).column_item_click(2,2)
				expect(module_progress.module_completion().student(3).column_item(2)).toContain('Finished_on_Time.png')

			})
			it("should logout",function(){
				header.logout()
			})
			it("Student 2 login in",function(){
				login_page.sign_in(params.student2_mail, params.password)
			})
			it("Student 2 should open course",function(){
				course_list.open()
				course_list.open_course(1)
			})
			it("Student 2 should open first moduel and check if module 1 is Finished_on_Time",function(){
				navigator.module(1).open()
				expect(module_progress.check_module_finished(1)).not.toMatch('ng-hide')
			})
			it("Student 2 should logout",function(){
				header.logout()
			})
			it("Student 3 login in",function(){
				login_page.sign_in(params.student_mail, params.password)
			})
			it("Student 3 should open course",function(){
				course_list.open()
				course_list.open_course(1)
			})
			it("Student 3 should open first moduel and check if module 1 is Finished_on_Time",function(){
				navigator.module(1).open()
				// expect(module_progress.check_module_finished(1)).toMatch('ng-hide')
				expect(module_progress.check_module_finished(2)).not.toMatch('ng-hide')
					
			})
			it("Student 3 should logout",function(){
				header.logout()
			})
			it("teacher should login",function(){
				login_page.sign_in(params.teacher_mail, params.password)
			})
			it("should open course",function(){
				course_list.open()
				course_list.open_course(1)
			})
			it("should go to review mode",function(){
				sub_header.open_review_mode()
			})
			it("should open first moduel",function(){
				navigator.module(1).open()
				element(by.className('course-completion')).click()
				expect(browser.driver.getCurrentUrl()).toContain('progress')
			})
			it ("should revert changes student 1 data ", function(){
				module_progress.module_completion().student(1).column_item_click(1,1)
				expect(module_progress.module_completion().student(1).column_item(1)).toContain('Not_Finished.png')
				module_progress.module_completion().student(3).column_item_click(1,1)
				expect(module_progress.module_completion().student(3).column_item(1)).toContain('Finished_on_Time.png')
				module_progress.module_completion().student(3).column_item_click(2,1)
				expect(module_progress.module_completion().student(3).column_item(2)).toContain('Not_Finished.png')
			})
			
		})	
		it("should logout",function(){
			header.logout()
		})
	})
})



