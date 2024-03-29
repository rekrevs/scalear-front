'use strict';

angular.module('scalearAngularApp')
  .run(['$http', '$rootScope', 'editableOptions', 'editableThemes', 'UserSession', '$state', 'ErrorHandler', '$timeout', '$window', '$log', '$translate', '$cookies', '$tour', 'Course', 'URLInformation', 'CourseModel', 'Token', '$location', function($http, $rootScope, editableOptions, editableThemes, UserSession, $state, ErrorHandler, $timeout, $window, $log, $translate, $cookies, $tour, Course, URLInformation, CourseModel, Token, $location) {

    try {
      MathJax && MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ['$', '$']
          ]
        },
        showProcessingMessages: false,
        showMathMenu: false
      });
    } catch(e) {}

    $http.defaults.headers.common['X-CSRF-Token'] = $cookies['XSRF-TOKEN']
    editableOptions.theme = 'default';
    editableThemes['default'].submitTpl = '<button class="button tiny with-tiny-padding with-medium-padding-right with-medium-padding-left no-margin-bottom size-1 success check" type="submit"><i class="fi-check"></i></button>';
    editableThemes['default'].cancelTpl = '<button class="button tiny with-tiny-padding with-medium-padding-right with-medium-padding-left no-margin-bottom size-1 alert cancel" type="button" ng-click="$form.$cancel()"><i class="fi-x"></i></button>';
    editableThemes['default'].errorTpl = '<small class="error with-tiny-padding position-relative" ng-show="$error" ng-bind="$error" style="z-index:90"></small>'
    $rootScope.textAngularOpts = {
      toolbar: [
        ['h1', 'h2', 'h3', 'p', 'pre', 'quote'],
        ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
        ['insertLink', 'unlink', 'insertImage']
      ],
      classes: {
        // focussed: "focussed",
        // toolbar: "btn-toolbar",
        toolbarGroup: "button-group tiny custom_button_group",
        toolbarButton: "button tiny secondary",
        // toolbarButtonActive: "active",
        textEditor: 'form-control',
        htmlEditor: 'form-control'
      }
    }

    $log.debug("lang is " + $rootScope.current_lang);
    var statesThatDontRequireAuth = ['login', 'teacher_signup', 'student_signup', 'thanks_for_registering', 'forgot_password', 'change_password', 'show_confirmation', 'new_confirmation', 'home', 'privacy', 'faq', 'about', 'ie', 'student_getting_started', 'teacher_getting_started', 'landing', 'signup','lti_course_list']
    var statesThatForStudents = ['course.student_calendar', 'course.course_information', 'course.module.courseware' , 'lti_course_list']
    var statesThatForTeachers = ['new_course', 'course.course_editor', 'course.calendar', 'course.enrolled_students', 'send_email', 'send_emails', 'course.announcements', 'course.edit_course_information', 'course.teachers', 'course.progress', 'course.progress.main', 'course.progress.module', 'statistics', 'course.module.course_editor','lti_course_list']
    var statesThatRequireNoAuth = ['login', 'student_signup', 'teacher_signup', 'thanks_for_registering', 'new_confirmation', 'forgot_password', 'change_password']

    //check if route requires no auth
    var stateNoAuth = function(state) {
      for(var element in statesThatRequireNoAuth) {
        var input = statesThatRequireNoAuth[element];
        if(state.substring(0, input.length) === input)
          return true;
      }
      return false;
    }

    // check if route does not require authentication
    var routeClean = function(state) {
      for(var element in statesThatDontRequireAuth) {
        var input = statesThatDontRequireAuth[element];
        if(state.substring(0, input.length) === input)
          return true
      }
      return false;
    }

    var stateStudent = function(state) {
      for(var element in statesThatForStudents) {
        var input = statesThatForStudents[element];
        if(state.substring(0, input.length) === input)
          return true
      }
      return false;
    }

    var stateTeacher = function(state) {
      for(var element in statesThatForTeachers) {
        var input = statesThatForTeachers[element];
        if(state.substring(0, input.length) === input)
          return true
      }
      return false;
    }

    var showErrorMsg = function(link) {
      ErrorHandler.showMessage('Error ' + ': ' + $translate.instant("error_message.you_are_not_authorized"), 'errorMessage', 4000, "error");
      URLInformation.setRedirectLink(link)
    }


    $window.onbeforeunload = function() {
      $rootScope.unload = true;
    }

    $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
      if($tour.isActive()) {
        $tour.end();
      }
      URLInformation.addToHistory($state.href(from, fromParams))

      // check if controller from lti_course_list && redirect_boolean == true 
      // if true then sign in user then and return a promsie to user.session  
      if( ( to.controller == "ltiSignInTokenCtrl" || to.controller == "ltiCourseListCtrl" ) &&  toParams['access-token'] ){
        Token.setTokenWithPromise(toParams)
          .then(function(){
            if( toParams['redirect_boolean'] == 'true'){
              ev.preventDefault();
              $location.url(toParams['redirect_local_url']);
            }
          })
          .catch(function(error) {
            $log.debug("Token error: " + error);
          })        
      }
      else{
        UserSession.getCurrentUser()
          .then(function(current_user) {
            if(/MSIE (\d+\.\d+);/.test($window.navigator.userAgent) && to.name !== "home") {
              $state.go("ie");
            }
            if(!current_user.info_complete) {
              $state.go('edit_account', {},{notify: false})
              ErrorHandler.showMessage($translate.instant("error_message.update_account_information"), 'errorMessage', 4000, "error");
            } else {
              if(toParams.course_id) {
                CourseModel.getCourseRole(toParams.course_id)
                  .then(function(role) {
                    if((stateTeacher(to.name) && CourseModel.isStudent()) || (stateStudent(to.name) && CourseModel.isTeacher())) { // student trying to access teacher page  // teacher trying to access student page
                      $state.go("course_list");
                      showErrorMsg($state.href(to, toParams))
                    }
                  })
              }
              if(to.name === 'home') {
                $state.go('course_list');
              }
              if(to.name === 'confirmed' && current_user.intro_watched) {
                  showErrorMsg($state.href(to, toParams))
              }
              else if( to.name !== 'confirmed' && !current_user.intro_watched && to.name !== "edit_account") {
                $state.go('confirmed')
              } else if((to.name === "login" || to.name === "teacher_signup" || to.name === "student_signup")) { // teacher going to home, redirected to courses page
                $state.go("course_list");
              } else if(stateNoAuth(to.name)) {
                $state.go("home");
                showErrorMsg($state.href(to, toParams))
              }
            }
          })
          .catch(function() {
            if(to.name === 'home') {
              $state.go("landing")
            }
            if(!routeClean(to.name)) { // user not logged in trying to access a page that needs authentication.
              $state.go("login");
              var url = $state.href(to, toParams)
              if(/courses\/enroll\?id=/.test(url)){
                URLInformation.setEnrollLink(url)
              }
              showErrorMsg(url)
            }
          })        
      }
    });

  }])
