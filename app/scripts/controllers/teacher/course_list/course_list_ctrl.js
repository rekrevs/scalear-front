'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page','$rootScope','ngDialog','$timeout','UserSession', function ($scope, Course,$stateParams, $translate, $log, $window,Page, $rootScope,ngDialog,$timeout,UserSession) {

    Page.setTitle('navigation.courses')
    Page.startTour();
    $rootScope.subheader_message = $translate.instant("navigation.courses")

    $scope.column='start_date'
    $scope.is_reverse = true
    $scope.course_filter = '!!'
    $scope.teacher_courses = []
    $scope.student_courses = []
    $scope.course_loading = false
    UserSession.getCurrentUser()
    .then(function(user) {
      $scope.current_user = user
    })

    var getCourses = function(offset, limit){  
      var course_offset = offset 
      var course_limit =  limit
      Course.index({   
        offset:course_offset,    
        limit: course_limit   
      },   
      function(data){
        $scope.teacher_courses = $scope.teacher_courses.concat(data.teacher_courses)
        $scope.student_courses = $scope.student_courses.concat(data.student_courses)
        
        course_offset+=course_limit
        if(course_offset<data.total){
          getCourses(course_offset, course_limit)
        }
        else{
          $scope.course_loading =  true
        }

      })  
    } 


    var removeFromCourseList=function(course, user_type){
      var courses_var = user_type+"_courses"
      var current_courses_var = "current_"+courses_var
      $scope[courses_var].splice($scope[courses_var].indexOf(course), 1)
      var course_index = $scope[current_courses_var].map(function(x){return x.id}).indexOf(course.id)
      if(course_index > -1)
        $scope[current_courses_var].splice(course_index, 1)
    }

		$scope.deleteCourse=function(course){
      ngDialog.open({
          template:'\
              <div class="ngdialog-message">\
                  <h2><b><span translate>courses.list.delete_popup.warning</span>!</b></h2>\
                  <span>\
                    <span>\
                      <span translate>courses.list.delete_popup.delete_course</span>\
                      <b> "'+course.short_name+' | '+course.name+'" </b>\
                      <span translate>courses.list.delete_popup.will_delete</span></span>\
                    <ul>\
                      <li translate>courses.list.delete_popup.all_modules</li>\
                      <li translate>courses.list.delete_popup.all_items</li>\
                      <li translate>courses.list.delete_popup.all_progress</li>\
                    </ul>\
                    <span translate>courses.list.delete_popup.are_you_sure</span>\
                    <span translate>courses.list.delete_popup.cannot_undo</span>\
                  </span>\
              </div>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)" translate>button.cancel</button>\
                  <button type="button" class="ngdialog-button ngdialog-button-alert delete_confirm" ng-click="delete()" translate>button.delete</button>\
              </div>',
          plain: true,
          className: 'ngdialog-theme-default ngdialog-dark_overlay ngdialog-theme-custom',
          showClose:false,
          controller: ['$scope', function($scope) {
              $scope.delete=function(){
                Course.destroy({course_id: course.id},{},
                  function(){
                    removeFromCourseList(course,"teacher")
                })
                $scope.closeThisDialog()
              }
          }]
      });

		}

    $scope.unenrollCourse=function(course){
      Course.unenroll({course_id: course.id},{},
        function(){
          removeFromCourseList(course, "student")
        },
        function(){})
    }

		$scope.filterTeacher=function(teacher_name, teacher_email){
			$scope.filtered_teacher_name = teacher_name
      $scope.filtered_teacher = teacher_email;
		}

    $scope.filterCourse=function(val){
      $scope.course_filter = val
    }

    $scope.removeFilter=function(){
      $scope.filtered_teacher = ''
    }

		$scope.order=function(column_name){
			$scope.column = column_name
			$scope.is_reverse = !$scope.is_reverse
		}

    getCourses(0,10)  

}]);
