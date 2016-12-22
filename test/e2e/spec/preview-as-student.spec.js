var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var sleep = require('./lib/utils').sleep;
var Login = require('./pages/login');
var ContentItems = require('./pages/content_items');
var NewCourse = require('./pages/new_course');

var SubHeader = require('./pages/sub_header');

var params = browser.params;
var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var content_items= new ContentItems()
var navigator = new ContentNavigator(1)
var	new_course = new NewCourse();

var sub_header = new SubHeader()

describe("go to preview as student mode", function(){
    it('should sign in as teacher', function(){
        login_page.sign_in(params.teacher1.email, params.password)
    })
    it("should open course", function() {
      course_list.open()
      course_list.open_teacher_course(2)
    })
    it("should go to edit mode", function() {
      sub_header.open_edit_mode()
    })

    it('should create_course', function(){
      new_course.open()
      new_course.create(params.short_name, params.course_name, params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })


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

      module.open_content_items()
      content_items.add_quiz()
      course_editor.rename_item("quiz1")

      module.open_content_items()
      content_items.add_survey()
      course_editor.rename_item("survey1")

    })

    it("should add items to the second module", function() {
      var module = navigator.module(2)
      module.open()
      module.open_content_items()
      content_items.add_video()
      course_editor.rename_item("lecture4 video quizzes")
      course_editor.change_item_url(params.url1)
        // video.wait_till_ready()

    })


    describe('Should be in the same module', function(){
      it('Should be in Module 1 in Student privew', function(){
        // sub_header.open_edit_mode()
        navigator.module(1).open()
        element(by.className('orange')).click();

        browser.driver.wait(function() {
            return element(by.id("student-accordion")).isPresent().then(function(present){
              return present
            })
          });

        expect(element(by.className('currentmodule')).getAttribute('title')).toBe('module 1')

      })

      it('Should go to module 2 and Exit Student preview', function(){
        navigator.module(2).open()
        sleep(5000)
        element(by.linkText('Exit Student Preview')).click();

      })

      it('Should be in Module 1', function(){


        expect(element(by.className('currentmodule')).getText()).toContain('module 1')

        // expect(element(by.css('[is-open="true"]')).getText()).toContain('module 1')

      })


    })

    describe('Should be in the Same lecture', function(){
      it('should be in lecture 1 in student preview', function(){
        browser.refresh()
        navigator.module(1).open()
        navigator.module(1).item(1).open()
        element(by.className('orange')).click();

        browser.driver.wait(function() {
    	      return element(by.id("student-accordion")).isPresent().then(function(present){
              return present
            })
    	    });

        expect(element(by.className('currentitem')).getAttribute('title')).toContain('lecture1')

      })

      it('Should go to lecture 2 and exit stu preview', function(){
        navigator.module(1).item(2).open()
        sleep(5000)
        element(by.linkText('Exit Student Preview')).click();

      })

      it('Should be in Lecture 1', function(){
        expect(element(by.className('currentitem')).getText()).toContain('lecture1')
      })
    })

    describe('Should be in the same quiz', function(){
      it('should be in quiz 1 in student preview', function(){
        navigator.module(1).open()
        navigator.module(1).item(3).open()
        element(by.className('orange')).click();

        browser.driver.wait(function() {
    	      return element(by.tagName("button")).isPresent().then(function(present){
              return present
            })
    	    });

        expect(element(by.className('currentitem')).getAttribute('title')).toBe('quiz1')

      })

      it('Should go to lecture 2 and exit stu preview', function(){
        navigator.module(1).item(2).open()
        sleep(5000)
        element(by.linkText('Exit Student Preview')).click();

      })

      it('Should be in quiz 1', function(){
        expect(element(by.className('currentitem')).getText()).toContain('quiz1')
      })
    })

    describe('Should be in the same survey', function(){
      it('should be in survey 1 in student preview', function(){
        navigator.module(1).open()
        navigator.module(1).item(4).open()
        element(by.className('orange')).click();

        browser.driver.wait(function() {
            return element(by.tagName("button")).isPresent().then(function(present){
              return present
            })
          });

        expect(element(by.className('currentitem')).getAttribute('title')).toBe('survey1')

      })

      it('Should go to lecture 2 and exit stu preview', function(){
        navigator.module(1).item(2).open()
        sleep(5000)
        element(by.linkText('Exit Student Preview')).click();

      })

      it('Should be in quiz 1', function(){
        expect(element(by.className('currentitem')).getText()).toContain('survey1')
      })

    })

    it('should delete course', function(){
      course_list.open()
      course_list.delete_teacher_course(2)
      expect(course_list.teacher_courses.count()).toEqual(1)
    })
})
