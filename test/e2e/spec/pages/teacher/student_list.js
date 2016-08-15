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
  // ng-click="action({event:$event});showDeletePopup(false, $event)"
  
  confirm_delete_button:{get:function(){return element(by.css('[ng-click="action({event:$event});showDeletePopup(false, $event)"]'))}},
  delete_student:{value:function(num){
    this.student_delete_button.get(num).click()
    this.confirm_delete_button.click()
  }}
// $('button.with-tiny-padding')

})

module.exports = StudentList;

