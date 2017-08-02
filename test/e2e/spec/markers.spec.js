var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var MarkerPanel = require('./pages/marker');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var sleep = require('./lib/utils').sleep;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
var ContentItems = require('./pages/content_items');
var scroll_top = require('./lib/utils').scroll_top;

var params = browser.params;
var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
var invideo_quiz = new InvideoQuiz();
var marker = new MarkerPanel();

var quiz = new NormalQuiz();
var content_items = new ContentItems()
var navigator = new ContentNavigator(1)

var q1_x = 169;
var q1_y = 127;

var q2_x = 169;
var q2_y = 157;

var q3_x = 169;
var q3_y = 187;

var d_q1_x = 169;
var d_q1_y = 70;

var d_q2_x = 169;
var d_q2_y = 130;

var d_q3_x = 169;
var d_q3_y = 190;

describe("Markers", function() {
  describe("Teacher", function() {
    it("should login", function() {
      login_page.sign_in(params.teacher1.email, params.password)
    })
    it("should open course", function() {
      course_list.open()
      course_list.open_teacher_course(1)
    })
    it("should go to edit mode", function() {
      sub_header.open_edit_mode()
    })

    it("should open first lecture in first module", function() {
      navigator.module(1).open()
      navigator.module(1).item(1).open()
      // navigator.close()
    })
    
    // Adding/Editing/Updating/Removing markers 
    it("should add makers", function() {
      expect(marker.markers.count()).toEqual(0)
      video.seek(55)
      marker.create()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.annotation_video.isPresent()).toEqual(false);      
      browser.driver.switchTo().activeElement().getAttribute('class').then(function(result){console.log(result)} )
      expect(marker.title.getAttribute('class')).toEqual(browser.driver.switchTo().activeElement().getAttribute('class'));
      marker.tab_click()
      expect(marker.annotation.getAttribute('class')).toEqual(browser.driver.switchTo().activeElement().getAttribute('class'));
      marker.tab_click()
      expect(marker.time.getAttribute('class')).toEqual(browser.driver.switchTo().activeElement().getAttribute('class'));
      marker.tab_click()
      expect(marker.done_button.getAttribute('class')).toEqual(browser.driver.switchTo().activeElement().getAttribute('class'));
      marker.tab_click()
      expect(browser.driver.switchTo().activeElement().getAttribute('class')).toContain("tiny alert delete");
      marker.tab_click()
      expect(marker.title.getAttribute('class')).toEqual(browser.driver.switchTo().activeElement().getAttribute('class'));
      marker.delete_button.click()
      expect(marker.markers.count()).toEqual(0)
    })
    xit("should edit makers", function() {
      expect(marker.markers.count()).toEqual(1)
      marker.marker(1).edit()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      marker.type_title("First Edit Marker")
      marker.type_annotation("First Edit Annotation Marker")
      marker.save_marker()
      expect(marker.marker(1).text).toContain("First Edit Marker")
    })
    xit("should delete makers", function() {
    
      expect(marker.markers.count()).toEqual(1)
      marker.marker(1).delete()
      expect(marker.markers.count()).toEqual(0)
    })
    xit("should add first maker by shortcut ", function() {
      expect(marker.markers.count()).toEqual(0)
      video.seek(55)
      video.current_time.then(function(result){expect(result).toEqual("0:02:37")} )
      marker.create_shortcut()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.annotation_video.isPresent()).toEqual(false);      
      marker.type_title("First Marker")
      marker.type_annotation("First Annotation Marker")
      expect(marker.annotation_video.isPresent()).toEqual(true);      
      marker.save_marker()
      expect(marker.markers.count()).toEqual(1)
      expect(marker.editor_panel.isPresent()).toEqual(false);
      expect(marker.annotation_video.isPresent()).toEqual(false);
    })
    xit("should add second maker", function() {
      expect(marker.markers.count()).toEqual(1)
      video.seek(57)
      video.current_time.then(function(result){expect(result).toEqual("0:02:43")} )
      marker.create_shortcut()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.annotation_video.isPresent()).toEqual(false);      
      marker.type_title("2nd Marker")
      marker.type_annotation("2nd Annotation Marker")
      expect(marker.annotation_video.isPresent()).toEqual(true);      
      marker.save_marker()
      expect(marker.editor_panel.isPresent()).toEqual(false);
      expect(marker.annotation_video.isPresent()).toEqual(false);
    })    
    xit("should add thrid marker", function() {
      video.seek(59)
      video.current_time.then(function(result){expect(result).toEqual("0:02:49")} )
      marker.create_shortcut()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.annotation_video.isPresent()).toEqual(false);      
      marker.type_title("3rd Marker")
      marker.type_annotation("3rd Annotation Marker")
      expect(marker.annotation_video.isPresent()).toEqual(true);      
      marker.save_marker()
      expect(marker.markers.count()).toEqual(3)
      expect(marker.editor_panel.isPresent()).toEqual(false);
      expect(marker.annotation_video.isPresent()).toEqual(false);
    })    
    // Showing/Closing markers 
    xit("should Showing/Closing markers", function() {
      marker.marker(1).edit()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.title.getText()).toContain("First Marker");
      expect(marker.annotation.getText()).toContain("First Annotation Marker");
      expect(marker.annotation_video.getText()).toContain("First Annotation Marker");
      marker.type_title("1st Edit Marker")
      marker.type_annotation("1st Edit Annotation Marker")
      video.current_time.then(function(result){expect(result).toEqual("0:02:37")} )
      expect(marker.annotation_video.isPresent()).toEqual(true);      
      marker.marker(2).edit()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.title.getText()).toContain("2nd Marker");
      expect(marker.annotation.getText()).toContain("2nd Annotation Marker");
      expect(marker.annotation_video.getText()).toContain("2nd Annotation Marker");
      video.current_time.then(function(result){expect(result).toEqual("0:02:43")} )
      expect(marker.annotation_video.isPresent()).toEqual(true);      
      marker.marker(3).edit()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.title.getText()).toContain("3rd Marker");
      expect(marker.annotation.getText()).toContain("3rd Annotation Marker");
      expect(marker.annotation_video.getText()).toContain("3rd Annotation Marker");
      video.current_time.then(function(result){expect(result).toEqual("0:02:49")} )
      expect(marker.annotation_video.isPresent()).toEqual(true);      
      marker.marker(1).edit()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.title.getText()).toContain("1st Edit Marker");
      expect(marker.annotation.getText()).toContain("1st Edit Annotation Marker");
      expect(marker.annotation_video.getText()).toContain("1st Edit Annotation Marker");
      marker.save_marker()
      marker.marker(3).delete()
      marker.marker(2).delete()
    })    
    // Markers with titles 
    // Markers without titles
    xit("should add empty maker by shortcut ", function() {
      video.seek(59)
      marker.create_empty_shortcut()
      expect(marker.markers.count()).toEqual(2)
      expect(marker.editor_panel.isPresent()).toEqual(false);
      expect(marker.annotation_video.isPresent()).toEqual(false);
      marker.marker(2).edit()
      marker.save_marker()
      expect(marker.editor_panel.isPresent()).toEqual(false);
      marker.marker(2).edit()
      marker.type_title(" Edit Marker")
      marker.type_annotation(" Edit Annotation Marker")
      marker.save_marker()
      expect(marker.editor_panel.isPresent()).toEqual(false);      
      marker.marker(2).edit()
      marker.type_empty_title()
      marker.type_empty_annotation()
      marker.save_marker()
      video.seek(64)
      marker.create()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.annotation_video.isPresent()).toEqual(false);      
      marker.type_title("Empty Annotation")
      marker.save_marker()
      expect(marker.markers.count()).toEqual(3)
      expect(marker.editor_panel.isPresent()).toEqual(false);
      expect(marker.annotation_video.isPresent()).toEqual(false);
      video.seek(69)
      marker.create()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.annotation_video.isPresent()).toEqual(false);      
      marker.type_annotation("Empty Annotation")
      marker.save_marker()
      expect(marker.markers.count()).toEqual(4)
      marker.create()
      expect(marker.editor_panel.isDisplayed()).toEqual(true);
      expect(marker.annotation_video.isPresent()).toEqual(false);      
      marker.type_title("First Marker")
      marker.type_annotation("First Annotation Marker")

    })

    // Markers shortcuts (enter/tab) 
    xit("should add empty maker by shortcut ", function() {
      video.seek(79)

    })    

    it("should logout", function() {
      header.logout()
    })
  })
})
