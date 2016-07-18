'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCourseInformationCtrl', ['$scope', '$stateParams', 'Course','$q', '$translate', '$log','$window','Page','scalear_utils','ContentNavigator','$rootScope','ErrorHandler','$interval','$location', function ($scope, $stateParams, Course, $q, $translate, $log, $window,Page, scalear_utils, ContentNavigator,$rootScope,ErrorHandler,$interval,$location) {

  $window.scrollTo(0, 0);
  $scope.in_delete = false;
  $scope.toggle_message = 'courses.information.button.remove_teacher'
  $scope.formData = {};
  if($scope.course.disable_registration)
  {
    $scope.formData.disable_registration_checked = true
  }

  $scope.roles = [{value:3, text:'courses.information.professor'}, {value:4, text:'courses.information.ta'}];
  Page.setTitle($translate('navigation.information') + ': ' + $scope.course.name);
  Page.startTour()
  ContentNavigator.close()
  $scope.timezones=scalear_utils.listTimezones()
  $scope.enrollment_url = $location.absUrl().split('courses')[0]+"courses/enroll?id="+$scope.course.unique_identifier

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
    delete modified_course.modules;
    delete modified_course.selected_module;
    delete modified_course.duration;
    var timezone = angular.copy(modified_course.time_zone)
    modified_course.time_zone = timezone.name
    Course.update(
      {course_id:$stateParams.course_id},
      {course:modified_course},
      function(){
        $scope.$emit('get_current_courses')
      }
    );
  }

  $scope.enable_disable_registration = function(){
    if (!$scope.formData.disable_registration_checked) {
      $scope.course.disable_registration = null
      $scope.updateCourse("","disable_registration")
    }
    else{
      if (!$scope.course.disable_registration) {
        $scope.course.disable_registration = $scope.course.end_date   
        $scope.updateCourse($scope.course.disable_registration,"disable_registration")        
      };
    }
  }

	$scope.validateCourse = function(column,data) {
    var d = $q.defer();
    var course={}
    course[column]=data;
    if($scope.formData.disable_registration_checked && !data){
      $scope.formData.disable_registration_checked = false
      $scope.course.disable_registration = null
      $scope.updateCourse("","disable_registration")        
    }
    Course.validateCourse(
      {course_id:$stateParams.course_id},
      course 
,
      function(){
        d.resolve()
      },
      function(data){
        if(data.status==422)
          d.resolve(data.data.errors.join());
        else
          d.reject('Server Error');
      }
    )
    return d.promise;
	};

  $scope.exportCourse = function(){
    Course.exportCsv({course_id: $stateParams.course_id},
      function(response){
        if (response.notice){
            $rootScope.show_alert = "success";
            ErrorHandler.showMessage($translate("error_message.export_course"), 'errorMessage', 2000);
            $interval(function() {
                  $rootScope.show_alert = "";
            }, 4000, 1);                    
      }
    })
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
       }
    )
  }

  $scope.toggleDelete = function(){
    $scope.in_delete = !$scope.in_delete
    $scope.toggle_message = $scope.in_delete? 'courses.information.done':'courses.information.button.remove_teacher'
  }

  $scope.addNewTeacher= function(){
    $scope.teacher_forum = true
  }

  $scope.updateTeacher = function(teacher){
    Course.updateTeacher(
      {course_id:$stateParams.course_id},
      teacher
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
      function(){
        $scope.teachers.splice(index, 1);
      }
    )
  }

  $scope.saveTeacher = function(){
    Course.saveTeacher(
      {course_id:$stateParams.course_id},
      {new_teacher:$scope.new_teacher},
      function() {
          $scope.getTeachers();
          $scope.teacher_forum = false
      },
      function(value) {
        $scope.new_teacher.errors=value.data.errors
      }
    )
  }

  $scope.animateCopy=function(){
     $('#enrollment_key').animate({ color: "#428bca" }, "fast").delay(400).animate({ color: "black" }, "fast");
  }

  $scope.updateTeacherEmailDiscussion=function(){

  }



  $scope.getTeachers();

}]);
