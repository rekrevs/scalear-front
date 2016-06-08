'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$rootScope', '$state', 'Module', 'CustomLink', '$q', '$stateParams', '$log', function($scope, $rootScope, $state, Module, CustomLink, $q, $stateParams, $log) {
        
    var unwatch =$scope.$watch('course.selected_module', function(){
        if($scope.course && $scope.course.selected_module){
            $scope.module=$scope.course.selected_module
            $scope.link_url=$state.href('course.module.courseware', {module_id: $scope.module.id}, {absolute: true})
            if($scope.module.due_date)
                $scope.module.due_date_enabled =!isDueDateDisabled()
            unwatch()
        }
        
    })

    // ---
    
    var init_module_group_settings= {module:   true,  // initially to open 'module' group, 
                                     settings: false  // 'settings' to be closed
                                    };
        
    if(!$rootScope.module_details_groups){
       $rootScope.module_details_groups= init_module_group_settings;
      }
   
    // ---
    
    $scope.validateModule = function(column, data) {
        $log.debug(data)
        var d = $q.defer();
        var group = {}
        group[column] = data;
        Module.validateModule({
                course_id: $stateParams.course_id,
                module_id: $scope.module.id
            },
            group,
            function() {
                d.resolve()
            }, function(data) {
                $log.debug(data.status);
                $log.debug(data);
                if (data.status == 422)
                    d.resolve(data.data.errors[0]); //.join()
                else
                    d.reject('Server Error');
            }
        )
        return d.promise;
    };

    $scope.updateModule = function() {
        delete $scope.module.new
        var modified_module = angular.copy($scope.module);
        delete modified_module.id;
        delete modified_module.items;
        delete modified_module.created_at;
        delete modified_module.updated_at;
        delete modified_module.total_time;
        delete modified_module.total_questions;
        delete modified_module.total_quiz_questions;
        delete modified_module.total_lectures;
        delete modified_module.total_quizzes
        delete modified_module.total_survey_questions
        delete modified_module.total_surveys
        delete modified_module.total_links
        delete modified_module.due_date_enabled;

        Module.update({
                course_id: $stateParams.course_id,
                module_id: $scope.module.id
            }, {
                group: modified_module
            },
            function(response) {
                $log.debug(response)
                $scope.module.items.forEach(function(item) {
                    if (item.appearance_time_module) {
                        item.appearance_time = $scope.module.appearance_time;
                    }
                    if (item.due_date_module) {
                        item.due_date = $scope.module.due_date;
                    }
                });
            },
            function() {}
        );
    }


    var isDueDateDisabled=function(){
        var due = new Date($scope.module.due_date)
        var today = new Date()
        return due.getFullYear() > today.getFullYear()+100
    }

    $scope.updateDueDate=function(){
        var enabled = $scope.module.due_date_enabled
        var due_date = new Date($scope.module.due_date)
        var week = 7
        if(isDueDateDisabled() && enabled) 
            var years =  -200 
        else if(!isDueDateDisabled() && !enabled)
            var years  =  200
        else
            var years = 0
        due_date.setFullYear(due_date.getFullYear()+ years)

        var appearance_date = new Date($scope.module.appearance_time)
        if(due_date <= appearance_date){
            due_date=appearance_date
            due_date.setDate(appearance_date.getDate()+ week)
        }
        
        $scope.module.due_date = due_date
        $scope.module.due_date_enabled =!isDueDateDisabled()
    }
}]);