'use strict';

angular.module('scalearAngularApp')
  .controller('courseCtrl', ['$rootScope', '$stateParams', '$scope', 'Course', '$log', '$cookieStore', 'ScalearUtils', 'CourseData', '$state', 'ContentNavigator', '$window', 'MobileDetector', 'CourseModel', function($rootScope, $stateParams, $scope, Course, $log, $cookieStore, ScalearUtils, CourseData, $state, ContentNavigator, $window, MobileDetector, CourseModel) {

    if($state.includes("**.course")) {
      if(CourseModel.isStudent()) {
        if(MobileDetector.isPhone() && angular.element($window).width() < 700 /*ipad 768x1024 */ ) {
          $state.go('course.content_selector', { course_id: CourseData.id })
        } else {
          if(CourseData.next_item.module != -1) {
            var params = { 'module_id': CourseData.next_item.module }
            params[CourseData.next_item.item.class_name + '_id'] = CourseData.next_item.item.id
            $state.go('course.module.courseware.' + CourseData.next_item.item.class_name, params)
          } else
            $state.go('course.course_information', { course_id: CourseData.id })
        }
      } else
        $state.go('course.edit_course_information', { course_id: CourseData.id })
    }

    $scope.$on('$destroy', function() {
      ContentNavigator.close()
      if(!$state.includes('**.course.**')) {
        CourseModel.removeSelectedCourse()
        CourseModel.removeCourseRole()
      }
    });

  }])
