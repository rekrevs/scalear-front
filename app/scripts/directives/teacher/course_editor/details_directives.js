'use strict';

angular.module('scalearAngularApp')
    .directive('detailsText', ['$timeout',
        function($timeout) {
            return {
                template: '<a href="#" onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" blur="submit" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate) }} <i ng-class="overclass"></i></a>',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@"
                },
                link: function(scope, element) {
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
                }
            };
        }
    ])
    .directive('detailsLink', ['$timeout',
        function($timeout) {
            return {
                template: '<a href="#" onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" blur="submit" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ short_url || ("empty"|translate) }} <i ng-class="overclass"></i></a>',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@",
                    dontshorten: "="
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
                            if(scope.dontshorten){
                                scope.short_url = scope.value
                            }
                            else{
                                scope.short_url = shorten(scope.value, 20)
                            }
                            
                        }
                        else{
                            scope.short_url = null;
                        }
                    })
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
                template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-checkbox="checked" blur="submit" e-title="{{title}}" class="editable-checkbox" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ checked && yes || no }}<i ng-class="overclass"></i></a>',
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
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-bsdate="date" blur="submit" e-datepicker-popup="dd-MMMM-yyyy" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (date | date:"dd/MM/yyyy") || ("empty"|translate) }}<i ng-class="overclass"></i></a>',
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
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate)  }}<i ng-class="overclass"></i></a> ',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@"
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
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" e-cols="100" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate)  }}<i ng-class="overclass"></i></a> ',
                restrict: 'E',
                scope: {
                    value: "=",
                    save: "&",
                    validate: "&",
                    column: "@"
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
                template: '<a onshow="selectField();" ng-mouseover="overclass = \'icon-pencil\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-number="value" e-min="min" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value }}<i ng-class="overclass"></i></a> ',
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
                template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" blur="submit" editable-select="value" buttons="no" e-ng-options="s.value as (s.text|translate) for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px !important;height:34px">{{ showStatus() }}<i ng-class="overclass"></i></a> ',
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

                template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" blur="submit" editable-select="value" buttons="no" e-ng-options="s.value for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px;">{{ short_timezone }}<i ng-class="overclass"></i></a> ',
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

                    scope.$watch('value', function(newval) {
                        if (scope.options){
                            scope.short_timezone = shorten(scope.showStatus(), 20)
                        }
                    });

                }
            };

        }
    ]).directive('detailsTime', ['$timeout',
        function($timeout) {
            return {
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-bstime="time" e-show-meridian="false" e-minute-step="15" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (time | date:"HH:MM") || ("empty"|translate) }}<i ng-class="overclass"></i></a><timepicker ng-hide="true" />',
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
                            element.find('.editable-input').select();
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