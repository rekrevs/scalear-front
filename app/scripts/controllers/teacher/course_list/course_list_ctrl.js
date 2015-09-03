'use strict';

angular.module('scalearAngularApp')
  .controller('courseListCtrl',['$scope','Course','$stateParams', '$translate','$log','$window','Page','$rootScope','ngDialog', function ($scope, Course,$stateParams, $translate, $log, $window,Page, $rootScope,ngDialog) {

    Page.setTitle('navigation.courses')
    Page.startTour();
    $rootScope.subheader_message = $translate("navigation.courses")

		$scope.column='name'
    $scope.course_filter = '!!'
    var getAllCourses=function(){
      $scope.courses=null
      Course.index({},
      function(data){
        $scope.courses = data
        $log.debug($scope.courses)
        $scope.courses.forEach(function(course){
          if(!course.ended){
            $scope.course_filter = false
            return 
          }
        })
      })           
    }

    var removeFromCourseList=function(course){
      $scope.courses.splice($scope.courses.indexOf(course), 1)
      var course_index = $scope.current_courses.map(function(x){return x.id}).indexOf(course.id)
      if(course_index > -1)
        $scope.current_courses.splice(course_index, 1)
    }

		$scope.deleteCourse=function(course){
      ngDialog.open({
          template:'\
              <div class="ngdialog-message">\
                  <h2><b>Warning!</b></h2>\
                  <span>\
                    <span>Deleting the course <b>"'+course.short_name+' | '+course.name+'"</b> will delete</span>\
                    <ul>\
                      <li>All modules</li>\
                      <li>All items inside each modules</li>\
                      <li>All students progress</li>\
                    </ul>\
                    <span>Are you sure you want to proceed? This cannot be undone!</span>\
                  </span>\
              </div>\
              <div class="ngdialog-buttons">\
                  <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)" translate>button.cancel</button>\
                  <button type="button" class="ngdialog-button ngdialog-button-alert" ng-click="delete()" translate>button.delete</button>\
              </div>',
          plain: true,
          className: 'ngdialog-theme-default ngdialog-dark_overlay ngdialog-theme-custom',
          showClose:false,
          controller: ['$scope', function($scope) {
              $scope.delete=function(){
                Course.destroy({course_id: course.id},{},
                  function(){
                    removeFromCourseList(course)
                })
                $scope.closeThisDialog()
              }
          }]
      });
			
		}

    $scope.unenrollCourse=function(course){
      Course.unenroll({course_id: course.id},{},
        function(){
          removeFromCourseList(course)
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

    getAllCourses()
  		
}]);
