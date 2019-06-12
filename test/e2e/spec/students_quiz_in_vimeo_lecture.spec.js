var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var StudentLecture = require('./pages/student/lecture');
var StudentQuiz = require('./pages/student/quiz');
var scroll_top = require('./lib/utils').scroll_top;
var scroll_bottom = require('./lib/utils').scroll_bottom;
var sleep = require('./lib/utils').sleep;
var SubHeader = require('./pages/sub_header');

var params = browser.params;

var course_list = new CourseList()
var video = new Video();
var quiz = new NormalQuiz();
var header = new Header()
var sub_header = new SubHeader()
var login_page = new Login()
var course_editor = new CourseEditor()
var student_lec = new StudentLecture()
var student_quiz = new StudentQuiz()

describe("Solve Course",function(){
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		describe("First Module",function(){
			it("should open first module",function(){
				navigator.module(1).open()
				navigator.module(1).item(1).open()
				navigator.close()
			})
			it("should seek video to 50%",function(){
				browser.refresh()
				video.wait_till_ready()
				video.play()
				video.seek(20)
				student_lec.wait_for_quiz()

				sleep(3000)
			})
			it('should expect OCQ quiz', function(){
				expect(student_lec.check_answer_button.isDisplayed()).toEqual(true);
			})
			it("should answer OCQ quiz",function(){
				// //  student_lec.mark_answer(1)
				 // var x = element(by.id('ontop')).all(by.tagName('input'))
				// //  expect(x.count(),3)
				// //  expect(x.first().getTagName()).toBe('input')
				// //  expect(x.first().getAttribute('style')).toBe('eft: 57.5053%; top: 17.5987%;  position: absolute;')
				// // // expect(x.first().getLocation()).toBe('input')
				// //  expect(x.first().isDisplayed()).toBeTruthy();

				// browser.driver.actions() .mouseMove(x.first()).perform() //, { x: 656.75, y:209.390625 }) .perform().then(() => browser.actions() .click() .perform());
				// browser.driver.actions() .mouseMove(x.first(), { x: 1, y:1}).perform()
			    // browser.driver.actions().click().perform();
				// // //Actions c = new Actions(driver).click(x.first())
				// element(by.id('ontop')).all(by.model('data.selected')).get(0).click()
				// // // expect(x.last()).toBe(0)
				// x.first().click().then(function(){

				
				// 	expect( x.first().  getAttribute('type')).toBe('radio')
				// 	expect( x.first().  getAttribute('name')).toBe('student_answer')
				// 	expect( x.first().  isSelected()).toBeTruthy()
				// })
				// expect( x.first().getAttribute('value')).toBe('on')
				 //expect( x.first().  isEnabled()).toBeTruthy()
				fstcheck =  element(by.id('ontop')).all(by.tagName('input')).first() //= element(by.id('mowmowma123'))
			
				expect(fstcheck.getAttribute('style')).toBe('left: 74.5387%; top: 46.168%; position: absolute;')
				browser.executeScript("arguments[0].click();", fstcheck);
				// fstcheck.click()
				//  var itemss = element.all(by.repeater("answer in selected_quiz.online_answers"));
				//  var firstCheckbox = itemss.get(0).element(by.model("data.selected"));
				//  expect(firstCheckbox.isDisplayed()).toBeTruthy()
				//  firstCheckbox.click()
				
				//  browser.driver.manage().window().maximize();
				//  browser.actions().mouseMove(firstCheckbox).perform();
				//  element(by.id('ontop')).all(by.tagName('input')).then(function(elts){
				// 	elts[0].click()
				//  })
			
				 sleep(1000)
				 expect( fstcheck.  isSelected()).toBeTruthy()
				 student_lec.check_answer_button.click()
				 sleep(1000)
				
				
			})
			it("should check that it is correct",function(){
				expect(student_lec.notification).toContain("Correct")
				sleep(3000)
			})
			xit("should check explanation",function(){
				student_lec.show_explanation(1)
				expect(student_lec.explanation_title).toContain("Incorrect")
				expect(student_lec.explanation_content).toContain("explanation 1")
			})
			xit('wait for the voting question', function(){
				video.play()
				sleep(1000)
				video.pause()
				student_lec.wait_for_vote()
			})
			xit('should request that the question not be reviewed in class', function(){
				student_lec.request_review_inclass()
			})

		})
	})
})