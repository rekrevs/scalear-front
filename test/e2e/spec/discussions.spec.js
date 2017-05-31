var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var Video = require('./pages/video');
var Header = require('./pages/header');
var Login = require('./pages/login');
var StudentLecture = require('./pages/student/lecture');
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var course_list = new CourseList()
var video = new Video();
var header = new Header()
var login_page = new Login()
var student_lec = new StudentLecture()
describe("Discussions",function(){
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		var navigator = new ContentNavigator(1)
		it('check course view controls appears all the time', function(){
			course_list.open()
			expect(element.all(by.model('searchText')).isDisplayed()).toEqual([ true ]);
			browser.executeScript('$("body").scrollTop(1000);') //Note that your code is represented as a String here!         
			expect(element.all(by.model('searchText')).isDisplayed()).toEqual([ true ]);
		})
		it('check feedback doesnot show course in options', function(){
			header.open_support()
			element(by.css('[ng-model="selected_type"]')).all(by.tagName('option')).count().then(function(result){expect(result).toEqual(1)} )
			header.close_support()
		})

		it('should open first course', function(){
			course_list.open_student_course(1)
		})
		it('check feedback does show course in options', function(){
			header.open_support()
			element(by.css('[ng-model="selected_type"]')).all(by.tagName('option')).count().then(function(result){expect(result).toEqual(2)} )
			header.close_support()
		})
		var navigator = new ContentNavigator(1)
		it('should open first course', function(){
			browser.refresh()
			course_list.open()
			course_list.open_student_course(1)
		})
		it('should open first lecture in first module', function(){
			navigator.open()
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
			// browser.refresh()
		})
		it('should add a public question', function(){
			sleep(3000)	
			//// Cancel discussion question
			student_lec.add_discussion_shortcut()
			expect(student_lec.discussion_directive.isDisplayed()).toEqual(true);
			student_lec.lecture(1).cancel_discussion()
            expect(student_lec.lecture(1).discussions.count()).toEqual(0)
			student_lec.add_discussion_shortcut()
            expect(student_lec.lecture(1).editable_discussion.isDisplayed()).toEqual(true)
            student_lec.lecture(1).type_discussion("Public Question")
            student_lec.lecture(1).type_time("00:00:00")
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(true)
            student_lec.lecture(1).type_time("01:00:00")
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(true)
	        student_lec.lecture(1).type_time("01:00")
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(true)
            student_lec.lecture(1).type_time("00:04:00")
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(false)
            expect(student_lec.lecture(1).discussions.count()).toEqual(1)
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(false)
			expect(student_lec.lecture(1).discussion(1).edit_key.isPresent()).toEqual(true)
			expect(student_lec.lecture(1).discussion(1).edit_key.isDisplayed()).toEqual(false)
			student_lec.open_timeline()
            student_lec.lecture(1).discussion(1).edit()
			expect(student_lec.discussion_directive.isDisplayed()).toEqual(true);
			student_lec.lecture(1).cancel_edited_discussion()
			// Edit discussion question
			student_lec.lecture(1).discussion(1).edit()
			student_lec.lecture(1).type_discussion("Question")
			student_lec.lecture(1).type_time("00:04:00")
 
			student_lec.lecture(1).save_edited_discussion()
			student_lec.lecture(1).discussion(1).edit()
			student_lec.lecture(1).type_discussion("Public Question")
			student_lec.lecture(1).type_time("00:04:00")
 			student_lec.lecture(1).save_edited_discussion()
            expect(student_lec.lecture(1).discussions.count()).toEqual(1)
			// browser.refresh()
		})
		it("should open timeline",function(){
			student_lec.close_timeline()
			// sleep(5000)
			student_lec.open_timeline()
		})
		it("should delete discussion post",function(){
			// sleep(10000)
			student_lec.lecture(1).discussion(1).delete()
            expect(student_lec.lecture(1).discussions.count()).toEqual(0)
		})
		it("should seek to 15%",function(){
			video.seek(15)
		})
		it("should add a private discussion",function(){
            student_lec.add_discussion()
            expect(student_lec.lecture(1).editable_discussion.isDisplayed()).toEqual(true)
            student_lec.lecture(1).type_discussion("Private Question")
            student_lec.lecture(1).change_discussion_private()
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).discussions.count()).toEqual(1)
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(false)
            expect(student_lec.lecture(1).items.count()).toEqual(4)
        })
        it('should seek to 35%', function(){
			video.seek(35)
		})
		it('should add a public question', function(){
			student_lec.add_discussion()
            expect(student_lec.lecture(1).editable_discussion.isDisplayed()).toEqual(true)
            student_lec.lecture(1).type_discussion("Public Question")
            student_lec.lecture(1).change_discussion_public()
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).discussions.count()).toEqual(2)
            expect(student_lec.lecture(1).editable_discussion.isPresent()).toEqual(false)
            expect(student_lec.lecture(1).items.count()).toEqual(5)
		})
		it("should logout",function(){
			expect(student_lec.check_timeline_is_open).toContain('land-medium-4 land-height')
			student_lec.close_timeline()
			sleep(5000)
			expect(student_lec.check_timeline_is_open).not.toContain('land-medium-4 land-height')
			header.logout()
		})
	})

	describe("Second Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student2.email, params.password)
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		var navigator = new ContentNavigator(1)
		it('should open first lecture in first module', function(){
			navigator.open()
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
		})
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should check discussion posts",function(){
			expect(student_lec.lecture(1).discussions.count()).toEqual(1)
			expect(student_lec.lecture(1).discussion(1).title).toContain("Public Question")
		})
		it("should flag/Unflag discussion post",function(){
			// Flag/Unflag discussion question
			expect(student_lec.lecture(1).discussion(1).text).not.toContain("Flagged post")
			student_lec.lecture(1).discussion(1).flag()
			expect(student_lec.lecture(1).discussion(1).text).toContain("Flagged post")
			student_lec.lecture(1).discussion(1).unflag()
		})
		it("should flag post",function(){
			expect(student_lec.lecture(1).discussion(1).text).not.toContain("Flagged post")
			student_lec.lecture(1).discussion(1).flag()
			expect(student_lec.lecture(1).discussion(1).text).toContain("Flagged post")
		})
		it("should upvote/downvote discussion post",function(){
			//  Upvote/Downvote discussion question
			expect(student_lec.lecture(1).discussion(1).vote_count).toEqual("0")
			student_lec.lecture(1).discussion(1).vote()
			expect(student_lec.lecture(1).discussion(1).vote_count).toEqual("1")
			student_lec.lecture(1).discussion(1).unvote()
		})
		it("should vote discussion post",function(){
			expect(student_lec.lecture(1).discussion(1).vote_count).toEqual("0")			
			student_lec.lecture(1).discussion(1).vote()
			expect(student_lec.lecture(1).discussion(1).vote_count).toEqual("1")
			
		})
		it("should add empty comment",function(){
			// Replying to a discussion questions with empty comment
			expect(student_lec.lecture(1).discussion(1).comments.count()).toEqual(0)
			student_lec.lecture(1).discussion(1).add_comment()
			student_lec.lecture(1).discussion(1).type_comment("")
			expect(student_lec.lecture(1).discussion(1).comments.count()).toEqual(0)
		})
		it("should add comment",function(){
			expect(student_lec.lecture(1).discussion(1).comments.count()).toEqual(0)
			student_lec.lecture(1).discussion(1).add_comment()
			student_lec.lecture(1).discussion(1).type_comment("first comment")
			expect(student_lec.lecture(1).discussion(1).comments.count()).toEqual(1)
		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})

	describe("Third Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student3.email, params.password)
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		var navigator = new ContentNavigator(1)
		it('should open first lecture in first module', function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
		})
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it('should add empty discussion',function(){
			expect(student_lec.lecture(1).discussions.count()).toEqual(1)
			student_lec.add_discussion_shortcut()
            expect(student_lec.lecture(1).editable_discussion.isDisplayed()).toEqual(true)
            student_lec.lecture(1).type_discussion("")
            student_lec.lecture(1).type_time("00:04:00")
            student_lec.lecture(1).save_discussion()
			expect(student_lec.lecture(1).discussions.count()).toEqual(1)            
		})		
		it("should check discussion posts",function(){
			expect(student_lec.lecture(1).discussions.count()).toEqual(1)
			expect(student_lec.lecture(1).discussion(1).title).toContain("Public Question")
			expect(student_lec.lecture(1).discussion(1).text).toContain("Flagged post")
		})
		it("should vote post",function(){
			expect(student_lec.lecture(1).discussion(1).vote_count).toEqual("1")
			student_lec.lecture(1).discussion(1).vote()
			expect(student_lec.lecture(1).discussion(1).vote_count).toEqual("2")
		})
		it("should check comments",function(){
			expect(student_lec.lecture(1).discussion(1).comments.count()).toEqual(1)
			expect(student_lec.lecture(1).discussion(1).comment(1).title).toEqual("first comment")
		})
		it("should flag/unflag comment",function(){
			// Flag/unflag comment
			expect(student_lec.lecture(1).discussion(1).comment(1).text).not.toContain("Flagged comment")
			student_lec.lecture(1).discussion(1).comment(1).flag()
			expect(student_lec.lecture(1).discussion(1).comment(1).text).toContain("Flagged comment")
			student_lec.lecture(1).discussion(1).comment(1).unflag()
		})
		it("should flag comment",function(){
			expect(student_lec.lecture(1).discussion(1).comment(1).text).not.toContain("Flagged comment")
			student_lec.lecture(1).discussion(1).comment(1).flag()
			expect(student_lec.lecture(1).discussion(1).comment(1).text).toContain("Flagged comment")
		})
		it("should upvote/downvote comment",function(){
			// upvote/downvote comment
			expect(student_lec.lecture(1).discussion(1).comment(1).vote_count).toEqual("0")
			student_lec.lecture(1).discussion(1).comment(1).vote()
			expect(student_lec.lecture(1).discussion(1).comment(1).vote_count).toEqual("1")
			student_lec.lecture(1).discussion(1).comment(1).unvote()
		})
		it("should vote comment",function(){
			expect(student_lec.lecture(1).discussion(1).comment(1).vote_count).toEqual("0")			
			student_lec.lecture(1).discussion(1).comment(1).vote()
			expect(student_lec.lecture(1).discussion(1).comment(1).vote_count).toEqual("1")
			
		})

		it("should add comment",function(){
			student_lec.lecture(1).discussion(1).add_comment()
			student_lec.lecture(1).discussion(1).type_comment("second comment")
			expect(student_lec.lecture(1).discussion(1).comments.count()).toEqual(2)
			expect(student_lec.lecture(1).discussion(1).comment(2).title).toEqual("second comment")
		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})

	describe("Second Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student2.email, params.password)
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		var navigator = new ContentNavigator(1)
		it('should open first lecture in first module', function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
		})
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should check comments count",function(){
			expect(student_lec.lecture(1).discussion(1).comments.count()).toEqual(2)
			expect(student_lec.lecture(1).discussion(1).comment(1).title).toEqual("first comment")
			expect(student_lec.lecture(1).discussion(1).comment(2).title).toEqual("second comment")
		})
		it("should flag second comment",function(){
			student_lec.lecture(1).discussion(1).comment(2).flag()
			expect(student_lec.lecture(1).discussion(1).comment(2).text).toContain("Flagged comment")
		})
		it("should vote first comment",function(){
			expect(student_lec.lecture(1).discussion(1).comment(2).vote_count).toEqual("0")
			student_lec.lecture(1).discussion(1).comment(2).vote()
			expect(student_lec.lecture(1).discussion(1).comment(2).vote_count).toEqual("1")
		})
		it("should seek to 40%",function(){
			video.seek(40)
		})
		it("should add a private discussion",function(){
            student_lec.add_discussion()
            student_lec.lecture(1).type_discussion("private question by second student")
            student_lec.lecture(1).change_discussion_private()
            student_lec.lecture(1).save_discussion()
            expect(student_lec.lecture(1).discussions.count()).toEqual(2)
            expect(student_lec.lecture(1).items.count()).toEqual(5)
        })
        it('should move to the second lecture', function(){
			navigator.open()
			navigator.module(1).item(2).open()
			navigator.close()
		})
		it('should seek to 40%', function(){
			video.seek(40)
		})
		it('should add a public question', function(){
			student_lec.add_discussion()
            expect(student_lec.lecture(2).editable_discussion.isDisplayed()).toEqual(true)
            student_lec.lecture(2).type_discussion("public question by second student")
            student_lec.lecture(2).change_discussion_public()
            student_lec.lecture(2).save_discussion()
            expect(student_lec.lecture(2).discussions.count()).toEqual(1)
            expect(student_lec.lecture(2).editable_discussion.isPresent()).toEqual(false)
            expect(student_lec.lecture(2).items.count()).toEqual(4)
		})
        it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		var navigator = new ContentNavigator(1)
		it('should open first lecture in first module', function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
		})
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should check comments",function(){
			expect(student_lec.lecture(1).discussions.count()).toEqual(2)
			expect(student_lec.lecture(1).discussion(2).comments.count()).toEqual(2)
			expect(student_lec.lecture(1).discussion(2).comment(2).text).toContain("Flagged comment")
		})
		it("should vote second comment",function(){
			expect(student_lec.lecture(1).discussion(2).comment(2).vote_count).toEqual("1")
			student_lec.lecture(1).discussion(2).comment(2).vote()
			expect(student_lec.lecture(1).discussion(2).comment(2).vote_count).toEqual("2")
		})
		it("should upvote the question asked by second student",function(){
			expect(student_lec.lecture(2).discussion(1).vote_count).toEqual("0")
			student_lec.lecture(2).discussion(1).vote()
			expect(student_lec.lecture(2).discussion(1).vote_count).toEqual("1")
		})
		it('should add a comment on the question asked by the Second Student', function(){
			student_lec.lecture(2).discussion(1).add_comment()
			student_lec.lecture(2).discussion(1).type_comment("comment by first student")
			expect(student_lec.lecture(2).discussion(1).comments.count()).toEqual(1)
			expect(student_lec.lecture(2).discussion(1).comment(1).title).toEqual("comment by first student")
		})
		it("should delete comment",function(){
			student_lec.lecture(2).discussion(1).comment(1).delete()
			expect(student_lec.lecture(2).discussion(1).comments.count()).toEqual(0)
		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})
	describe("Second Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student2.email, params.password)
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		var navigator = new ContentNavigator(1)
		it('should open first lecture in first module', function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
		})
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should check comments",function(){
			expect(student_lec.lecture(2).discussions.count()).toEqual(1)
			expect(student_lec.lecture(2).discussion(1).comments.count()).toEqual(0)
		})
		it("should delete discussion post",function(){
			student_lec.lecture(2).discussion(1).delete()
			expect(student_lec.lecture(2).discussions.count()).toEqual(0)
			expect(student_lec.lecture(2).items.count()).toEqual(3)
		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.student1.email, params.password)
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_student_course(1)
		})
		var navigator = new ContentNavigator(1)
		it('should open first lecture in first module', function(){
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
		})
		it("should open timeline",function(){
			student_lec.open_timeline()
		})
		it("should check discussion post",function(){
			expect(student_lec.lecture(2).discussions.count()).toEqual(0)
			expect(student_lec.lecture(2).items.count()).toEqual(3)
		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})
})
