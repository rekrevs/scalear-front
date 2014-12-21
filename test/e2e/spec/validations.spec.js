var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');
var youtube = require('./lib/youtube.js');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().setSize(params.width, params.height);

describe("invideo quiz time and name validation", function(){
	
	it('should sign in as teacher', function(){
		o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture to create quizzes', function(){
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		// teacher.open_item(ptor,1,1)
		teacher.add_lecture(ptor);			
		// o_c.press_content_navigator(ptor);
		// ptor.sleep(2000)
		
		teacher.init_lecture(ptor, "ocq_text_quiz","https://www.youtube.com/watch?v=SKqBmAHwSkg");
	})

	it("should create quiz and check for it's time", function(){
		create_quiz_and_check_time(ptor);
		// ptor.navigate().refresh();
	})

	it("should validate name", function(){
		// o_c.press_content_navigator(ptor);
		// o_c.scroll(ptor, 1000);
		open_invideo_quiz(1)
		teacher.rename_invideo_quiz(' ')
		save_quiz()
		error_feedback_quiz("Question can't be blank", 1)
		teacher.rename_invideo_quiz('correct')
		save_quiz()
		editor_hidden()

		// ptor.navigate().refresh();
		// ptor.sleep(5000)
	})

	it("should validate time",function(){
		open_invideo_quiz(1)
		teacher.change_invideo_quiz_time('00:00:00')
		save_quiz()
		error_feedback_quiz("Time Outside Video Range",2)
		teacher.change_invideo_quiz_time('00:00:0')
		save_quiz()
		error_feedback_quiz("Incorrect Format for Time",2)
		teacher.change_invideo_quiz_time('0:00:00')
		save_quiz()
		error_feedback_quiz("Incorrect Format for Time",2)
		teacher.change_invideo_quiz_time('0:00:000')
		save_quiz()
		error_feedback_quiz("Incorrect Format for Time",2)
		teacher.change_invideo_quiz_time('00:01:16')
		save_quiz()
		editor_hidden()
	})

	it('should clear the course for deletion', function(){
		// o_c.open_course_list(ptor);
	 //    o_c.open_course(ptor, 1);
	 //    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("lec details data validation", function(){
	
	it('should sign in as teacher', function(){
		// o_c.press_login(ptor);
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	it('should add a module and lecture to create quizzes', function(){
		teacher.add_module(ptor);
		teacher.open_module(ptor, 1);
		// teacher.open_item(ptor, 1,1)
		teacher.add_lecture(ptor);
		// teacher.open_lecture_video_settings()
		teacher.init_lecture(ptor, "lecture","https://www.youtube.com/watch?v=SKqBmAHwSkg");			
	})

	it('should make sure that the lecture name is set correctly', function(){
		teacher.open_lecture_video_settings()
		element(by.id('name')).then(function(name){
			expect(name.getText()).toBe('lecture');
		})
	})

	it('should change the name and validate', function(){
		change_lecture_name(' ');
		error_feedback("Name can't be blank");
		cancel_editing();
	})

	it('should make sure that the lecture url is set correctly', function(){
		element(by.id('url')).then(function(url){
			expect(url.getText()).toBe('https://www.youtube.com/watch?v=SKqBmAHwSkg');
		})
	})

	it('should try setting the url to blank', function(){
		change_lecture_url(' ');
		error_feedback("Url can't be blank");
		cancel_editing();
	})

	it('should try setting a Vimeo url', function(){
		change_lecture_url('http://vimeo.com/109672232');
		error_feedback("Invalid Input");
		cancel_editing();
	})

	it('should try setting a .mov url', function(){
		change_lecture_url('http://it.uu.se/katalog/davbl791/wide-test.mov');
		error_feedback("Invalid Input");
		cancel_editing();
	})

	it('should try setting a .mp4 url', function(){
		change_lecture_url('http://it.uu.se/katalog/davbl791/wide-test.mp4');
	})

	it('should now have the new mp4 video', function(){
		element(by.id('url')).then(function(url){
			expect(url.getText()).toBe('http://it.uu.se/katalog/davbl791/wide-test.mp4');
		})
	})

	it('should be in order and required by default', function(){
		teacher.open_lecture_settings()
		element(by.model('lecture.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe('true');
		})
		element(by.model('lecture.graded')).then(function(graded){
			expect(graded.getAttribute('checked')).toBe('true');
		})
	})

	it('should change the lecture to be not in order', function(){
		element(by.model('lecture.required')).click().then(function(){
			ptor.navigate().refresh();
		})
	})

	it('should now not be in order', function(){
		teacher.open_lecture_settings()
		element(by.model('lecture.required')).then(function(in_order){
			expect(in_order.getAttribute('checked')).toBe(null);
		})
	})

	it('should change the lecture to be not required', function(){
		element(by.model('lecture.graded')).click().then(function(){
			ptor.navigate().refresh();
		})
	})

	it('should now not be required', function(){
		teacher.open_lecture_settings()
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

	it('should clear the course for deletion', function(){
		// o_c.to_teacher(ptor);
		// o_c.open_course_list(ptor);
	 //    o_c.open_course(ptor, 1);
	 //    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
	    teacher.delete_empty_module(ptor, 1)
	})

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
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
	element(by.id('name')).click().then(function(){
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

function error_feedback_quiz(error, num){
	expect(element(by.id("editing")).all(by.className('error')).get(num-1).getText()).toContain(error);
}

function save_quiz() {
	element(by.buttonText('Done')).click()
}

function editor_hidden() {
	expect(element(by.id('editing')).isPresent()).toEqual(false)
}