var Header = require('./pages/header');
var Login = require('./pages/login');
var CourseEditor = require('./pages/course_editor');
var ContentNavigator = require('./pages/content_navigator');
var UploadModal = require('./pages/upload_modal.js')
var TrimModal = require('./pages/trim_modal.js')
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
var upload = new UploadModal()
var trim = new TrimModal()
var content_items= new ContentItems()
var dropFile = require('./lib/drop-File')

describe("Upload a video",function(){
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
            var module = navigator.module(1)
            module.open_content_items()
            content_items.add_video()
        })
        it("should  upload a video",function(){
            dropFile($('#drop_zone'),'./test/e2e/spec/hello.mov')
            sleep(1000)
            upload.have_permission()
            sleep(3000)
            // browser.driver.manage().window().maximize();
            browser.driver.wait(function() { // console.log(browser.element(by.partialButtonText('Trim')).isPresent())
                return browser.element(by.partialButtonText('Trim')).isPresent()
            }, 300000)
            browser.driver.manage().window().maximize();
            trim.cancel_trim()
            sleep(300000)
        })
        it("should  create a quiz",function(){
 
        })
        it("should logout",function(){
            // header.logout()
        })
    })
})