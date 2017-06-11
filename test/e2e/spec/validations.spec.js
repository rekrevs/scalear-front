// var locator = require('./lib/locators');
// var o_c = require('./lib/openers_and_clickers');
// var teacher = require('./lib/teacher_module');
// var student = require('./lib/student_module');
// var youtube = require('./lib/youtube.js');

// var ptor = protractor.getInstance();
// var params = ptor.params
// ptor.driver.manage().window().setSize(params.width, params.height);

var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
var ContentItems = require('./pages/content_items');
var NewCourse = require('./pages/new_course');
var StudentLecture = require('./pages/student/lecture');
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
var	new_course = new NewCourse();
var student_lec = new StudentLecture()
var module_progress = new ModuleProgress()

var q1_x = 169;
var q1_y = 127;

var q2_x = 169;
var q2_y = 157;

var q3_x = 169;
var q3_y = 187;

var d_q1_x = 169;
var d_q1_y = 70;

var d_q2_x = 169;
var d_q2_y = 130;

var d_q3_x = 169;
var d_q3_y = 190;


describe("Lecture validation", function(){
	it('should sign in as teacher', function(){
		login_page.sign_in(params.teacher1.email, params.password)
	})
	it('should create course', function(){
		new_course.open()
		new_course.create(params.short_name, params.course_name, params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
		new_course.disable_email_reminders_modal_button_click()
	})
	it("should open course",function(){
		course_list.open()
		course_list.open_teacher_course(2)
	})
	it("should go to edit mode",function(){
		sub_header.open_edit_mode()
	})
	it("should create modules",function(){
		expect(navigator.modules.count()).toEqual(0)
		course_editor.add_module();
		course_editor.rename_module("module 1")
		expect(navigator.modules.count()).toEqual(1)
		navigator.add_module();
		course_editor.rename_module("module 2")
		expect(navigator.modules.count()).toEqual(2)
	})
	it('should make sure that the module name is set correctly', function(){
		var module = navigator.module(1)
		module.open()
        expect(course_editor.get_module_name()).toBe('module 1')
    })
	it('should change the name and validate', function(){
		course_editor.rename_module(' ');
		error_feedback("Name can't be blank");
		cancel_editing();
	})

	it('should change the duedate checkbox to null',function(){
		navigator.module(1).open()
		course_editor.open_lecture_settings();
		var due_check= element(by.model('due_date_enabled'))
		due_check.click()
		expect(due_check.getAttribute('checked')).toBe(null)
	})
	it('should change time of module', function(){
		change_appearance_date(getAfterNextWeek("dd-mmmm-yyyy"));
		expect(element(by.css('[src*="error.png"]')).isDisplayed()).toEqual(true)
		change_appearance_date(getYesterday("dd-mmmm-yyyy"));
	})

	describe("Due Date change module",function(){
		it('should change module duedate checkbox to true',function(){
			element(by.model('due_date_enabled')).then(function(due_check){
				due_check.click();
				expect(due_check.getAttribute('checked')).toBe("true")
			})
		})
		it("should add items to the first module",function(){
			var module = navigator.module(1)
			module.open()
			module.open_content_items()
			content_items.add_video()
	        course_editor.rename_item("lecture1 video quizzes")
	        course_editor.change_item_url("https://www.youtube.com/watch?v=SKqBmAHwSkg")
		})
		it('should change lecture due-date_module_link to null  ',function(){
			navigator.module(1).item(1).open()
			element(by.id("lec_settings")).click()
			element(by.model('lecture.due_date_module')).then(function(due_module){
				due_module.click();
				expect(due_module.getAttribute('checked')).toBe(null)
			})
		})
		it('should change module duedate checkout box to null',function(){
			navigator.module(1).open()
			// element(by.id("lec_settings")).click()
			element(by.model('due_date_enabled')).then(function(due_check){
			due_check.click();
			expect(due_check.getAttribute('checked')).toBe(null)
			})
		})
		it('should change lecture due date to after next week  ',function(){
			navigator.module(1).item(1).open()
			// element(by.id("lec_settings")).click()
			change_due_date(getAfterNextWeek("dd-mmmm-yyyy"));
		})
		it('should change module due date to next week',function(){
			navigator.module(1).open()
		 //  element(by.id("lec_settings")).click()
			element(by.model('due_date_enabled')).then(function(due_check){
				due_check.click();
				expect(due_check.getAttribute('checked')).toBe("true")
				// change_due_date(getNextWeek("dd-mmmm-yyyy"));
			})
		})
		it('should check that lecture due date change to module next week ',function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			// element(by.id("lec_settings")).click()
			change_due_date(getAfterNextWeek("dd-mmmm-yyyy"));
			element.all(by.tagName('details-date')).then(function(dates){
				dates[1].getText().then(function(dat){
					expect(dat.split(' ')[1]).toBe(getAfterNextWeek("dd"))
				})
			})
		})
	})

	it("should create quiz", function(){
		navigator.module(1).open()
		navigator.module(1).item(1).open()
		navigator.close()
		video.seek(20)
		invideo_quiz.create(invideo_quiz.ocq)
		expect(invideo_quiz.editor_panel.isDisplayed()).toEqual(true);
		invideo_quiz.rename("OCQ QUIZ")
		invideo_quiz.add_answer(q1_x, q1_y)
		invideo_quiz.type_explanation("explanation 1")
		invideo_quiz.hide_popover()
		invideo_quiz.add_answer(q2_x, q2_y)
		invideo_quiz.mark_correct()
		invideo_quiz.type_explanation("explanation 2")
		invideo_quiz.hide_popover()
		invideo_quiz.add_answer(q3_x, q3_y)
		invideo_quiz.type_explanation("explanation 3")
		invideo_quiz.hide_popover()
		invideo_quiz.save_quiz()
		expect(invideo_quiz.editor_panel.isPresent()).toEqual(false);
		browser.refresh()
	})
	it("should validate name", function(){
		invideo_quiz.open(1)
		invideo_quiz.rename(" ")
		invideo_quiz.save_quiz()
		error_feedback_quiz("Question can't be blank", 1)
		invideo_quiz.rename("OCQ QUIZ")
		invideo_quiz.save_quiz()
	})
	it("should validate time",function(){
		invideo_quiz.open(1)
		invideo_quiz.change_time('00:00:00')
		save_quiz()
		error_feedback_quiz("Time Outside Video Range",2)
		invideo_quiz.change_time('00:00:0')
		save_quiz()
		error_feedback_quiz("Incorrect Format for Time",2)
		invideo_quiz.change_time('0:00:00')
		save_quiz()
		error_feedback_quiz("Incorrect Format for Time",2)
		invideo_quiz.change_time('0:00:000')
		save_quiz()
		error_feedback_quiz("Incorrect Format for Time",2)
		invideo_quiz.change_time('00:01:16')
		invideo_quiz.save_quiz()
	})
	
	it("should delete course",function(){
			course_list.open()
			course_list.delete_teacher_course(2)
			expect(course_list.teacher_courses.count()).toEqual(1)
	})
	it("should logout",function(){
		header.logout()
	})
})

