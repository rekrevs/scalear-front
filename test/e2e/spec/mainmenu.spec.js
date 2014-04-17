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

ptor.driver.manage().window().maximize();

describe('basic functionality', function(){
	it('should login', function(){
		functions.sign_in(ptor, mail, password, functions.feedback)
	})
	it('menu app should be closed',function(){
		menu_should_be_closed(ptor);
	})
	it('should open tray', function(){
		functions.open_tray(ptor);
	})
	it('menu should be open', function(){
		menu_should_be_open(ptor);
	})
	it('lecture icons should not be visible', function(){
		check_for_nav_bar_icons_before_course(ptor);
	})
	it('should open course', function(){
		functions.open_course(ptor);
	})
	it('menu should be closed', function(){
		menu_should_be_closed(ptor);
	})
	it('should open main menu', function(){
		functions.open_tray(ptor);
	})
	it('item are visible in the course page',function(){
		check_for_nav_bar_icons_after_course(ptor);
	})
})

describe('scenario 1', function(){
	})


//======================================================
//check for nav_bar icons_is_displayed inside a course
//======================================================

function check_for_nav_bar_icons_after_course(ptor){

	info_icon = ptor.findElement(protractor.By.id("info"));
    expect(info_icon.isDisplayed()).toEqual(true);

    cal_icon = ptor.findElement(protractor.By.id("calendar"));
    expect(cal_icon.isDisplayed()).toEqual(true);

    lec_icon = ptor.findElement(protractor.By.id("lectures"));
    expect(lec_icon.isDisplayed()).toEqual(true);

    settings_btn = ptor.findElement(protractor.By.id("settings-btn"));
    expect(settings_btn.isDisplayed()).toEqual(true);

    language_link_sweden = ptor.findElement(protractor.By.id("lang_link_swed"));
    expect(language_link_sweden.isDisplayed()).toEqual(true);

    help_link = ptor.findElement(protractor.By.id("help_link"));
    expect(help_link.isDisplayed()).toEqual(true);

    logout_link = ptor.findElement(protractor.By.id("logout_link"));
    expect(logout_link.isDisplayed()).toEqual(true);
}

//======================================================
//check for nav_bar icons_is_displayed outside a course
//======================================================

function check_for_nav_bar_icons_before_course(ptor){

	expect(element(by.id('info')).isPresent()).toBe(false);

	expect(element(by.id('calendar')).isPresent()).toBe(false);

	expect(element(by.id('lectures')).isPresent()).toBe(false);

    settings_btn = ptor.findElement(protractor.By.id("settings_btn"));
    expect(settings_btn.isDisplayed()).toEqual(true);

    language_link_sweden = ptor.findElement(protractor.By.id("lang-link-swed"));
    expect(language_link_sweden.isDisplayed()).toEqual(true);

    help_link = ptor.findElement(protractor.By.id("help-link"));
    expect(help_link.isDisplayed()).toEqual(true);

    logout_link = ptor.findElement(protractor.By.id("logout-link"));
    expect(logout_link.isDisplayed()).toEqual(true);
}

//======================================================
//						menu tests
//======================================================

function menu_should_be_open(ptor){
	ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/span[1]/ul/div')).then(function(btn){
		expect(btn.isDisplayed()).toEqual(true);
	});
}

function menu_should_be_closed(ptor){
	ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/span[1]/ul/div')).then(function(btn){
		expect(btn.isDisplayed()).toEqual(false);
	});
}

//======================================================
//					settings test
//======================================================


function settings_menu_should_be_open(ptor){
	ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/span[2]/ul/div/table/tbody/tr/td[3]/span[2]/table/tbody/tr/td/div/a/ul')).then(function(table){
		expect(table.isDisplayed()).toEqual(true);
	});
}

function settings_menu_should_be_closed(ptor){
	ptor.findElement(protractor.By.xpath('//*[@id="main"]/div/span[2]/ul/div/table/tbody/tr/td[3]/span[2]/table/tbody/tr/td/div/a/ul')).then(function(btn){
		expect(btn.isDisplayed()).toEqual(false);
	});
}

function check_for_settings_menu_elements(ptor){
	ptor.sleep(3000);
	ptor.findElements(protractor.By.id('settings_screen_name')).then(function(scr_name){
		expect(scr_name[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_name')).then(function(user_name){
		expect(user_name[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_last_name')).then(function(last_name){
		expect(last_name[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_email')).then(function(email){
		expect(email[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_university')).then(function(uni){
		expect(uni[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_bio')).then(function(bio){
		expect(bio[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_link')).then(function(link){
		expect(link[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_password')).then(function(password){
		expect(password[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_password_confirmation')).then(function(password_conf){
		expect(password_conf[1].isDisplayed()).toEqual(true);
	})

	ptor.findElements(protractor.By.id('setting_user_current_confirmation')).then(function(current_pass_conf){
		expect(current_pass_conf[1].isDisplayed()).toEqual(true);
	})
}

function open_settings(){
	ptor.findElement(protractor.By.id("settings-btn")).then(function(btn){
		btn.click();
	});
}

function close_settings(){
	ptor.findElement(protractor.By.id("settings-btn")).then(function(btn){
		btn.click();
	});
}