var Header = require('./pages/header');
var Login = require('./pages/login');
var Signup = require('./pages/sign_up');
var GuerrillaMail = require('./pages/guerrilla_mail');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var StudentLecture = require('./pages/student/lecture');
var ShareModal = require('./pages/share_modal');
var SharedPage = require('./pages/shared_page');
var NewCourse = require('./pages/new_course');
var scroll = require('./lib/utils').scroll;
var sleep = require('./lib/utils').sleep;
var Video = require('./pages/video');

var params = browser.params;

var header = new Header()
var login_page = new Login()
var signup_page = new Signup()
var guerrilla_mail_page = new GuerrillaMail()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var student_lec = new StudentLecture()
var share_window = new ShareModal()
var shared = new SharedPage()
var new_course = new NewCourse()
var video = new Video();


describe("Sign up Teacher ",function(){
	describe("guerrillamail",function(){
		it("should sign up as teacher",function(){
			signup_page.sign_up('teacher')
			signup_page.create(params.guerrillamail_user, params.guerrillamail_password , params.guerrillamail_sch_uni_name , params.guerrillamail_last_name , params.guerrillamail_first_name )
		})
		it("should check url thanks pages",function(){
			sleep(6000)
			expect(browser.driver.getCurrentUrl()).toContain('thanks')
		})
		it("should open guerrillamail website",function(){
			browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "n")).perform();
			browser.getAllWindowHandles().then(function (handles) {
				var secondWindowHandle = handles[1];
				var firstWindowHandle = handles[0];

				browser.switchTo().window(secondWindowHandle)
					.then(function () {
				    	guerrilla_mail_page.open_url(params.guerrillamail_url)    
					})
				});
			})
		

		// })
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.guerrillamail_user)
			sleep(31000)
		})				
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
		})
		it("should open the last mail ",function(){
			 guerrilla_mail_page.open_last_mail()
			 sleep(6000)
		})
		describe("Guerrilla website tab ",function(){
			it("should confirm the mail",function(){
				guerrilla_mail_page.confirm_email()
				sleep(12000) 
				browser.getAllWindowHandles().then(function (handles) {
					var thridWindowHandle = handles[2];
					var secondWindowHandle = handles[1];
					var firstWindowHandle = handles[0];
					browser.switchTo().window(firstWindowHandle)
					.then(function () {
						guerrilla_mail_page.open_url(params.frontend)
						browser.switchTo().window(thridWindowHandle) })
					.then(function () {
						browser.close(); //close the current browser
					}).then(function(){
						browser.switchTo().window(firstWindowHandle) //Switch to previous tab
						.then(function(){
							sleep(1000)
						});
					});
				})
			})
		})
		it("should check course information page ",function(){
			sleep(3000)
			expect(browser.driver.getCurrentUrl()).toContain('confirmed')	
		    signup_page.skip_button()
			sleep(5000)
			expect(browser.driver.getCurrentUrl()).toContain('courses')	
		})
		it("should logout",function(){
            header.logout()
        })
    })
})
describe("Sign up Student ",function(){
	describe("guerrillamail",function(){
		it("should sign up as student",function(){

			sleep(4000)
			signup_page.sign_up('student')
			signup_page.create(params.guerrillamail_student, params.guerrillamail_password , params.guerrillamail_sch_uni_name , params.guerrillamail_last_name , params.guerrillamail_first_name )
		})
		it("should check url thanks pages",function(){
			sleep(6000)
			expect(browser.driver.getCurrentUrl()).toContain('thanks')
		})
		it("should open guerrillamail website",function(){
			// browser.actions().sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "n")).perform();
			browser.getAllWindowHandles().then(function (handles) {
				var secondWindowHandle = handles[1];
				var firstWindowHandle = handles[0];

				browser.switchTo().window(secondWindowHandle)
					.then(function () {
				    	guerrilla_mail_page.open_url(params.guerrillamail_url)    
					})
				});
			})
		

		// })
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.guerrillamail_student)
			sleep(31000)
		})				
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
		})
		it("should open the last mail ",function(){
			 guerrilla_mail_page.open_last_mail()
			 sleep(6000)
		})
		describe("Guerrilla website tab ",function(){
			it("should confirm the mail",function(){
				guerrilla_mail_page.confirm_email()
				sleep(12000) 
				browser.getAllWindowHandles().then(function (handles) {
					var thridWindowHandle = handles[2];
					var secondWindowHandle = handles[1];
					var firstWindowHandle = handles[0];
					browser.switchTo().window(firstWindowHandle)
					.then(function () {
						guerrilla_mail_page.open_url(params.frontend)
						browser.switchTo().window(thridWindowHandle) })
					.then(function () {
						browser.close(); //close the current browser
					}).then(function(){
						browser.switchTo().window(firstWindowHandle) //Switch to previous tab
						.then(function(){
							sleep(1000)
						});
					});
				})
			})
		})
		it("should check course information page ",function(){
			sleep(3000)
			browser.ignoreSynchronization = false;
			expect(browser.driver.getCurrentUrl()).toContain('confirmed')	
		    signup_page.skip_button()
			sleep(5000)
			expect(browser.driver.getCurrentUrl()).toContain('courses')	
		})
		it("should logout",function(){
            header.logout()
        })
    })
})

