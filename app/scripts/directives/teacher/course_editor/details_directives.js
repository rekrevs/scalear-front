'use strict';

angular.module('scalearAngularApp')
    .directive('detailsText', ['$timeout',
        function($timeout) {
            return {
                template: '<a ng-click="show()" onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'"  editable-text="value" e-form="textBtnForm" blur="submit" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || empty_message ||("empty"|translate) }} <i ng-class="overclass"></i></a>',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@",
                    open:"=",
                    empty_message:"@emptyMessage"
                },
                link: function(scope, element, attr) {
                    scope.selectField = function() {
                        // if(scope.column=="url"){
                        $timeout(function() {
                            element.find('.editable-input').select();
                        });
                        // }
                    };

                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }

                    scope.show=function(){
                      scope.textBtnForm.$show()
                      // $('.editable-input').focus()
                    }
                    if(attr.open){
                        var unwatch = scope.$watch('open', function(val){
                            if(val === true){
                                scope.show()
                                unwatch()
                            }
                        })
                    }
                }
            };
        }
    ])
    .directive('detailsUrl', ['$timeout','$translate',
        function($timeout,$translate) {
            return {
                template: '<a ng-click="show()" onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'"  editable-text="value" e-form="textBtnForm" blur="submit" onbeforesave="validate()(column,$data)" onaftersave="saveData()" ng-class={"text-italic":value=="none"}>{{ text || ("empty"|translate) }} <i ng-class="overclass"></i></a>',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    open:"="
                },
                link: function(scope, element, attr) {
                    scope.$watch('value',function(){
                        scope.text = scope.value == "none"? "("+$translate("lectures.add_video")+"...)" : scope.value
                    })
                    scope.selectField = function() {
                        $timeout(function() {
                            element.find('.editable-input').select();
                            if(scope.value == "none")
                                element.find('.editable-input').val("")
                        });
                    };

                    scope.saveData = function() {
                        $timeout(function() {
                            scope.text = scope.value
                            scope.save()
                        })
                    }

                    scope.show=function(){
                      scope.textBtnForm.$show()
                     
                    }
                    if(attr.open){
                        var unwatch = scope.$watch('open', function(val){
                            if(val === true){
                                scope.show()
                                unwatch()
                            }
                        })
                    }
                }
            };
        }
    ])
    .directive('detailsLink', ['$timeout',
        function($timeout) {
            return {
                template: '<a href="#" onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'"  editable-text="value" blur="submit" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ short_url || "http://" }} <i ng-class="overclass"></i></a>',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@",
                    shorten: "="
                },
                link: function(scope, element) {
                    scope.selectField = function() {
                        // if(scope.column=="url"){
                        $timeout(function() {
                            element.find('.editable-input').select();
                        });
                        // }
                    };
                    scope.$watch('value', function(){
                        if(scope.value){
                            scope.short_url = scope.shorten? shrort_url(scope.value, scope.shorten) : scope.value
                        }
                    })
                    var shrort_url = function(url, l){
                        var l = typeof(l) != "undefined" ? l : 50;
                        var chunk_l = (l/2);
                        // var url = url.replace("http://","").replace("https://","");

                        if(url.length <= l){ return url; }

                        var start_chunk = shortString(url, chunk_l, false);
                        var end_chunk = shortString(url, chunk_l, true);
                        return start_chunk + ".." + end_chunk;
                    }
                    var shortString = function(s, l, reverse){
                        var stop_chars = [' ','/', '&'];
                        var acceptable_shortness = l * 0.80; // When to start looking for stop characters
                        var reverse = typeof(reverse) != "undefined" ? reverse : false;
                        var s = reverse ? s.split("").reverse().join("") : s;
                        var short_s = "";

                        for(var i=0; i < l-1; i++){
                            short_s += s[i];
                            if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0){
                                break;
                            }
                        }
                        if(reverse){ return short_s.split("").reverse().join(""); }
                        return short_s;
                    }

                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }
                }
            };
        }
    ])
    .directive('detailsCheck', ['$timeout',
        function($timeout) {
            return {
                template: '<a href="#" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'" editable-checkbox="checked" blur="submit" e-title="{{title}}" class="editable-checkbox" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ checked && yes || no }}<i ng-class="overclass"></i></a>',
                restrict: 'E',
                scope: {
                    checked: "=",
                    save: "&",
                    title: "@",
                    yes: "@",
                    no: "@",
                    validate: "&",
                    column: "@"
                },
                link: function(scope) {
                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }
                }
            };
        }
    ])
    .directive('detailsDate', ['$timeout',
        function($timeout) {
            return {
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'" href="#" editable-bsdate="date" blur="submit" e-datepicker-popup="dd-MMMM-yyyy" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (date | date:"dd/MM/yyyy") || ("empty"|translate) }}<i ng-class="overclass"></i></a>',
                restrict: 'E',
                scope: {
                    date: "=",
                    save: "&",
                    validate: "&",
                    column: "@"
                },
                link: function(scope, element) {
                    scope.selectField = function() {
                        $timeout(function() {
                            element.find('.editable-input').select();
                            shortcut.add("enter", function(){
                                element.find('.editable-input').submit()
                                shortcut.remove("enter");
                            }, {"disable_in_input" : false});
                        });
                    },
                    scope.saveData = function(data) {
                        $timeout(function() {
                            scope.save({
                                data: data,
                                type: scope.column
                            })
                        })
                    }
                }
            };
        }
    ])
    .directive('detailsArea', ['$timeout',
        function($timeout) {
            return {
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || empty_message }}<i ng-class="overclass"></i></a> ',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@",
                    empty_message:"@emptyMessage"
                },
                link: function(scope, element) {
            // scope.selectField = function() {
            //     $timeout(function() {
            //         element.find('.editable-input').select();
            //     });
            // },   
                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }
                }
            };
        }
    ])
    .directive('bigArea', ['$timeout',
        function($timeout) {
            return {
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" e-cols="100" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || empty_message ||("empty"|translate)  }}<i ng-class="overclass"></i></a> ',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@",
                    empty_message:"@emptyMessage"
                },
                link: function(scope, element) {
            // scope.selectField = function() {
            //     $timeout(function() {
            //         element.find('.editable-input').select();
            //     });
            // },
                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }
                }
            };
        }
    ])
    .directive('detailsNumber', ['$timeout',
        function($timeout) {
            return {
                template: '<a onshow="selectField();" ng-mouseover="overclass = \'fi-pencil size-14\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-number="value" e-min="min" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value }}<i ng-class="overclass"></i></a> ',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    min: "@",
                    validate: "&",
                    column: "@"
                },
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
    .directive('detailsSelect', ['$timeout', '$filter',
        function($timeout, $filter) {
            return {
                template: '<a href="#" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'" blur="submit" editable-select="value" buttons="no" e-ng-options="s.value as (s.text|translate) for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px !important;height:34px">{{ showStatus() }}<i ng-class="overclass"></i></a> ',
                restrict: 'E',
                scope: {
                    value: "=",
                    options: "=",
                    save: "&",
                    validate: "&",
                    column: "@"
                },
                link: function(scope) {
                    scope.showStatus = function() {
                        var selected = $filter('filter')(scope.options, {
                            value: scope.value
                        });
                        return selected.length ? $filter('translate')(selected[0].text) : 'Not set';
                    };
                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }
                }
            };

        }
    ])
    .directive('detailsTimeZone', ['$timeout', '$filter',
        function($timeout, $filter) {
            return {

                template: '<a href="#" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'" blur="submit" editable-select="value" buttons="no" e-ng-options="s.value for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" >{{ showStatus()}}<i ng-class="overclass"></i></a> ',
                restrict: 'E',
                scope: {
                    value: "=",
                    options: "=",
                    save: "&",
                    validate: "&",
                    column: "@"
                },
                link: function(scope) {
                    // scope.$watch('status', function(){
                    //     if(scope.status){
                    //         scope.short_timezone = shorten(scope.status, 20)
                    //     }
                    // })
                    scope.showStatus = function() {
                        var selected = $filter('filter')(scope.options, scope.value);
                        return selected.length ? selected[0].value : 'Not set';
                    };
                    scope.saveData = function() {
                        $timeout(function() {
                            scope.save()
                        })
                    }
                    var shorten = function(url, l){
                        var l = typeof(l) != "undefined" ? l : 50;
                        var chunk_l = (l/2);
                        var url = url.replace("http://","").replace("https://","");

                        if(url.length <= l){ return url; }

                        var start_chunk = shortString(url, chunk_l, false);
                        var end_chunk = shortString(url, chunk_l, true);
                        return start_chunk + ".." + end_chunk;
                    }
                    var shortString = function(s, l, reverse){
                        var stop_chars = [' ','/', '&'];
                        var acceptable_shortness = l * 0.80; // When to start looking for stop characters
                        var reverse = typeof(reverse) != "undefined" ? reverse : false;
                        var s = reverse ? s.split("").reverse().join("") : s;
                        var short_s = "";

                        for(var i=0; i < l-1; i++){
                            short_s += s[i];
                            if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0){
                                break;
                            }
                        }
                        if(reverse){ return short_s.split("").reverse().join(""); }
                        return short_s;
                    }

                    // scope.$watch('value', function(newval) {
                    //     if (scope.options){
                    //         scope.short_timezone = scope.showStatus()//shorten(scope.showStatus(), 20)
                    //     }
                    // });

                }
            };

        }
    ]).directive('detailsTime', ['$timeout',
        function($timeout) {
            return {
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-bstime="time" e-show-meridian="false" e-minute-step="15" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (time | date:"HH:mm") || ("empty"|translate) }}<i ng-class="overclass"></i></a><timepicker ng-hide="true" />',
                restrict: 'E',
                scope: {
                    time: "=",
                    save: "&",
                    validate: "&",
                    column: "@"
                },
                link: function(scope, element) {
                    scope.selectField = function() {
                        $timeout(function() {
                            element.find('.editable-input td.control-group:nth(0) input').select();
                        });
                    },
                    scope.saveData = function(data) {
                        $timeout(function() {
                            scope.save({
                                data: data,
                                type: scope.column
                            })
                        })
                    }
                }
            };
        }
    ]).directive('linkItem', ['$q','$rootScope',function($q, $rootScope){
        return{
            templateUrl: '/views/link_item.html',
            restrict: 'E',
            scope: {
                link: "=",
                // update: "=",
                remove: "=",
                // validate: "=",
                small:"="
            },
            link: function(scope, element){
                scope.validate= function(data, elem){
                    var d = $q.defer();
                    var doc={}
                    doc.url=data;
                    CustomLink.validate(
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

                scope.removeLink=function(){
                    if(scope.remove)
                        scope.remove(scope.link)
                    else
                        $rootScope.$broadcast('remove_link', scope.link)
                }

                scope.update=function(){
                    $rootScope.$broadcast('update_link', scope.link)
                }
            }
        }
    }]);