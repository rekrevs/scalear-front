var Header = require('./pages/header');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var SubHeader = require('./pages/sub_header')
var NewCourse = require('./pages/new_course');

var params = browser.params;

var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var course_list = new CourseList()
var new_course = new NewCourse();

describe("Teacher", function(){
    it('should create another course', function(){
        new_course.open()
        new_course.create("short_name", "course_name", "15", params.discussion_link, params.image_link, params.course_description, params.prerequisites);
    })
    it('should open first course', function(){
        course_list.open()
        course_list.open_course(1)
    })
    var navigator = new ContentNavigator(1)
    it("should copy first module",function(){
        navigator.module(1).open()
        course_editor.copy()
        sub_header.show_content_menu()
        expect(course_editor.paste_description).toEqual(navigator.module(1).name)
    })
    it('should open second course', function(){
        course_list.open()
        course_list.open_course(2)
    })

    it('should paste module', function(){
        course_editor.paste()
    })

    it('should check if the copied data is right', function(){
        expect(navigator.modules.count()).toEqual(1)
        var module = navigator.module(1)
        module.open()
        expect(module.items.count()).toEqual(6)
        expect(module.items.get(0).getText()).toContain("lecture1 video quizzes")
        expect(module.items.get(1).getText()).toContain("lecture2 text quizzes")
        expect(module.items.get(2).getText()).toContain("lecture3 video surveys")
        expect(module.items.get(3).getText()).toContain("quiz1")
        expect(module.items.get(4).getText()).toContain("quiz2")
        expect(module.items.get(5).getText()).toContain("survey1")
    })
    it('should open first course', function(){
        course_list.open()
        course_list.open_course(1)
    })
    it("should copy first lecture in second module",function(){
        navigator.module(2).open()
        navigator.module(2).open_item(1)
        course_editor.copy()
        sub_header.show_content_menu()
        expect(course_editor.paste_description).toEqual("lecture4 video quizzes")
    })
    it('should open second course', function(){
        course_list.open()
        course_list.open_course(2)
    })
    it('should paste lecture in new module', function(){
        course_editor.add_module();
        expect(navigator.modules.count()).toEqual(2)
        var module= navigator.module(2)
        module.open()
        expect(module.items.count()).toEqual(0)
        course_editor.paste()
        expect(module.items.count()).toEqual(1)
        expect(module.items.get(0).getText()).toContain("lecture4 video quizzes")
    })
    it('should paste same lecture in first module', function(){
        var module = navigator.module(1)
        module.open()
        expect(module.items.count()).toEqual(6)
        course_editor.paste()
        expect(module.items.count()).toEqual(7)
        expect(module.items.get(6).getText()).toContain("lecture4 video quizzes")
    })
    it('should open first course', function(){
        course_list.open()
        course_list.open_course(1)
    })
    it('should paste same lecture in first module', function(){
        var module = navigator.module(1)
        module.open()
        expect(module.items.count()).toEqual(6)
        course_editor.paste()
        expect(module.items.count()).toEqual(7)
        expect(module.items.get(6).getText()).toContain("lecture4 video quizzes")
    })
    it("should copy quiz in first module",function(){
        navigator.module(1).open()
        navigator.module(1).open_item(4)
        course_editor.copy()
        sub_header.show_content_menu()
        expect(course_editor.paste_description).toEqual("quiz1")
    })
    it("should past quiz in new module",function(){
        navigator.module(1).open()
        course_editor.add_module()
        expect(navigator.modules.count()).toEqual(3)
        expect(navigator.module(3).items.count()).toEqual(0)
        course_editor.paste()
        expect(navigator.module(3).items.count()).toEqual(1)
        expect(navigator.module(3).items.get(0).getText()).toEqual("quiz1")
    })
    it("should copy survey in second module",function(){
        navigator.module(2).open()
        navigator.module(2).open_item(6)
        course_editor.copy()
        sub_header.show_content_menu()
        expect(course_editor.paste_description).toEqual("survey2")
    })
    it('should open second course', function(){
        course_list.open()
        course_list.open_course(2)
    })
     it('should paste survey in second module', function(){
        var module= navigator.module(2)
        module.open()
        expect(module.items.count()).toEqual(1)
        course_editor.paste()
        expect(module.items.count()).toEqual(2)
        expect(module.items.get(1).getText()).toEqual("survey2")
    })
})

describe("Teacher", function(){
    it("should navigate to second course",function(){
        course_list.open()
        course_list.open_course(2)
    })
    var navigator = new ContentNavigator(1)
    it('should clear the course for deletion', function(){        
        var module = navigator.module(2)
        module.open()
        module.delete_item(2)
        expect(module.items.count()).toEqual(1)
        module.delete_item(1)
        expect(module.items.count()).toEqual(0)
        module.delete()
        expect(navigator.modules.count()).toEqual(1)

        var module = navigator.module(1)
        module.open()
        module.delete_item(7)
        expect(module.items.count()).toEqual(6)
        module.delete_item(6)
        expect(module.items.count()).toEqual(5)
        module.delete_item(5)
        expect(module.items.count()).toEqual(4)
        module.delete_item(4)
        expect(module.items.count()).toEqual(3)
        module.delete_item(3)
        expect(module.items.count()).toEqual(2)
        module.delete_item(2)
        expect(module.items.count()).toEqual(1)
        module.delete_item(1)
        expect(module.items.count()).toEqual(0)
        module.delete()
        expect(navigator.modules.count()).toEqual(0)    
    })

    it('should delete course', function(){
        course_list.open()
        course_list.delete_course(2)
        expect(course_list.courses.count()).toEqual(1)
    })
})

describe("Revert Changes - Teacher", function(){
    it("should navigate to first course",function(){
        course_list.open()
        course_list.open_course(1)
    })
    var navigator = new ContentNavigator(1)
    it('should removed copied itesm', function(){        
        var module = navigator.module(3)
        module.open()
        module.delete_item(1)
        expect(module.items.count()).toEqual(0)
        module.delete()

        var module = navigator.module(1)
        module.open()
        module.delete_item(7)
        expect(module.items.count()).toEqual(6)
    })
})