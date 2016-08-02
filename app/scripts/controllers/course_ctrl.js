'use strict';

angular.module('scalearAngularApp')
  .controller('courseCtrl', ['$rootScope', '$stateParams', '$scope', 'Course', '$log', '$cookieStore', 'ScalearUtils', 'CourseData', '$state', 'ContentNavigator', '$window', 'MobileDetector','CourseModel', function($rootScope, $stateParams, $scope, Course, $log, $cookieStore, ScalearUtils, CourseData, $state, ContentNavigator, $window, MobileDetector, CourseModel) {
    // angular.extend($scope.$parent, CourseData)
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
            $state.go('course.course_information', { course_id: CourseData.course.id })
        }
      } else
        $state.go('course.edit_course_information', { course_id: CourseData.course.id })
    }
    $scope.$on('$destroy', function() {
      ContentNavigator.close()
      CourseModel.removeCourse()
      if(!$state.includes('**.course.**' ))
        CourseModel.removeCourseRole()
    });

  }])
  // .factory('courseResolver', ['$rootScope', '$stateParams', 'Course', '$log', '$cookieStore', 'ScalearUtils', '$q','CourseModel', function($rootScope, $stateParams, Course, $log, $cookieStore, ScalearUtils, $q, CourseModel) {
  //   var x = {
  //     init: function(id) {
  //       var deferred = $q.defer();
  //       var unwatch = $rootScope.$watch('current_user', function() {
  //         if($rootScope.current_user && $rootScope.current_user.roles) {
  //           unwatch()
  //           CourseModel.getUserRole(id).then(function(course_role){
  //             if(CourseModel.isTeacher()) {
  //               x.getTeacherData(id).then(function(data) {
  //                 deferred.resolve(data);
  //               })
  //             } else if(CourseModel.isStudent()) {
  //               x.getStudentData(id).then(function(data) {
  //                 deferred.resolve(data);
  //               })
  //             }
  //           })
  //         }
  //       });
  //       return deferred.promise
  //     },
  //     getTeacherData: function(id) {
  //       var deferred = $q.defer();
  //       var $scope = {}
  //       $cookieStore.remove('preview_as_student')
  //       $cookieStore.remove('old_user_id')
  //       $cookieStore.remove('new_user_id')
  //       $cookieStore.remove('course_id')
  //       Course.getCourseEditor({ course_id: id },
  //         function(data) {
  //           $scope.course = data.course
  //           $scope.course.modules = data.groups
  //           $scope.module_obj = {}
  //           $scope.items_obj = { lecture: {}, quiz: {}, customlink: {} }
  //           $scope.course.modules.forEach(function(module) {
  //             $scope.module_obj[module.id] = module
  //             module.items.forEach(function(item) {
  //               $scope.items_obj[item.class_name][item.id] = item
  //             })
  //           })
  //           deferred.resolve($scope);
  //         },
  //         function() {
  //           deferred.reject();
  //         }
  //       )
  //       return deferred.promise;
  //     },
  //     getStudentData: function(id) {
  //       var deferred = $q.defer();
  //       var $scope = {}
  //       Course.getCourseware({ course_id: id },
  //         function(data) {
  //           $scope.course = JSON.parse(data.course);
  //           $scope.next_item = data.next_item
  //           $scope.module_obj = ScalearUtils.toObjectById($scope.course.groups)
  //           $scope.course.markDone = function(module_id, item_id) {
  //             var group_index = ScalearUtils.getIndexById($scope.course.groups, module_id) //CourseEditor.getIndexById($scope.$parent.$parent.course.groups, data.done[1])
  //             var item_index = ScalearUtils.getIndexById($scope.course.groups[group_index].items, item_id) //CourseEditor.getIndexById($scope.$parent.$parent.course.groups[group_index].lectures, data.done[0])
  //             if(item_index != -1 && group_index != -1)
  //               $rootScope.$broadcast("item_done", $scope.course.groups[group_index].items[item_index])
  //           }
  //           deferred.resolve($scope);
  //         },
  //         function() {
  //           deferred.reject();
  //         }
  //       )
  //       return deferred.promise;
  //     }
  //   }
  //   return x
  // }])
