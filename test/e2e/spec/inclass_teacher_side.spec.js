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
var StudentQuiz = require('./pages/student/quiz');
var StudentLecture = require('./pages/student/lecture');
var Inclass = require('./pages/teacher/inclass');
var InclassReviewModel = require('./pages/teacher/inclass_review_model');


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
var student_quiz = new StudentQuiz()
var student_lec = new StudentLecture()
var inclass_page = new Inclass()
var review_model = new InclassReviewModel

describe("check course review", function(){
	describe("Teacher", function(){
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
			element(by.className('module-review')).click()
		})
		xdescribe('First Module Progress Page', function(){
			// Quiz Quizzes & votes 
			describe('First lecture',function(){
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n0 minutes')
				})
				it('should display correct quiz titles',function(){
					module_progress.module_item(1).quiz(1).show_inclass_click()
					expect(module_progress.module_item(1).quiz(1).show_inclass_box.isSelected()).toEqual(true)
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n3 minutes')
				})
				it('should be able to add a replay to discussion',function(){
					module_progress.module_item(1).discussion(2).comment(1).show_inclass_click()
					expect(module_progress.module_item(1).discussion(2).show_inclass_box.isSelected()).toEqual(true)
					expect(module_progress.module_item(1).discussion(2).comment(1).show_inclass_box.isSelected()).toEqual(true)
					module_progress.module_item(1).discussion(1).show_inclass_click()
				})
				it('should be able to add a replay to discussion',function(){
					// module_progress.module_item(1).confused(1).show_inclass_click()
					module_progress.module_item(1).super_confused(1).show_inclass_click()
					// expect(module_progress.module_item(1).confused(1).show_inclass_box.isSelected()).toEqual(true)
					expect(module_progress.module_item(1).super_confused(1).show_inclass_box.isSelected()).toEqual(true)

				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n7 minutes')
				})
				

			})
			describe('Quiz 2',function(){
				it('should be able to add a replay to discussion',function(){
					module_progress.module_item(5).freetextquestion(1).answer_inclass(1).show_inclass_click()
					expect(module_progress.module_item(5).freetextquestion(1).show_inclass_box.isSelected()).toEqual(true)
					expect(module_progress.module_item(5).freetextquestion(1).answer_inclass(1).show_inclass_box.isSelected()).toEqual(true)
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n13 minutes')
				})
			})
			describe('Survey',function(){
				it('should display freetext question statistics correct',function(){
					module_progress.module_item(6).question_quiz(1).show_inclass_click()
				})
				it('should display correct total In-Class time',function(){
					expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n15 minutes')
				})
			})
		})
		describe('InClass Page', function(){
			it("should go to inclass mode", function() {
				sub_header.open_inclass_mode()
			})
			it("should check correct inclass time estimate", function() {
				expect(inclass_page.total_inclass_time).toEqual("15");
				expect(inclass_page.total_pi_time).toEqual("0")
				expect(inclass_page.total_pi_quizzes).toEqual("0")
				expect(inclass_page.total_review_time).toEqual("15")
				expect(inclass_page.total_review_quizzes).toEqual("2")
				expect(inclass_page.total_review_discussions).toEqual("2")
				expect(inclass_page.total_review_surveys).toEqual("1")
				expect(module_progress.module_items.count()).toBe(5)
			// 	// expect(module_progress.module_item(1).markers.count()).toBe(2)
			})

			it('Should Inclass: Seek to different items from the inclass content selector', function(){
				inclass_page.start_inclass_review();
				// browser.actions().sendKeys(protractor.Key.SPACE).perform();
				// sleep(1000)				
				// expect(video.is_playing()).toEqual("00:00:01")
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes")
				expect(review_model.quiz_title.getText()).toBe("MCQ QUIZ")
				review_model.content_list_button.click()
				review_model.content_list.get(4).click()
				expect(review_model.lecture_title.getText()).toEqual("survey1")
				expect(review_model.free_text_question_title.getText()).toContain("mcq question")
				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

			})

			it('Should start in class review First Quiz', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes")
				expect(review_model.question_block.isDisplayed()).toEqual(true)
				expect(review_model.get_block_text(1)).toEqual("Quiz")
				expect(review_model.quiz_title.getText()).toBe("MCQ QUIZ")
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.connected_blocks.count()).toEqual(1) // it was 5 and we added 1 block for showing the result 
				expect(review_model.chart.isDisplayed()).toEqual(true)
				browser.actions().sendKeys("h").perform();
				// sleep(4000)
				expect(review_model.question_block.isPresent()).toEqual(false)
				expect(review_model.chart.isPresent()).toEqual(false)
				browser.actions().sendKeys("h").perform();
				expect(review_model.question_block.isDisplayed()).toEqual(true)
				expect(review_model.chart.isDisplayed()).toEqual(true)
				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
				inclass_page.module_item(1).inclass_quiz(1).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("12");
			})
			it('Should start in class review Private Discussion', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes")
				expect(review_model.question_block.isDisplayed()).toEqual(true)
				expect(review_model.get_block_text(1)).toEqual("Discussion")
				// comment_title
				expect(review_model.question_title.getText()).toBe("Private Question")
				// expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.connected_blocks.count()).toEqual(1) // it was 5 and we added 1 block for showing the result 
				expect(review_model.chart.isPresent()).toEqual(false)
				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
				// inclass_page.module_item(1).inclass_quiz(1).show_inclass_click()
				inclass_page.module_item(1).discussion(1).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("10");
			})
			it('Should start in class review Public Discussion and Comment', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes")
				expect(review_model.question_block.isDisplayed()).toEqual(true)
				expect(review_model.get_block_text(1)).toEqual("Discussion")
				// comment_title
				expect(review_model.question_title.getText()).toContain("Public Question")
				expect(review_model.question_title.getText()).toContain("second comment")				
				expect(review_model.comment_title.getText()).toBe("second comment")
				// expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.connected_blocks.count()).toEqual(1) // it was 5 and we added 1 block for showing the result 
				expect(review_model.chart.isPresent()).toEqual(false)
				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
				// inclass_page.module_item(1).inclass_quiz(1).show_inclass_click()
				inclass_page.module_item(1).discussion(2).comment(1).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("10");
			})
			it('Should start in class review Public Discussion', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes")
				expect(review_model.question_block.isDisplayed()).toEqual(true)
				expect(review_model.get_block_text(1)).toEqual("Discussion")
				// comment_title
				expect(review_model.question_title.getText()).toBe("Public Question")
				// expect(review_model.comment_title.isPresent()).toBe(false)
				// expect(review_model.get_block(5).getAttribute('class')).toContain("small_circles")
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.connected_blocks.count()).toEqual(1) // it was 5 and we added 1 block for showing the result 
				expect(review_model.chart.isPresent()).toEqual(false)
				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
				// inclass_page.module_item(1).inclass_quiz(1).show_inclass_click()
				inclass_page.module_item(1).discussion(2).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("8");
			})
			it('Should start in class review Markers', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes : 1st Edit Marker")
				expect(review_model.question_block.isPresent()).toEqual(false)
				expect(review_model.get_block(1).getAttribute('class')).toContain("small_circles")
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.get_block(2).getAttribute('class')).toContain("small_circles")
				expect(review_model.connected_blocks.count()).toEqual(2) // it was 5 and we added 1 block for showing the result 
				browser.actions().sendKeys("b").perform();
				expect(element(by.className('blackscreen')).getText()).toEqual("Click or Press 'b' to return")
				browser.actions().sendKeys("b").perform();
				browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
				expect(review_model.get_block(1).getAttribute('class')).not.toContain("active")
				expect(review_model.get_block(2).getAttribute('class')).toContain("active")
				browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.get_block(2).getAttribute('class')).not.toContain("active")

				browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
				browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes : Empty Annotation")
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.get_block(2).getAttribute('class')).not.toContain("active")
				browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
				expect(review_model.get_block(1).getAttribute('class')).not.toContain("active")
				expect(review_model.get_block(2).getAttribute('class')).toContain("active")
				browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();
				expect(review_model.get_block(1).getAttribute('class')).toContain("active")
				expect(review_model.get_block(2).getAttribute('class')).not.toContain("active")

				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
				inclass_page.module_item(1).marker(1).show_inclass_click()
				inclass_page.module_item(1).marker(2).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("8");
			})
			it('Should start in class review Confused', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("lecture1 video quizzes")
				expect(review_model.question_block.isPresent()).toEqual(true)
				expect(review_model.get_block(1).getAttribute('class')).toContain("small_circles")
				expect(review_model.get_block(2).getAttribute('class')).not.toContain("small_circles")
				expect(review_model.confused_title.getText()).toBe("Really Confused: 1")
				expect(review_model.get_block_text(2)).toEqual("Confused")
				expect(review_model.connected_blocks.count()).toEqual(2) // it was 5 and we added 1 block for showing the result 

				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
				inclass_page.module_item(1).really_confused(1).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("8");
			})
			it('Should start in class review Free Text Question', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("quiz2")
				expect(review_model.free_text_question_title.getText()).toContain("free question")
				expect(review_model.free_text_question_title.getText()).toContain("second free answer")
				browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
				inclass_page.module_item(4).freetextquestion(1).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("2");
			})
			it('Should start in class Survey', function(){
				inclass_page.start_inclass_review();
				expect(review_model.review_model.isDisplayed()).toEqual(true)
				expect(review_model.lecture_title.getText()).toEqual("survey1")
				expect(review_model.free_text_question_title.getText()).toContain("mcq question")
				// expect(review_model.free_text_question_title.getText()).toContain("second free answer")
				expect(review_model.white_chart.isDisplayed()).toContain(true)
				browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();	
				expect(element(by.className('blackscreen')).getText()).toEqual('Review finished. Press ESC to end')
				browser.actions().sendKeys(protractor.Key.ARROW_LEFT).perform();	
				review_model.exit_button.click()
				inclass_page.module_item(5).question_quiz(1).show_inclass_click()
				expect(inclass_page.total_inclass_time).toEqual("0");
			})

			it("should check correct inclass time estimate", function() {
				inclass_page.module_item(1).inclass_quiz(1).show_inclass_click()
				inclass_page.module_item(1).discussion(1).show_inclass_click()
				inclass_page.module_item(1).discussion(2).show_inclass_click()
				inclass_page.module_item(1).discussion(2).comment(1).show_inclass_click()
				inclass_page.module_item(1).marker(1).show_inclass_click()
				inclass_page.module_item(1).marker(2).show_inclass_click()
				inclass_page.module_item(1).really_confused(1).show_inclass_click()

				inclass_page.module_item(4).freetextquestion(1).show_inclass_click()
				inclass_page.module_item(5).question_quiz(1).show_inclass_click()

				expect(inclass_page.total_inclass_time).toEqual("15");
			})			
		  })

		it("should go to review mode",function(){
			sub_header.open_review_mode()
		})
		it("should open first moduel",function(){
			navigator.module(1).open()
			element(by.className('module-review')).click()
		})
		it("should revert",function(){
			module_progress.module_item(1).quiz(1).show_inclass_click()
			module_progress.module_item(1).discussion(2).comment(1).show_inclass_click()
			module_progress.module_item(1).discussion(2).show_inclass_click()
			module_progress.module_item(1).discussion(1).show_inclass_click()
			module_progress.module_item(1).super_confused(1).show_inclass_click()

			module_progress.module_item(5).freetextquestion(1).answer_inclass(1).show_inclass_click()
			module_progress.module_item(5).freetextquestion(1).show_inclass_click()
			module_progress.module_item(6).question_quiz(1).show_inclass_click()


			expect(module_progress.time_estimate_total_time).toEqual('Total In-Class Time:\n0 minutes')
		})
		it("should logout",function(){
			header.logout()
		})
	})
})