describe("Teacher Management",function(){
	describe("Teacher1",function(){
		it("should login as teacher",function(){
			login_page.sign_in(params.teacher_mail, params.password)
		})
		it("should open course",function(){
	        course_list.open()
	        course_list.open_course(1)
	    })
	    var navigator = new ContentNavigator(1)
		it('should check number of teachers intially', function(){
			// course_info.open()
			expect(course_info.teachers.count()).toEqual(1)
		})
		it('should add a teacher', function(){
			expect(course_info.email_field.isDisplayed()).toEqual(false);
			expect(course_info.role_field.isDisplayed()).toEqual(false);
			course_info.add_teacher()
			expect(course_info.email_field.isDisplayed()).toEqual(true);
			expect(course_info.role_field.isDisplayed()).toEqual(true);
			course_info.type_email(params.guerrillamail_user)
			course_info.select_role(2)
			course_info.invite()
			expect(course_info.teachers.count()).toEqual(2)
		})

		it("should logout",function(){
            header.logout()
        })
    })
    describe("guerrillamail Teacher",function(){
        it("should login",function(){        	
            login_page.sign_in(params.guerrillamail_user, params.guerrillamail_password)
        })
        it('should accept invitation to course', function(){
            header.show_notification()
            expect(header.invitation_notifications.count()).toEqual(1)
            header.accept_invitation_notification(1)
            expect(header.notification_menu.isPresent()).toBe(false)
        })
        it('should check that it redirected to the course information page', function(){
            expect(browser.driver.getCurrentUrl()).toContain('information')
        })
        it("should mark email receive button ",function(){
            course_info.receive_email_button_click()
        })
        it('should get the enrollment key and enroll students 1', function(){
			browser.ignoreSynchronization = false;
			course_info.open()
			var enrollment_key = course_info.enrollmentkey
			// console.log(enrollmentkey.getText())
			header.logout()
        	sleep(5000)
			login_page.sign_in(params.guerrillamail_student, params.guerrillamail_password)
			sleep(5000)
			expect(browser.driver.getCurrentUrl()).toContain('dashboard')
			sleep(5000)
			header.join_course(enrollment_key)
		})

        it("should logout",function(){
            header.logout()
        })
    })

    describe("Student1",function(){
    	it("should login", function(){    		
			login_page.sign_in(params.guerrillamail_student, params.guerrillamail_password)
		})
		var navigator = new ContentNavigator(1)
		it('should open course information', function(){
			course_list.open()
			course_list.open_course(1)
			course_info.student.open()			
		})
		it("should check number of teacher ",function(){
			expect(course_info.teachers.count()).toEqual(2)
		})
		it("should logout",function(){
            header.logout()
        })
    })
})


