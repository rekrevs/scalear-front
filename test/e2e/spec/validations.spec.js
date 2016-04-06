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


xdescribe("Lecture validation", function(){
	it('should sign in as teacher', function(){
		login_page.sign_in(params.teacher_mail, params.password)
	})
	it('should create course', function(){
		new_course.open()
		new_course.create(params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	it("should open course",function(){
		course_list.open()
		course_list.open_course(2)
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
	it('should change the duedate checkout box to null',function(){
		navigator.module(1).open()
		course_editor.open_lecture_settings();
		element(by.model('module.due_date_enabled')).then(function(due_check){
			due_check.click();
			expect(due_check.getAttribute('checked')).toBe(null)	
		})
	})	
	it('should change time of module', function(){
		change_appearance_date(getAfterNextWeek("dd-mmmm-yyyy"));
		expect(element(by.css('[src="images/error.png"]')).isDisplayed()).toEqual(true)	
		change_appearance_date(getYesterday("dd-mmmm-yyyy"));
	})

	describe("Due Date change lecture module",function(){
		it('should change module duedate checkout box to tree',function(){
			element(by.model('module.due_date_enabled')).then(function(due_check){
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
			element(by.id("lec_settings")).click()
			element(by.model('module.due_date_enabled')).then(function(due_check){
			due_check.click();
			expect(due_check.getAttribute('checked')).toBe(null)	
			})
		})	
		it('should change lecture due date to after next week  ',function(){
			navigator.module(1).item(1).open()
			element(by.id("lec_settings")).click()
			change_due_date(getAfterNextWeek("dd-mmmm-yyyy"));	
		})	
		it('should change module due date to next week',function(){
			navigator.module(1).open()
			element(by.id("lec_settings")).click()
			element(by.model('module.due_date_enabled')).then(function(due_check){
				due_check.click();
				expect(due_check.getAttribute('checked')).toBe("true")	
				// change_due_date(getNextWeek("dd-mmmm-yyyy"));
			})
		})	
		it('should check that lecture due date change to module next week ',function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			element(by.id("lec_settings")).click()
			change_due_date(getAfterNextWeek("dd-mmmm-yyyy"));	
			element.all(by.tagName('details-date')).then(function(dates){
				dates[1].getText().then(function(dat){
					expect(dat.split('/')[0]).toBe(getNextWeek("dd"))
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
			course_list.delete_course(2)
			expect(course_list.courses.count()).toEqual(1)
	})
	it("should logout",function(){
		header.logout()
	})
})

describe("Video validation", function(){
	it('should sign in as teacher', function(){
		login_page.sign_in(params.teacher_mail, params.password)
	})
	it('should create course', function(){
		new_course.open()
		new_course.create(params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	it("should open course",function(){
		course_list.open()
		course_list.open_course(2)
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
	    course_editor.change_item_url("https://www.youtube.com/watch?v=SKqBmAHwSkg")
      	course_editor.open_video_settings()
      	expect(course_editor.get_item_url()).toBe('https://www.youtube.com/watch?v=SKqBmAHwSkg')
	})

	xit('should try setting the url to blank', function(){
	    course_editor.change_item_url(" ")
		error_feedback("Url can't be blank");
		cancel_editing();
	})

	xit('should try setting a Vimeo url', function(){
		// change_lecture_url('http://vimeo.com/109672232');
	    course_editor.change_item_url("http://vimeo.com/109672232")
		error_feedback("Invalid Input");
		cancel_editing();
	})

	xit('should try setting a .mov url', function(){
		// change_lecture_url('http://it.uu.se/katalog/davbl791/wide-test.mov');
	    course_editor.change_item_url("http://it.uu.se/katalog/davbl791/wide-test.mov")
		error_feedback("Invalid Input");
		cancel_editing();
	})

	it('should try setting a .mp4 url', function(){
		course_editor.change_item_url("http://it.uu.se/katalog/davbl791/wide-test.mp4")
      	course_editor.open_video_settings()
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
		element(by.model('lecture.required')).click().then(function(){
			browser.refresh();
		})
	})

	it('should now not be in order', function(){
		course_editor.open_lecture_settings()
		element(by.model('lecture.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe(null);
		})
	})

	it('should change the lecture to be not required', function(){
		element(by.model('lecture.graded')).click().then(function(){
			browser.refresh();
		})
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

		element(by.model('lecture.due_date_enabled')).then(function(due_enabled){
			expect(due_enabled.getAttribute('checked')).toBe('true')
		})

		element(by.model('lecture.due_date_module')).then(function(due_module){
			expect(due_module.getAttribute('checked')).toBe('true')
		})
	})

	it('should try changing the appearance date to an invalid date - before module appearance', function(){
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
})

describe("Quiz validation", function(){
	it("should open course",function(){
		course_list.open()
		course_list.open_course(2)
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
		
		// navigator.module(1).open()
		// course_editor.open_lecture_settings()
		element(by.model('quiz.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe('true');
		})
		element(by.model('quiz.graded')).then(function(graded){
			expect(graded.getAttribute('checked')).toBe('true');
		})

	})

	it('should change the quiz to be not in order', function(){
		element(by.model('quiz.required')).click().then(function(){
			browser.refresh();
		})
	})

	it('should now not be in order', function(){
		// course_editor.open_quiz_settings()
		element(by.model('quiz.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe(null);
		})
	})

	it('should change the quiz to be not required', function(){
		element(by.model('quiz.graded')).click().then(function(){
			browser.refresh();
		})
	})

	it('should now not be required', function(){
		// course_editor.open_quiz_settings()
		element(by.model('quiz.graded')).then(function(required){
			expect(required.getAttribute('checked')).toBe(null);
		})
	})

	it('should be using module\'s visiblity and due times bt default', function(){
		element(by.model('quiz.appearance_time_module')).then(function(appearance_check){
			expect(appearance_check.getAttribute('checked')).toBe('true')
		})

		element(by.model('quiz.due_date_enabled')).then(function(due_enabled){
			expect(due_enabled.getAttribute('checked')).toBe('true')
		})

		element(by.model('quiz.due_date_module')).then(function(due_module){
			expect(due_module.getAttribute('checked')).toBe('true')
		})
	})

	it('should try changing the appearance date to an invalid date - before module appearance', function(){
		element(by.model('quiz.appearance_time_module')).then(function(appearance_check){
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
		element(by.model('quiz.due_date_module')).then(function(due_check){
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


	it("should delete course",function(){
		course_list.open()
		course_list.delete_course(2)
		expect(course_list.courses.count()).toEqual(1)
	})
	it("should logout",function(){
		header.logout()
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
function getYesterday(format){
	var date = new Date();
	date.setDate(date.getDate() - 1);
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

function change_due_date(date){
	element.all(by.tagName('details-date')).then(function(dates){
		dates[1].click().then(function(){
			element(by.className('editable-input')).clear().sendKeys(date);
			element(by.className('check')).click();
		})
	})
}
function change_due_time(hours, minutes){
	element.all(by.tagName('details-time')).then(function(times){
		times[1].click().then(function(){
			element(by.className('editable-controls')).then(function(controls){
				controls.findElements(protractor.By.tagName('input')).then(function(inputs){
					inputs[0].clear().sendKeys(hours);
					inputs[1].clear().sendKeys(minutes);
				}).then(function(){
					element(by.className('fi-check')).click();
				})
			})
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