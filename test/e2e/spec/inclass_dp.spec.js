var ContentNavigator = require('./pages/content_navigator');
var CourseEditor = require('./pages/course_editor');
var CourseList = require('./pages/course_list');
var InvideoQuiz = require('./pages/invideo_quiz');
var NormalQuiz = require('./pages/normal_quiz');
var Video = require('./pages/video');
var utils = require('./lib/utils');
var sleep = require('./lib/utils').sleep;
var Login = require('./pages/login');
var Header = require('./pages/header');
var SubHeader = require('./pages/sub_header');
var ContentItems = require('./pages/content_items');
// var StudentDistancePeer = require('./pages/student/inclass_dp');
var StudentDP = require('./pages/student/inclass_dp');
var StudentLecture = require('./pages/student/lecture');
var InclassReviewModel = require('./pages/teacher/inclass_review_model');
var scroll_top = require('./lib/utils').scroll_top;

var params = browser.params;
var header = new Header()
var sub_header = new SubHeader()
var course_editor = new CourseEditor()
var login_page = new Login()
var course_list = new CourseList()
var video = new Video();
var invideo_quiz = new InvideoQuiz();
var quiz = new NormalQuiz();
var content_items = new ContentItems()
var navigator = new ContentNavigator(1)
// var student_page = new StudentDistancePeer()
var review_model = new InclassReviewModel
var student_dp = new StudentDP()
var student_lec = new StudentLecture()

