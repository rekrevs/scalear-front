'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$state', 'Module', 'Document', '$q', '$stateParams', '$log',
        function($scope, $state, Module, Documents, $q, $stateParams, $log) {

            $scope.$watch('module_obj[' + $stateParams.module_id + ']', function() {
                if ($scope.module_obj && $scope.module_obj[$stateParams.module_id]){
                    $scope.module = $scope.module_obj[$stateParams.module_id]
                    if($scope.module.due_date)
                        $scope.module.due_date_enabled =!isDueDateDisabled()
                }
            })

            //**************************FUNCTIONS****************************************///
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
                    function(data) {
                        d.resolve()
                    }, function(data) {
                        $log.debug(data.status);
                        $log.debug(data);
                        if (data.status == 422)
                            d.resolve(data.data.errors.join());
                        else
                            d.reject('Server Error');
                    }
                )
                return d.promise;
            };

            $scope.updateModule = function(data, type) {
                // if (data && data instanceof Date) {
                //     data.setMinutes(data.getMinutes() + 120);
                //     $scope.module[type] = data
                // }
                var modified_module = angular.copy($scope.module);
                delete modified_module.id;
                delete modified_module.items;
                delete modified_module.documents;
                delete modified_module.created_at;
                delete modified_module.updated_at;
                delete modified_module.total_time;
                delete modified_module.total_questions;
                delete modified_module.total_quiz_questions;
                delete modified_module.open;
                delete modified_module.due_date_enabled;

                Module.update({
                        course_id: $stateParams.course_id,
                        module_id: $scope.module.id
                    }, {
                        group: modified_module
                    },
                    function(response) {
                        $log.debug(response)
                        $scope.module.items.forEach(function(item, i) {
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

            $scope.updateDueDate=function(type,enabled){
                var d = new Date($scope.module.due_date)
                if(isDueDateDisabled() && enabled) 
                    var years =  -200 
                else if(!isDueDateDisabled() && !enabled)
                    var years  =  200
                else
                    var years = 0
                d.setFullYear(d.getFullYear()+ years)
                $scope.module.due_date = d
                $scope.module.due_date_enabled =!isDueDateDisabled()
            }

            $scope.visible = function(appearance_time) {
                if (new Date(appearance_time) <= new Date()) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ]);