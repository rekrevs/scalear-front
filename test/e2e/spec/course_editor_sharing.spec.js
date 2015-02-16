var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var ShareModal = require('./pages/share_modal');
var SharedPage = require('./pages/shared_page');
var NewCourse = require('./pages/new_course');
var sleep = require('./lib/utils').sleep;

var params = browser.params;

var header = new Header()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_list = new CourseList()
var share_window = new ShareModal()
var shared = new SharedPage()
var new_course = new NewCourse()
var navigator = new ContentNavigator(1)

describe("Sharing a module",function(){
    describe("Teacher1",function(){  
        it("should login as teacher",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })      
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it('should open second module', function(){
            navigator.module(2).open()
        })
        it("should share module with teacher2",function(){
            course_editor.open_share_window()
            expect(share_window.items.count()).toEqual(7)
            expect(share_window.checkboxes.count()).toEqual(7)
            share_window.checkboxes.each(function(checkbox){
                expect(checkbox.getAttribute('checked')).toBe('true')
            })
            share_window.type_teacher_email(params.teacher2_mail)
            share_window.share()
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher2",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher2_mail, params.password)
        })
        it('should create course', function(){
            new_course.open()
            new_course.create(params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites);
        })
        it('should reject shared data', function(){
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(1)
            header.reject_share_notification(1)
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(0)
        })
        it('should check if the in the same location', function(){
            expect(browser.driver.getCurrentUrl()).toContain('course_editor')
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher1",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it('should open first module', function(){
            navigator.module(1).open()
        })
        it("should share module with teacher2",function(){
            course_editor.open_share_window()
            expect(share_window.items.count()).toEqual(7)
            expect(share_window.checkboxes.count()).toEqual(7)
            share_window.checkboxes.each(function(checkbox){
                expect(checkbox.getAttribute('checked')).toBe('true')
            })
            share_window.type_teacher_email(params.teacher2_mail)
            share_window.share()
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher2",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher2_mail, params.password)
        })
        it('should accept shared data', function(){
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(1)
            header.accept_share_notification(1)
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(0)
        })
        it('should check that it redirected to share page', function(){
            expect(browser.driver.getCurrentUrl()).toContain('show_shared')
        })
        it('should check if the shared data is right', function(){
            expect(shared.modules.count()).toEqual(1)
            expect(shared.items.count()).toEqual(6)
        })
        it("should add data to course",function(){
            var shared_item = shared.module(1)
            expect(shared_item.add_button.isEnabled()).toBe(false)
            shared_item.select_course(1)
            expect(shared_item.add_button.isEnabled()).toBe(true)
            shared_item.add()
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it("should check course content with updated data",function(){
            expect(navigator.modules.count()).toEqual(1)
            var module = navigator.module(1)
            module.open()
            expect(module.items.count()).toEqual(6)
        })
        it("should logout",function(){
            header.logout()
        })
    })
})

describe("Sharing a non existing module",function(){
    describe("Teacher1",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it("should add two new modules",function(){
            course_editor.add_module()
            course_editor.add_lecture()
            navigator.module(3).open()
            course_editor.add_survey()
            navigator.module(3).open()
            course_editor.add_module()
            course_editor.add_lecture()
            navigator.module(4).open()
            course_editor.add_quiz()
        })
        it('should open third module', function(){
            navigator.module(3).open()
        })
        it("should share module with teacher2",function(){
            course_editor.open_share_window()
            expect(share_window.items.count()).toEqual(3)
            expect(share_window.checkboxes.count()).toEqual(3)
            share_window.checkboxes.each(function(checkbox){
                expect(checkbox.getAttribute('checked')).toBe('true')
            })
            share_window.type_teacher_email(params.teacher2_mail)
            share_window.share()
        })
        it('should open forth module', function(){
            navigator.module(4).open()
        })
        it("should share module with teacher2",function(){
            course_editor.open_share_window()
            expect(share_window.items.count()).toEqual(3)
            expect(share_window.checkboxes.count()).toEqual(3)
            share_window.checkboxes.each(function(checkbox){
                expect(checkbox.getAttribute('checked')).toBe('true')
            })
            share_window.type_teacher_email(params.teacher2_mail)
            share_window.share()
        })
        it("should delete forth module",function(){
            var module = navigator.module(4)
            module.delete_item(2)
            module.delete_item(1)
            module.delete()
        })

        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher2",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher2_mail, params.password)
        })
        it('should accept shared data', function(){
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(1)
            header.accept_share_notification(1)
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(0)
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher1",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it("should delete third module",function(){
            var module = navigator.module(3)
            module.open()
            module.delete_item(2)
            module.delete_item(1)
            module.delete()
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher2",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher2_mail, params.password)
        })
        it("should check that shared item doesn't exist",function(){
            header.show_courses_menu()
            expect(header.shared_button.isDisplayed()).toEqual(false)
        })
        it("should logout",function(){
            header.logout()
        })
    })
})
describe("Sharing single items",function(){
    describe("Teacher1",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it("should add a two new modules",function(){
            course_editor.add_module()
            course_editor.add_lecture()
            navigator.module(3).open()
            course_editor.add_survey()

            navigator.module(3).open()
            course_editor.add_module()
            course_editor.add_lecture()
            navigator.module(4).open()
            course_editor.add_quiz()
        })

        it('should open third module', function(){
            navigator.module(3).open()
            navigator.module(3).open_item(1)
        })
        it('should share item with teacher2', function(){
            course_editor.open_share_window()
            expect(share_window.items.count()).toEqual(3)
            expect(share_window.checkboxes.count()).toEqual(3)
            expect(share_window.checked(2)).toEqual('true')
            expect(share_window.checked(1)).toBe(null)
            expect(share_window.checked(3)).toBe(null)
            share_window.type_teacher_email(params.teacher2_mail)
            share_window.share()
        })
        it('should open forth module', function(){
            navigator.module(4).open()
            navigator.module(4).open_item(2)
        })
        it('should share item with teacher2', function(){
            course_editor.open_share_window()
            expect(share_window.items.count()).toEqual(3)
            expect(share_window.checkboxes.count()).toEqual(3)
            expect(share_window.checked(3)).toEqual('true')
            expect(share_window.checked(1)).toBe(null)
            expect(share_window.checked(2)).toBe(null)
            share_window.type_teacher_email(params.teacher2_mail)
            share_window.share()
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher2",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher2_mail, params.password)
        })
        it('should accept shared data', function(){
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(2)
            header.accept_share_notification(1)
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(1)
            header.accept_share_notification(1)
            header.show_notification()
            expect(header.share_notifications.count()).toEqual(0)
        })
        it('should check that it redirected to share page', function(){
            expect(browser.driver.getCurrentUrl()).toContain('show_shared')
        })
        it('should check if the shared data is right', function(){
            expect(shared.lectures.count()).toEqual(1)
            expect(shared.quizzes.count()).toEqual(1)
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it("should add a new module",function(){
            course_editor.add_module()
        })
        it('should open view shared', function(){
            header.open_shared()
        })
        it("should add data to course",function(){
            var shared_item = shared.lecture(1)
            expect(shared_item.add_button.isEnabled()).toBe(false)
            shared_item.select_course(1)
            shared_item.select_module(2)
            expect(shared_item.add_button.isEnabled()).toBe(true)
            shared_item.add()
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it('should open second module', function(){
            navigator.module(2).open()
            expect(navigator.module(2).items.count()).toEqual(1)
        })

        it('should open view shared', function(){
            header.open_shared()
        })
        it("should add data to course",function(){
            var shared_item = shared.quiz(1)
            expect(shared_item.add_button.isEnabled()).toBe(false)
            shared_item.select_course(1)
            shared_item.select_module(2)
            expect(shared_item.add_button.isEnabled()).toBe(true)
            shared_item.add()
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it('should open second module', function(){
            navigator.module(2).open()
            expect(navigator.module(2).items.count()).toEqual(2)
        })
    })
})
describe("Rollback changes",function(){
    describe("Teacher2",function(){
        it("should delete items and module",function(){
            var module = navigator.module(2)
            module.open()
            module.delete_item(2)
            module.delete_item(1)
            module.delete()

            var module = navigator.module(1)
            module.open()
            module.delete_item(6)
            module.delete_item(5)
            module.delete_item(4)
            module.delete_item(3)
            module.delete_item(2)
            module.delete_item(1)
            module.delete()
        })
        it("should delete course",function(){
            course_list.open()
            course_list.delete_course(1)
            expect(course_list.courses.count()).toEqual(0)
        })
        it("should logout",function(){
            header.logout()
        })
    })
    describe("Teacher1",function(){
        it("should login",function(){
            login_page.sign_in(params.teacher_mail, params.password)
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_course(1)
        })
        it("should delete items and module",function(){
            var module = navigator.module(4)
            module.open()
            module.delete_item(2)
            module.delete_item(1)
            module.delete()

            var module = navigator.module(3)
            module.open()
            module.delete_item(2)
            module.delete_item(1)
            module.delete()
        })
        it("should logout",function(){
            header.logout()
        })
    })
})