var d_q3_y = 190;
var student_browser;
var student2_browser;
var module_count;
describe("PI Inclass", function() {
student_browser = browser
student2_browser = utils.new_session()

                          // ////////////////////////////////////////////////////////////////////////////////////////

                          // Part 1
                            // Student 1 invite student 2 and cancel
                            // Student 1 invite student 2 and student 2 refuse 
                            // Student 1 invite student 2 also invite student 1 and both begin distance peer session

                          // Part 2
                            // student 1 try to seek forward and is prevented 
                            // Student 1 finish video state and waiting student 2
                            // Student 2 finish video state and both go intro video

                          // Part 3
                            // student 1 refresh the page and seek to intro state 
                            // Student 1 & 2 finsih intro state go to self quiz state

                          // Part 4
                            // student 1 refresh the page and self quiz state 
                            // student 1 try to play and is prevented
                            // student 1 try to check answer without solving and is prevented                             
                            // Student 1 & 2 finsih self quiz state go to group quiz state

                          // Part 5
                            // Student 1 & 2 finsih group quiz state go to end state

                          // Part 6
                            // Student 1 & 2 finsih end state go to intro state

                          // Part 7
                            // student 1 end session 
                            // DP session is ended for student 2

                          // ////////////////////////////////////////////////////////////////////////////////////////




  describe('Sign In', function(){  
    describe('Student 1', function(){
      it("should go to lecture",function(){
        utils.switch_browser(student_browser)
        login_page.sign_in(params.student1.email, params.password)
        course_list.open()
        course_list.open_student_course(1)
      })
      xit('should open first lecture in first module', function(){
        course_list.open()
        course_list.open_student_course(1)
          navigator.open()
          navigator.modules.count().then(function(count) { 
            navigator.module(count).open()
            navigator.module(count).item(1).open()
          }) 
      })
    })
    describe('Student 2 ', function(){
      it("should go to student mode",function(){
        utils.switch_browser(student2_browser)
        login_page.sign_in(params.student2.email, params.password)
        course_list.open()
        course_list.open_student_course(1)
      })
      xit('should open first lecture in first module', function(){
        navigator.open()
        navigator.modules.count().then(function(count) { 
          navigator.module(count).open() 
          navigator.module(count).item(1).open()
        }) 
      })
    })
  })

// Part 1
  // Student 1 invite student 2 and cancel  
  // Student 1 invite student 2 and student 2 refuse (lesa)
  // Student 1 invite student 2 also invite student 1 and both begin distance peer session
  describe('Invitation', function(){  
    describe('Student 1', function(){
      it("should invite student 2",function(){
        utils.switch_browser(student_browser)
        student_dp.wait_modal()
        expect(student_dp.modal_student(1).getText()).toContain(params.student2.email)
        expect(student_dp.modal_student(1).getText()).toContain(params.student2.email)
        expect(student_dp.modal_invite_email(1).getText()).toContain(params.student2.email)
        student_dp.modal_invite_email(1).click()
        // student_dp.modal_student(1).click()
        // student_dp.modal_invite_student(0)
        expect(student_dp.modal.getText()).toContain("Wait For Acceptance")
      })
    })
    describe('Student 2 ', function(){
      it("should check student 1 invitation",function(){
        utils.switch_browser(student2_browser)
        browser.refresh()
        student_dp.wait_modal()
        expect(student_dp.modal.getText()).toContain("You are invited by")
      })
    })
    describe('Student 1', function(){
      it("should cancel invitation to student 2",function(){
        utils.switch_browser(student_browser)
        student_dp.modal_invite_another_wait_for_acceptance()
      })
    })
    describe('Student 2 ', function(){
      it("should accpet student 1 invitation and website show invitation is cancelled",function(){
        utils.switch_browser(student2_browser)
        student_dp.wait_modal()
        expect(student_dp.modal.getText()).toContain("You are invited by")
        student_dp.modal_accept_invitation()
        sleep(5000)
        expect(student_dp.modal.getText()).toContain(" cancelled the invitation")
      })
    })
    describe('Student 1', function(){
      it("should invite student 2",function(){
        utils.switch_browser(student_browser)
        expect(student_dp.modal_student(1).getText()).toContain(params.student2.email)
        // student_dp.modal_invite_student(1)
        student_dp.modal_invite_email(1).click()
        expect(student_dp.modal.getText()).toContain("Wait For Acceptance")
      })
    })
    describe('Student 2 ', function(){
      it("should accpet student 1 invitation and website show invitation is cancelled",function(){
        utils.switch_browser(student2_browser)
        browser.refresh()
        student_dp.wait_modal()
        expect(student_dp.modal.getText()).toContain("You are invited by")
        student_dp.modal_accept_invitation()
      })
    })    
  })

// Part 2
  // student 1 try to seek forward and is prevented 
  // Student 1 finish video state and waiting student 2
  // Student 2 finish video state and both go intro video
  describe('Video State', function(){  
    describe('Student 1', function(){
      it("should check distance state panel & end peer instruction button are shown",function(){
        utils.switch_browser(student_browser)
        // video.wait_till_ready()
        sleep(5000)
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Please watch the video")
      })
      it("should try to seek forward and to be prevented",function(){
        video.seek(99)
        sleep(1000)
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Please do not skip ahead of your partner.")
      })
      it("should play video and watch video state",function(){
        video.play()
        student_dp.wait_state_to_finished()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Waiting for your partner to finish watching the video.")
        // video.seek(8)
      })
      it("should try and to be prevented",function(){
        video.play()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Waiting for your partner to finish watching the video.")
      })
    })
    describe('Student 2 ', function(){
      it("should play video and watch video state",function(){
        utils.switch_browser(student2_browser)
        video.wait_till_ready()
        video.seek(3)
        video.play()
        student_dp.wait_state_to_finished()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Waiting for your partner to finish watching the video.")
      })
    })
  })


// Part 3
  // student 1 refresh the page and intro state 
  // Student 1 & 2 finsih intro state go to self quiz state
  describe('Quiz:Intro State', function(){  
    describe('Student 1', function(){
      it("should be able to begin quiz intro state ",function(){
        utils.switch_browser(student_browser)
        sleep(7000)
        // student_dp.wait_state_to_finished()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Press play to watch the introduction to the question.")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Intro")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(false);
      })
    })
    describe('Student 2', function(){
      it("should be able to begin quiz intro state ",function(){
        utils.switch_browser(student2_browser)
        // sleep(7000)
        // student_dp.wait_state_to_finished()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Press play to watch the introduction to the question.")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Intro")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(false);
      })
    })
    describe('Student 1', function(){
      it("should refresh page and seek after video state(start time of quiz)",function(){
        utils.switch_browser(student_browser)
        browser.refresh()
        video.wait_till_ready()
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Intro")
        video.seek(8)
        video.play()
        student_dp.wait_state_to_finished()
      })      
    })
    describe('Student 2 ', function(){
      it("should play video and watch intro state",function(){
        utils.switch_browser(student2_browser)
        // video.wait_till_ready()
        video.seek(8)
        video.play()
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(false);
        student_dp.wait_state_to_finished()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Waiting for your partner to finish watching the introduction.")
      })
    })    
  })

// Part 4
  // student 1 refresh the page and self quiz state 
  // student 1 try to play and is prevented
  // student 1 try to check answer without solving and is prevented                             
  // Student 1 & 2 finsih self quiz state go to group quiz state

  describe('Quiz:self State', function(){  
    describe('Student 1', function(){
      it("should be able to begin quiz self state ",function(){
        utils.switch_browser(student_browser)
        sleep(7000)
        // expect(student_dp.annotation.isDisplayed()).toEqual(true);
        // expect(student_dp.annotation.getText()).toContain("finished this status, you can resume")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Self")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(true);
      })
    })
    describe('Student 2', function(){
      it("should be able to begin quiz Self state ",function(){
        utils.switch_browser(student2_browser)
        // expect(student_dp.annotation.isDisplayed()).toEqual(true);
        // expect(student_dp.annotation.getText()).toContain("finished this status, you can resume")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Self")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(true);
      })
    })
    describe('Student 1', function(){
      it("should refresh page and seek after video state(start time of quiz)",function(){
        utils.switch_browser(student_browser)
        browser.refresh()
        video.wait_till_ready()
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Intro")
        video.current_time.then(function(result){expect(result).toEqual("0:00:28")} )
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(true);
        expect(video.is_paused()).toEqual(true);
      })
      it("should try to play video and prevented",function(){
        video.play()
        expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
      it("should try to check quiz without solving  and prevented",function(){
        student_lec.check_answer()
        expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
      it("should answer quiz",function(){
        student_lec.mark_answer(1)
        student_lec.mark_answer(3)
        student_lec.check_answer()
        // expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
    })
    describe('Student 2', function(){
      it("should answer quiz",function(){
        utils.switch_browser(student2_browser)
        student_lec.mark_answer(1)
        student_lec.mark_answer(3)
        student_lec.check_answer()
        // expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
    })
  })

// Part 5
  // Student 1 & 2 finsih group quiz state go to end state


  describe('Quiz:group State', function(){  
    describe('Student 1', function(){
      it("should be able to begin quiz group state ",function(){
        utils.switch_browser(student_browser)
        sleep(7000)
        // expect(student_dp.annotation.isDisplayed()).toEqual(true);
        // expect(student_dp.annotation.getText()).toContain("finished this status, you can resume")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Group")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(true);
      })
    })
    describe('Student 2', function(){
      it("should be able to begin quiz Group state ",function(){
        utils.switch_browser(student2_browser)
        // expect(student_dp.annotation.isDisplayed()).toEqual(true);
        // expect(student_dp.annotation.getText()).toContain("finished this status, you can resume")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Group")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(true);
      })
    })
    describe('Student 1', function(){
      it("should refresh page and seek after video state(start time of quiz)",function(){
        utils.switch_browser(student_browser)
        browser.refresh()
        video.wait_till_ready()
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:Intro")
        video.current_time.then(function(result){expect(result).toEqual("0:00:28")} )
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(true);
        expect(video.is_paused()).toEqual(true);
      })
      it("should try to play video and prevented",function(){
        video.play()
        expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
      it("should try to check quiz without solving  and prevented",function(){
        student_lec.check_answer()
        expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
      it("should answer quiz",function(){
        student_lec.mark_answer(1)
        student_lec.mark_answer(3)
        student_lec.check_answer()
        // expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
    })
    describe('Student 2', function(){
      it("should answer quiz",function(){
        utils.switch_browser(student2_browser)
        student_lec.mark_answer(1)
        student_lec.mark_answer(3)
        student_lec.check_answer()
        // expect(student_lec.notification).toContain("Please choose the correct answer(s)")
        expect(video.is_paused()).toEqual(true);
      })
    })
  })

// Part 6
  // Student 1 & 2 finsih end state go to intro state


  describe('Quiz:End State', function(){  
    describe('Student 1', function(){
      it("should be able to begin quiz End state ",function(){
        utils.switch_browser(student_browser)
        sleep(7000)
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Please watch the teacher's explanation of the answer.")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:End")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(false);
        video.play()
      })
    })
    describe('Student 2', function(){
      it("should be able to begin quiz End state ",function(){
        utils.switch_browser(student2_browser)
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Please watch the teacher's explanation of the answer.")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Quiz:End")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(false);
        video.play()
      })
    })
    describe('Student 1', function(){
      it("should play the video",function(){
        utils.switch_browser(student_browser)
        student_dp.wait_state_to_finished()
      })      
    })
    describe('Student 2 ', function(){
      it("should play the video",function(){
        utils.switch_browser(student_browser)
        student_dp.wait_state_to_finished()
      })      
    })    
  })

  // Part 7
    // student 1 & 2 are in the intro state
    // student 1 end session 
    // DP session is ended for student 2
  describe('Quiz:Intro State', function(){  
    describe('Student 1', function(){
      it("should be able to begin video state ",function(){
        utils.switch_browser(student_browser)
        sleep(7000)
        // student_dp.wait_state_to_finished()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Please watch the video to get to the peer instruction questions.")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Please watch the video")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(false);
      })
    })
    describe('Student 2', function(){
      it("should be able to begin video state ",function(){
        utils.switch_browser(student2_browser)
        // sleep(7000)
        // student_dp.wait_state_to_finished()
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("Please watch the video to get to the peer instruction questions.")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(true);
        expect(student_dp.distance_peer_panel.getText()).toContain("Please watch the video")
        expect(student_dp.stage_timer_distance_peer.isDisplayed()).toEqual(false);
      })
    })
    describe('Student 1', function(){
      it("should end distance peer ",function(){
        utils.switch_browser(student_browser)
        student_dp.end_distance_peer_click()
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(false);        
      })
      it("should logout", function() {
        header.logout()
      })      
    })
    describe('Student 2', function(){
      it("should wait to distance peer session to be ended",function(){
        utils.switch_browser(student2_browser)
        sleep(25000)
        expect(student_dp.annotation.isDisplayed()).toEqual(true);
        expect(student_dp.annotation.getText()).toContain("ended the distance peer session")
        expect(student_dp.distance_peer_panel.isDisplayed()).toEqual(false);        
      })
      it("should logout", function() {
        header.logout()
      })
    })
  })
  describe('Teacher ', function(){
    it("should go to lecture",function(){
      utils.switch_browser(student_browser)
      login_page.sign_in(params.teacher1.email, params.password)
      course_list.open()
      course_list.open_teacher_course(1)
    })
    it("should delete items in first module and module itself",function(){
      sub_header.open_edit_mode()
      navigator.modules.count().then(function(count) {
        module_count = count
        var module = navigator.module(module_count)
        module.open()
        expect(module.items.count()).toEqual(1)
        module.item(1).delete()
        expect(module.items.count()).toEqual(0)
        module.delete()
        expect(navigator.modules.count()).toEqual(0)
      })
    })
    it("should logout", function() {
      course_list.open()
      header.logout()
    })
  })
})
