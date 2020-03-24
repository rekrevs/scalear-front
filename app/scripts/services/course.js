'use strict';

angular.module('scalearAngularApp')
  .factory('Course', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/courses/:course_id/:action', { course_id: $stateParams.course_id, lang: $translate.use() }, {
      'create': { method: 'POST', headers: headers, params: { course_id: null } },
      'index': { method: 'GET', ignoreLoadingBar: true,  headers: headers, params: { course_id: null } },
      'update': { method: 'PUT', headers: headers },
      'validateCourse': { method: 'PUT', params: { action: 'validate_course_angular' }, headers: headers },
      'send_batch_email_through': { method: 'POST', params: { action: 'send_batch_email_through' }, headers: headers },
      'removeStudent': { method: 'POST', params: { action: 'remove_student' }, headers: headers },
      'unenroll': { method: 'POST', params: { action: 'unenroll' }, headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'show': { method: 'GET', headers: headers },
      'saveTeacher': { method: 'POST', params: { action: 'save_teachers' }, headers: headers },
      'updateTeacher': { method: 'POST', params: { action: 'update_teacher' }, headers: headers },
      'updateStudentDueDateEmail': { method: 'POST', params: { action: 'update_student_duedate_email' }, headers: headers },
      'updateTeacherDiscussionEmail': { method: 'POST', params: { action: 'update_teacher_discussion_email' }, headers: headers },
      'getStudentDueDateEmail': { method: 'GET', params: { action: 'get_student_duedate_email' }, headers: headers },
      'deleteTeacher': { method: 'DELETE', params: { action: 'delete_teacher' }, headers: headers },
      'getCalendarEvents': { method: 'GET', params: { action: 'events' }, headers: headers }, 
      'getAnnouncements': { method: 'GET', isArray: true, params: { action: 'announcements' }, headers: headers },
      'newCourse': { method: 'GET', headers: headers, params: { action: 'new', course_id: null } },
      'getCourseEditor': { method: 'GET', params: { action: 'course_editor_angular' }, headers: headers },
      'getTeachers': { method: 'GET', params: { action: 'teachers' }, headers: headers },
      'getSelectedSubdomains': { method: 'GET', params: { action: 'get_selected_subdomains' }, headers: headers },
      'setSelectedSubdomains': { method: 'POST', params: { action: 'set_selected_subdomains' }, headers: headers },
      'enroll': { method: 'POST', params: { action: 'enroll_to_course', course_id: null }, headers: headers },
      'getModuleProgress': { method: 'GET', ignoreLoadingBar: true, params: { action: 'module_progress_angular' }, headers: headers },
      'getTotalChart': { method: 'GET', params: { action: 'get_total_chart_angular' }, headers: headers },
      'getCourseware': { method: 'GET', params: { action: 'courseware_angular' }, headers: headers },
      'getCurrentStudentGroups': { method: 'GET', params: { action: 'get_current_student_groups' }, headers: headers },
      'getEnrolledStudents': { method: 'GET', params: { action: 'enrolled_students' }, headers: headers, isArray: true },
      'exportCsv': { method: 'GET', params: { action: 'export_csv' }, headers: headers },
      'exportStudentCsv': { method: 'GET', params: { action: 'export_student_csv' }, headers: headers },
      'currentCourses': { method: 'GET',isArray: false, headers: headers, params: { action: 'current_courses' } },
      'exportModuleProgress': { method: 'GET', headers: headers, params: { action: 'export_modules_progress' } },
      'systemWideEmail': { method: 'POST', params: { action: 'send_system_announcement' }, headers: headers },
      'getRole': { method: 'GET', headers: headers, params: { action: 'get_role' } },
    });

  }]).factory('CourseModel', ['Course', '$rootScope', '$q', 'UserSession', '$cookieStore', 'ScalearUtils', function(Course, $rootScope, $q, UserSession, $cookieStore, ScalearUtils) {

    var course_role;
    var selected_course;
    var deferred_role = null



    function getCourseRole(id) {
      if(!deferred_role) {
        deferred_role = $q.defer();
        Course.getRole({ course_id: id })
          .$promise
          .then(function(resp) {
            setCourseRole(resp.role)
            deferred_role.resolve(resp.role)
          })
          .catch(function() {
            removeCourseRole()
          })
      }
      return deferred_role.promise;
    }

    function currentCourses() {
      return Course.currentCourses({}).$promise
    }

    function setCourseRole(role) {
      course_role = role
    }

    function removeCourseRole() {
      deferred_role = null
      course_role = null
    }

    function isStudent() {
      return course_role == 2 || course_role == 7
    }

    function isTeacher() {
      return course_role == 1
    }

    function init(course_id) {
      return UserSession.getCurrentUser()
        .then(function(user) {
          if(user && user.roles) {
            removeCourseRole()
            return getCourseRole(course_id)
          }
        }).then(function(course_role) {
          if(isTeacher()) {
            return getTeacherData(course_id)
          } else if(isStudent()) {
            return getStudentData(course_id)
          }
        })
        .then(function(course_data) {
          var course = createInstance(course_data)
          setCourse(course)
          $rootScope.$broadcast("Course:ready", course)
          return course
        })
    }

    function getTeacherData(id) {
      $cookieStore.remove('preview_as_student')
      $cookieStore.remove('old_user_id')
      $cookieStore.remove('new_user_id')
      $cookieStore.remove('course_id')
      return Course.getCourseEditor({ course_id: id })
        .$promise
        .then(function(data) {
          $rootScope.$broadcast("Course:set_modules", data.groups)
          return data.course;
        })
    }

    function getStudentData(id) {

      function getGroups(){
        return Course.getCurrentStudentGroups({ first_half: true })
        .$promise
        .then(function(data) {
          // data.course.next_item = data.next_item
          // console.log('data.next_item',data.next_item)
          console.log(data)
          $rootScope.$broadcast("Course:set_modules", data.groups)
          return data.groups;
        })
      }
    
      return Course.getCourseware({ course_id: id })
      .$promise
      .then(function(data) {
        // data.course = JSON.parse(data.course);
        var var_data_groups = getGroups()
        var data_course = data.course
        console.log("var_data_groups:",var_data_groups)
        console.log("data_course",data_course)
        return data_course;
      })
      

    }

    function setCourse(course_data) {
      selected_course = course_data
    }

    function getSelectedCourse() {
      return selected_course
    }

    function removeSelectedCourse() {
      selected_course = null
    }

    function getUserOtherCourses() {
      return Course.newCourse().$promise
    }

    function create(course, import_from_id) {
      var subdomains = course.selected_subdomain
      var email_discussion = course.email_discussion
      delete course.selected_subdomain
      delete course.email_discussion
      var modified_course = angular.copy(course)
      var d = new Date()
      modified_course.start_date.setMinutes(modified_course.start_date.getMinutes() - d.getTimezoneOffset());
      modified_course.time_zone = course.time_zone.name;
      return Course.create({ course: modified_course, "import": import_from_id , "subdomains":subdomains , "email_discussion":email_discussion })
        .$promise
        .then(function(data) {
          $rootScope.$broadcast('Course:get_current_courses')
          return data
        })
    }

    function isInstance(instance) {
      return(instance.instanceType && instance.instanceType() == "Course");
    }

    function createInstance(course) {
      if(isInstance(course)) {
        return course
      }

      function instanceType() {
        return 'Course'
      }

      function update() {
        var modified_course = angular.copy(course);
        modified_course.time_zone = course.time_zone.name
        delete modified_course.id;
        delete modified_course.created_at;
        delete modified_course.updated_at;
        delete modified_course.unique_identifier;
        delete modified_course.duration;
        delete modified_course.guest_unique_identifier

        return Course.update({ course_id: course.id }, { course: modified_course })
          .$promise
      }

      function validate() {
        return Course.validateCourse({ course_id: course.id }, course)
          .$promise
          .catch(function(resp) {
            if(resp.status == 422)
              return resp.data.errors.join();
            else
              return 'Server Error';
          })
      }

      function exportCourse() {
        return Course.exportCsv({ course_id: course.id })
          .$promise
      }

      function getAnnouncements() {
        return Course.getAnnouncements({ course_id: course.id })
          .$promise
      }

      function getStudentDueDateEmail() {
        return Course.getStudentDueDateEmail({ course_id: course.id })
          .$promise
      }

      function updateStudentDueDateEmail(val) {
        Course.updateStudentDueDateEmail({ course_id: course.id }, { email_due_date: val });
      }

      function updateTeacherDiscussionEmail(val) {
        Course.updateTeacherDiscussionEmail({ course_id: course.id }, { email_discussion: val });
      }

      return angular.extend(course, {
        instanceType: instanceType,
        update: update,
        validate: validate,
        exportCourse: exportCourse,
        getAnnouncements: getAnnouncements,
        getStudentDueDateEmail: getStudentDueDateEmail,
        updateStudentDueDateEmail: updateStudentDueDateEmail,
        updateTeacherDiscussionEmail: updateTeacherDiscussionEmail
      })
    }

    return {
      getCourseRole: getCourseRole,
      removeCourseRole: removeCourseRole,
      removeSelectedCourse: removeSelectedCourse,
      getData: init,
      getSelectedCourse: getSelectedCourse,
      isStudent: isStudent,
      isTeacher: isTeacher,
      createInstance: createInstance,
      isInstance: isInstance,
      currentCourses: currentCourses,
      getUserOtherCourses: getUserOtherCourses,
      create: create
    }

  }])
