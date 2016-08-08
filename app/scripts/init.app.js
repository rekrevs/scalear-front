'use strict';

angular.module('scalearAngularApp')
  .run(['$http', '$rootScope', 'editableOptions', 'editableThemes', 'UserSession', '$state', 'ErrorHandler', '$timeout', '$window', '$log', '$translate', '$cookies', '$tour', 'Course', 'URLInformation','CourseModel', function($http, $rootScope, editableOptions, editableThemes, UserSession, $state, ErrorHandler, $timeout, $window, $log, $translate, $cookies, $tour, Course, URLInformation, CourseModel) {

    try{
    MathJax && MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [
          ['$', '$']
        ]
      },
      showProcessingMessages: false,
      showMathMenu: false
    });
  }
  catch(e){}

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
    var statesThatDontRequireAuth = ['login', 'teacher_signup', 'student_signup', 'thanks_for_registering', 'forgot_password', 'change_password', 'show_confirmation', 'new_confirmation', 'home', 'privacy', 'faq', 'about', 'ie', 'student_getting_started', 'teacher_getting_started', 'landing', 'signup']
    var statesThatForStudents = ['course.student_calendar', 'course.course_information', 'course.courseware']
    var statesThatForTeachers = ['new_course', 'course.course_editor', 'course.calendar', 'course.enrolled_students', 'send_email', 'send_emails', 'course.announcements', 'course.edit_course_information', 'course.teachers', 'course.progress', 'course.progress.main', 'course.progress.module', 'statistics', 'course.module.course_editor']
    var statesThatRequireNoAuth = ['login', 'student_signup', 'teacher_signup', 'thanks_for_registering', 'new_confirmation', 'forgot_password', 'change_password', 'show_confirmation']

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

    var showErrorMsg = function() {
      ErrorHandler.showMessage('Error ' + ': ' + $translate("error_message.you_are_not_authorized"), 'errorMessage', 4000, "error");
    }


    $window.onbeforeunload = function() {
      $rootScope.unload = true;
    }

    $rootScope.$on('$stateChangeStart', function(ev, to, toParams, from, fromParams) {
      if($tour.isActive()) {
        $tour.end();
      }
      URLInformation.history = $state.href(from, fromParams)
      UserSession.getCurrentUser().then(function(user) {
        var s = 1;
        if(/MSIE (\d+\.\d+);/.test($window.navigator.userAgent) && to.name !== "home") {
          $state.go("ie");
        }
        if($rootScope.current_user && $rootScope.current_user.info_complete === false) {
          $state.go('edit_account')
          s = 2;
        } else {
          if(toParams.course_id && $rootScope.current_user) {
            CourseModel.getCourseRole(toParams.course_id).then(function(role) {
              if((stateTeacher(to.name) && CourseModel.isStudent()) || (stateStudent(to.name) && CourseModel.isTeacher() )) { // student trying to access teacher page  // teacher trying to access student page
                $state.go("course_list");
                showErrorMsg()
              }
            })
          }
          if($rootScope.current_user && to.name === 'home') {
            $state.go("dashboard")
          } else if(!$rootScope.current_user && to.name === 'home') {
            $state.go("landing")
          }
          if(to.name === 'confirmed') {
            if(from.name === 'show_confirmation') {
              $state.go("confirmed")
            } else {
              $state.go("home");
              s = 0;
            }
          }
          if($rootScope.current_user && !$rootScope.current_user.intro_watched && to.name !== "edit_account") {
            $state.go('confirmed')
            s = 1;
          }
          if(!routeClean(to.name) && !user) { // user not logged in trying to access a page that needs authentication.
            $state.go("login");
            s = 0;
          }
          else if((to.name === "login" || to.name === "teacher_signup" || to.name === "student_signup") && user){ // teacher going to home, redirected to courses page
            $state.go("course_list");
          }
          else if(stateNoAuth(to.name)) {
            if(user) {
              $state.go("home");
              s = 0;
            }
          }
        }

        if(s === 0) {
          showErrorMsg()
          URLInformation.redirect = $state.href(to, toParams)
        }
        if(s === 2) {
          ErrorHandler.showMessage($translate("error_message.update_account_information"), 'errorMessage', 4000, "error");
        }
      })
    });

  }])
