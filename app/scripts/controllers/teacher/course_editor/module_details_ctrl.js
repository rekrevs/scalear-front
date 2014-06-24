'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$state', 'Module', 'CustomLink', '$q', '$stateParams', '$log', '$filter',
        function($scope, $state, Module, CustomLink, $q, $stateParams, $log, $filter) {

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

        $scope.addCustomLink=function(){
            $log.debug($scope.module.id)
            $scope.link_overlay=true
            Module.newCustomLink({course_id:$stateParams.course_id, module_id:$scope.module.id},
                {},
                function(doc){
                    $log.debug(doc)
                    doc.link.url = "http://"
                    $scope.module.custom_links.push(doc.link)
                    $scope.link_overlay=false
                }, 
                function(){}
            );
        }


        $scope.removeCustomLink=function (elem) {
            $scope.link_overlay=true
            CustomLink.destroy(
                {link_id: elem.id},{},
                function(){
                    $scope.module.custom_links.splice($scope.module.custom_links.indexOf(elem), 1)
                    $scope.link_overlay=false
                }, 
                function(){}
            );
        }
        $scope.validateName= function(data, elem){
            var d = $q.defer();
            var doc={}
            doc.name=data;
            CustomLink.validateName(
                {link_id: elem.id},
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
            CustomLink.validateURL(
                {link_id: elem.id},
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
        $scope.updateCustomLink=function(elem){
            elem.url = $filter("formatURL")(elem.url)
            CustomLink.update(
                {link_id: elem.id},
                {"link":{
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