var Login = require('./pages/login');
var NewCourse = require('./pages/new_course');
var Header = require('./pages/header');
var CourseInformation = require('./pages/course_information');
var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var ContentItems = require('./pages/content_items');
var CourseList = require('./pages/course_list');
var Dashboard = require('./pages/dashboard');


var params = browser.params;

var login_page = new Login()
var new_course = new NewCourse();
var header = new Header();
var course_info = new CourseInformation();
var course_editor = new CourseEditor()
var navigator = new ContentNavigator(1);
var content_items = new ContentItems();
var course_list = new CourseList();
var dashboard = new Dashboard();



// var element = 'Module 1';
// var date;
//
// var current_date = new Date();
// var month = new Array();
//
// month[0] = "January";
// month[1] = "February";
// month[2] = "March";
// month[3] = "April";
// month[4] = "May";
// month[5] = "June";
// month[6] = "July";
// month[7] = "August";
// month[8] = "September";
// month[9] = "October";
// month[10] = "November";
// month[11] = "December";

describe("should check calendar functionality", function(){

  it('should login as teacher', function(){
    login_page.sign_in(params.teacher1.email,params.password)
  })

  it('should create_course', function(){
    new_course.open()
    new_course.create(params.short_name, params.course_name, params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
  })

  xdescribe('should add a couple of module and lectures', function(){
    it("should create modules", function() {
      expect(navigator.modules.count()).toEqual(0)
      course_editor.add_module();
      course_editor.rename_module("module 1")
      expect(navigator.modules.count()).toEqual(1)
      navigator.add_module();
      course_editor.rename_module("module 2")
      expect(navigator.modules.count()).toEqual(2)
    })

    it("should add items to the first module", function() {
      var module = navigator.module(1)
      module.open()
      module.open_content_items()
      content_items.add_video()
      course_editor.rename_item("lecture1 video quizzes")
      course_editor.change_item_url(params.url1)
        // video.wait_till_ready()

      module.open_content_items()
      content_items.add_video()
      course_editor.rename_item("lecture2 text quizzes")
      course_editor.change_item_url(params.url1)
        // video.wait_till_ready()

    })

    it("should add items to the second module", function() {
      var module = navigator.module(2)
      module.open()
      module.open_content_items()
      content_items.add_video()
      course_editor.rename_item("lecture4 video quizzes")
      course_editor.change_item_url(params.url1)
        // video.wait_till_ready()

      module.open_content_items()
      content_items.add_video()
      course_editor.rename_item("lecture5 text quizzes")
      course_editor.change_item_url(params.url1)
        // video.wait_till_ready()

    })
  })

  it('should check if the calendar is visible', function(){
    dashboard.open()
    expect(element.all(by.className('fc-event-title')).count()).toEqual(2);
    
  })

  xit('should get the enrollment key and enroll student', function(){
    course_info.open()
		var enrollment_key = course_info.enrollmentkey
		header.logout()
		// browser.pause();
		login_page.sign_in(params.student1.email, params.password)
		header.join_course(enrollment_key)
		header.logout()
		login_page.sign_in(params.student2.email, params.password)
		header.join_course(enrollment_key)
  })

  xit('should check if the calendar is visible', function(){

  })



  xit('should delete course', function(){
    course_list.open()
    course_list.delete_teacher_course(1)
    expect(course_list.courses.count()).toEqual(0)
  })

  xit("should logout",function(){
    header.logout()
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
