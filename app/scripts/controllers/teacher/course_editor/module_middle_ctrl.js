'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'Document', '$stateParams', '$translate','$q','$log', '$filter', function ($scope, $state, Module, Document, $stateParams, $translate, $q, $log, $filter) {      
        $scope.$parent.not_module = false;
        $scope.$watch('module_obj['+$stateParams.module_id+']', function(){
            if($scope.module_obj && $scope.module_obj[$stateParams.module_id]){
                $scope.module=$scope.module_obj[$stateParams.module_id]
                if($scope.module.due_date)
                        $scope.module.due_date_enabled =!isDueDateDisabled()
            }
            init();
        })
        var init = function(){
            Module.getModules(
                {
                    course_id:$stateParams.course_id,
                    module_id:$stateParams.module_id
                },
                function(data){
                    $scope.$watch('module',function(){
                        if($scope.module)
                            angular.extend($scope.module, data)
                    })                    
                },
                function(){}
            )
        }
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

            $scope.addDocument=function(){
                $log.debug($scope.module.id)
                $scope.document_overlay=true
                Module.newDocument({course_id:$stateParams.course_id, module_id:$scope.module.id},
                    {},
                    function(doc){
                        $log.debug(doc)
                        doc.document.url = "http://"
                        $scope.module.documents.push(doc.document)
                        $scope.document_overlay=false
                    }, 
                    function(){}
                );
            }


            $scope.removeDocument=function (elem) {
                $scope.document_overlay=true
                Document.destroy(
                    {document_id: elem.id},{},
                    function(){
                        $scope.module.documents.splice($scope.module.documents.indexOf(elem), 1)
                        $scope.document_overlay=false
                    }, 
                    function(){}
                );
            }
            $scope.validateName= function(data, elem){
                var d = $q.defer();
                var doc={}
                doc.name=data;
                Document.validateName(
                    {document_id: elem.id},
                    doc,
                    function(data){
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
            }
                
            $scope.validateURL= function(data, elem){
                var d = $q.defer();
                var doc={}
                doc.url=data;
                Document.validateURL(
                    {document_id: elem.id},
                    doc,
                    function(data){
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
            }
            $scope.updateDocument=function(elem){
                elem.url = $filter("formatURL")(elem.url)
                Document.update(
                    {document_id: elem.id},
                    {"document":{
                        url: elem.url,
                        name: elem.name
                        }
                    },
                    function(resp){
                        elem.errors=""
                    },
                    function(resp){
                        elem.errors=resp.data.errors;
                    }
                );
            }
    }]);