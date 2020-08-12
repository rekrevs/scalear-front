'use strict';

angular.module('scalearAngularApp')
  .controller('teacherCourseInformationCtrl', ['$scope', '$state', '$translate', '$log', '$window', 'Page', 'ScalearUtils', 'ContentNavigator', 'ErrorHandler', '$location', 'CourseModel', 'TeacherModel', '$modal','Course', function($scope, $state, $translate, $log, $window, Page, ScalearUtils, ContentNavigator, ErrorHandler, $location, CourseModel, TeacherModel, $modal,Course) {

    $window.scrollTo(0, 0);
    $scope.in_delete = false;
    $scope.toggle_message = 'courses.information.button.remove_teacher'
    $scope.formData = {};
    $scope.course = CourseModel.getSelectedCourse()
    $scope.formData.disable_registration_checked = !!$scope.course.disable_registration
    $scope.roles = [{ value: 3, text: 'courses.information.professor' }, { value: 4, text: 'courses.information.ta' }];
    Page.setTitle($translate.instant('navigation.information') + ': ' + $scope.course.name);
    $scope.timezones = ScalearUtils.listTimezones()
    $scope.enrollment_url = $location.absUrl().split('courses')[0] + "courses/enroll?id=" + $scope.course.unique_identifier
    $scope.course_info_url = $state.href('course.course_information', { course_id: $scope.course.id }, { absolute: true })
    $scope.course_domain={}
    $scope.subdomains = {}
    // $scope.course_domain.selected_subdomain ={}
    Page.startTour()
    ContentNavigator.close()
    setupTimezone()
    getTeachers();
    getSelectedSubdomains();

    function setupTimezone() {
      $scope.timezones.forEach(function(zone) {
        if(zone.name == $scope.course.time_zone) {
          $scope.course.time_zone = zone
          return
        }
      })
    }

    function checkRegistrationField() {
      if(!$scope.formData.disable_registration_checked) {
        $scope.course.disable_registration = null
      } else if(!$scope.course.disable_registration) {
        $scope.course.disable_registration = $scope.course.end_date
      }
    }

    $scope.updateCourse = function(data, type) {
      if(data && data instanceof Date) {
        data.setMinutes(data.getMinutes() - data.getTimezoneOffset());
        $scope.course[type] = data
      }
      checkRegistrationField()
      $scope.course.update()
    }

    $scope.toggleRegistrationCheck = function() {
      checkRegistrationField()
      $scope.updateCourse()
    }

    $scope.validateCourse = function(column, data) {
      var course = { id: $scope.course.id }
      course[column] = data;
      var temp_course = CourseModel.createInstance(course)
      return temp_course.validate()
    };

    $scope.exportCourse = function() {
      $scope.course.exportCourse()
        .then(function(response) {
          if(response.notice) {
            ErrorHandler.showMessage($translate.instant("error_message.export_course"), 'errorMessage', 4000, 'success');
          }
        })
    }
    $scope.sendCourseToTeacherMail = function(fbf) {
      checkToExport(fbf, $scope.course.id)
    }
    function checkToExport(fbf, course_id) {
      $modal.open({
        templateUrl: '/views/teacher/course_editor/export_modal.html',
        controller: ['$scope', '$rootScope', '$modalInstance', function ($scope, $rootScope, $modalInstance) {
          $scope.course_export_dialogue = fbf.with_fbf == true?  true:false
          $scope.canvas = fbf.with_fbf == false? true:false
          console.log(' $scope.course_export_dialogue', $scope.course_export_dialogue)
          console.log('$scope.canvas',$scope.canvas)
          $scope.cancelExport = function () {
            $modalInstance.close();
          }
          $scope.beginExport = function () {
            $modalInstance.close();
            Course.sendCourseToTeacherMail({
              course_id: course_id,
              export_lec_2_fbf: fbf.with_fbf,
            }, function (response) {
              if (response.notice) {
                ErrorHandler.showMessage($translate.instant("error_message.export_course_cc"), 'errorMessage', 4000, 'success');
              }
            })
          }
        }]
      });
    }
    $scope.sendCourseTextToTeacherMail = function () {
      Course.sendCourseTextToTeacherMail({
        course_id:  $scope.course.id
      },function(response){
        if(response.notice) {
          ErrorHandler.showMessage($translate.instant("error_message.export_course_text"), 'errorMessage', 4000, 'success');
        }
      })
    }
    //teachers part
    function getTeachers() {
      TeacherModel.getTeachers().then(function(value) {
        $scope.teachers = value.data;
        $scope.new_teacher = {};
        if($state.params.new_course) {
          $modal.open({
            templateUrl: '/views/teacher/course_list/email_student_answers_modal.html',
            scope: $scope,
            controller:['$modalInstance', function($modalInstance ) {
              var index = $scope.teachers.findIndex(function(teacher) { return $scope.current_user.id==teacher.id })
              $scope.updateEmailDiscussion = function (email_discussion) {
                $scope.teachers[index].email_discussion = email_discussion 
                $scope.updateTeacher($scope.teachers[index])
                $modalInstance.dismiss('cancel');
              }
            }]
          })
        } 

      })
    }
    
    function getSelectedSubdomains() {
      TeacherModel.getSelectedSubdomains().then(function(value) {
        $scope.course_domain.selected_subdomain = value.selected_domain;
        $scope.subdomains = value.subdomains;
      })
    }

    $scope.toggleDelete = function() {
      $scope.in_delete = !$scope.in_delete
      $scope.toggle_message = $scope.in_delete ? 'courses.information.done' : 'courses.information.button.remove_teacher'
    }

    $scope.addNewTeacher = function() {
      $scope.teacher_forum = true
    }

    $scope.updateTeacher = function(teacher) {
      TeacherModel.updateTeacher(teacher)
    }

    $scope.removeNewTeacher = function() {
      $scope.new_teacher = null
      $scope.teacher_forum = false
    }

    $scope.removeTeacher = function(teacher) {
      TeacherModel.deleteTeacher(teacher).then(function(params) {
        if(params.remove_your_self){
          $state.go("course_list") 
          ErrorHandler.showMessage($translate.instant('error_message.remove_your_self'), 'errorMessage', 4000, "success");
        }
        var index = $scope.teachers.indexOf(teacher)
        if(index != -1)
          $scope.teachers.splice(index, 1);
      })
    }

    $scope.saveTeacher = function() {
      TeacherModel.saveNewTeacher($scope.new_teacher)
        .then(function() {
          getTeachers();
          $scope.teacher_forum = false
        })
        .catch(function(value) {
          $scope.new_teacher.errors = value.data.errors
        })
    }

    $scope.animateCopy = function() {
      $('#enrollment_key').animate({ color: "#428bca" }, "fast").delay(400).animate({ color: "black" }, "fast");
    }

    $scope.copySuccess = function(e) {
      $(e.trigger)
        .animate({ color: "#428bca" }, "fast")
        .delay(300)
        .animate({ color: "black" }, "fast", function() {
          e.clearSelection();
        });
    }

    $scope.copyError = function(e) {

    }

    $scope.toggleDomain = function(event) {
      event.stopPropagation()      
      $modal.open({
        templateUrl: '/views/teacher/course_list/school_registration_modal.html', 
        plain: true,
        scope: $scope,
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){ 

          $scope.subdomain = {}
          $scope.subdomain.boolean = 'all'
          if (!$scope.course_domain.selected_subdomain['All']){
            $scope.subdomain.boolean = 'custom'
          }
          $scope.close = function () { 
            $modalInstance.dismiss(); 
         };

          $scope.updateDomainList = function(){
          };
    
          $scope.setBooleanDomain= function(){
            if($scope.subdomain.boolean == "all"){
              $scope.course_domain.selected_subdomain = {'All':true}
            }
            else{
              delete $scope.course_domain.selected_subdomain['All']; 
            }
          };
       }],
      }).result.finally(function() {
          if (Object.keys($scope.course_domain.selected_subdomain).map(function(key) {return $scope.course_domain.selected_subdomain[key];}).indexOf(true) == -1) {
            $scope.course_domain.selected_subdomain = {'All':true}
          }
          TeacherModel.setSelectedSubdomains($scope.course_domain.selected_subdomain).then(function(value) {
            // ErrorHandler.showMessage($translate.instant(("error_message.export_course"), 'errorMessage', 4000, 'success');
          })
        }); 
    }


  }]);
