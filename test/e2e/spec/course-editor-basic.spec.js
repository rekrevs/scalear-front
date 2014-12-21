var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params;
ptor.driver.manage().window().maximize();

//function testing
// describe("3", function(){
// 	it('should', function(){
// 		o_c.sign_in(ptor, params.teacher_mail, params.password);
// 		o_c.open_course_whole(ptor,1);
// 		o_c.press_content_navigator(ptor);
// 		teacher.open_module(ptor, 1);
// 		// teacher.open_content_new_module(ptor);
// 		teacher.create_lecture(ptor);
// 		teacher.initialize_lecture(ptor, "menaz")
// 		ptor.sleep(5000);
// 	})
// })

describe("1", function(){

	it('should sign in as teacher', function(){
		o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})

	//test
	it('should add a couple of module and lectures', function(){
		// o_c.sign_in(ptor, params.teacher_mail, params.password);
		// o_c.open_course_list(ptor)
		// o_c.open_course(ptor, 1);
		// o_c.open_content_editor(ptor);
		teacher.add_module(ptor);
		teacher.add_module(ptor);
		// o_c.press_content_navigator(ptor)
		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		teacher.add_lecture(ptor);
		teacher.add_quiz(ptor);
		
		teacher.open_module(ptor, 2);
		teacher.add_lecture(ptor);
		teacher.add_lecture(ptor);
		teacher.add_survey(ptor);
		
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should check for number of modules and lectures student-side', function(){
		// o_c.to_student(ptor);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		// o_c.open_lectures(ptor);
		o_c.press_content_navigator(ptor)

		student.check_module_number(ptor, 2);
		student.check_item_number(ptor, 1, 3);
		student.check_timeline_item_number(ptor, 3);
		teacher.open_module(ptor, 2);
		student.check_item_number(ptor,2, 3);
		student.check_timeline_item_number(ptor, 3);
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
	 	o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);
	    // o_c.press_content_navigator(ptor)

	    teacher.open_module(ptor, 2);
	    teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_empty_module(ptor, 2)


	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_empty_module(ptor, 1)
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("2", function(){

	it('should sign in as teacher', function(){
		// o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	
	//test
	it('should add a couple of module and lectures', function(){
		teacher.add_module(ptor);
		teacher.rename_module(ptor, 'module 1')
		teacher.add_module(ptor);
		teacher.rename_module(ptor, 'module 2')

		teacher.open_module(ptor, 1);
		teacher.add_lecture(ptor);
		teacher.rename_item(ptor, "lecture1")
		teacher.add_lecture(ptor);
		teacher.rename_item(ptor, "lecture2")
		teacher.add_quiz(ptor);
		teacher.rename_item(ptor, "quiz")

		teacher.open_module(ptor, 2);
		teacher.add_lecture(ptor);
		teacher.rename_item(ptor, "lecture1")
		teacher.add_lecture(ptor);
		teacher.rename_item(ptor, "lecture2")
		teacher.add_survey(ptor);
		teacher.rename_item(ptor, "survey")
		
	})

	it('should sort items inside modules', function(){
		teacher.open_module(ptor, 1);
		ptor.sleep(2000)
		sort_items(ptor, 1)
		teacher.open_module(ptor, 2);
		ptor.sleep(2000)
		sort_items(ptor, 2)
	})

	it('should sort modules', function(){
		sort_modules(ptor)
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should check for number of modules and lectures student-side', function(){
		// o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		o_c.press_content_navigator(ptor)

		student.check_module_number(ptor, 2);
		check_module_name(1, "module 2")
		teacher.open_module(ptor, 2);
		check_module_name(2, "module 1")
		check_item_name(2,1,'quiz')
		check_item_name(2,2,'lecture1')
		check_item_name(2,3,'lecture2')
		teacher.open_module(ptor, 1);
		check_item_name(1,1,'survey')
		check_item_name(1,2,'lecture1')
		check_item_name(1,3,'lecture2')
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
	 	o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);

	    teacher.open_module(ptor, 2);
	    teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_item_by_number(ptor, 2, 1);
		teacher.delete_empty_module(ptor, 2)


	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_empty_module(ptor, 1)
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("3", function(){

	it('should sign in as teacher', function(){
		// o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	
	//test
	it('should add and edit course links', function(){
		teacher.add_module(ptor)
		teacher.add_lecture(ptor)
		teacher.add_course_link(ptor)
		teacher.edit_course_link_info(1, "link1", "http://helloworld1.com")
		teacher.add_course_link(ptor)
		teacher.edit_course_link_info(2, "link2", "http://helloworld2.com")
		teacher.add_course_link(ptor)
		teacher.edit_course_link_info(3, "link3", "http://helloworld3.com")		
	})

	it('should sort course links', function(){
		sort_course_links(ptor)
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should check for number of modules and lectures student-side', function(){
		// o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		o_c.press_content_navigator(ptor)
		student.open_course_links()
		student.check_course_links_number(ptor, 3);
		check_course_link_name(1, "link3")
		check_course_link_name(2, "link1")
		check_course_link_name(3, "link2")
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
	 	o_c.open_course_list(ptor);
	    o_c.open_course(ptor, 1);

	    teacher.open_course_links()

	    teacher.delete_course_link(ptor, 1)
		teacher.delete_course_link(ptor, 1)
		teacher.delete_course_link(ptor, 1)

	    teacher.open_module(ptor, 1);
	    teacher.delete_item_by_number(ptor, 1, 1);
		teacher.delete_empty_module(ptor, 1)
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

describe("4", function(){

	it('should sign in as teacher', function(){
		// o_c.press_login(ptor)
		o_c.sign_in(ptor, params.teacher_mail, params.password);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
	})
	
	//test
	it('should add and edit course links', function(){
		teacher.add_module(ptor)
		teacher.add_module_link(ptor)
		teacher.edit_module_link_info(1, "link1", "http://helloworld1.com")
		teacher.add_module_link(ptor)
		teacher.edit_module_link_info(2, "link2", "http://helloworld2.com")
		teacher.add_module_link(ptor)
		teacher.edit_module_link_info(3, "link3", "http://helloworld3.com")	
	})

	it('should sort course links', function(){
		sort_module_links(ptor)
		teacher.add_lecture(ptor)	
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
	})

	it('should check for number of modules and lectures student-side', function(){
		// o_c.sign_in(ptor, params.student_mail, params.password);
		o_c.open_course_list(ptor)
		o_c.open_course(ptor, 1);
		o_c.press_content_navigator(ptor)
		teacher.open_module(ptor, 1);
		student.check_module_links_number(ptor, 3);
		check_module_link_name(1, "link3")
		check_module_link_name(2, "link1")
		check_module_link_name(3, "link2")
	})

	it('should clear the course for deletion', function(){
		o_c.to_teacher(ptor);
	 	o_c.open_course_list(ptor)
	    o_c.open_course(ptor, 1); 
	    teacher.open_module(ptor, 1)
	    teacher.delete_module_link(ptor, 1)
		teacher.delete_module_link(ptor, 1)
		teacher.delete_module_link(ptor, 1)
	    teacher.delete_item_by_number(ptor, 1, 1)
		teacher.delete_empty_module(ptor, 1)
	})
	//end test

	it('should delete course', function(){
		o_c.open_course_list(ptor);
	    teacher.delete_course(ptor, 1);
	    o_c.logout(ptor);
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

var sort_items = function(ptor, module_num){
	var module =element(by.repeater('module in modules').row(module_num-1))
	var items = module.all(by.repeater('item in module.items'))
  	var handles = module.all(by.className('handle'))
  	var names=[]
  	items.get(2).getText().then(function(text){
  		names[0]= text
  	})
  	items.get(0).getText().then(function(text){
  		names[1]= text
  	})
  	items.get(1).getText().then(function(text){
  		names[2]= text
  		ptor.actions().dragAndDrop(handles.get(1), handles.get(2)).perform();
		ptor.actions().dragAndDrop(handles.get(3), handles.get(1)).perform().then(function(){
			for(var i=0; i<3; i++){
				expect(items.get(i).getText()).toEqual(names[i])
			}
		})
  	})
}


var sort_modules = function(ptor){
	var modules =element.all(by.repeater('module in modules'))
	var handle_1 = modules.get(0).element(by.className('handle')) 
	var handle_2 = modules.get(1).element(by.className('handle')) 

	modules.get(1).getText().then(function(text){
		ptor.actions().dragAndDrop(handle_2, handle_1).perform().then(function(){
			expect(modules.get(0).getText()).toEqual(text)
		})
	})
}

var sort_course_links = function(ptor, module_num){
	var links =element.all(by.repeater('link in links'))
  	var names=[]
  	links.get(2).getText().then(function(text){
  		names[0]= text
  	})
  	links.get(0).getText().then(function(text){
  		names[1]= text
  	})
  	links.get(1).getText().then(function(text){
  		names[2]= text
  		ptor.actions().dragAndDrop(links.get(0).element(by.className('handle')) , links.get(1).element(by.className('handle')) ).perform();
		ptor.actions().dragAndDrop(links.get(2).element(by.className('handle')) , links.get(0).element(by.className('handle')) ).perform().then(function(){
			for(var i=0; i<3; i++){
				expect(links.get(i).getText()).toEqual(names[i])
			}
		})
  	})
}

var sort_module_links = function(ptor, module_num){
	var links =element.all(by.repeater('doc in module.custom_links'))
  	var names=[]
  	links.get(2).getText().then(function(text){
  		names[0]= text
  	})
  	links.get(0).getText().then(function(text){
  		names[1]= text
  	})
  	links.get(1).getText().then(function(text){
  		names[2]= text
  		ptor.actions().dragAndDrop(links.get(0).element(by.className('handle')) , links.get(1).element(by.className('handle')) ).perform();
		ptor.actions().dragAndDrop(links.get(2).element(by.className('handle')) , links.get(0).element(by.className('handle')) ).perform().then(function(){
			for(var i=0; i<3; i++){
				expect(links.get(i).getText()).toEqual(names[i])
			}
		})
  	})
}

var check_module_name = function(mod_num, name){
	expect(element(by.repeater('module in modules').row(mod_num-1)).getText()).toContain(name)
}

var check_item_name = function(mod_num, item_num, name){
	var module =element(by.repeater('module in modules').row(mod_num-1))
	var item = module.element(by.repeater('item in module.items').row(item_num-1))
	expect(item.getText()).toContain(name)
}

var check_course_link_name = function(link_num, name){
	expect(element(by.repeater('link in links').row(link_num-1)).getText()).toContain(name)
}

var check_module_link_name = function(link_num, name){
	expect(element(by.repeater('link in module.custom_links').row(link_num-1)).getText()).toContain(name)
}