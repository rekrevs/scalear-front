var ContentNavigator = require('./pages/content_navigator');
// var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
// var InvideoQuiz = require('./pages/invideo_quiz');
// var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
// var MarkerPanel = require('./pages/marker');
var sleep = require('./lib/utils').sleep;
// var refresh= require('./lib/utils').refresh;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
// var ContentItems = require('./pages/content_items');
// var ModuleProgress = require('./pages/module_progress');
// var StudentQuiz = require('./pages/student/quiz');
var StudentLecture = require('./pages/student/lecture');
// var StudentModuleSummary = require('./pages/student/module_summary');
// var Dashboard = require('./pages/dashboard');


var params = browser.params;
var header = new Header()
var sub_header = new SubHeader
// var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
// var marker = new MarkerPanel();
// var invideo_quiz = new InvideoQuiz();
// var quiz = new NormalQuiz();
// var content_items= new ContentItems()
// var navigator = new ContentNavigator(1)
// var module_progress = new ModuleProgress()
// var student_quiz = new StudentQuiz()
var student_lec = new StudentLecture()
// var student_module_summary = new StudentModuleSummary()
// var dashboard = new Dashboard()

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
		navigator.module(1).open()
		navigator.module(1).item(1).open()
		navigator.close()
		video.wait_till_ready()
	})
	// Adding/Deleting confused in timeline
	xdescribe("Adding/Deleting confused in timeline",function(){  
		it("should open timeline",function(){
			// video.wait_till_ready()
			student_lec.open_timeline()
		})
		it("should seek video to 75% & add confused item",function(){
			video.seek(59)
			sleep(1000)
			student_lec.add_confused()
			expect(student_lec.lecture(1).confused.count()).toEqual(1)
		})
		it("should seek video to 77% & add supper confused item",function(){
			video.seek(77)
			sleep(1000)
			student_lec.add_confused()
			student_lec.add_confused()
			expect(student_lec.lecture(1).confused.count()).toEqual(2)
		})
		it("should seek video to 79% & add confused item",function(){
			video.seek(79)
			sleep(1000)
			student_lec.add_confused()
			expect(student_lec.lecture(1).confused.count()).toEqual(3)
		})
		it("should seek video to 81% & add supper confused item",function(){
			video.seek(89)
			sleep(1000)
			student_lec.add_confused()
			student_lec.add_confused()
			expect(student_lec.lecture(1).confused.count()).toEqual(4)
		})
		it("should delete confused and supper confused item ",function(){
			// student_lec.open_timeline()
			student_lec.lecture(1).delete_confused_item(4)
			expect(student_lec.lecture(1).confused.count()).toEqual(3)
			student_lec.lecture(1).delete_confused_item(3)
			expect(student_lec.lecture(1).confused.count()).toEqual(2)
		})		
		it("should close timeline",function(){
			// video.wait_till_ready()
			student_lec.close_timeline()
		})
	})
	// Filtering the timeline
	xdescribe("Filtering the timeline",function(){  
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should filter and check # of items in timeline ",function(){
			expect(student_lec.lecture(1).items.count()).toEqual(10)
			student_lec.timeline_settings.click()
			student_lec.timeline_settings_notes.click()
			expect(student_lec.lecture(1).items.count()).toEqual(9)
			student_lec.timeline_settings_disscusions.click()
			expect(student_lec.lecture(1).items.count()).toEqual(7)			
			student_lec.timeline_settings_quizzes.click()
			expect(student_lec.lecture(1).items.count()).toEqual(4)
			student_lec.timeline_settings_confused.click()
			expect(student_lec.lecture(1).items.count()).toEqual(2)
			student_lec.timeline_settings_markers.click()
			expect(student_lec.lecture(1).items.count()).toEqual(0)
			student_lec.timeline_settings_disscusions.click()
			expect(student_lec.lecture(1).items.count()).toEqual(2)
			student_lec.timeline_settings_quizzes.click()
			expect(student_lec.lecture(1).items.count()).toEqual(5)			
			student_lec.timeline_settings_confused.click()
			expect(student_lec.lecture(1).items.count()).toEqual(7)			
			student_lec.timeline_settings_notes.click()
			expect(student_lec.lecture(1).items.count()).toEqual(8)
			student_lec.timeline_settings_markers.click()
			expect(student_lec.lecture(1).items.count()).toEqual(10)
			student_lec.timeline_settings.click()
		})		
		it("should browser refresh",function(){
			browser.refresh()
			video.wait_till_ready()
			student_lec.reset_timeline_boolean()
			sleep(5000)
			// student_lec.close_timeline()
		})
	})
	// Vote/Un-vote quiz for review from timeline 
	xdescribe("Vote/Un-vote quiz for review from timeline",function(){  
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should Vote quiz for review from timeline ",function(){
			video.wait_till_ready()
			student_lec.open_timeline()
			expect(student_lec.lecture(1).quiz(1).vote_count).toEqual('1')
			student_lec.lecture(1).quiz(1).vote_for_review()
			expect(student_lec.lecture(1).quiz(1).vote_count).toEqual('2')
		})
		it("should Un-vote quiz for review from timeline ",function(){
			expect(student_lec.lecture(1).quiz(1).vote_count).toEqual('2')
			student_lec.lecture(1).quiz(1).unvote_for_review()
			expect(student_lec.lecture(1).quiz(1).vote_count).toEqual('1')
		})
		it("should close timeline",function(){
			// video.wait_till_ready()
			student_lec.close_timeline()
		})
	})
	// All student shortcuts functionality
	xdescribe("All student shortcuts functionality",function(){  	
		// q for question
		it('should add a public question', function(){
			//// Cancel discussion question
			video.seek(00)			
			video.current_time.then(function(result){expect(result).toEqual("0:00:00")} )
			student_lec.add_discussion_shortcut()
			expect(student_lec.discussion_directive.isDisplayed()).toEqual(true);
			student_lec.lecture(1).cancel_discussion()
			expect(student_lec.lecture(1).discussions.count()).toEqual(2)
		})
		// c for confused 
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it('should add a public question', function(){
			student_lec.add_confused_shortcut()
			sleep(5000)
			expect(student_lec.lecture(1).confused.count()).toEqual(3)
			student_lec.lecture(1).delete_confused_item(1)
			expect(student_lec.lecture(1).confused.count()).toEqual(2)
		})
		// n for note
		it("should add a note",function(){
			student_lec.add_note_shortcut()
			student_lec.lecture(1).type_note("Some note text for testing.")
			expect(student_lec.lecture(1).notes.count()).toEqual(2)
			expect(student_lec.lecture(1).note(1).getText()).toEqual("Some note text for testing.")
			student_lec.lecture(1).delete_note(1)
			expect(student_lec.lecture(1).notes.count()).toEqual(1)
		})
		// f for fullscreen
		it("should go to Fullscreen and exit it ",function(){
			expect(student_lec.full_screen_button.getText()).toEqual("Fullscreen")
			student_lec.go_to_fullscreen_shortcut()
			expect(student_lec.exit_full_screen_button.getText()).toEqual("Exit Fullscreen")
			student_lec.go_to_fullscreen_shortcut()
			expect(student_lec.full_screen_button.getText()).toEqual("Fullscreen")
		})
		// J to rewind 10s 
		// K for play/pause 
		// L for fast forward 10s
		it("should go to Fullscreen and exit it ",function(){
			student_lec.forward_10_sec_shortcut()
			video.current_time.then(function(result){expect(result).toEqual("0:00:10")} )
			student_lec.forward_10_sec_shortcut()
			video.current_time.then(function(result){expect(result).toEqual("0:00:20")} )
			student_lec.backward_10_sec_shortcut()
			video.current_time.then(function(result){expect(result).toEqual("0:00:10")} )
			student_lec.play_pause_shortcut()
			expect(video.is_playing()).toEqual(true)
			student_lec.play_pause_shortcut()
			expect(video.is_paused()).toEqual(true)
		})
		it("should close timeline",function(){
			student_lec.close_timeline()
		})
	})

	// Replay button at the end of a student video
	xdescribe("Replay button at the end of a student video",function(){  
		it('should replay the lecture again', function(){	
			video.play()
			expect(student_lec.next_button.isDisplayed()).toEqual(false)
			video.seek(99);
			student_lec.wait_for_video_end()
			expect(student_lec.next_button.isDisplayed()).toEqual(true)
			expect(student_lec.replay_button.isDisplayed()).toEqual(true)
			video.current_time.then(function(result){expect(result).not.toEqual("0:00:00")} )
			student_lec.replay()
			video.current_time.then(function(result){expect(result).toEqual("0:00:00")} )
			expect(student_lec.next_button.isDisplayed()).toEqual(false)
		})
		it('should next the lecture ', function(){	
			var url = browser.driver.getCurrentUrl()
			video.play()
			expect(student_lec.next_button.isDisplayed()).toEqual(false)
			video.seek(99);
			student_lec.wait_for_video_end()
			expect(student_lec.next_button.isDisplayed()).toEqual(true)
			expect(student_lec.replay_button.isDisplayed()).toEqual(true)
			video.current_time.then(function(result){expect(result).not.toEqual("0:00:00")} )
			student_lec.next()
			sleep(1000)
			expect(browser.driver.getCurrentUrl()).not.toEqual(url)
			// url.then(function(result){console.log(result)})
			// browser.driver.getCurrentUrl().then(function(result){console.log(result)})
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		it("should open first module",function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
			video.wait_till_ready()
		})

	})
	// Case where a student retry a quiz through the button 
	xdescribe("Case where a student retry a quiz through the button",function(){  
			it("should seek video to 19%",function(){
				video.play()
				video.seek(19)
				student_lec.wait_for_quiz()
			})
			it('should expect OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ quiz",function(){
				student_lec.mark_answer(1)
				student_lec.check_answer()
			})
			it("should check that it is incorrect",function(){
				expect(student_lec.notification).toContain("Incorrect")
			})
			it("should check explanation",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 1")
			})
			it('wait for the voting question', function(){
				video.play()
				sleep(1000)
				video.pause()
				student_lec.wait_for_vote()
			})
			it('should request that the question not be reviewed in class', function(){
				student_lec.retry_previous_question()
			})
			it('should expect OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ quiz",function(){
				student_lec.mark_answer(3)
				student_lec.check_answer()
			})
	})

	// Markers in timeline
	// Student annotations display
	xdescribe("Markers in timeline && Student annotations display",function(){  
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should add empty maker by shortcut ", function() {
			expect(student_lec.lecture(1).markers.count()).toEqual(2)
			video.seek(54)
			video.current_time.then(function(result){expect(result).toEqual("0:02:34")} )
			video.play()
			sleep(4000)
			expect(student_lec.annotation.isPresent()).toEqual(true)
			video.current_time.then(function(result){expect(result).toEqual("0:02:38")} )
			student_lec.close_annotation()
			expect(student_lec.annotation.isPresent()).toEqual(false)
			video.pause()
			video.seek(58)
			video.current_time.then(function(result){expect(result).toEqual("0:02:46")} )
			video.play()
			sleep(4000)
			expect(student_lec.annotation.isPresent()).toEqual(false)
			video.current_time.then(function(result){expect(result).toEqual("0:02:50")} )
			video.pause()
			video.seek(63)
			video.current_time.then(function(result){expect(result).toEqual("0:03:00")} )
			video.play()
			sleep(4000)
			expect(student_lec.annotation.isPresent()).toEqual(false)
			video.current_time.then(function(result){expect(result).toEqual("0:03:04")} )

			video.pause()
			video.seek(68)
			video.current_time.then(function(result){expect(result).toEqual("0:03:15")} )
			video.play()
			sleep(4000)
			expect(student_lec.annotation.isPresent()).toEqual(true)
			video.current_time.then(function(result){expect(result).toEqual("0:03:18")} )
			video.pause()
	    })
		it("should close timeline",function(){
			student_lec.close_timeline()
		})	    
	})


	// Student free text video quiz with explanation 
	// Case where “You are not authorized” ( lecture is hidden or quiz is unpublished ) 
	// Case where quizzes are less than a second apart 
	// Case where a quiz is at the end of a video 
	// tudent seeking after unsolved quiz while the quiz is displayed 
	// checkIfQuizSolved” in “scripts/controllers/student/lectures/lectures_middle_ctrl.js 
	it('should logout',function(){
		header.logout()
	})
})