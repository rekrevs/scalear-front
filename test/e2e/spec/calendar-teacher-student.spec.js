var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module');

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();

var element = 'Module 1';
var date;

var current_date = new Date();
var month = new Array();

month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";


describe("teacher teacher calendar", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module and change the time zone', function(){
		
    teacher.add_module(ptor, o_c.feedback);
		o_c.home_teacher(ptor);
		o_c.open_course_whole(ptor);
    teacher.add_module(ptor, o_c.feedback);
		o_c.open_tray(ptor);
		o_c.open_info_teacher(ptor);
		teacher.change_time_zone(ptor, 143);
		//teacher.delete_empty_module(ptor, 1, o_c.feedback);
	})

  it('should log in as student check for modules due date', function(){
    o_c.to_student(ptor);
    o_c.open_course_whole(ptor);
    check_element_date(ptor, 'Module', )
  })
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})


xdescribe("teacher student calendar", function(){

	it('should sign in as teacher', function(){
		o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
	})

	it('should create_course', function(){
		teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
	})

	it('should get the enrollment key and enroll student', function(){
		teacher.get_key_and_enroll(ptor);
	})
	//test
	it('should add a module', function(){
		//o_c.open_course_whole(ptor);
	})
	//end test

	it('should delete course', function(){
		//should choose one of home() or home_teacher() 
		//depending on the current state(student or teacher)
		o_c.home(ptor);
		teacher.delete_course(ptor, o_c.feedback);
	})
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////

//====================================================
///////////////check element date///////////////////
//====================================================
function check_element_date(ptor, element, date){
  params.wait_ele(ptor, protractor.By.partialLinkText(element));
  locator.by_partial_text(ptor, element).then(function(wanted_element){
    wanted_element.click();
  });
}

//====================================================
//////////////////is on Calendar page///////////////
//====================================================
function is_calendar(ptor){
  locator.by_binding(ptor, 'current | translate').then(function(promise){
     expect(promise.getText()).toContain('Calendar');
  })
}

//====================================================
///////////////is current month/////////////////////
//====================================================
function is_current_month(ptor)
{
  locator.by_tag(ptor, 'h2').then(function(promise){
    expect(promise.getText()).toEqual(month[current_date.getMonth()]+" "+current_date.getFullYear())
  });
}

//====================================================
///////////////get previous month///////////////////
//====================================================
function get_previous_month(ptor){
  var mon;
  var year;
  locator.by_classname(ptor, 'fc-button-prev').click().
                then(function(promise){
                    locator.by_tag(ptor, 'h2').
                        then(function(promise){
                          if((current_date.getMonth()-1)<0){
                            mon = 11;
                            year = current_date.getFullYear()-1;
                          }
                          else{
                            mon = current_date.getMonth()-1;
                            year = current_date.getFullYear();
                          }
                          expect(promise.getText()).toEqual(month[mon]+" "+year)
                        });
                });
}

//====================================================
///////////////get next month///////////////////
//====================================================
function get_next_month(ptor){
  var mon;
  var year;
  locator.by_classname(ptor,'fc-button-next').click().
                then(function(promise){
                    locator.by_tag(ptor, 'h2').
                        then(function(promise){
                          if((current_date.getMonth()+1)>11){
                            mon = 0;
                            year = current_date.getFullYear()+1;
                          }
                          else{
                            mon = current_date.getMonth()+1;
                            year = current_date.getFullYear();
                          }
                            expect(promise.getText()).toEqual(month[mon]+" "+year);
                        });
                });
}

//====================================================
///////////////press todays button///////////////////
//====================================================

function get_todays_month(){
            locator.by_classname(ptor,'fc-button-prev').click();
            locator.by_classname(ptor,'fc-button-prev').click();
            locator.by_classname(ptor,'fc-button-today').click().
                then(function(promise){
                    locator.by_tag(ptor, 'h2').
                        then(function(promise){
                            expect(promise.getText()).toEqual(month[current_date.getMonth()]+" "+current_date.getFullYear())
                        });
                });
}

//====================================================
///////////////test the number of events//////////////
//====================================================

function all_events_specific_month(ptor, events_no){
  locator.s_by_classname(ptor, 'fc-event-title').then(function(events){
    expect(events.length).toEqual(events_no);
  })
}

//====================================================
/////////////test the event correctness//////////////
//====================================================

function open_random_event(ptor){
  var random_event_number;
  var text;
  var res;
  locator.by_classname(ptor, 'fc-content').findElements(protractor.By.tagName('a')).then(function(links){
      ptor.sleep(5000);
      locator.by_classname(ptor, 'fc-content').findElements(protractor.By.tagName('a')).then(function(links){
          random_event_number = Math.floor((Math.random()*links.length)+0);
          links[random_event_number].getText().then(function(textt){
            text = textt.split(" ");
            links[random_event_number].click().then(function(){
              locator.by_binding(ptor, "modules_obj[lecture.group_id].name+': '+lecture.name").then(function(title){
                 expect(title.getText()).toContain(text[0]);
              })
            })
          })
      })
  });
}
