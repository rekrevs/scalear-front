'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCourseInformationCtrl', ['$scope', '$stateParams', 'Course','$q', '$translate', '$log','$window','Page','scalear_utils', function ($scope, $stateParams, Course, $q, $translate, $log, $window,Page, scalear_utils) {

  $window.scrollTo(0, 0);
  $scope.in_delete = false;
  $scope.toggle_message = 'courses.remove_teacher'
  $scope.roles = [{value:3, text:'courses.professor'}, {value:4, text:'courses.ta'}];
  $scope.role_names = {'3': 'courses.professor', '4': 'courses.ta'};
  Page.setTitle('head.information')
  $scope.timezones=scalear_utils.listTimezones()

    $scope.timezones.forEach(function(zone){
      console.log(zone.name)
      console.log($scope.course.time_zone)
      if(zone.name == $scope.course.time_zone){
        $scope.course.time_zone = zone
        return
      }
  })

  // Course.show({course_id:$stateParams.course_id},
  //   function(response){
  //   	// $scope.course=response.course
  //     // console.log($scope.course)
  //   	var timezones=response.timezones;
  //     // console.log($scope.timezones)
  //     $scope.timezones=[]
  //     var offset=[]
  //     timezones.forEach(function(zone){
  //       // console.log(offset.indexOf(zone.offset))
  //       console.log("name":"+"zone.name+" ,offset:"+zone.offset+", value:""+zone.value)"
  //       if(offset.indexOf(zone.offset)==-1){
  //         $scope.timezones.push(zone)
  //         offset.push(zone.offset)
  //       }
  //       if(zone.name == $scope.course.time_zone){
  //         $scope.course.time_zone = zone
  //         return
  //       }
  //   })
  //     console.log($scope.timezones)
  //     console.log(offset)
  // });
  

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
    delete modified_course.custom_links;
    delete modified_course.modules;
    delete modified_course.selected_module;

    $log.debug(modified_course);
    var timezone = angular.copy(modified_course.time_zone)
    modified_course.time_zone = timezone.name
    Course.update(
      {course_id:$stateParams.course_id},
      {course:modified_course},
      function(response){
        $scope.course=response.course;
        $scope.course.time_zone = timezone
        $scope.$emit('get_all_courses')
        console.log(timezone)
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
      $log.debug(data.status);
      $log.debug(data);
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

  $scope.url_with_protocol = function(url)
  {
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
           $scope.new_teacher = null;
       },
       function(value){}
    )
  }

  $scope.toggleDelete = function(){
    $scope.in_delete = !$scope.in_delete
    $scope.toggle_message = $scope.in_delete? 'events.done':'courses.remove_teacher'

    // if($scope.in_delete == false){
    // }
    // else{
    //   $scope.toggle_message = 'events.done'
    // }
  }

  $scope.addNewTeacher= function(){
    $scope.teacher_forum = true
    // $scope.new_teachers.splice(index+1, 0, {email: null, role: null, status: $translate('controller_msg.pending')});
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
    //var answer = confirm($translate('courses.you_sure_remove_teacher', {teacher: $scope.teachers[index].email}));
    //if(answer){
    Course.deleteTeacher(
      {
        course_id:$stateParams.course_id, 
        email:$scope.teachers[index].email
      }, {},
      function(value) 
      {
        $scope.teachers.splice(index, 1);
      },
      function(value) {}
    )

    $log.debug($scope.teachers);
    // }
  }

  $scope.saveTeacher = function(){
    Course.saveTeacher(
      {course_id:$stateParams.course_id},
      {new_teacher:$scope.new_teacher},
        function(value) {
            $scope.error = $scope.getTeachers();
            $scope.teacher_forum = false
        },
        //handle error
        function(value) {
          $scope.errors=
          $scope.new_teacher.error=value.data.errors.email

          // for(var element in $scope.new_teachers)
          // {
          // }
          $log.debug($scope.errors);
          //$scope.error = $scope.getTeachers();
        }
    )
  }
  
  // $scope.check = function(value, index){
  //   if(value ==''){
  //       $scope.new_teachers[index].email = null;
  //   }
  // }

  $scope.getTeachers();
  // $scope.$watch('current_lang', function(newval, oldval){
  //   if(newval!=oldval)
  //     delete $scope.new_teacher.error
  //       // for(var elem in $scope.new_teachers)
  //       // {
  //       //     delete $scope.new_teachers[elem].error
  //       // }
  // });
  // $scope.validateDuration=function(type,value){
      // if (value<1 || value >=1000)
            // return $translate('courses.duration_invalid')
  // }

  }]);
