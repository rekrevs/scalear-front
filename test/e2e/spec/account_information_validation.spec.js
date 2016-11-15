var AccountInformation = require('./pages/account_information');
var sleep = require('./lib/utils').sleep;
var refresh = require('./lib/utils').refresh;
var Login = require('./pages/login');
var Header = require('./pages/header');

var login_page = new Login()
var	info = new AccountInformation();
var header = new Header()
var params = browser.params;

// var biog = "This is my biography it contains everything about me"
// var webs = "www.website.com"

var screen_name_new = "screen teacher 1"
var fname_new = "Test teacher"
var lname_new = "teacher_1"
var mail_new = "teacher1_1@email.com"
var univer_new = "uni_uni1"
// var biog_new = "text w text_1"
// var webs_new = ".com_1"
var password_new = "password_1"

describe("Check Teacher account information", function(){
	it("should login as teacher",function(){
		login_page.sign_in(params.teacher1.email, params.password)
	})
	it("should check for info", function(){
		info.open()
		expect(info.firstname).toEqual(params.teacher1.f_name);
		expect(info.lastname).toEqual(params.teacher1.l_name);
		expect(info.email).toEqual(params.teacher1.email);
		expect(info.university).toEqual(params.teacher1.university);
		expect(info.screenname).toEqual(params.teacher1.online_name);
		// expect(info.link).toEqual(webs);
		// expect(info.bio).toEqual(biog);
	})

	it("should change to new info", function(){
		info.type_firstname(fname_new)
		info.type_lastname(lname_new)
		// info.type_email(mail_new)
		info.type_university(univer_new)
		info.type_screenname(screen_name_new)
		// info.type_link(webs_new)
		// info.type_bio(biog_new)
		info.save('password')
		sleep(2000)
		refresh()
	})

	it("should check for new info", function(){
		info.open()
		expect(info.firstname).toEqual(fname_new);
		expect(info.lastname).toEqual(lname_new);
		// expect(info.email).toEqual(mail_new);
		expect(info.university).toEqual(univer_new);
		expect(info.screenname).toEqual(screen_name_new);
		// expect(info.link).toEqual(webs_new);
		// expect(info.bio).toEqual(biog_new);
	})

	it("should change to old info", function(){
		info.type_firstname(params.teacher1.f_name)
		info.type_lastname(params.teacher1.l_name)
		// info.type_email(params.teacher1.email)
		info.type_university(params.teacher1.university)
		info.type_screenname(params.teacher1.online_name)
		// info.type_link(webs)
		// info.type_bio(biog)
		info.save('password')
		sleep(2000)
		refresh()
	})

	it("should check for old info", function(){
		info.open()
		expect(info.firstname).toEqual(params.teacher1.f_name);
		expect(info.lastname).toEqual(params.teacher1.l_name);
		expect(info.email).toEqual(params.teacher1.email);
		expect(info.university).toEqual(params.teacher1.university);
		expect(info.screenname).toEqual(params.teacher1.online_name);
		// expect(info.link).toEqual(webs);
		// expect(info.bio).toEqual(biog);
	})
    it("should check text of delete teacher account",function(){
		info.open()
        header.open_account_information()
		info.click_delete_account()
        expect(info.get_text_modal_delete()).toEqual("Delete my account")
		info.click_modal_cancel_account()
    })
	describe("Pick first day of the week for Calendar",function(){
		it("should change first day to Sat",function(){
			info.open()
		    // header.open_account_information()
		    info.choose_first_day(6)
		    info.save(params.password)
		    header.open_dashboard()
		    $('tr th').getText().then(function (text) { expect(text).toEqual("Sat") });
		})
		it("should change first day to Sun",function(){
			info.open()
		    info.choose_first_day(0)
		    info.save(params.password)
		    header.open_dashboard()
		    $('tr th').getText().then(function (text) { expect(text).toEqual("Sun") });
	    })
    })
	it("should logout",function(){
		header.logout()
	})
})
