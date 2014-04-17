var ptor = protractor.getInstance();
var driver = ptor.driver;
var functions = ptor.params;

var youtube = require('./youtube');
var locator = require('./locators');

ptor.driver.manage().window().maximize();
describe('', function(){
	it('should login', function(){
    	functions.sign_in(ptor, functions.mail, functions.password, functions.feedback);
  	})
	it('should open the course to be tested', function(){
	    functions.open_course_by_name(ptor, functions.course_name);
	})
	it('should open the main app menu',function(){
		functions.open_tray(ptor);
	})
	it('should press the lecture icon',function(){
		functions.open_lectures(ptor);
	})
	it('uncheck the quiz checkbox',function(){
		uncheck_quiz(ptor);
	})
	it('should check the discussion checkbox',function(){
		check_discussion(ptor);
	})
	ptor.driver.manage().window().maximize();
	it('ask a private question ',function(){
		//ask_private_question(ptor);
		//ask_a_question(ptor, 'question ya zmeel');
		check_discussions_in_videonotes(ptor);
	})
})

//===================================================
// quiz tab is checked by default so this uncheck it
//===================================================
function uncheck_quiz(ptor){
	locator.by_id(ptor, 'quiz_checkbox').then(function(btn){
		btn.click();
	})
}

//===================================================
// checks the disscussion check box to start testing
//===================================================
function check_discussion(ptor){
	locator.by_id(ptor, 'discussion_checkbox').then(function(btn){
		btn.click();
	})
}
//============================================================
//ask private question and check the total number of question
//============================================================

function ask_private_question(ptor){
	var questions_no = 0;
	locator.by_repeater(ptor, 'element in timeline').then(function(questions){
		questions_no = questions.length;
	})
	locator.by_classname(ptor, 'questionDiv').then(function(btn){
		btn.click().then(function(){
			locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[1]/td/textarea").then(function(textarea){
				textarea.sendKeys('question 1').then(function(){
					locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[2]/td[2]/input").then(function(save){
						save.click().then(function(){
							locator.by_repeater(ptor, 'element in timeline').then(function(elements){
								expect(elements.length).toEqual(questions_no+1);
							})
						})
					})
				})
			})
		})
	})
}

//============================================================
// checks the number of questions given a number as parameter
//============================================================
function check_discussion_no(ptor, con_no){
	locator.by_repeater(ptor, 'element in timeline').then(function(elements){
				expect(elements.length).toEqual(con_no);
	})
}

//=================================================================
// checks the pausing and playing through the question submission
//=================================================================

function check_question_flow(ptor){
	locator.by_classname(ptor, 'questionDiv').then(function(btn){
		btn.click().then(function(){
			youtube.is_paused(ptor);
			locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[1]/td/textarea").then(function(textarea){
				textarea.sendKeys('question 1').then(function(){
					locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[2]/td[2]/input").then(function(save){
						save.click().then(function(){
								youtube.is_playing(ptor);
						})
					})
				})
			})
		})
	})
}

//==========================================================
//		ask a question given the question context
//==========================================================

function ask_a_question(ptor, ques_string){
	var questions_no = 0;
	locator.by_repeater(ptor, 'element in timeline').then(function(questions){
		questions_no = questions.length;
	})
	locator.by_classname(ptor, 'questionDiv').then(function(btn){
		btn.click().then(function(){
			locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[1]/td/textarea").then(function(textarea){
				textarea.sendKeys(ques_string).then(function(){
					locator.by_xpath(ptor, "//*[@id='show_question']/table/tbody/tr[2]/td[2]/input").then(function(save){
						save.click().then(function(){
							locator.by_repeater(ptor, 'element in timeline').then(function(elements){
								expect(elements.length).toEqual(questions_no+1);
							})
						})
					})
				})
			})
		})
	})
}

//==========================================================
// 		checks for the question appearance in videonotes
//==========================================================

function check_discussions_in_videonotes(ptor){
	var video_notes = 0;
	locator.by_id(ptor, 'video_notes').then(function(video_notes_btn){
		video_notes_btn.click().then(function(){
			ptor.sleep(2000);
			locator.s_by_classname(ptor, 'ace_breakpoint').then(function(notes){
				video_notes = notes.length;
				locator.by_id(ptor,'video_events').then(function(btn){
					btn.click();
				})
				ask_a_question(ptor,'question ya zmeel');
				ptor.sleep(10000);
				locator.by_id(ptor, 'video_notes').then(function(video_notes_btn){
					video_notes_btn.click().then(function(){
						ptor.sleep(2000);
						locator.s_by_classname(ptor, 'ace_breakpoint').then(function(notess){
							expect(notess.length).toEqual(video_notes+1);
						})
					})
				})
			})
		})
	})
}

