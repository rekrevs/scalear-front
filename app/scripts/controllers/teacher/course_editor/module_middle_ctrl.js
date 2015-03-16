'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'CustomLink', '$stateParams', '$translate','$q','$log', '$filter', '$rootScope', function ($scope, $state, Module, CustomLink, $stateParams, $translate, $q, $log, $filter, $rootScope) {      
        
        var unwatch =$scope.$watch('course.selected_module', function(){
            if($scope.course && $scope.course.selected_module){
                $scope.module=$scope.course.selected_module
                // if($scope.module.due_date)
                //         $scope.module.due_date_enabled =!isDueDateDisabled()
            }
            init();
            unwatch()
        })
        var init = function(){
            Module.getModuleStatistics(
                {
                    course_id:$stateParams.course_id,
                    module_id:$stateParams.module_id
                },
                function(data){
                    // $scope.$watch('module',function(){
                    //     if($scope.module){
                    angular.extend($scope.module, data)
                    //         console.log($scope.module)
                    //     }
                    // })                    
                },
                function(){}
            )
            $scope.link_url=$state.href('course.module.courseware', {module_id: $scope.module.id}, {absolute: true})
            
        }
        

            // $scope.visible = function(appearance_time) {
            //     return new Date(appearance_time) <= new Date()
            // }

            $scope.addCustomLink=function(){
                // $log.debug($scope.module.id)
                // $scope.link_overlay=true
                Module.newCustomLink(
                    {
                        course_id:$stateParams.course_id, 
                        module_id:$scope.module.id
                    },
                    {},
                    function(doc){
                        // $log.debug(doc)
                        doc.link.url = "http://"
                        doc.link.class_name="customlink"
                        $scope.module.items.push(doc.link)
                        $scope.items_obj["customlink"][doc.link.id] = $scope.module.items[$scope.module.items.length-1]
                        // $scope.module.custom_links.push(doc.link)
                        // $scope.link_overlay=false
                    }, 
                    function(){}
                );
            }

            // $scope.removeCustomLink=function (elem) {
            //     $scope.link_overlay=true
            //     CustomLink.destroy(
            //         {link_id: elem.id},{},
            //         function(){
            //             $scope.module.custom_links.splice($scope.module.custom_links.indexOf(elem), 1)
            //             $scope.link_overlay=false
            //         }, 
            //         function(){}
            //     );
            // }
                         
            
            // $scope.updateCustomLink=function(elem){
            //     elem.url = $filter("formatURL")(elem.url)
            //     CustomLink.update(
            //         {link_id: elem.id},
            //         {"link":{
            //             url: elem.url,
            //             name: elem.name
            //             }
            //         },
            //         function(resp){
            //             elem.errors=""
            //         },
            //         function(resp){
            //             elem.errors=resp.data.errors;
            //         }
            //     );
            // }


            // $scope.listSortableOptions={
            //     axis: 'y',
            //     dropOnEmpty: false,
            //     handle: '.handle',
            //     cursor: 'crosshair',
            //     items: '.group_links',
            //     opacity: 0.4,
            //     scroll: true,
            //     update: function(e, ui) {
            //         Module.sortGroupLinks(
            //             {   course_id: $state.params.course_id,
            //                 module_id: $scope.module.id},
            //             {links:$scope.module.custom_links}
            //         )
            //     },
            // }
    }]);