describe("Discussion Part 1" , function(){
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.guerrillamail_student, params.guerrillamail_password)
		})
		var navigator = new ContentNavigator(1)
		it('should open first course', function(){
			course_list.open()
			course_list.open_course(1)
		})
		it('should open first lecture in first module', function(){
			navigator.open()
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
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

		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})

	describe("guerrillamail Teacher",function(){



		it("should open guerrillamail website",function(){
			browser.getAllWindowHandles().then(function (handles) {
				var secondWindowHandle = handles[1];
				var firstWindowHandle = handles[0];

				browser.switchTo().window(secondWindowHandle)
					.then(function () {
				    	guerrilla_mail_page.open_url(params.guerrillamail_url)    
					})
				});
			// guerrilla_mail_page.open_url(params.guerrillamail_url)
		})
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.guerrillamail_user)
			sleep(30000)
		})				
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(4)})
		})
		// it("should open scalable learning website ",function(){
		    
		//     guerrilla_mail_page.open_url(params.frontend)
		//     // browser.ignoreSynchronization = false;

		// })
        it("should login",function(){        	
			browser.getAllWindowHandles().then(function (handles) {
				var secondWindowHandle = handles[1];
				var firstWindowHandle = handles[0];

				browser.switchTo().window(firstWindowHandle)
					.then(function () {
						login_page.sign_in(params.guerrillamail_user, params.guerrillamail_password)    
					})
				});
        })

		it('should open first course', function(){
			course_list.open()
			course_list.open_course(1)
            // expect(browser.driver.getCurrentUrl()).toContain('information')
		})
        it("should unmark email receive button ",function(){
        	// expect()
            course_info.receive_email_button_click()
        })
        it("should logout",function(){
            header.logout()
        })
    

    })

})

describe("Discussion Part 2" , function(){
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.guerrillamail_student, params.guerrillamail_password)
		})
		var navigator = new ContentNavigator(1)
		it('should open first course', function(){
			course_list.open()
			course_list.open_course(1)
		})
		it('should open first lecture in first module', function(){
			navigator.open()
			navigator.module(1).open()
			navigator.module(1).item(1).open()
			navigator.close()
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
		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})
	})
})



describe("Revert Changes",function(){
	describe("Teacher1",function(){
		it("should open scalable learning website",function(){
			guerrilla_mail_page.open_url(params.frontend)
			browser.ignoreSynchronization = false;

        })
 		var navigator = new ContentNavigator(1)
		it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })
        it('should open course information', function(){
			course_list.open()
			course_list.open_course(1)
			course_info.open()
			expect(course_info.teachers.count()).toEqual(2)
		})
		it("should delete second teacher",function(){
			course_info.delete_teacher(2)
		})
		it("should logout",function(){
            header.logout()
        })
	})
	describe("First Student",function(){
		it("should login", function(){
			login_page.sign_in(params.guerrillamail_student, params.guerrillamail_password)
		})
		it('should open first course', function(){
			course_list.open()
			course_list.open_course(1)
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
		it("should delete discussion post",function(){
			student_lec.lecture(1).discussion(1).delete()
			student_lec.lecture(1).discussion(1).delete()
			student_lec.lecture(1).discussion(1).delete()
			student_lec.lecture(1).discussion(1).delete()
			expect(student_lec.lecture(1).discussions.count()).toEqual(0)
			expect(student_lec.lecture(1).items.count()).toEqual(3)
		})
		it("should logout",function(){
			student_lec.close_timeline()
			header.logout()
		})		
	} )
	describe("guerrillamail teacher",function(){
		it("should login",function(){
            login_page.sign_in(params.guerrillamail_user, params.guerrillamail_password)
       })
        it("should check that course has been removed",function(){
        	course_list.open()
        	expect(course_list.courses.count()).toEqual(0)
        })
        it("should delete teacher account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})
	describe("guerrillamail student",function(){
		it("should login",function(){
            login_page.sign_in(params.guerrillamail_student, params.guerrillamail_password)
       })
        it("should delete teacher account",function(){
            header.open_account_information()
            header.delete_user(params.guerrillamail_password)
        })
	})
})
describe("guerrillamail website",function(){
	it("should open guerrillamail website",function(){
		browser.getAllWindowHandles().then(function (handles) {
		var secondWindowHandle = handles[1];
		var firstWindowHandle = handles[0];

		browser.switchTo().window(secondWindowHandle)
			.then(function () {
		    	guerrilla_mail_page.open_url(params.guerrillamail_url)    
			})
		});
		// guerrilla_mail_page.open_url(params.guerrillamail_url)
	})
	it("should change guerrillamail email ",function(){
		guerrilla_mail_page.change_mail_name(params.guerrillamail_user)
		sleep(11000)
	})				
	it("should check mails count ",function(){
		 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(4)})
	})
})
