// var ContentNavigator = require('./pages/content_navigator');
// var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
// var InvideoQuiz = require('./pages/invideo_quiz');
// var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;
// var refresh= require('./lib/utils').refresh;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
// var ContentItems = require('./pages/content_items');
// var ModuleProgress = require('./pages/module_progress');
// var StudentQuiz = require('./pages/student/quiz');
// var StudentLecture = require('./pages/student/lecture');
var StudentModuleSummary = require('./pages/student/module_summary');
var Dashboard = require('./pages/dashboard');

var params = browser.params;
var header = new Header()
var sub_header = new SubHeader()
// var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
// var invideo_quiz = new InvideoQuiz();
// var quiz = new NormalQuiz();
// var content_items= new ContentItems()
// var navigator = new ContentNavigator(1)
// var module_progress = new ModuleProgress()
// var student_quiz = new StudentQuiz()
// var student_lec = new StudentLecture()
var student_module_summary = new StudentModuleSummary()
var dashboard = new Dashboard()

describe("Student 1",function(){
	it("should login as student",function(){
		login_page.sign_in(params.student1.email, params.password)
	})
	it('should check 2 modules blocks in  dashboard', function(){
		// course_list.open()
		dashboard.open()
		expect(student_module_summary.modules.count()).toEqual(2)
	})
	describe("First Module",function(){
		it('should check main information', function(){
			expect(student_module_summary.module(1).course_module_title.getText()).toContain("csc-test: module 1 ")
			expect(student_module_summary.module(1).course_module_subtitle.getText()).toContain("00:14 hours, 8 Quizzes, 3 Surveys. Due") 
			expect(student_module_summary.module(1).remaning.getText()).toContain("Remaining: 00:00 hours, 0 Quizzes, 0 Surveys.") 
			expect(student_module_summary.module(1).button.getText()).toEqual("Watch again")	// quiz(list) icon
			expect(student_module_summary.module(1).items_completions.count()).toEqual(6) 
			expect(student_module_summary.module(1).items_completion(1).tooltip.getInnerHtml()).toContain("lecture1 video quizzes")
			expect(student_module_summary.module(1).items_completion(1).color).toContain("rgb(22, 165, 63) 100%")	
			// expect(student_module_summary.module(1).online_quiz(2).color).toEqual('rgba(237, 148, 103, 1)')
			expect(student_module_summary.module(1).items_completion(1).type.get(0).isDisplayed()).toEqual(true)	// video icon
			expect(student_module_summary.module(1).items_completion(1).type.get(1).isDisplayed()).toEqual(false)	// quiz(list) icon
			expect(student_module_summary.module(1).items_completion(4).type.get(0).isDisplayed()).toEqual(false)	// video icon
			expect(student_module_summary.module(1).items_completion(4).type.get(1).isDisplayed()).toEqual(true)	// quiz(list) icon
		})
		it('should click on first video item in completion and check url contain lectures', function(){
			student_module_summary.module(1).items_completion(1).click()
			sleep(2000)
			expect(browser.driver.getCurrentUrl()).toContain('courseware/lectures/')
			dashboard.open()	
		})
		it('should click on first quiz item in completion and check url contain quizzes', function(){
			student_module_summary.module(1).items_completion(4).click()
			sleep(2000)
			expect(browser.driver.getCurrentUrl()).toContain('courseware/quizzes/')
			dashboard.open()	
		})
		it('should check first online quizzes information', function(){
			expect(student_module_summary.module(1).online_quizzes.count()).toEqual(8)
			expect(student_module_summary.module(1).online_quiz(1).color).toEqual('rgba(22, 165, 63, 1)')
			// student_module_summary.module(1).online_quiz(1).hover_tooltip()
			// expect(student_module_summary.module(1).online_quiz(1).tooltip_title).toEqual('lecture1 video quizzes')
			// expect(student_module_summary.module(1).online_quiz(1).tooltip_title).toEqual('correct')
			// expect(student_module_summary.module(1).online_quiz(1).tooltip_content).toEqual('MCQ QUIZ')
			expect(student_module_summary.module(1).online_quiz(2).color).toEqual('rgba(237, 148, 103, 1)')
			expect(student_module_summary.module(1).online_quiz(8).color).toEqual('rgba(53, 91, 183, 1)')
		})
		// Case where there’s a time parameter in URL
		it('should click on first online quiz check url contain lectures and check time of video', function(){
			student_module_summary.module(1).online_quiz(1).click()
			sleep(5000)
			expect(browser.driver.getCurrentUrl()).toContain('courseware/lectures/')
			video.current_time.then(function(result){expect(result).toEqual("0:00:28")} )
			dashboard.open()
		})
		it('should click on last online quiz check url contain lectures and check time of video', function(){
			student_module_summary.module(1).online_quiz(8).click()
			sleep(5000)
			expect(browser.driver.getCurrentUrl()).toContain('courseware/lectures/')
			video.current_time.then(function(result){expect(result).toEqual("0:00:57")} )
			dashboard.open()
		})
		it('should check first online quizzes information', function(){
			expect(student_module_summary.module(1).question_title.getText()).toContain('(1 of 2 answered)')
			
			expect(student_module_summary.module(1).questions.count()).toEqual(2)
			expect(student_module_summary.module(1).question(1).getText()).toContain('Public')
			expect(student_module_summary.module(1).question(1).getText()).toContain('first comment')
			expect(student_module_summary.module(1).question(1).getText()).toContain('second comment')
			expect(student_module_summary.module(1).question(2).getText()).toContain('Private')
		})
		it('should click on first question check url contain lectures and check time of video', function(){
			student_module_summary.module(1).question(1).click()
			sleep(5000)
			expect(browser.driver.getCurrentUrl()).toContain('courseware/lectures/')
			video.current_time.then(function(result){expect(result).toEqual("0:01:40")} )
			dashboard.open()
		})
		it('should click on last question check url contain lectures and check time of video', function(){
			student_module_summary.module(1).question(2).click()
			sleep(5000)
			expect(browser.driver.getCurrentUrl()).toContain('courseware/lectures/')
			video.current_time.then(function(result){expect(result).toEqual("0:00:42")} )
			dashboard.open()
		})
	})
	describe("second Module",function(){
		it('should check main information', function(){
			expect(student_module_summary.module(2).course_module_title.getText()).toContain("csc-test: module 2")
			expect(student_module_summary.module(2).course_module_subtitle.getText()).toContain("00:14 hours, 8 Quizzes, 3 Surveys. Due") 
			expect(student_module_summary.module(2).remaning.getText()).toContain("Remaining: 00:00 hours, 2 Quizzes, 1 Surveys.") 
			expect(student_module_summary.module(2).items_completions.count()).toEqual(6) 
			expect(student_module_summary.module(2).items_completion(1).tooltip.getInnerHtml()).toContain("lecture4 video quizzes")		
			expect(student_module_summary.module(2).items_completion(1).color).toContain("rgb(22, 165, 63) 100%")	
			expect(student_module_summary.module(2).items_completion(4).tooltip.getInnerHtml()).toContain("quiz3")		
			expect(student_module_summary.module(2).items_completion(4).color).toContain("rgb(22, 165, 63) 0%")	
			expect(student_module_summary.module(2).items_completion(4).color).toContain("rgb(164, 169, 173) 0%")	
			expect(student_module_summary.module(2).items_completion(1).type.get(0).isDisplayed()).toEqual(true)	// video icon
			expect(student_module_summary.module(2).items_completion(1).type.get(1).isDisplayed()).toEqual(false)	// quiz(list) icon
			expect(student_module_summary.module(2).items_completion(5).type.get(0).isDisplayed()).toEqual(false)	// video icon
			expect(student_module_summary.module(2).items_completion(5).type.get(1).isDisplayed()).toEqual(true)	// quiz(list) icon
		})
		it('should check first online quizzes information', function(){
			expect(student_module_summary.module(2).online_quizzes.count()).toEqual(8)

			expect(student_module_summary.module(2).online_quiz(1).color).toEqual('rgba(237, 148, 103, 1)')
			expect(student_module_summary.module(2).online_quiz(3).color).toEqual('rgba(230, 103, 38, 1)')
			expect(student_module_summary.module(2).online_quiz(5).color).toEqual('rgba(22, 165, 63, 1)')
			expect(student_module_summary.module(2).online_quiz(8).color).toEqual('rgba(53, 91, 183, 1)')
		})
	})
	it('should logout',function(){
		header.logout()
	})
})
describe("Student 2",function(){
	it("should login as student",function(){
		login_page.sign_in(params.student2.email, params.password)
	})
	it('should check 2 modules blocks in  dashboard', function(){
		// course_list.open()
		dashboard.open()
		expect(student_module_summary.modules.count()).toEqual(2)
	})
	it('should check main information', function(){
		expect(student_module_summary.module(1).remaning.getText()).toContain("Remaining: 00:00 hours, 1 Quizzes, 1 Surveys.") 
		expect(student_module_summary.module(1).button.getText()).toEqual("Watch again")	// quiz(list) icon
		expect(student_module_summary.module(2).remaning.getText()).toContain("Remaining: 00:14 hours, 8 Quizzes, 3 Surveys.") 
		expect(student_module_summary.module(2).button.getText()).toEqual("Start watching")	// quiz(list) icon

	})
	it('should logout',function(){
		header.logout()
	})
})