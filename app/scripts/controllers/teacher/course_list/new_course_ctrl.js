'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl', ['$rootScope', '$scope', 'Course', '$state', '$window', '$log', 'Page', 'ScalearUtils', '$translate', '$filter','CourseModel','$q','$modal', function($rootScope, $scope, Course, $state, $window, $log, Page, ScalearUtils, $translate, $filter,CourseModel,$q,$modal) {
    $window.scrollTo(0, 0);
    Page.setTitle('navigation.new_course')
    $rootScope.subheader_message = $translate.instant("navigation.new_course")
    $scope.submitting = false;
    $scope.course = {}
    $scope.course.selected_subdomain = {'All':true}
    $scope.course.email_discussion = false
    CourseModel.getUserOtherCourses().then(function(data) {
        $scope.importing = data.importing;
        $scope.subdomains = data.subdomains;
      })
    $scope.timezones = ScalearUtils.listTimezones()
    $scope.course.time_zone = $scope.timezones[11] //GMT+0
    $scope.course.start_date = new Date()
    $scope.course.end_date = new Date()
    var days_in_week = 7;
    var default_course_duration =  10 //weeks
    $scope.course.end_date.setDate($scope.course.start_date.getDate() + (days_in_week * default_course_duration));

    $scope.import_from = null

    $scope.addImportInformation = function() {
      var splitter_text = "[" + $translate.instant("navigation.copied_from")
      var desc_temp = "",
        pre_temp = "",
        desc_temp_empty = "",
        pre_temp_empty = "",
        image_temp_empty = ""
      var course_info = $scope.import_from
      if(course_info) {
        var course_name_text = "\n" + splitter_text + " " + course_info.name + " :]\n"
        if(course_info.description) {
          desc_temp = course_name_text + course_info.description
        }
        desc_temp_empty = course_info.description
        if(course_info.prerequisites) {
          pre_temp = course_name_text + course_info.prerequisites
        }
        pre_temp_empty = course_info.prerequisites
        image_temp_empty = course_info.image_url
      }
      if($scope.course.description) {
        $scope.course.description = $scope.course.description.split(splitter_text)[0].trim() + desc_temp
      } else {
        $scope.course.description = desc_temp_empty
      }
      if($scope.course.prerequisites) {
        $scope.course.prerequisites = $scope.course.prerequisites.split(splitter_text)[0].trim() + pre_temp
      } else {
        $scope.course.prerequisites = pre_temp_empty
      }
      if(!$scope.course.image_url){
        $scope.course.image_url = image_temp_empty
      }
    }

    $scope.unselectCourse = function() {
      $scope.import_from = null
      $scope.addImportInformation()
    }

    $scope.toggleRegistration = function() {
      if(!$scope.disable_registration_checked) {
        $scope.course.disable_registration = null
      }
      else{
        $scope.course.disable_registration = $scope.course.end_date
      }
    }
    $scope.toggleDomain = function(event) {
      event.stopPropagation()      
      $modal.open({ 
        templateUrl: '/views/teacher/course_list/school_registration_modal.html', 
        plain: true,
        scope: $scope,
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){ 
          $scope.subdomain = {}
          $scope.course_domain = {}
          $scope.course_domain.selected_subdomain = {};
          $scope.subdomain.boolean = 'all'
          if (!$scope.course.selected_subdomain['All']){
            $scope.subdomain.boolean = 'custom'
          }
          $scope.close = function () { 
            $modalInstance.dismiss(); 
         };

          $scope.updateDomainList = function(){
            $scope.course.selected_subdomain = $scope.course_domain.selected_subdomain
          };
    
          $scope.setBooleanDomain= function(){
            if($scope.subdomain.boolean == "all"){
              $scope.course.selected_subdomain = {'All':true}
            }
            else{
              delete $scope.course.selected_subdomain['All']; 
            }
          };
       }],
      }).result.finally(function() {
          if (Object.keys($scope.course.selected_subdomain).map(function(key) {return $scope.course.selected_subdomain[key];}).indexOf(true) == -1) {
            $scope.course.selected_subdomain = {'All':true}
          }
        }); 
    }

    function validateDate() {
      var deferred = $q.defer()
      var errors = {}
      var a = true
      if (($scope.course.start_date == "Invalid Date" || $scope.course.start_date == null )) {
        errors["start_date"] = ["not a Date"]
        deferred.reject(errors)
        a = false
      } 
      if (($scope.course.end_date == "Invalid Date" || $scope.course.end_date == null )) {
        errors["end_date"] = ["not a Date"]
        deferred.reject(errors)
        a = false
      }
      if(a){        
        if (!($scope.course.start_date < $scope.course.end_date)) {
          errors["start_date"] = ["must be before end date"]
          deferred.reject(errors)
        } 
        else {
          errors["start_date"] = []
          errors["end_date"] = []
          deferred.resolve(errors)
        }
      }
      return deferred.promise
    }


    $scope.createCourse = function() {
      $scope.submitting = true;
      validateDate()
      .then(function(errors) {
        var import_from_id = $scope.import_from ? $scope.import_from.id : null
        var selected_subdomain = $scope.course.selected_subdomain
        var email_discussion = $scope.course.email_discussion
        CourseModel.create($scope.course, import_from_id)
          .then(function(data) {

            $scope.submitting = false;
            if(data.importing) {
              $state.go("course_list")
            } else {
              $state.go("course.course_editor", { "course_id": data.course.id, new_course:true  })
            }
          })
          .catch(function(response) {
            $scope.submitting = false;
            $scope.server_errors = response.data.errors
            $scope.course.selected_subdomain = selected_subdomain
            $scope.course.email_discussion = email_discussion
          })
      }) 
      .catch(function(errors) {
          $scope.server_errors = errors
          $scope.submitting = false;
      })
    }
  }]);
