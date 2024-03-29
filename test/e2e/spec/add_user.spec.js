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


describe("Sign up Teacher 1",function(){
	describe("guerrillamail",function(){
		it("should sign up as teacher",function(){
			console.log(params.teacher1.email)
			// browser.refresh()
			signup_page.sign_up('teacher')
			signup_page.create(params.teacher1.email, params.password , params.guerrillamail_sch_uni_name , '1' , params.teacher_first_name ,params.teacher1.email)
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
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.teacher1.email)
			sleep(120000)
		})
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
		})
		it("should open the last mail ",function(){
			 sleep(10000)
			 guerrilla_mail_page.open_last_mail()
			 sleep(6000)
		})
		describe("Guerrilla website tab ",function(){
			it("should confirm the mail",function(){
				guerrilla_mail_page.confirm_email()
				sleep(22000)
				browser.getAllWindowHandles().then(function (handles) {
					var thridWindowHandle = handles[2];
					var secondWindowHandle = handles[1];
					var firstWindowHandle = handles[0];
					browser.switchTo().window(firstWindowHandle)
					.then(function () {
						guerrilla_mail_page.open_url(params.frontend)
						sleep(5000)
						browser.switchTo().window(thridWindowHandle) })
					.then(function () {
						browser.close(); //close the current browser
					}).then(function(){
						browser.switchTo().window(firstWindowHandle) //Switch to previous tab
						.then(function(){
							browser.ignoreSynchronization = false;
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
describe("Sign up teacher 2",function(){
	describe("guerrillamail",function(){
		it("should sign up as teacher",function(){
			sleep(4000)
			// consloe.log(params.teacher2.email)
			// browser.refresh()
			signup_page.sign_up('teacher')
			signup_page.create(params.teacher2.email, params.password , params.guerrillamail_sch_uni_name , "2" , params.teacher_first_name, params.teacher2.email)
		})
		it("should check url thanks pages",function(){
			sleep(6000)
			expect(browser.driver.getCurrentUrl()).toContain('thanks')
		})
		it("should open guerrillamail website",function(){
			browser.getAllWindowHandles().then(function (handles) {
			var secondWindowHandle = handles[1];
			var firstWindowHandle = handles[0];

			browser.switchTo().window(secondWindowHandle)
				.then(function () {
			    	guerrilla_mail_page.open_url(params.guerrillamail_url)
				})
			});
		})
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.teacher2.email)
			sleep(120000)
		})
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
		})
		it("should open the last mail ",function(){
			 sleep(10000)
			 guerrilla_mail_page.open_last_mail()
			 sleep(6000)
		})
		describe("Guerrilla website tab ",function(){
			it("should confirm the mail",function(){
				guerrilla_mail_page.confirm_email()
				sleep(22000)
				browser.getAllWindowHandles().then(function (handles) {
					var thridWindowHandle = handles[2];
					var secondWindowHandle = handles[1];
					var firstWindowHandle = handles[0];
					browser.switchTo().window(firstWindowHandle)
					.then(function () {
						guerrilla_mail_page.open_url(params.frontend)
						sleep(5000)
						browser.switchTo().window(thridWindowHandle) })
					.then(function () {
						browser.close(); //close the current browser
					}).then(function(){
						browser.switchTo().window(firstWindowHandle) //Switch to previous tab
						.then(function(){
							browser.ignoreSynchronization = false;
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
describe("Sign up Student 1",function(){
	describe("guerrillamail",function(){
		it("should sign up as student",function(){

			sleep(4000)
			// consloe.log(params.student1.email)
			// browser.refresh()
			signup_page.sign_up('student')
			signup_page.create(params.student1.email, params.password , 'uni' , params.student_name , "Test" , params.student1.email )
		})
		it("should check url thanks pages",function(){
			sleep(6000)
			expect(browser.driver.getCurrentUrl()).toContain('thanks')
		})
		it("should open guerrillamail website",function(){
			browser.getAllWindowHandles().then(function (handles) {
			var secondWindowHandle = handles[1];
			var firstWindowHandle = handles[0];

			browser.switchTo().window(secondWindowHandle)
				.then(function () {
			    	guerrilla_mail_page.open_url(params.guerrillamail_url)
				})
			});
		})
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.student1.email)
			sleep(120000)
		})
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
		})
		it("should open the last mail ",function(){
			 sleep(10000)
			 guerrilla_mail_page.open_last_mail()
			 sleep(6000)
		})
		describe("Guerrilla website tab ",function(){
			it("should confirm the mail",function(){
				guerrilla_mail_page.confirm_email()
				sleep(22000)
				browser.getAllWindowHandles().then(function (handles) {
					var thridWindowHandle = handles[2];
					var secondWindowHandle = handles[1];
					var firstWindowHandle = handles[0];
					browser.switchTo().window(firstWindowHandle)
					.then(function () {
						guerrilla_mail_page.open_url(params.frontend)
						sleep(5000)
						browser.switchTo().window(thridWindowHandle) })
					.then(function () {
						browser.close(); //close the current browser
					}).then(function(){
						browser.switchTo().window(firstWindowHandle) //Switch to previous tab
						.then(function(){
							browser.ignoreSynchronization = false;
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
describe("Sign up Student 2",function(){
	describe("guerrillamail",function(){
		it("should sign up as student",function(){

			// sleep(4000)
			// consloe.log(params.student2.email)
			// browser.refresh()
			signup_page.sign_up('student')
			signup_page.create(params.student2.email, params.password , "uni" , "2" , params.student_name ,params.student2.email )
		})
		it("should check url thanks pages",function(){
			sleep(6000)
			expect(browser.driver.getCurrentUrl()).toContain('thanks')
		})
		it("should open guerrillamail website",function(){
			browser.getAllWindowHandles().then(function (handles) {
			var secondWindowHandle = handles[1];
			var firstWindowHandle = handles[0];

			browser.switchTo().window(secondWindowHandle)
				.then(function () {
			    	guerrilla_mail_page.open_url(params.guerrillamail_url)
				})
			});
		})
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.student2.email)
			sleep(120000)
		})
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
		})
		it("should open the last mail ",function(){
			 sleep(10000)
			 guerrilla_mail_page.open_last_mail()
			 sleep(6000)
		})
		describe("Guerrilla website tab ",function(){
			it("should confirm the mail",function(){
				guerrilla_mail_page.confirm_email()
				sleep(22000)
				browser.getAllWindowHandles().then(function (handles) {
					var thridWindowHandle = handles[2];
					var secondWindowHandle = handles[1];
					var firstWindowHandle = handles[0];
					browser.switchTo().window(firstWindowHandle)
					.then(function () {
						guerrilla_mail_page.open_url(params.frontend)
						sleep(5000)
						browser.switchTo().window(thridWindowHandle) })
					.then(function () {
						browser.close(); //close the current browser
					}).then(function(){
						browser.switchTo().window(firstWindowHandle) //Switch to previous tab
						.then(function(){
							browser.ignoreSynchronization = false;
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
describe("Sign up Student 3",function(){
	describe("guerrillamail",function(){
		it("should sign up as student",function(){

			// sleep(4000)
			// consloe.log(params.student3.email)
			// browser.refresh()
			signup_page.sign_up('student')
			signup_page.create(params.student3.email, params.password , "uni" , "3" , params.student_name , params.student3.email )
		})
		it("should check url thanks pages",function(){
			sleep(6000)
			expect(browser.driver.getCurrentUrl()).toContain('thanks')
		})
		it("should open guerrillamail website",function(){
			browser.getAllWindowHandles().then(function (handles) {
			var secondWindowHandle = handles[1];
			var firstWindowHandle = handles[0];

			browser.switchTo().window(secondWindowHandle)
				.then(function () {
			    	guerrilla_mail_page.open_url(params.guerrillamail_url)
				})
			});
		})
		it("should change guerrillamail email ",function(){
			guerrilla_mail_page.change_mail_name(params.student3.email)
			sleep(120000)
		})
		it("should check mails count ",function(){
			 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
		})
		it("should open the last mail ",function(){
			 sleep(10000)
			 guerrilla_mail_page.open_last_mail()
			 sleep(6000)
		})
		describe("Guerrilla website tab ",function(){
			it("should confirm the mail",function(){
				guerrilla_mail_page.confirm_email()
				sleep(22000)
				browser.getAllWindowHandles().then(function (handles) {
					var thridWindowHandle = handles[2];
					var secondWindowHandle = handles[1];
					var firstWindowHandle = handles[0];
					browser.switchTo().window(firstWindowHandle)
					.then(function () {
						guerrilla_mail_page.open_url(params.frontend)
						sleep(5000)
						browser.switchTo().window(thridWindowHandle) })
					.then(function () {
						browser.close(); //close the current browser
					}).then(function(){
						browser.switchTo().window(firstWindowHandle) //Switch to previous tab
						.then(function(){
							browser.ignoreSynchronization = false;
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
        it("should close guerrillamail website",function(){
    		browser.getAllWindowHandles().then(function (handles) {
				var secondWindowHandle = handles[1];
				var firstWindowHandle = handles[0];
				browser.switchTo().window(secondWindowHandle)
				.then(function () {
					browser.close(); //close the current browser
				}).then(function(){
					browser.switchTo().window(firstWindowHandle) //Switch to previous tab
					.then(function(){
						browser.ignoreSynchronization = false;
						sleep(1000)
					});
				});
			})
        })
    })
})

// SCAL-1017: Add email address to after-registration page frontend: check on email in users/thanks
// SCAL-571 At first login we should show the privacy policy and require students to click "I understand"	check on I understand when new user confirm
describe("Add User ",function(){
	describe("Sign up Teacher 1",function(){
		describe("guerrillamail",function(){
			it("should sign up as teacher",function(){
				console.log(params.teacher3.email)
				signup_page.sign_up('teacher')
				signup_page.create(params.teacher3.email, params.guerrillamail_password , params.guerrillamail_sch_uni_name , '1' , params.teacher_first_name ,params.teacher3.email)
			})
			it("should check url thanks pages",function(){
				sleep(6000)
				expect(browser.driver.getCurrentUrl()).toContain('thanks')
		        element(by.css('h5 b')).getText().then(function (text) { expect(text).toEqual(params.teacher3.email) });

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
			it("should change guerrillamail email ",function(){
				guerrilla_mail_page.change_mail_name(params.teacher3.email)
				sleep(60000)
			})
			it("should check mails count ",function(){
				 guerrilla_mail_page.count_row().then(function(coun){expect(coun).toEqual(2)})
			})
			it("should open the last mail ",function(){
				 sleep(10000)
				 guerrilla_mail_page.open_last_mail()
				 sleep(6000)
			})
			describe("Guerrilla website tab ",function(){
				it("should confirm the mail",function(){
					guerrilla_mail_page.confirm_email()
					sleep(22000)
					browser.getAllWindowHandles().then(function (handles) {
						var thridWindowHandle = handles[2];
						var secondWindowHandle = handles[1];
						var firstWindowHandle = handles[0];
						browser.switchTo().window(firstWindowHandle)
						.then(function () {
							guerrilla_mail_page.open_url(params.frontend)
							sleep(5000)
							browser.switchTo().window(thridWindowHandle) })
						.then(function () {
							browser.close(); //close the current browser
						}).then(function(){
							browser.switchTo().window(firstWindowHandle) //Switch to previous tab
							.then(function(){
								browser.ignoreSynchronization = false;
								sleep(1000)
							});
						});
					})
				})
			})
			it("should check course information page ",function(){
				sleep(3000)
			    signup_page.skip_button()
				sleep(5000)
				expect(browser.driver.getCurrentUrl()).toContain('courses')
			})
			it("should logout",function(){
	            header.logout()
	        })
	    })
	})
	describe("guerrillamail teacher 1",function(){
		it("should login",function(){
            login_page.sign_in(params.teacher3.email, params.guerrillamail_password)
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
})
