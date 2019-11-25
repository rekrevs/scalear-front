'use strict';

angular.module('scalearAngularApp')
  .controller('indexCtrl', ['$scope', '$timeout', '$rootScope', '$translate', '$window', '$log', 'Page', '$cookieStore', 'ContentNavigator', 'scalear_api', 'MobileDetector', 'CourseModel', 'UserSession', function($scope, $timeout, $rootScope, $translate, $window, $log, Page, $cookieStore, ContentNavigator, scalear_api, MobileDetector, CourseModel, UserSession) {

    FastClick.attach(document.body);
    $scope.Page = Page;
    $rootScope.preview_as_student = $cookieStore.get('preview_as_student')
    $scope.ContentNavigator = ContentNavigator

    $scope.isTeacher = CourseModel.isTeacher
    $scope.isStudent = CourseModel.isStudent

    $scope.ContentNavigator.delayed_navigator_open = $scope.ContentNavigator.status

    $rootScope.is_mobile = MobileDetector.isMobile()
    $rootScope.is_ipad = MobileDetector.isiPad()
    $rootScope.is_iphone = MobileDetector.isiPhone()
    $rootScope.is_ios = $rootScope.is_iphone || $rootScope.is_ipad
    $rootScope.firstEdit = true
    $scope.$on('content_navigator_change', function(ev, status) {
      if(!status) {
        $scope.cancelDelay = $timeout(function() {
          $scope.ContentNavigator.delayed_navigator_open = false
        }, 300)
      } else {
        if($scope.cancelDelay)
          $timeout.cancel($scope.cancelDelay)
        $scope.ContentNavigator.delayed_navigator_open = true
      }
    })

    UserSession.getCurrentUser()
    .then(function (user) {
       getCurrentCourses()
    },function(error){
      //preview user is deleted from database
      if($rootScope.preview_as_student){
        $rootScope.preview_as_student = null;
        $cookieStore.remove('preview_as_student')
      }
    })

    $rootScope.$on("Course:get_current_courses", function() {
      getCurrentCourses();
    })

    function getCurrentCourses() {
      $scope.current_teacher_courses = null;
      $scope.current_student_courses = null;
      CourseModel.currentCourses()
        .then(function(data) {
          $scope.current_teacher_courses = data.teacher_courses
          $scope.current_student_courses = data.student_courses
        })
    }

    $scope.changeLanguage = function(key) {
      $translate.use(key);
      $rootScope.current_lang = key;
      $window.moment.locale(key);
    };

    $scope.changeLanguage($translate.use());

    //Google Analytics
    ga('create', scalear_api.ga_token);
    ga('send', 'pageview');

  }]);
