'use strict';

angular.module('scalearAngularApp')
  .factory('TeacherModel', ['Course','CourseModel' function(Course, CourseModel) {

    function getTeachers() {
      return Course.getTeachers({ course_id: CourseModel.getCourse().id }).$promise
    }

    function updateTeacher(teacher) {
      return Course.updateTeacher({ course_id: CourseModel.getCourse().id }, teacher).$promise
    }

    function saveNewTeacher(teacher) {
      return Course.saveTeacher({ course_id: CourseModel.getCourse().id }, { new_teacher: teacher }).$promise
    }

    function deleteTeacher(teacher) {
      return Course.deleteTeacher({
        course_id: CourseModel.getCourse().id,
        email: teacher.email
      }).$promise
    }

    return {
      getTeachers: getTeachers,
      updateTeacher: updateTeacher,
      deleteTeacher: deleteTeacher,
      saveNewTeacher: saveNewTeacher,
    }
  }])
