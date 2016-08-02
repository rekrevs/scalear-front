'use strict';

angular.module('scalearAngularApp')
  .factory('Course', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/courses/:course_id/:action', { course_id: $stateParams.course_id, lang: $translate.uses() }, {
      'create': { method: 'POST', headers: headers, params: { course_id: null } },
      'index': { method: 'GET', headers: headers, params: { course_id: null } },
      'update': { method: 'PUT', headers: headers },
      'validateCourse': { method: 'PUT', params: { action: 'validate_course_angular' }, headers: headers },
      'send_email_through': { method: 'POST', params: { action: 'send_email_through' }, headers: headers },
      'send_batch_email_through': { method: 'POST', params: { action: 'send_batch_email_through' }, headers: headers },
      'removeStudent': { method: 'POST', params: { action: 'remove_student' }, headers: headers },
      'unenroll': { method: 'POST', params: { action: 'unenroll' }, headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'show': { method: 'GET', headers: headers },
      'saveTeacher': { method: 'POST', params: { action: 'save_teachers' }, headers: headers },
      'updateTeacher': { method: 'POST', params: { action: 'update_teacher' }, headers: headers },
      'updateStudentDueDateEmail': { method: 'POST', params: { action: 'update_student_duedate_email' }, headers: headers },
      'getStudentDueDateEmail': { method: 'GET', params: { action: 'get_student_duedate_email' }, headers: headers },
      'deleteTeacher': { method: 'DELETE', params: { action: 'delete_teacher' }, headers: headers },
      'getCalendarEvents': { method: 'GET', params: { action: 'events' }, headers: headers },
      'getAnnouncements': { method: 'GET', isArray: true, params: { action: 'announcements' }, headers: headers },
      'newCourse': { method: 'GET', headers: headers, params: { action: 'new', course_id: null } },
      'getCourse': { method: 'GET', params: { action: 'get_course_angular' }, headers: headers },
      'getCourseEditor': { method: 'GET', params: { action: 'course_editor_angular' }, headers: headers },
      'getGroupItems': { method: 'GET', params: { action: 'get_group_items' }, headers: headers },
      'getTeachers': { method: 'GET', params: { action: 'teachers' }, headers: headers },
      'enroll': { method: 'POST', params: { action: 'enroll_to_course', course_id: null }, headers: headers },
      'getModuleProgress': { method: 'GET', ignoreLoadingBar: true, params: { action: 'module_progress_angular' }, headers: headers },
      'getTotalChart': { method: 'GET', params: { action: 'get_total_chart_angular' }, headers: headers },
      'getCourseware': { method: 'GET', params: { action: 'courseware_angular' }, headers: headers },
      'getEnrolledStudents': { method: 'GET', params: { action: 'enrolled_students' }, headers: headers, isArray: true },
      'exportCsv': { method: 'GET', params: { action: 'export_csv' }, headers: headers },
      'exportStudentCsv': { method: 'GET', params: { action: 'export_student_csv' }, headers: headers },
      'courseCopy': { method: 'GET', params: { action: 'course_copy_angular', course_id: null }, headers: headers },
      'getAllTeachers': { method: 'GET', headers: headers, params: { action: 'get_all_teachers' } },
      'newCustomLink': { method: 'POST', params: { action: 'new_link_angular' }, headers: headers },
      'currentCourses': { method: 'GET', headers: headers, params: { action: 'current_courses' } },
      'exportModuleProgress': { method: 'GET', headers: headers, params: { action: 'export_modules_progress' } },
      'systemWideEmail': { method: 'POST', params: { action: 'send_system_announcement' }, headers: headers },
      'getRole': { method: 'GET', headers: headers, params: { action: 'get_role' } },
    });

  }]).factory('CourseModel', ['Course', '$rootScope', '$q', 'UserSession', '$cookieStore', 'ScalearUtils', 'ModuleModel', function(Course, $rootScope, $q, UserSession, $cookieStore, ScalearUtils, ModuleModel) {

    var course_role = null
    var course

    function getRole(id) {
      var deferred = $q.defer();
      var role = getCourseRole()
      if(!role) {
        Course.getRole({ course_id: id },
          function(resp) {
            setCourseRole(resp.role)
            deferred.resolve(resp.role)
          })
      } else {
        deferred.resolve(role)
      }
      return deferred.promise;
    }

    function getCourseRole() {
      return course_role
    }

    function setCourseRole(role) {
      course_role = role
    }

    function removeCourseRole() {
      course_role = null
    }

    function isStudent() {
      return course_role == 2 || course_role == 7
    }

    function isTeacher() {
      return course_role == 1
    }

    function init(course_id) {
      var deferred = $q.defer();
      UserSession.getUser().then(function(user) {
        if(user && user.roles) {
          getRole(course_id)
            .then(function(course_role) {
              if(course_role == 1) {
                getTeacherData(course_id)
                  .then(deferred.resolve)
              } else if(course_role == 2 || course_role == 7) {
                getStudentData(course_id)
                  .then(deferred.resolve)
              }
            })
        }
      })
      return deferred.promise
    }

    function getTeacherData(id) {
      var deferred = $q.defer();
      $cookieStore.remove('preview_as_student')
      $cookieStore.remove('old_user_id')
      $cookieStore.remove('new_user_id')
      $cookieStore.remove('course_id')
      Course.getCourseEditor({ course_id: id },
        function(data) {
          course = data.course
          ModuleModel.setModules(data.groups)
          // course.modules = data.groups
            // course.module_obj = {}
            // course.items_obj = { lecture: {}, quiz: {}, customlink: {} }
            // course.modules.forEach(function(module) {
            //   course.module_obj[module.id] = module
            //   module.items.forEach(function(item) {
            //     course.items_obj[item.class_name][item.id] = item
            //   })
            // })
          deferred.resolve(course);
        },
        function() {
          deferred.reject();
        }
      )
      return deferred.promise;
    }

    function getStudentData(id) {
      var deferred = $q.defer();
      Course.getCourseware({ course_id: id },
        function(data) {
          course = JSON.parse(data.course);
          course.next_item = data.next_item
          course.module_obj = ScalearUtils.toObjectById(course.groups)

          deferred.resolve($scope);
        },
        function() {
          deferred.reject();
        }
      )
      return deferred.promise;
    }

    function markDone(module_id, item_id) {
      var group_index = ScalearUtils.getIndexById(course.groups, module_id)
      var item_index = ScalearUtils.getIndexById(course.groups[group_index].items, item_id)
      if(item_index != -1 && group_index != -1)
        $rootScope.$broadcast("item_done", course.groups[group_index].items[item_index])
    }

    function getCourse() {
      return course
    }

    function removeCourse() {
      course = null
    }

    function update(c) {
      var modified_course = angular.copy(c);
      console.log(modified_course.time_zone);
      modified_course.time_zone = c.time_zone.name
      delete modified_course.id;
      delete modified_course.created_at;
      delete modified_course.updated_at;
      delete modified_course.unique_identifier;
      delete modified_course.duration;
      delete modified_course.guest_unique_identifier
      return Course.update(
        { course_id: course.id },
        { course: modified_course },
        function() {
          angular.extend(course, modified_course)
            // $scope.$emit('get_current_courses')
        }
      ).$promise
    }

    function validate(c) {
      return Course.validateCourse({ course_id: course.id }, c).$promise
    }

    function exportCourse() {
      return Course.exportCsv({ course_id: course.id }).$promise
    }

    function getTeachers() {
      return Course.getTeachers({ course_id: course.id }).$promise
    }

    function updateTeacher(teacher) {
      return Course.updateTeacher({ course_id: course.id }, teacher).$promise
    }

    function saveNewTeacher(teacher){
      return Course.saveTeacher(
        { course_id: course.id },
        { new_teacher: teacher }
      ).$promise
    }

    function deleteTeacher(teacher) {
      return Course.deleteTeacher({
        course_id: course.id,
        email: teacher.email
      }).$promise
    }

    return {
      getUserRole: getRole,
      getCourseRole: getCourseRole,
      removeCourseRole: removeCourseRole,
      removeCourse: removeCourse,
      getData: init,
      getCourse: getCourse,
      isStudent: isStudent,
      isTeacher: isTeacher,
      update: update,
      validate: validate,
      getTeachers: getTeachers,
      updateTeacher: updateTeacher,
      deleteTeacher: deleteTeacher,
      saveNewTeacher:saveNewTeacher,
      exportCourse:exportCourse
    }

  }])