describe("Video validation", function(){
	it('should sign in as teacher', function(){
		login_page.sign_in(params.teacher1.email, params.password)
	})
	it('should create course', function(){
		new_course.open()
		new_course.create(params.short_name, params.course_name, params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
		new_course.disable_email_reminders_modal_button_click()
	})
	it("should open course",function(){
		course_list.open()
		course_list.open_teacher_course(2)
	})
	it("should go to edit mode",function(){
		sub_header.open_edit_mode()
	})
	it("should create modules",function(){
		expect(navigator.modules.count()).toEqual(0)
		course_editor.add_module();
		course_editor.rename_module("module 1")
		expect(navigator.modules.count()).toEqual(1)
		navigator.add_module();
		course_editor.rename_module("module 2")
		expect(navigator.modules.count()).toEqual(2)
	})
	it("should add items to the first module",function(){
		var module = navigator.module(1)
		module.open()
		module.open_content_items()
		content_items.add_video()
        course_editor.rename_item("lecture")
	})


	it('should make sure that the lecture name is set correctly', function(){
        expect(course_editor.get_item_name()).toBe('lecture')
    })

	it('should change the name and validate', function(){
		course_editor.rename_item(' ');
		error_feedback("Name can't be blank");
		cancel_editing();
	})

	it('should make sure that the lecture url is set correctly', function(){
		// cancel_editing();
	    course_editor.change_item_url("https://www.youtube.com/watch?v=SKqBmAHwSkg")
      // course_editor.open_video_settings()
      // expect(course_editor.get_item_url()).toBe('https://www.youtube.com/watch?v=SKqBmAHwSkg')
	})
	it('should make sure that the lecture url is set correctly', function(){
	  expect(course_editor.get_item_url()).toBe('https://www.youtube.com/watch?v=SKqBmAHwSkg')
	})
	it('should try setting the url to blank', function(){
	    course_editor.change_item_url_link(" ")
		error_feedback("Invalid movie type. Please provide a YouTube or .mp4 URL.");
		cancel_editing();
	})

	it('should try setting a Vimeo url', function(){
		// change_lecture_url('http://vimeo.com/109672232');
	    course_editor.change_item_url_link("http://vimeo.com/109672232")
		error_feedback("Invalid movie type. Please provide a YouTube or .mp4 URL.");
		cancel_editing();
	})

	it('should try setting a .mov url', function(){
		// change_lecture_url('http://it.uu.se/katalog/davbl791/wide-test.mov');
	    course_editor.change_item_url_link("http://it.uu.se/katalog/davbl791/wide-test.mov")
		error_feedback("Invalid movie type. Please provide a YouTube or .mp4 URL.");
		cancel_editing();
	})

	it('should try setting a .mp4 url', function(){
		course_editor.change_item_url("http://it.uu.se/katalog/davbl791/wide-test.mp4")
      	// course_editor.open_video_settings()
	})

	it('should now have the new mp4 video', function(){
      	expect(course_editor.get_item_url()).toBe('http://it.uu.se/katalog/davbl791/wide-test.mp4')
	})

	it('should be in order and required by default', function(){

		// navigator.module(1).open()
		course_editor.open_lecture_settings()
		element(by.model('lecture.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe('true');
		})
		element(by.model('lecture.graded')).then(function(graded){
			expect(graded.getAttribute('checked')).toBe('true');
		})

	})

	it('should change the lecture to be not in order', function(){
		element(by.model('lecture.required_module')).click().then(function(){
			browser.refresh();
		})
		course_editor.open_lecture_settings()
		element(by.model('lecture.required')).click()
	})

	it('should now not be in order', function(){
		course_editor.open_lecture_settings()
		element(by.model('lecture.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe(null);
		})
	})

	it('should change the lecture to be not required', function(){
		course_editor.open_lecture_settings()
		element(by.model('lecture.graded_module')).click().then(function(){
			browser.refresh();
		})
		course_editor.open_lecture_settings()
		element(by.model('lecture.graded')).click()
	})

	it('should now not be required', function(){
		course_editor.open_lecture_settings()
		element(by.model('lecture.graded')).then(function(required){
			expect(required.getAttribute('checked')).toBe(null);
		})
	})

	it('should be using module\'s visiblity and due times bt default', function(){
		element(by.model('lecture.appearance_time_module')).then(function(appearance_check){
			expect(appearance_check.getAttribute('checked')).toBe('true')
		})

		element(by.model('setting.due_date_enabled')).then(function(due_enabled){
			expect(due_enabled.getAttribute('checked')).toBe('true')
		})

		element(by.model('lecture.due_date_module')).then(function(due_module){
			expect(due_module.getAttribute('checked')).toBe('true')
		})
	})

	it('should try changing the appearance date to an invalid date - before module appearance', function(){
		course_editor.open_lecture_settings()
		element(by.model('lecture.appearance_time_module')).then(function(appearance_check){
			appearance_check.click();
			expect(appearance_check.getAttribute('checked')).toBe(null)
		})
		change_appearance_date(getYesterday("dd-mmmm-yyyy"));
		error_feedback('Appearance time must be after module appearance time');
	})

	it('should try changing the appearance date to an invalid date - after due date', function(){
		change_appearance_date(getAfterNextWeek("dd-mmmm-yyyy"));
		error_feedback('Appearance time must be before due time');
		cancel_editing();
	})

	it('should try changing the due date to an invalid date - before appearance', function(){
		element(by.model('lecture.due_date_module')).then(function(due_check){
			due_check.click();
			expect(due_check.getAttribute('checked')).toBe(null)
		})
		change_due_date(getYesterday("dd-mmmm-yyyy"));
		error_feedback('Appearance time must be before due time');
	})

	it('should try changing the due date to an invalid date - after module\'s due date', function(){
		change_due_date(getAfterNextWeek("dd-mmmm-yyyy"));
		error_feedback('Due date must be before module due date');
		cancel_editing();
	})
	it("should logout",function(){
		header.logout()
	})
})

describe("Quiz validation", function(){
	it('should sign in as teacher', function(){
		login_page.sign_in(params.teacher1.email, params.password)
	})
	it("should open course",function(){
		course_list.open()
		course_list.open_teacher_course(2)
	})
	it("should go to edit mode",function(){
		sub_header.open_edit_mode()
	})
	it("should add items to the first module",function(){
		var module = navigator.module(1)
		module.open()
        module.open_content_items()
		content_items.add_quiz()
        course_editor.rename_item("quiz1")
	})

	it('should make sure that the lecture name is set correctly', function(){
        expect(course_editor.get_item_name()).toBe('quiz1')
    })

	it('should change the name and validate', function(){
		course_editor.rename_item(' ');
		error_feedback("Name can't be blank");
		cancel_editing();
	})

	it('should be in order and required by default', function(){
		element(by.model('quiz.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe('true');
		})
		element(by.model('quiz.graded')).then(function(graded){
			expect(graded.getAttribute('checked')).toBe('true');
		})

	})

	it('should change the quiz to be not in order', function(){
		element(by.model('quiz.required_module')).click().then(function(){
			browser.refresh();
		})

		element(by.model('quiz.required')).click()
	})

	it('should now not be in order', function(){
		// course_editor.open_quiz_settings()
		element(by.model('quiz.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe(null);
		})
	})

	it('should change the quiz to be not required', function(){
		element(by.model('quiz.graded_module')).click().then(function(){
			browser.refresh();
		})
		element(by.model('quiz.graded')).click()
	})

	it('should now not be required', function(){
		// course_editor.open_quiz_settings()
		element(by.model('quiz.graded')).then(function(required){
			expect(required.getAttribute('checked')).toBe(null);
		})
	})

	it('should be using module\'s visiblity and due times bt default', function(){
		// element(by.model('quiz.appearance_time_module')).then(function(appearance_check){
		// 	expect(appearance_check.getAttribute('checked')).toBe('true')
		// })

		element(by.model('due_date_enabled')).then(function(due_enabled){
			expect(due_enabled.getAttribute('checked')).toBe('true')
		})

		element(by.model('quiz.due_date_module')).then(function(due_module){
			expect(due_module.getAttribute('checked')).toBe('true')
		})
	})

	it('should be publish quiz', function(){
		browser.refresh()
		element(by.name("save_publish")).click()
		expect(element(by.css('[tooltip="Unpublished: not visible to students."]')).isPresent() ).toEqual(false)
		// expect(element(by.css('[ng-if="!(item.appearance_time | visible) && item.class_name == quiz"]')).isDisplayed() ).toEqual(false)

	})
	it('should be unpublish quiz', function(){
		element(by.name("save_publish")).click()
		expect(element(by.css('[tooltip="Unpublished: not visible to students."]')).isDisplayed() ).toEqual(true)
		// expect(element(by.css('[ng-if="!(item.appearance_time | visible) && item.class_name == quiz"]')).isDisplayed() ).toEqual(true)
	})
	it('should be publish quiz', function(){
		browser.refresh()
		element(by.name("save_publish")).click()
		expect(element(by.css('[tooltip="Unpublished: not visible to students."]')).isPresent() ).toEqual(false)
		// expect(element(by.css('[ng-if="!(item.appearance_time | visible) && item.class_name == quiz"]')).isDisplayed() ).toEqual(false)
	})

	it("should delete course",function(){
		course_list.open()
		course_list.delete_teacher_course(2)
		expect(course_list.teacher_courses.count()).toEqual(1)
	})
	it("should logout",function(){
		header.logout()
	})
})


// Case where a lecture due date passed 
// Case where a lecture is due today
describe("Case where a lecture due date passed // Case where a lecture is due today",function(){
	describe("Teacher",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
		it("should open course", function() {
			course_list.open()
			course_list.open_teacher_course(1)
		})
		it("should go to edit mode", function() {
			sub_header.open_edit_mode()
		})
		describe("add module, lectures and quizzes",function(){
			it("should create modules", function() {
				expect(navigator.modules.count()).toEqual(2)
				course_editor.add_module();
				course_editor.rename_module("module 3")
				expect(navigator.modules.count()).toEqual(3)
				navigator.add_module();
				course_editor.rename_module("module 4")
				expect(navigator.modules.count()).toEqual(4)
				navigator.add_module();
				course_editor.rename_module("module 5")
				expect(navigator.modules.count()).toEqual(5)
			})
			it("should add items to the 3rd module", function() {
				var module = navigator.module(3)
				module.open()
				module.open_content_items()
				content_items.add_video()
				course_editor.rename_item("lecture1 video quizzes")
				course_editor.change_item_url(params.url1)
				module.open_content_items()
				content_items.add_quiz()
				course_editor.rename_item("quiz1")
				module.open_content_items()
				content_items.add_survey()
				course_editor.rename_item("survey1")
			})
			it("should add items to the 4th module", function() {
				var module = navigator.module(4)
				module.open()
				module.open_content_items()
				content_items.add_video()
				course_editor.rename_item("lecture1 video quizzes")
				course_editor.change_item_url(params.url1)
				module.open_content_items()
				content_items.add_quiz()
				course_editor.rename_item("quiz1")
				module.open_content_items()
				content_items.add_survey()
				course_editor.rename_item("survey1")
			})
			it("should add items to the 5th module", function() {
				var module = navigator.module(5)
				module.open()
				module.open_content_items()
				content_items.add_video()
				course_editor.rename_item("lecture1 video quizzes")
				course_editor.change_item_url(params.url1)
				module.open_content_items()
				content_items.add_quiz()
				course_editor.rename_item("quiz1")
				module.open_content_items()
				content_items.add_survey()
				course_editor.rename_item("survey1")
			})	
		})
		describe("change due date for module 3 & 4 , required for module 5",function(){
			// MODULE 3
			it('should change lecture appearance date to last week  ',function(){
				navigator.module(3).open()
				course_editor.open_lecture_settings()
				change_appearance_date(getLastWeek("dd-mmmm-yyyy"));
			})		
			it('should change lecture due date to yesterday  ',function(){
				change_due_date(getYesterday("dd-mmmm-yyyy"));
			})
			// MODULE 4
			it('should change lecture appearance date to last week  ',function(){
				navigator.module(4).open()
				// course_editor.open_lecture_settings()
				change_appearance_date(getLastWeek("dd-mmmm-yyyy"));
			})		
			it('should change lecture due date to yesterday  ',function(){
				change_due_date(getToday("dd-mmmm-yyyy"));
				// change_due_time( (new Date().getHours() + 3) , 00)
			})
			it('should change lecture due date to yesterday  ',function(){
				// change_due_date(getToday("dd-mmmm-yyyy"));
				change_due_time( (new Date().getHours() + 3) , 00)
			})
			// MODULE 5
			it('should change lecture appearance date to last week  ',function(){
				navigator.module(5).open()
				// course_editor.open_lecture_settings()
				course_editor.change_module_required()
			})		
		})
		it("should logout",function(){
			header.logout()
		})
	})
	describe("Student 1",function(){
		it("should login as student",function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		it("should open first module",function(){
			navigator.module(3).open()
			navigator.module(3).item(1).open()
			// navigator.close()
			video.wait_till_ready()
		})
		it("should checked warning box of due date",function(){
			// student_lec.due_date_warning
			expect(student_lec.due_date_warning.isDisplayed()).toEqual(true)
			expect(student_lec.due_date_warning.getText()).toContain("Due date has passed")
			expect(student_lec.due_date_warning.getText()).toContain("(1 day) ago")
		})
		it("should open first module",function(){
			navigator.module(4).open()
			navigator.module(4).item(1).open()
			// navigator.close()
			video.wait_till_ready()
		})
		it("should checked warning box of due date",function(){
			// student_lec.due_date_warning
			expect(student_lec.due_date_warning.isDisplayed()).toEqual(true)
			expect(student_lec.due_date_warning.getText()).toContain("Due today at")
		})
		it("should logout",function(){
			header.logout()
		})
	})
})
// Case where all items in a module are optional 
describe("Case where all items in a module are optional ",function(){
	describe("Teacher",function(){

		it("should login",function(){
			login_page.sign_in(params.teacher1.email, params.password)
		})
		it("should open course",function(){
			course_list.open()
			course_list.open_teacher_course(1)
		})
		it("should go to review mode",function(){
			sub_header.open_review_mode()
		})
		it("should open first moduel",function(){
			navigator.module(1).open()
			element(by.className('course-completion')).click()
			expect(browser.driver.getCurrentUrl()).toContain('progress')
		})
		it ("should check number of students", function(){
			module_progress.module_completion().students_count().then(function(coun){expect(coun).toEqual(3)})
		})
		it ("should check number of columns of table", function(){
			module_progress.module_completion().student(1).columns_count().then(function(coun){expect(coun).toEqual(5)})
		})
		it ("should check student 1 data ", function(){
			expect(module_progress.module_completion().student(1).name).toEqual(params.student1.f_name +' '+ params.student1.l_name)
			expect(module_progress.module_completion().student(1).email).toEqual(params.student1.email)
			expect(module_progress.module_completion().student(1).column_item(5)).toContain('Finished_on_Time.png')
		})
		it ("should check student 2 data ", function(){
			expect(module_progress.module_completion().student(2).name).toEqual(params.student2.f_name +' '+ params.student2.l_name)
			expect(module_progress.module_completion().student(2).email).toEqual(params.student2.email)
			expect(module_progress.module_completion().student(2).column_item(5)).toContain('Finished_on_Time.png')
		})
		it ("should check student 3 data ", function(){
			expect(module_progress.module_completion().student(3).name).toEqual(params.student3.f_name +' '+ params.student3.l_name)
			expect(module_progress.module_completion().student(3).email).toEqual(params.student3.email)
			expect(module_progress.module_completion().student(3).column_item(5)).toContain('Finished_on_Time.png')
		})
		// it("should open course",function(){
		// 	course_list.open()
		// 	course_list.open_teacher_course(1)
		// })
		it("should go to edit mode",function(){
			sub_header.open_edit_mode()
		})
		it("should delete modules",function(){
			expect(navigator.modules.count()).toEqual(5)
			var module = navigator.module(5)
			module.open()
			module.item(3).delete()
			expect(module.items.count()).toEqual(2)
			module.item(2).delete()
			expect(module.items.count()).toEqual(1)
			module.item(1).delete()
			expect(module.items.count()).toEqual(0)
			module.delete()
			expect(navigator.modules.count()).toEqual(4)
			var module = navigator.module(4)
			module.open()
			module.item(3).delete()
			expect(module.items.count()).toEqual(2)
			module.item(2).delete()
			expect(module.items.count()).toEqual(1)
			module.item(1).delete()
			expect(module.items.count()).toEqual(0)
			module.delete()
			expect(navigator.modules.count()).toEqual(3)
			var module = navigator.module(3)
			module.open()
			module.item(3).delete()
			expect(module.items.count()).toEqual(2)
			module.item(2).delete()
			expect(module.items.count()).toEqual(1)
			module.item(1).delete()
			expect(module.items.count()).toEqual(0)
			module.delete()
			expect(navigator.modules.count()).toEqual(2)
		})	
		it("should logout",function(){
			header.logout()
		})
	})
})
var months = ["January",
							"February",
							"March",
							"April",
							"May",
							"June",
							"July",
							"August",
							"September",
							"October",
							"November",
							"December"
      			];
function getLastWeek(format){
	var date = new Date();
	date.setDate(date.getDate() - 7);
	return format.replace('yyyy', date.getFullYear()).replace('mmmm', months[date.getMonth()]).replace('mm', date.getMonth()+1).replace('dd', date.getDate());
}
function getYesterday(format){
	var date = new Date();
	date.setDate(date.getDate() - 1);
	return format.replace('yyyy', date.getFullYear()).replace('mmmm', months[date.getMonth()]).replace('mm', date.getMonth()+1).replace('dd', date.getDate());
}
function getToday(format){
	var date = new Date();
	date.setDate(date.getDate());
	return format.replace('yyyy', date.getFullYear()).replace('mmmm', months[date.getMonth()]).replace('mm', date.getMonth()+1).replace('dd', date.getDate());
}
function getTomorrow(format){
	var date = new Date();
	date.setDate(date.getDate() + 1);
	return format.replace('yyyy', date.getFullYear()).replace('mmmm', months[date.getMonth()]).replace('mm', date.getMonth()+1).replace('dd', date.getDate());
}
function getNextWeek(format){
	var date = new Date();
	date.setDate(date.getDate() + 7);
	return format.replace('yyyy', date.getFullYear()).replace('mmmm', months[date.getMonth()]).replace('mm', date.getMonth()+1).replace('dd', date.getDate());
}
function getAfterNextWeek(format){
	var date = new Date();
	date.setDate(date.getDate() + 8);
	return format.replace('yyyy', date.getFullYear()).replace('mmmm', months[date.getMonth()]).replace('mm', date.getMonth()+1).replace('dd', date.getDate());
}

function change_appearance_date(date){
	element(by.tagName('details-date')).click().then(function(){
		element(by.className('editable-input')).clear().sendKeys(date);
		element(by.className('check')).click();
	})
}
function change_appearance_time(hours, minutes){
	element(by.tagName('details-time')).click().then(function(){
		element(by.className('editable-controls')).then(function(controls){
			controls.findElements(protractor.By.tagName('input')).then(function(inputs){
				inputs[0].clear().sendKeys(hours);
				inputs[1].clear().sendKeys(minutes);
			}).then(function(){
				element(by.className('fi-check')).click();
			})
		})
	})
}

function change_due_date(date, indx){
	if(indx == null)
		indx = 1
	element.all(by.tagName('details-date')).then(function(dates){
		dates[indx].click().then(function(){
			element(by.className('editable-input')).clear().sendKeys(date);
			element(by.className('check')).click();
		})
	})
}
function change_due_time(hours, minutes){
	element.all(by.tagName('details-time')).then(function(times){
		times[1].click().then(function(){
			times[1].element(by.model('hours')).clear().sendKeys(hours)
			times[1].element(by.model('minutes')).clear().sendKeys(minutes)
			times[1].element(by.className('fi-check')).click();
			// times[1]
			// element(by.className('editable-controls')).then(function(controls){
				// controls.findElements(protractor.By.tagName('input')).then(function(inputs){
				// times[1].element.all(by.tagName('input')).then(function(inputs){
				// // controls.findElements(protractor.By.tagName('input')).then(function(inputs){
				// 	inputs[0].clear().sendKeys(hours);
				// 	inputs[1].clear().sendKeys(minutes);
				// }).then(function(){
				// 	element(by.className('fi-check')).click();
				// })
			// })
		})
	})
}

function create_quiz_and_check_time(ptor){
	youtube.seek(ptor, 21);
	ptor.sleep(2000);
	locator.by_classname(ptor, 'timer').findElements(protractor.By.className('ng-binding')).then(function(timers){
		timers[0].getText().then(function(time){
			teacher.create_invideo_ocq_text_quiz(ptor);
			expect(element(by.className('quiz_time')).getAttribute('value')).toEqual(time)
			expect(element(by.className('quiz_name')).getAttribute('value')).toEqual("New Quiz")
			teacher.make_ocq_text_questions(ptor);
		})
	})
}

function change_name(ptor, text){
	element.all(by.name('quiz_name')).then(function(q_names){
		ptor.actions().mouseMove(q_names[0]).perform().then(function(){
			element.all(by.className('fi-pencil')).then(function(pen){
				pen[0].click();
			})
		})
	})
	ptor.sleep(5000);
		element(by.className('editable-input')).sendKeys('test');
		ptor.findElement(protractor.By.className('editable-buttons')).findElement(protractor.By.className('fi-check')).then(function(confirm){
			confirm.click();
		})

		element.all(by.name('quiz_name')).then(function(q_names){
			expect(q_names[0].getText()).toEqual('test');
		})
}

function change_lecture_name(name){
	element(by.id('quiz_name')).click().then(function(){
		element(by.className('editable-input')).sendKeys(name)
		element(by.className('check')).click()
	})
}

function change_lecture_url(url){
	element(by.id('url')).click().then(function(){
		element(by.className('editable-input')).sendKeys(url)
		element(by.className('check')).click();
	})
}

function error_feedback(error){
	element(by.className('editable-controls')).element(by.className('error')).then(function(err){
		expect(err.getText()).toContain(error);
	})
}

function cancel_editing(){
	element(by.className('fi-x')).click();
}

function open_invideo_quiz(num) {
	element.all(by.repeater("quiz in quiz_lis")).get(num-1).element(by.className("quiz_title")).click()
}

// function error_feedback_quiz(error, num){
// 	expect(element(by.id("editing")).all(by.className('error')).get(num-1).getText()).toContain(error);
// }
function error_feedback_quiz(error, num){
	// expect(element(by.className('editing')).all(by.className('error')).get(num-1).getText()).toContain(error);
	expect(element(by.css('[ng-switch-when="quiz"]')).all(by.className('error')).get(num-1).getText()).toContain(error);

}

function save_quiz() {
	element(by.buttonText('Done')).click()
}

function editor_hidden() {
	expect(element(by.id('editing')).isPresent()).toEqual(false)
}
