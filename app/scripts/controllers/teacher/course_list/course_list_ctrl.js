'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page','$rootScope','ngDialog','$timeout','UserSession', function ($scope, Course,$stateParams, $translate, $log, $window,Page, $rootScope,ngDialog,$timeout,UserSession) {

    Page.setTitle('navigation.courses')
    Page.startTour();
    $rootScope.subheader_message = $translate.instant("navigation.courses")

    $scope.column='name'
    $scope.course_filter = '!!'
    $scope.teacher_courses = []
    $scope.student_courses = []
    $scope.course_loading = false
    UserSession.getCurrentUser()
    .then(function(user) {
      $scope.current_user = user
      // console.log($scope.current_user)
    })

    var getCoursesFirstTime = function(){  
      var limit_course = 200 
        Course.index({   
          offset:0,    
          limit: limit_course   
        },   
        function(data){  
          $scope.course_loading =  true
        $scope.teacher_courses = $scope.teacher_courses.concat(data.teacher_courses)
        $scope.student_courses = $scope.student_courses.concat(data.student_courses)

          for(var i=limit_course;i<data.total;i+=limit_course){  
            getAllCourses(i,limit_course)    
          }  
        })  
    } 

  var getAllCourses=function(offset, limit){ 
      $scope.course_limit =  limit, 
      $scope.course_offset = offset 
      Course.index({ 
        offset:$scope.course_offset,  
        limit: $scope.course_limit 
      }, 
      function(data){
        $scope.teacher_courses = $scope.teacher_courses.concat(data.teacher_courses)
        $scope.student_courses = $scope.student_courses.concat(data.student_courses)

        // $scope.total = data.total 
        // $timeout(function(){ 
        //     $scope.getRemainingCourse() 
        // }) 

    // Code for removing finshed courses when chosing "All Courses" from main menu
    //     $scope.courses.forEach(function(course){
    //        if(!course.ended){
    //        $scope.course_filter = false;
    //        return
    //    }
    //  })
     })
    }

    $scope.getRemainingCourse = function(){ 
      if($scope.course_offset+$scope.course_limit<=parseInt($scope.total)) 
          getAllCourses($scope.course_offset+$scope.course_limit,$scope.course_limit)  
      else{ 
          // $scope.loading_lectures=false  
          $log.debug("no more") 
      //  disableInfinitScrolling() 
      } 
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

    // getAllCourses(0,10)
    getCoursesFirstTime()  

}]);
