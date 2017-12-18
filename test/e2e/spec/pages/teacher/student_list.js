'use strict';

var SubHeader = require('../sub_header');
var sub_header = new SubHeader()
var StudentList=function(model){}

StudentList.prototype= Object.create({},{

  open:{value:function(){
    sub_header.open_student_list()
    browser.driver.wait(function() {
        return browser.driver.getCurrentUrl().then(function(url) {
          return /enrolled_students/.test(url);
        });
      });
  }},
  export_student_list_button:{get:function(){return element(by.css("[ng-click='exportStudentsList()']"))}},
  click_export_student_list:{value:function(){this.export_student_list_button.click()}},
  export_student_list_message:{get:function(){return element(by.className("errorMessage"))}},
  remove_student_button:{get:function(){return element(by.id("delete_mode"))}},
  click_remove_student:{value:function(){this.remove_student_button.click()}},
  student_delete_button:{get:function(){return element.all(by.css('[ng-click="showDeletePopup(true, $event)"]'))}},
  select_all_button:{get:function(){return element(by.css("[ng-click='selectAll()']"))}},
  click_select_all:{value:function(){this.select_all_button.click()}},
  de_select_all_button:{get:function(){return element(by.css("[ng-click='deSelectAll()']"))}},
  click_de_select_all:{value:function(){this.de_select_all_button.click()}},
  email_button:{get:function(){return element(by.css('[ng-click="emailForm()"]'))}},
  click_email:{value:function(){this.email_button.click()}},

  list_view_button:{get:function(){return element(by.css("[ng-click='listView(true)']"))}},
  click_list_view:{value:function(){this.list_view_button.click()}},
  grid_view_button:{get:function(){return element(by.css("[ng-click='listView(false)']"))}},
  click_grid_view:{value:function(){this.grid_view_button.click()}},

  students:{get:function(){return element.all(by.repeater('student in students'))}},
  student:{value:function(num){return this.students.get(num-1)}},

  // modal
  email_students:{get:function(){return element.all(by.repeater('email in batch_emails'))}},
  email_student:{value:function(num){return this.email_students.get(num-1)}},


  confirm_delete_button:{get:function(){return element(by.css('[ng-click="action({event:$event});showDeletePopup(false, $event)"]'))}},
  delete_student:{value:function(num){
    this.student_delete_button.get(num-1).click()
    this.confirm_delete_button.click()
  }}
// $('button.with-tiny-padding')

})

module.exports = StudentList;

