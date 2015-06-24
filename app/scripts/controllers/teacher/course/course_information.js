'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCourseInformationCtrl', ['$scope', '$stateParams', 'Course','$q', '$translate', '$log','$window','Page','scalear_utils','ContentNavigator', function ($scope, $stateParams, Course, $q, $translate, $log, $window,Page, scalear_utils, ContentNavigator) {

  $window.scrollTo(0, 0);
  $scope.in_delete = false;
  $scope.toggle_message = 'courses.remove_teacher'
  $scope.roles = [{value:3, text:'courses.professor'}, {value:4, text:'courses.ta'}];
  Page.setTitle('head.information')
  Page.startTour()
  ContentNavigator.close()
  $scope.timezones=scalear_utils.listTimezones()

  $scope.timezones.forEach(function(zone){
    if(zone.name == $scope.course.time_zone){
      $scope.course.time_zone = zone
      return
    }
  })  

  $scope.updateCourse = function(data,type){
    if(data && data instanceof Date){ 
          data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
          $scope.course[type] = data
    }
    var modified_course=angular.copy($scope.course);
    delete modified_course.id;
    delete modified_course.created_at;
    delete modified_course.updated_at;
    delete modified_course.unique_identifier;
    // delete modified_course.custom_links;
    delete modified_course.modules;
    delete modified_course.selected_module;

    $log.debug(modified_course);
    var timezone = angular.copy(modified_course.time_zone)
    modified_course.time_zone = timezone.name
    Course.update(
      {course_id:$stateParams.course_id},
      {course:modified_course},
      function(response){
        $scope.$emit('get_current_courses')
      }
    );
  }

	$scope.validateCourse = function(column,data) {
    var d = $q.defer();
    var course={}
    course[column]=data;
    Course.validateCourse({course_id:$stateParams.course_id},course,function(data){
      d.resolve()
    },function(data){
      if(data.status==422)
        d.resolve(data.data.errors.join());
      else
        d.reject('Server Error');
      }
    )
    return d.promise;
	};

  $scope.exportCourse = function(course){;
    Course.exportCsv(
      {course_id: $stateParams.course_id}, 
      function(){
        console.log("success");
      }
    )
  }

  $scope.url_with_protocol = function(url){
    if(url)
        return url.match(/^http/)? url: 'http://'+url;
    else
        return url;
  }

  //teachers part
  $scope.getTeachers = function(){
    Course.getTeachers({course_id:$stateParams.course_id},
      function(value){
           $scope.teachers = value.data;
           $scope.new_teacher = {};
       },
       function(value){}
    )
  }

  $scope.toggleDelete = function(){
    $scope.in_delete = !$scope.in_delete
    $scope.toggle_message = $scope.in_delete? 'events.done':'courses.remove_teacher'
  }

  $scope.addNewTeacher= function(){
    $scope.teacher_forum = true
  }

  $scope.updateTeacher = function(){
    Course.updateTeacher(
      {course_id:$stateParams.course_id},
      {
        email:$scope.teachers[index].email, 
        role_id:$scope.teachers[index].role
      }
    );
  }

  $scope.removeNewTeacher = function(){
    $scope.new_teacher = null
    $scope.teacher_forum = false
  }

  $scope.removeTeacher = function(index){
    Course.deleteTeacher(
      {
        course_id:$stateParams.course_id, 
        email:$scope.teachers[index].email
      }, {},
      function(value){
        $scope.teachers.splice(index, 1);
      },
      function(value) {}
    )
  }

  $scope.saveTeacher = function(){
    Course.saveTeacher(
      {course_id:$stateParams.course_id},
      {new_teacher:$scope.new_teacher},
        function(value) {
            $scope.getTeachers();
            $scope.teacher_forum = false
        },
        function(value) {
          console.log(value)
          $scope.new_teacher.errors=value.data.errors
        }
    )
  }

  $scope.animateCopy=function(){
     $('#enrollment_key').animate({ color: "#428bca" }, "fast").delay(400).animate({ color: "black" }, "fast");
  }
  $scope.getTeachers();

}]);
