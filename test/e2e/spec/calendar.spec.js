var ptor = protractor.getInstance();
var driver = ptor.driver;
var functions = ptor.params;

var mail = 'mena.happy@yahoo.com'
var password = 'password';

var course_name = 'csc-303';

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


describe('', function(){
	it('should login', function(){
    functions.sign_in(ptor, mail, password, functions.feedback);
  })
  it('should open the course to be tested', function(){
    functions.open_course_by_name(ptor, course_name);
  })
  it('should test if an element is in the right date', function(){
    open_random_event(ptor);
  })
})



//====================================================
///////////////check element date///////////////////
//====================================================
function check_element_date(ptor, element, date){
  functions.wait_ele(ptor, protractor.By.partialLinkText(element));
  ptor.findElement(protractor.By.partialLinkText(element)).then(function(wanted_element){
    wanted_element.click();
  });
}

//====================================================
//////////////////is on Calendar page///////////////
//====================================================
function is_calendar(ptor){
  ptor.findElement(protractor.By.binding('current | translate')).then(function(promise){
     expect(promise.getText()).toContain('Calendar');
  })
}

//====================================================
///////////////is current month/////////////////////
//====================================================
function is_current_month(ptor)
{
  ptor.findElement(protractor.By.tagName('h2')).then(function(promise){
    expect(promise.getText()).toEqual(month[current_date.getMonth()]+" "+current_date.getFullYear())
  });
}

//====================================================
///////////////get previous month///////////////////
//====================================================
function get_previous_month(ptor){
  var mon;
  var year;
  ptor.findElement(protractor.By.className('fc-button-prev')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
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
  ptor.findElement(protractor.By.className('fc-button-next')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
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
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-prev')).click();
            ptor.findElement(protractor.By.className('fc-button-today')).click().
                then(function(promise){
                    ptor.findElement(protractor.By.tagName('h2')).
                        then(function(promise){
                            expect(promise.getText()).toEqual(month[current_date.getMonth()]+" "+current_date.getFullYear())
                        });
                });
}

//====================================================
///////////////test the number of events//////////////
//====================================================

function all_events_specific_month(ptor, events_no){
  ptor.findElements(protractor.By.className('fc-event-title')).then(function(events){
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
  ptor.findElement(protractor.By.className('fc-content')).findElements(protractor.By.tagName('a')).then(function(links){
      ptor.sleep(5000);
      ptor.findElement(protractor.By.className('fc-content')).findElements(protractor.By.tagName('a')).then(function(links){
          random_event_number = Math.floor((Math.random()*links.length)+0);
          links[random_event_number].getText().then(function(textt){
            text = textt.split(" ");
            links[random_event_number].click().then(function(){
              ptor.findElement(protractor.By.binding("modules_obj[lecture.group_id].name+': '+lecture.name")).then(function(title){
                 expect(title.getText()).toContain(text[0]);
              })
            })
          })
      })
  });
}

