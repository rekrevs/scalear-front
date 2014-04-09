var ptor = protractor.getInstance();
var driver = ptor.driver;

var frontend = 'http://localhost:9000/';

var screen_name = "student test";
var fname = "student";
var lname = "test";
var univer = "world university";
var studentmail = 'studenttest@sharklasers.com';
var biog = "kalam keteeer yege 140 char";
var webs = "www.website.com";
var password = 'password';
var enrollment_key = '';
var functions = ptor.params;

var mail = 'mena.happy@yahoo.com'

describe('', function(){
	it('should login', function(){
		functions.sign_in(ptor, mail, password, functions.feedback)
	})
	it('should open course', function(){
		//open_course(ptor);
	})
	it('should open tray', function(){
		functions.open_tray(ptor);
	})
	it('item are visible in the course page',function(){
		//check_for_menu_icons_true(ptor);
		check_for_nav_bar_icons_true(ptor);
	})
})

open_course = function(ptor){
	ptor.findElements(protractor.By.partialLinkText('|')).then(function(course){
		course[0].click();
	})
}

check_for_menu_icons_true = function(ptor){

	info_icon = ptor.findElement(protractor.By.id("info"));
    expect(info_icon.isDisplayed()).toEqual(true);

    info_icon = ptor.findElement(protractor.By.id("calendar"));
    expect(info_icon.isDisplayed()).toEqual(true);

    info_icon = ptor.findElement(protractor.By.id("lectures"));
    expect(info_icon.isDisplayed()).toEqual(true);
}

check_for_nav_bar_icons_true = function(ptor){

	settings_btn = ptor.findElement(protractor.By.id("settings_btn"));
    expect(settings_btn.isDisplayed()).toEqual(true);

    language_link_sweden = ptor.findElement(protractor.By.id("language_link_sweden"));
    expect(language_link_sweden.isDisplayed()).toEqual(true);

    help_link = ptor.findElement(protractor.By.id("help_link"));
    expect(help_link.isDisplayed()).toEqual(true);

    logout_link = ptor.findElement(protractor.By.id("logout_link"));
    expect(logout_link.isDisplayed()).toEqual(true);
}

