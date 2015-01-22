var AccountInformation = require('./pages/account_information');
var sleep = require('./lib/utils').sleep;
var refresh = require('./lib/utils').refresh;

var	info = new AccountInformation();

var screen_name = "teacher1"
var fname = "teacher1"
var lname = "sharklasers.com"
var mail = "teacher1@sharklasers.com"
var univer = "shark"
var biog = "This is my biography it contains everything about me"
var webs = "www.website.com"
var password = "password"

var screen_name_new = "teacher 0_1"
var fname_new = "Test_1"
var lname_new = "teacher_1"
var mail_new = "teacher1_1@email.com"
var univer_new = "uni_1"
var biog_new = "text w text_1"
var webs_new = ".com_1"
var password_new = "password_1"

describe("Check Teacher account information", function(){
	it("should check for info", function(){
		info.open()
		expect(info.firstname).toEqual(fname);
		expect(info.lastname).toEqual(lname);
		expect(info.email).toEqual(mail);
		expect(info.university).toEqual(univer);
		expect(info.screenname).toEqual(screen_name);
		expect(info.link).toEqual(webs);
		expect(info.bio).toEqual(biog);
	})

	it("should change to new info", function(){
		info.type_firstname(fname_new)
		info.type_lastname(lname_new)
		info.type_email(mail_new)
		info.type_university(univer_new)
		info.type_screenname(screen_name_new)
		info.type_link(webs_new)
		info.type_bio(biog_new)
		info.save('password')
		refresh()
	})

	it("should check for new info", function(){
		expect(info.firstname).toEqual(fname_new);
		expect(info.lastname).toEqual(lname_new);
		expect(info.email).toEqual(mail);
		expect(info.university).toEqual(univer_new);
		expect(info.screenname).toEqual(screen_name_new);
		expect(info.link).toEqual(webs_new);
		expect(info.bio).toEqual(biog_new);
	})

	it("should change to old info", function(){
		info.type_firstname(fname)
		info.type_lastname(lname)
		info.type_email(mail)
		info.type_university(univer)
		info.type_screenname(screen_name)
		info.type_link(webs)
		info.type_bio(biog)
		info.save('password')
		refresh()
	})

	it("should check for old info", function(){
		expect(info.firstname).toEqual(fname);
		expect(info.lastname).toEqual(lname);
		expect(info.email).toEqual(mail);
		expect(info.university).toEqual(univer);
		expect(info.screenname).toEqual(screen_name);
		expect(info.link).toEqual(webs);
		expect(info.bio).toEqual(biog);
	})
})
