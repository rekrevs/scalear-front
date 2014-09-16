'use strict';

angular.module('scalearAngularApp')
    .directive("module", ['$rootScope','$timeout','$state',function($rootScope, $timeout,$state) {
        return {
            restrict: "E",
            replace:true,
            scope: {
                module:"=data",
                current: "="
            },
            templateUrl: '/views/teacher/course_editor/module.html',
            link: function(scope,element) {
                scope.remove=function(event){
                    event.preventDefault();
                    event.stopPropagation();  
                    $rootScope.$broadcast("delete_module", scope.module)
                }
            }
        }
    }]).directive('item', ['$rootScope','$timeout','$anchorScroll','$location','$state', function($rootScope, $timeout, $anchorScroll,$location,$state) {
        return {
            scope: {
                item:'=data',
            },
            restrict: 'E',
            templateUrl: '/views/teacher/course_editor/item.html',
            link: function(scope,element) {
                scope.remove=function(event){
                    event.stopPropagation()
                    event.preventDefault() 
                    $rootScope.$broadcast("delete_item", scope.item)
                }
            }
        };
    }]).directive('buttonLink', function() {
        return {
            scope: {
                title: "@",
                action: "&"
            },
            restrict: 'E',
            replace: true,
            template: '<div ng-click="action({$event:$event})" class="btn" >{{title}}</div>'
        };
    }).directive('editableText', ['$timeout',
        function($timeout) {
            return {
                scope: {
                    value: "=",
                    save: "&",
                    validation: "&",
                    action: "&",
                    elem: '='
                },
                restrict: 'E',
                template: '<a onshow="selectField()" ng-mouseover="show_pencil = true;" e-form="myform" blur="submit" ng-mouseleave="show_pencil = false;"  editable-text="value" e-form="textBtnForm" onbeforesave="validation()($data, elem)" onaftersave="saveData()" ng-click="action()" style="cursor:pointer;">' +
                    '{{ value || ("empty"|translate) }}' +
                    '<i ng-class="overclass"></i>' +
                    ' <span ng-show="show_pencil" class="fi-pencil size-18" style="position: absolute;" ng-click="textBtnForm.$show()"></span>' +
                    '</a>',
                link: function(scope, element, attr) {
                    scope.selectField = function() {
                        $timeout(function() {
                            element.find('.editable-input').select();
                        });
                    }

                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }

                    scope.show=function(){
                      scope.myform.$show()
                      // $('.editable-input').focus()
                    }

                    if(attr.open)
                        scope.show()
                }
            };
        }
    ])
    .directive('overlay', ['$timeout', function($timeout) {
        return {
            transclude: true,
            restrict: 'E',
            replace: true,
            template: '<div class="overlay" ng-transclude></div>',
            link: function(scope, element) {
                var parent = element.parent()
                // console.log(element.parent())
                // scope.getWidth = function() {
                //     return element.parent().width()
                // };
                scope.getHeight = function() {
                    return parent.height()
                };
                // scope.$watch(scope.getWidth, function(newValue, oldValue) {
                //     angular.element(element.children()[0]).css("width", newValue)
                // });
                $timeout(function(){
                    scope.$watch(scope.getHeight, function(newValue, oldValue) {
                        console.log(parent.height())
                        element.css("height", parent.height())
                    })
                },1000);
            }
        }
    }])
    .directive('loading', function() {
        return {
            scope: {
                size: '@',
                show: "="
            },
            restrict: 'E',
            replace: true,
            templateUrl: '/views/teacher/course_editor/loading.html',
        };
    }).directive('deleteButton', function() {
        return {
            scope: {
                size: "@",
                action: "&",
                hideConfirm: '=',
                placement: '=',
                vertical: '=',
                text: '=',
                color: '@',
                overlaymode: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: '/views/teacher/course_editor/delete_button.html',
            link: function(scope) {
                scope.showDeletePopup = function(value,ev) {
                    scope.displayDeletePopup = value
                    ev.stopPropagation()
                    ev.preventDefault()

                };
                // var template =  "<input type='button' value='Delete' ng-click='' class='btn btn-small btn-primary'/>"+
                //                 "<input type='button' value='cancel' ng-click='' class='btn btn-small'/>";

                // var template = "<div class='alert alert-block alert-error notification fade in' style='padding: 3px;margin-bottom: 5px; width: 50px;text-align:center'>"+
                //                         "<span class='form-controls-alert' style='margin:auto' >"+
                //                             "<a class='btn btn-danger btn-mini' ng-click='action({event:$event});showDeletePopup(false)' translate>delete</a>"+
                //                             // "<a class='btn btn-mini' ng-click='showDeletePopup(false)' translate>lectures.cancel</a>"+
                //                         "</span>"+
                //                 "</div>";

                // scope.myoptions={
                //     content: template,
                //     html:true,
                //     placement:scope.placement || 'bottom'
                // }
            }
        }
    }).directive('addModuleItems', function(){
        return{
            scope:{
                index: '=',
                lecture: '=',
                quiz: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: '/views/teacher/course_editor/add_module_items.html',
            link: function(scope){
                scope.collapse_add = true
                scope.toggleAdd = function(){
                    scope.collapse_add = !scope.collapse_add;
                }
                scope.addlecture = function(index){
                    scope.lecture(index)
                    scope.toggleAdd()
                }
                scope.addquiz = function(index, type){
                    scope.quiz(index, type)
                    scope.toggleAdd()
                }
            }
        }
    }).directive('onlineModal', ['$modal', function($modal){
        return{
            restrict: 'A',
            replace: true,
            link: function(scope, element){
                scope.openOnlineContentModal = function () {
                    var modalInstance = $modal.open({
                        templateUrl: '/views/teacher/course_editor/online_content_modal.html',
                        controller: ModalInstanceCtrl,
                    })
                }
                var ModalInstanceCtrl = ['$scope', '$modalInstance', '$rootScope',function ($scope, $modalInstance, $rootScope) {
                    $scope.addItem=function(type){
                        $rootScope.$broadcast("add_item", type)
                        $modalInstance.close()
                    }
                  $scope.cancel = $modalInstance.dismiss
                }]
            }
        }
    }]).directive('questionsModal', ['$modal',function($modal){
        return{
            restrict: 'A',
            replace: true,
            link: function(scope, element){
                scope.openQuestionsModal = function () {
                    var modalInstance = $modal.open({
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
            }
        }
    }]);