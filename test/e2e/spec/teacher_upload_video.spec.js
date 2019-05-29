var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var CourseList = require('./pages/course_list');
var ShareModal = require('./pages/share_modal');
var SharedPage = require('./pages/shared_page');
var NewCourse = require('./pages/new_course');
var SubHeader = require('./pages/sub_header');
var sleep = require('./lib/utils').sleep;
var ContentItems = require('./pages/content_items');

var params = browser.params;

var header = new Header()
var sub_header = new SubHeader()
var login_page = new Login()
var course_editor = new CourseEditor()
var course_list = new CourseList()
var share_window = new ShareModal()
var shared = new SharedPage()
var new_course = new NewCourse()
var navigator = new ContentNavigator(1)
var content_items= new ContentItems()
var dropFile = require('./lib/drop-File')

describe("Sharing a module",function(){
    describe("Teacher1",function(){
        it("should login as teacher",function(){
            login_page.sign_in(params.teacher1.email, params.password)
        })
        it("should open course",function(){
            course_list.open()
            course_list.open_teacher_course(1)
        })
        it("should go to edit mode",function(){
            sub_header.open_edit_mode()
        })
        it('should open first module', function(){
            navigator.module(1).open()
        })
        it("should create a lecture",function(){
            module.open_content_items()
            content_items.add_video()
        })
        it("should  upload a video",function(){
            dropFile('#drop_zone')
        })
        it("should  create a quiz",function(){
 
        })
        it("should logout",function(){
            header.logout()
        })
    })
})