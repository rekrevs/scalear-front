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

describe("should check calendar functionality", function(){
  
  it('should sign in as teacher', function(){
    o_c.press_login(ptor)
    o_c.sign_in(ptor, params.teacher_mail, params.password);
  })

  it('should create_course', function(){
    teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
  })

  it('should get the enrollment key and enroll student', function(){
    teacher.get_key_and_enroll(ptor, params.student_mail, params.password);
  })
  //test
  it('should add a couple of module and lectures', function(){
    o_c.sign_in(ptor, params.teacher_mail, params.password);
    o_c.open_course_list(ptor)
    o_c.open_course(ptor, 1);
    // o_c.open_content_editor(ptor);
    teacher.add_module(ptor);
    teacher.add_module(ptor);
    // o_c.press_content_navigator(ptor)
    teacher.open_module(ptor, 1);
    teacher.add_lecture(ptor);
    teacher.add_lecture(ptor);
    
    teacher.open_module(ptor, 2);
    teacher.add_lecture(ptor);
    teacher.add_lecture(ptor);
    teacher.add_lecture(ptor);
    
  })

  it('should check if the calendar is visible', function(){
    o_c.to_student(ptor);
    all_events_specific_month(ptor, 2);
    ptor.sleep(5000)
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
      teacher.delete_empty_module(ptor, 1)
  })

  it('should delete course', function(){
      o_c.open_course_list(ptor);
      teacher.delete_course(ptor, 1);
      o_c.logout(ptor);
  })


})


/////////////////////////////////////////////////////////
//				test specific functions
////////////////begin new_layout mods//////////////////

//====================================================
//////////////////is on Calendar page///////////////
//====================================================
function is_calendar(ptor){
  locator.by_id(ptor, "studentCalendar").then(function(cal){
    expect(cal.isDisplayed()).toEqual(true);    
  })
}

//====================================================
///////////////is current month/////////////////////
//====================================================
function is_current_month(ptor)
{
  locator.by_classname(ptor, 'fc-header-title').then(function(promise){
    expect(promise.getText()).toEqual(month[current_date.getMonth()]+" "+current_date.getFullYear())
  });
}


//====================================================
//                  press calendar btn
//====================================================

function open_calendar(ptor){
  locator.by_id(ptor, "calendar_btn").then(function(btn){
    btn.click();
  })
}

//====================================================
///////////////get previous month///////////////////
//====================================================
function get_previous_month(ptor){
  var mon;
  var year;
  locator.by_classname(ptor, 'fc-button-prev').click().
                then(function(promise){
                    locator.by_classname(ptor, 'fc-header-title').
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
                    locator.by_classname(ptor, 'fc-header-title').
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
                    locator.by_classname(ptor, 'fc-header-title').
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

//====================================================
///////////////check element date///////////////////
//====================================================
function check_element_date(ptor, element, date){
  params.wait_ele(ptor, protractor.By.partialLinkText(element));
  locator.by_partial_text(ptor, element).then(function(wanted_element){
    wanted_element.click();
  });
}
