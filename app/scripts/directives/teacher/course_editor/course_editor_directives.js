'use strict';

angular.module('scalearAngularApp')
.directive("moduleEdit", ['$rootScope','$timeout','$state', '$log','ngDialog', function($rootScope, $timeout,$state, $log,ngDialog) {
    return {
        restrict: "E",
        replace:true,
        scope: {
            module:"=data",
        },
        templateUrl: '/views/teacher/course_editor/module_edit.html',
        link: function(scope,element) {
            var calculateTime=function(){
                var total_calculated_time = 0
                scope.module.items.forEach(function(item){
                    if(item.duration){
                        total_calculated_time += parseInt(item.duration)
                    } 
                })
                scope.module.total_time = total_calculated_time
            }
            calculateTime()
            scope.$on('update_module_time', function(ev, module_id){
                if(scope.module.id == module_id){
                    calculateTime()
                }
            })
            $rootScope.$watch('clipboard', function(){
                scope.clipboard = $rootScope.clipboard
            })

            scope.remove=function(event){
                event.preventDefault();
                event.stopPropagation();
                ngDialog.open({
                    template:'\
                        <div class="ngdialog-message">\
                            <h2><b><span translate>groups.delete_popup.warning</span>!</b></h2>\
                            <span>\
                                <span translate>groups.delete_popup.delete_module</span>\
                                <b>"'+scope.module.name+'"</b>\
                                <span translate>groups.delete_popup.will_delete</span>\
                                <span translate>groups.delete_popup.are_you_sure</span>\
                            </span>\
                        </div>\
                        <div class="ngdialog-buttons">\
                            <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)" translate>button.cancel</button>\
                            <button type="button" class="ngdialog-button ngdialog-button-alert delete_confirm" ng-click="delete()" translate>button.delete</button>\
                        </div>',
                    plain: true,
                    className: 'ngdialog-theme-default ngdialog-dark_overlay ngdialog-theme-custom',
                    showClose:false,
                    controller: ['$scope', function($scope) {
                        $scope.delete=function(){
                            $rootScope.$broadcast("delete_module", scope.module)
                            $scope.closeThisDialog()
                        }
                    }]

                });
            }

            scope.copy=function(){
                $log.debug("copy")
                event.preventDefault();
                $rootScope.$broadcast('copy_item', scope.module)
            }

            scope.paste=function(){
                $log.debug("Paste")
                event.preventDefault();
                $rootScope.$broadcast('paste_item', scope.module.id)
            }

            scope.share=function(){
                $log.debug("Share")
                event.preventDefault();
                $rootScope.$broadcast('share_copy', {module_id:scope.module.id})
            }

        }
    }
}]).directive('itemEdit', ['$rootScope','$timeout','$anchorScroll','$location','$state','$log', function($rootScope, $timeout, $anchorScroll,$location,$state,$log) {
    return {
        scope: {
            item:'=data'
        },
        restrict: 'E',
        templateUrl: '/views/teacher/course_editor/item_edit.html',
        link: function(scope,element) {
            $rootScope.$watch('clipboard', function(){
                scope.clipboard = $rootScope.clipboard
            })
            scope.remove=function(event){
                event.stopPropagation()
                event.preventDefault() 
                $rootScope.$broadcast("delete_item", scope.item)
            }

            scope.copy=function(){
                $log.debug("copy")
                event.preventDefault();
                $rootScope.$broadcast('copy_item', scope.item)
            }

            scope.paste=function(){
                $log.debug("Paste")
                event.preventDefault();
                $rootScope.$broadcast('paste_item', scope.item.group_id)
            }

            scope.share=function(){
                $log.debug("Share")
                event.preventDefault();
                $rootScope.$broadcast('share_copy', {module_id:scope.item.group_id, item: scope.item})
            }
        }
    };
}])
.directive("module", function() {
    return {
        replace:true,
        restrict: "E",
        scope: {
            data:"&data"
        },
        templateUrl: '/views/teacher/course_editor/module.html',
        link: function(scope,element) {
            scope.module = scope.data()
            var calculateTime=function(){                
                var total_calculated_time = 0
                scope.module.items.forEach(function(item){
                    if(item.duration){
                        total_calculated_time += parseInt(item.duration)
                    } 
                })
                scope.module.total_time = total_calculated_time
            }
            calculateTime()
        }
    }
}).directive('item', function() {
    return {
        scope: {
            data:'&data'
        },
        restrict: 'E',
        templateUrl: '/views/teacher/course_editor/item.html',
        link: function(scope,element) {
            scope.item = scope.data()
        }
    };
}).directive('buttonLink', function() {
    return {
        scope: {
            title: "@",
            action: "&"
        },
        restrict: 'E',
        replace: true,
        template: '<div ng-click="action({$event:$event})" class="btn" >{{title}}</div>'
    };
}).directive('editableText', ['$timeout',function($timeout) {
    return {
        scope: {
            value: "=",
            save: "&",
            validation: "&",
            action: "&",
            elem: '='
        },
        restrict: 'E',
        template: '<a onshow="selectField()" ng-mouseover="show_pencil = true;" blur="submit" ng-mouseleave="show_pencil = false;"  editable-text="value" e-form="textBtnForm" onbeforesave="validation()($data, elem)" onaftersave="saveData()" ng-click="action()" style="cursor:pointer;padding-right: 20px;" e-class="editable-input-large">' +
            '{{ value || ("global.empty"|translate) }}' +
            '<i ng-class="overclass" ></i>' +
            ' <span ng-show="show_pencil" class="fi-pencil size-21" style="position: absolute;" ng-click="textBtnForm.$show()"></span>' +
            '</a>',
        link: function(scope, element, attr) {
            scope.selectField = function() {
                $timeout(function() {
                    var input = element.find('.editable-input')
                    var form= element.find('form.editable-wrap')
                    form.css("width","100%")
                    input.select();
                });
            }

            scope.saveData = function() {
                $timeout(function() {
                    scope.save()
                })
            }

            scope.show=function(){
              scope.textBtnForm.$show()
            }

            if(attr.open)
                scope.show()
        }
    };
}]).directive('overlay', ['$timeout', function($timeout) {
    return {
        transclude: true,
        restrict: 'E',
        replace: true,
        template: '<div class="overlay" ng-transclude></div>',
        link: function(scope, element) {
            var parent = element.parent()
            scope.getHeight = function() {
                return parent.height()
            };
        }
    }
}]).directive('loading', function() {
    return {
        scope: {
            size: '@',
            show: "="
        },
        restrict: 'E',
        replace: true,
        templateUrl: '/views/teacher/course_editor/loading.html'
    };
}).directive('deleteButton', ['$translate',function($translate) {
    return {
        scope: {
            size: "@",
            action: "&",
            vertical: '&',
            text: '&',
            overlaymode: '&',
            mode: '@',
            moduleitem: '@',
            tooltiptext: "@",
            padded: '@'
        },
        restrict: 'E',
        templateUrl: '/views/teacher/course_editor/delete_button.html',
        link: function(scope) {
            scope.tooltiptext_translated = $translate(scope.tooltiptext)
            scope.overlay = scope.overlaymode() || false
            scope.display_vertical = scope.vertical()
            scope.text_mode = scope.text()
            scope.showDeletePopup = function(value,ev) {
                scope.displayDeletePopup = value
                ev.stopPropagation()
                ev.preventDefault()
            };
        }
    }
}])
.directive('moduleContentModal', ['$modal', function($modal){
    return{
        scope:{
            openModal:"="
        },
        restrict: 'A',
        replace: true,
        controller: ['$scope', function($scope){
            $scope.openModal = function () {
                $modal.open({
                    templateUrl: '/views/teacher/course_editor/online_content_modal.html',
                    controller: ModalInstanceCtrl
                })
            }
            var ModalInstanceCtrl = ['$scope', '$modalInstance', '$rootScope',function ($scope, $modalInstance, $rootScope) {
                $scope.addItem=function(type){
                    $rootScope.$broadcast("add_item", type)
                    $modalInstance.close()
                }
                $scope.cancel = $modalInstance.dismiss
            }]
        }]
    }
}]).directive('lectureQuestionsModal', ['$modal',function($modal){
    return{
        scope:{
            openModal:"="
        },
        restrict: 'A',
        replace: true,
        controller: ['$scope',function($scope){
            $scope.openModal = function () {
                $modal.open({
                    templateUrl: '/views/teacher/course_editor/question_types_modal.html',
                    controller: ModalInstanceCtrl,
                    windowClass: 'large'
                })
            }
            var ModalInstanceCtrl = ['$scope', '$modalInstance', '$rootScope',function ($scope, $modalInstance, $rootScope) {
                $scope.addQuiz=function(quiz_type, question_type){
                    $rootScope.$broadcast("add_online_quiz", quiz_type, question_type)
                    $modalInstance.close()
                }
              $scope.cancel = $modalInstance.dismiss
            }]
        }]
    }
}])