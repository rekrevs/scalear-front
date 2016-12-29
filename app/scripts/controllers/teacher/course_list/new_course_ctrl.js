'use strict';

angular.module('scalearAngularApp')
  .controller('newCourseCtrl', ['$rootScope', '$scope', 'Course', '$state', '$window', '$log', 'Page', 'ScalearUtils', '$translate', '$filter','CourseModel','$modal', function($rootScope, $scope, Course, $state, $window, $log, Page, ScalearUtils, $translate, $filter,CourseModel,$modal) {
    $window.scrollTo(0, 0);
    Page.setTitle('navigation.new_course')
    $rootScope.subheader_message = $translate("navigation.new_course")
    $scope.submitting = false;
    $scope.course = {}
    $scope.course.selected_subdomain = {'All':true}
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
      var splitter_text = "[" + $translate("navigation.copied_from")
      var desc_temp = "",
        pre_temp = "",
        desc_temp_empty = "",
        pre_temp_empty = ""
      var course_info = $scope.import_from //$filter("filter")($scope.importing,{id:$scope.import_from},true)
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
        template: '<form name="myForm" >\
                    <div class="ngdialog-message">\
                    <h2><b><span translate>courses.limit_registration_domain_description</span></b></h2>\
                    </div>\
                    <ul>\
                      <li><input type="radio" ng-model="subdomain.boolean" value="all" ng-change="setBooleanDomain();" translate>all</li>\
                      <li><input type="radio" ng-model="subdomain.boolean" value="custom" ng-change="setBooleanDomain();" translate>custom</li>\
                      </form>\
                      <div ng-show=subdomain.boolean=="custom">\
                        <ul style="margin-bottom: 5px;" ng-repeat="domain in subdomains">\
                          <input class="valign-middle" ng-change="updateDomainList()" type="checkbox" name="mcq" ng-model="course.selected_subdomain[domain]" style="margin: auto;margin-right: 10px;"/>{{domain}}\
                        </ul>\
                      </div>\
                    </ul>',
        plain: true,
        scope: $scope,
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance){ 
          $scope.subdomain = {}
          $scope.subdomain.boolean = 'all'
          if (!$scope.course.selected_subdomain['All']){
            $scope.subdomain.boolean = 'custom'
          }
          $scope.close = function () { 
            $modalInstance.dismiss(); 
         };

          $scope.updateDomainList = function(){
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
          if (Object.keys($scope.course.selected_subdomain).map(function(key) {return $scope.course_domain.selected_subdomain[key];}).indexOf(true) == -1) {
            $scope.course.selected_subdomain = {'All':true}
          }
        }); 
    }

    $scope.createCourse = function() {
      $scope.submitting = true;
      if($scope.form.$valid) {
        var import_from_id = $scope.import_from ? $scope.import_from.id : null
        var selected_subdomain = $scope.course.selected_subdomain
        CourseModel.create($scope.course, import_from_id)
          .then(function(data) {
            $scope.submitting = false;
            if(data.importing) {
              $state.go("course_list")
            } else {
              $state.go("course.course_editor", { "course_id": data.course.id })
            }
          })
          .catch(function(response) {
            $scope.submitting = false;
            $scope.server_errors = response.data.errors
            $scope.course.selected_subdomain = selected_subdomain
          })
      } else {
        $scope.submitting = false;
      }
    }
  }]);
