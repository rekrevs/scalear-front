var Header = require('./pages/header');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseInformation = require('./pages/course_information');
var CourseList = require('./pages/course_list');
var SubHeader = require('./pages/sub_header')
var NewCourse = require('./pages/new_course');
var Login = require('./pages/login');
var ContentItems = require('./pages/content_items');
var sleep = require('./lib/utils').sleep;
var login_page = new Login()
var params = browser.params;


var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var course_info = new CourseInformation()
var course_list = new CourseList()
var new_course = new NewCourse();
var content_items = new ContentItems()
describe("Course Editor Copy", function(){
    it("should login as teacher",function(){
        login_page.sign_in(params.teacher1.email, params.password)
    })
    describe("Teacher", function(){
        it('should create another course', function(){
            new_course.open()
            new_course.create("short_name", "course_name",params.course_end_date, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
            new_course.disable_email_reminders_modal_button_click()
        })
        it('should open old course', function(){
            course_list.open()
            course_list.open_teacher_course(2)
        })
        it("should go to edit mode",function(){
            sub_header.open_edit_mode()
        })
        var navigator = new ContentNavigator(1)
        it("should copy first module",function(){
            navigator.module(1).open()
            navigator.module(1).copy()
        })

        it('should open new course', function(){
            course_list.open()
            course_list.open_teacher_course(1)
        })

        it('should paste module', function(){
            sub_header.open_edit_mode()
            navigator.paste()
        })

        it('should check if the copied data is right', function(){
            expect(navigator.modules.count()).toEqual(1)
            var module = navigator.module(1)
            module.open()
            expect(module.items.count()).toEqual(6)
            expect(module.item(1).name).toContain("lecture1 video quizzes")
            expect(module.item(2).name).toContain("lecture2 text quizzes")
            expect(module.item(3).name).toContain("lecture3 video surveys")
            expect(module.item(4).name).toContain("quiz1")
            expect(module.item(5).name).toContain("quiz2")
            expect(module.item(6).name).toContain("survey1")
        })
        it('should open old course', function(){
            course_list.open()
            course_list.open_teacher_course(2)
        })
        it("should copy first lecture in second module",function(){
            sub_header.open_edit_mode()
            navigator.module(2).open()
            navigator.module(2).item(1).copy()
        })
        it('should open new course', function(){
            course_list.open()
            course_list.open_teacher_course(1)
        })
        it('should paste lecture in new module', function(){
            sub_header.open_edit_mode()
            course_editor.add_module();
            expect(navigator.modules.count()).toEqual(2)
            var module= navigator.module(2)
            module.open()
            expect(module.items.count()).toEqual(0)
            module.paste()
            expect(module.items.count()).toEqual(1)
            expect(module.item(1).name).toContain("lecture4 video quizzes")
        })
        it('should paste same lecture in first module', function(){
            var module = navigator.module(1)
            module.open()
            expect(module.items.count()).toEqual(6)
            module.paste()
            expect(module.items.count()).toEqual(7)
            expect(module.items.get(6).getText()).toContain("lecture4 video quizzes")
        })
        it('should open old course', function(){
            course_list.open()
            course_list.open_teacher_course(2)
        })
        it('should paste same lecture in first module', function(){
            sub_header.open_edit_mode()
            var module = navigator.module(1)
            module.open()
            expect(module.items.count()).toEqual(6)
            module.paste()
            expect(module.items.count()).toEqual(7)
            expect(module.items.get(6).getText()).toContain("lecture4 video quizzes")
        })
        it("should copy quiz in first module",function(){
            navigator.module(1).item(4).copy()
        })
        it("should past quiz in new module",function(){
            navigator.add_module()
            expect(navigator.modules.count()).toEqual(3)
            var module = navigator.module(3)
            expect(module.items.count()).toEqual(0)
            module.paste()
            expect(module.items.count()).toEqual(1)
            expect(module.item(1).name).toContain("quiz1")
        })
        it("should copy survey in second module",function(){
            var module = navigator.module(2)
            module.open()
            module.item(6).copy()
        })
        it('should open new course', function(){
            course_list.open()
            course_list.open_teacher_course(1)
        })
         it('should paste survey in second module', function(){
            sub_header.open_edit_mode()
            var module= navigator.module(2)
            module.open()
            expect(module.items.count()).toEqual(1)
            module.paste()
            expect(module.items.count()).toEqual(2)
            expect(module.item(2).name).toEqual("survey2")
        })
    })
    // Copy/Past Links
    describe("Teacher",function(){
        var navigator = new ContentNavigator(1)
        var module = navigator.module(1)
        it("should navigate to new course",function(){
            course_list.open()
            course_list.open_teacher_course(1)
        })
        it("should go to edit mode",function(){
            sub_header.open_edit_mode()
        })
        it("should add link to the first module", function() {
            module.open()
            module.open_content_items()
            content_items.add_link()
            course_editor.rename_item("link_url")
            course_editor.change_item_url_link(params.link_url)          
        })
        it("should copy link in first module",function(){
            module.item(8).copy()            
            // navigator.module(1).item(8).copy()
        })
        it("should past link in same module",function(){
            expect(module.items.count()).toEqual(8)
            module.paste()
            expect(module.items.count()).toEqual(9)
            expect(module.items.get(8).getText()).toContain("link_url")
        })
        it("should past link in new module",function(){
            navigator.add_module()
            expect(navigator.modules.count()).toEqual(3)
            var module = navigator.module(3)
            expect(module.items.count()).toEqual(0)
            module.paste()
            expect(module.items.count()).toEqual(1)
            expect(module.item(1).name).toContain("link_url")
        })            
        it("should delete all links",function(){
            var module = navigator.module(1)
            module.open()
            expect(module.items.count()).toEqual(9)
            module.item(9).delete()
            module.item(8).delete()
            expect(module.items.count()).toEqual(7)
            var module = navigator.module(3)
            module.open()
            expect(module.items.count()).toEqual(1)
            module.item(1).delete()
            expect(module.items.count()).toEqual(0)
            module.delete()
        })            
    })
    describe("Teacher", function(){
        it("should navigate to new course",function(){
            course_list.open()
            course_list.open_teacher_course(1)
        })
        it("should go to edit mode",function(){
            sub_header.open_edit_mode()
        })
        var navigator = new ContentNavigator(1)
        it('should clear the course for deletion', function(){
            var module = navigator.module(2)
            module.open()
            module.item(2).delete()
            expect(module.items.count()).toEqual(1)
            module.item(1).delete()
            expect(module.items.count()).toEqual(0)
            module.delete()
            expect(navigator.modules.count()).toEqual(1)

            var module = navigator.module(1)
            module.open()
            module.item(7).delete()
            expect(module.items.count()).toEqual(6)
            module.item(6).delete()
            expect(module.items.count()).toEqual(5)
            module.item(5).delete()
            expect(module.items.count()).toEqual(4)
            module.item(4).delete()
            expect(module.items.count()).toEqual(3)
            module.item(3).delete()
            expect(module.items.count()).toEqual(2)
            module.item(2).delete()
            expect(module.items.count()).toEqual(1)
            module.item(1).delete()
            expect(module.items.count()).toEqual(0)
            module.delete()
            expect(navigator.modules.count()).toEqual(0)
        })

        it('should delete new course', function(){
            course_list.open()
            course_list.delete_teacher_course(1)
            expect(course_list.teacher_courses.count()).toEqual(1)
        })
    })

    describe("Revert Changes - Teacher", function(){
        it("should navigate to old course",function(){
            course_list.open()
            course_list.open_teacher_course(1)
        })
        var navigator = new ContentNavigator(1)
        it("should go to edit mode",function(){
            sub_header.open_edit_mode()
        })
        it('should removed copied itesm', function(){
            var module = navigator.module(3)
            module.open()
            module.item(1).delete()
            expect(module.items.count()).toEqual(0)
            module.delete()

            var module = navigator.module(1)
            module.open()
            module.item(7).delete()
            expect(module.items.count()).toEqual(6)
        })
    })
        it("should logout",function(){
            header.logout()
        })
})
