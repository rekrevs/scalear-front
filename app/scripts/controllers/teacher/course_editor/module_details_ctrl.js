'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$state', 'Module', 'Document', '$q', '$stateParams', '$log', '$filter',
        function($scope, $state, Module, Document, $q, $stateParams, $log, $filter) {

            $scope.$watch('module_obj[' + $stateParams.module_id + ']', function() {
                if ($scope.module_obj && $scope.module_obj[$stateParams.module_id]){
                    $scope.module = $scope.module_obj[$stateParams.module_id]
                }
                init();
            })

            //**************************FUNCTIONS****************************************///
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
        }
    ]);