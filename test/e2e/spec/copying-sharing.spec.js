var locator = require('./lib/locators');
var o_c = require('./lib/openers_and_clickers');
var teacher = require('./lib/teacher_module');
var student = require('./lib/student_module')

var ptor = protractor.getInstance();
var params = ptor.params
ptor.driver.manage().window().maximize();



describe("teacher", function(){

    it('should sign in as teacher', function(){
        o_c.sign_in(ptor, params.teacher_mail, params.password, o_c.feedback);
    })

    it('should create_course', function(){
        teacher.create_course(ptor, params.short_name, params.course_name, params.course_duration, params.discussion_link, params.image_link, params.course_description, params.prerequisites, o_c.feedback);
    })

    it('should get the enrollment key and enroll student', function(){
        teacher.get_key_and_enroll(ptor);
    })
    //test
    it('should add a module and lectures', function(){
        o_c.open_course_whole(ptor);
        teacher.add_module(ptor, o_c.feedback);
        teacher.open_module(ptor, 1);
        teacher.add_lecture(ptor, 1, o_c.feedback);
        teacher.add_module(ptor, o_c.feedback);
        teacher.open_module(ptor, 2);
        teacher.add_lecture(ptor, 2, o_c.feedback);
    })

    //end test

    it('should delete course', function(){
        //should choose one of home() or home_teacher() 
        //depending on the current state(student or teacher)
        o_c.home(ptor);
        teacher.delete_course(ptor, o_c.feedback);
    })
})

/////////////////////////////////////////////////////////
//				test specific functions
/////////////////////////////////////////////////////////