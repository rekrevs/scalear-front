'use strict';

angular.module('scalearAngularApp')
    .directive("module", function() {
        return {
            restrict: "E",
            scope: {
                name: "=",
                id: '=',
                remove: "&",
                open: "=",
                copy:"&",
                paste: "&",
                share:"&"
            },
            templateUrl: '/views/teacher/course_editor/module.html',
            link: function(scope) {
                scope.menu_status = false
                scope.invertOpen = function() {
                    if (scope.open[scope.id])
                        scope.open[scope.id] = false
                    else {
                        for (var i in scope.open)
                            scope.open[i] = false;
                        scope.open[scope.id] = true
                    }
                }
                scope.copyModule=function(event){
                    event.stopPropagation() 
                    scope.menu_status = false
                    scope.copy()
                }

                scope.doPaste=function(event){
                    event.stopPropagation() 
                    scope.menu_status = false
                    scope.paste()
                }

                scope.shareModule=function(event){
                    event.stopPropagation() 
                    scope.menu_status = false
                    scope.share()
                }
            }
        }
    }).directive('item', ['$state', '$translate', function($state, $translate) {
        return {
            scope: {
                name: '=',
                id: '=',
                className: '=',
                remove: '&',
                copy:"&",
                paste:"&",
                share:"&"
            },
            restrict: 'E',
            templateUrl: '/views/teacher/course_editor/item.html',
            link: function(scope) {
                scope.getDeleteMessage = function() {
                    var translation_value = {}
                    translation_value[scope.className] = scope.name
                    return $translate('groups.you_sure_delete_' + scope.className, translation_value)
                }
                scope.copyItem=function(event){
                    event.stopPropagation() 
                    scope.menu_status = false
                    scope.copy()
                }

                scope.doPaste=function(event){
                    event.stopPropagation() 
                    scope.menu_status = false
                    scope.paste()
                }

                scope.shareItem=function(event){
                    event.stopPropagation() 
                    scope.menu_status = false
                    scope.share()
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
                template: '<a onshow="selectField()" ng-mouseover="show_pencil = true;" ng-mouseleave="show_pencil = false;"  editable-text="value" e-form="textBtnForm" onbeforesave="validation()($data, elem)" onaftersave="saveData()" ng-click="action()" style="cursor:pointer;">' +
                    '{{ value || ("empty"|translate) }}' +
                    '<i ng-class="overclass"></i>' +
                    ' <span ng-show="show_pencil" class="icon-pencil" ng-click="textBtnForm.$show()"></span>' +
                    '</a>',
                link: function(scope, element) {
                    scope.selectField = function() {
                        $timeout(function() {
                            element.find('.editable-input').select();
                        });
                    },
                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }
                }
            };
        }
    ])
    .directive('overlay', function() {
        return {
            transclude: true,
            restrict: 'E',
            replace: true,
            template: '<div class="overlay well" ng-transclude></div>',
            link: function(scope, element) {
                var parent = element.parent();
                scope.getWidth = function() {
                    return parent.width()
                };
                scope.getHeight = function() {
                    return parent.height()
                };
                scope.$watch(scope.getWidth, function(newValue, oldValue) {
                    element.css("width", newValue)
                });
                scope.$watch(scope.getHeight, function(newValue, oldValue) {
                    element.css("height", newValue)
                });
            }
        }
    })
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
                vertical: '='
            },
            replace: true,
            restrict: 'E',
            templateUrl: '/views/teacher/course_editor/delete_button.html',
            link: function(scope) {
                scope.showDeletePopup = function(value) {
                    scope.displayDeletePopup = value
                };
                // var template =  "<input type='button' value='Delete' ng-click='' class='btn btn-small btn-primary'/>"+
                //                 "<input type='button' value='cancel' ng-click='' class='btn btn-small'/>";

                var template = "<div class='alert alert-block alert-error notification fade in' style='padding: 3px;margin-bottom: 5px; width: 50px;text-align:center'>"+
                                        "<span class='form-controls-alert' style='margin:auto' >"+
                                            "<a class='btn btn-danger btn-mini' ng-click='action({event:$event});showDeletePopup(false)' translate>delete</a>"+
                                            // "<a class='btn btn-mini' ng-click='showDeletePopup(false)' translate>lectures.cancel</a>"+
                                        "</span>"+
                                "</div>";

                scope.myoptions={
                    content: template,
                    html:true,
                    placement:scope.placement || 'bottom'
                }
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
    });