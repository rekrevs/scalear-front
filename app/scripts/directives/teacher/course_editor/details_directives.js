'use strict';

angular.module('scalearAngularApp')
    .directive('detailsText', ['$timeout',
        function($timeout) {
            return {
                template: '<a href="#" onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate) }} <i ng-class="overclass"></i></a>',
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
                template: '<a href="#" onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ short_url || ("empty"|translate) }} <i ng-class="overclass"></i></a>',
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
                    scope.$watch('value', function(){
                        if(scope.value){
                            scope.short_url = shorten(scope.value, 20)
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
                template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-checkbox="checked" e-title="{{title}}" class="editable-checkbox" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ checked && yes || no }}<i ng-class="overclass"></i></a>',
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
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-bsdate="date" e-datepicker-popup="dd-MMMM-yyyy" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (date | date:"dd/MM/yyyy") || ("empty"|translate) }}<i ng-class="overclass"></i></a>',
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
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate)  }}<i ng-class="overclass"></i></a> ',
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
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate)  }}<i ng-class="overclass"></i></a> ',
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
                template: '<a onshow="selectField();" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-number="value" e-min="min" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value }}<i ng-class="overclass"></i></a> ',
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
                template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-select="value" buttons="no" e-ng-options="s.value as (s.text|translate) for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px;height:25px">{{ showStatus() }}<i ng-class="overclass"></i></a> ',
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

                template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-select="value" buttons="no" e-ng-options="s.value for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px;">{{ short_timezone }}<i ng-class="overclass"></i></a> ',
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
                template: '<a onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-bstime="time" e-show-meridian="true" e-minute-step="15" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (time | date:"shortTime") || ("empty"|translate) }}<i ng-class="overclass"></i></a><timepicker ng-hide="true" />',
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
    ]).directive('documentItem', function(){
        return{
            templateUrl: '/views/document_item.html',
            restrict: 'E',
            scope: {
                document: "=",
                update: "=",
                remove: "=",
                nameval: "=",
                urlval: "="

            },
            link: function(scope, element){

            }
        }
    });