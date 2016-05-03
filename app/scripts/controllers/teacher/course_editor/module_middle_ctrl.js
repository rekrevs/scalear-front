'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'CustomLink', '$stateParams', '$translate', function ($scope, $state, Module, CustomLink, $stateParams, $translate){
        
        var unwatch =$scope.$watch('course.selected_module', function(){
            if($scope.course && $scope.course.selected_module){
                $scope.module=$scope.course.selected_module
            }
            init();
            unwatch()
        })
        var init = function(){
            Module.getModuleStatistics({
                    course_id:$stateParams.course_id,
                    module_id:$stateParams.module_id
                },
                function(data){
                    angular.extend($scope.module, data)
                }
            )
            $scope.link_url=$state.href('course.module.courseware', {module_id: $scope.module.id}, {absolute: true})
        }

        $scope.$on("update_module_statistics",function(){
            init()
        })

    }]);