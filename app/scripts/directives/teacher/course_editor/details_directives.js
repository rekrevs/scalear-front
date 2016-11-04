'use strict';

angular.module('scalearAngularApp')
  .directive('detailsText', ['$timeout', function($timeout) {
    return {
      template: '<a ng-click="show()" onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'"  editable-text="value" e-form="textBtnForm" blur="submit" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || empty_message ||("global.empty"|translate) }} <i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope: {
        value: "=",
        save: "&",
        validate: "&",
        column: "@",
        open: "=",
        empty_message: "@emptyMessage"
      },
      link: function(scope, element, attr) {
        scope.selectField = function() {
          $timeout(function() {
            element.find('.editable-input').select();
          });
        };

        scope.saveData = function() {
          $timeout(function() {
            scope.save()
          })
        }

        scope.show = function() {
          scope.textBtnForm.$show()
        }

        if(attr.open) {
          var unwatch = scope.$watch('open', function(val) {
            if(val === true) {
              scope.show()
              unwatch()
            }
          })
        }
      }
    };
  }]).directive('detailsUrl', ['$timeout', '$translate', function($timeout, $translate) {
    return {
      template: '<a ng-click="show()" onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'"  editable-textarea="value" e-rows="5" e-cols="100" e-form="textBtnForm" blur="submit" onbeforesave="validate()(column,$data)" onaftersave="saveData()" ng-class={"text-italic":value=="none"}>{{ text || "http://" }} <i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope: {
        value: "=",
        save: "&",
        validate: "&",
        column: "@",
        open: "="
      },
      link: function(scope, element, attr) {
        var unwatch = scope.$watch('value', function() {
          scope.text = scope.value == "none" ? "(" + $translate("editor.details.add_video") + "...)" : scope.value
          unwatch()
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
            // if(scope.text !== scope.value) {
              scope.text = scope.value
              scope.save()
            // }
          })
        }

        scope.show = function() {
          scope.textBtnForm.$show()
        }

        if(attr.open) {
          var unwatch = scope.$watch('open', function(val) {
            if(val === true) {
              scope.show()
              unwatch()
            }
          })
        }
      }
    };
  }]).directive('detailsLink', ['$timeout', function($timeout) {
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
          $timeout(function() {
            element.find('.editable-input').select();
          });
        };

        scope.$watch('value', function() {
          if(scope.value) {
            scope.short_url = scope.shorten ? shrort_url(scope.value, scope.shorten) : scope.value
          }
        })
        var shrort_url = function(url, l) {
          var l = typeof(l) != "undefined" ? l : 50;
          var chunk_l = (l / 2);
          if(url.length <= l) {
            return url; }

          var start_chunk = shortString(url, chunk_l, false);
          var end_chunk = shortString(url, chunk_l, true);
          return start_chunk + ".." + end_chunk;
        }
        var shortString = function(s, l, reverse) {
          var stop_chars = [' ', '/', '&'];
          var acceptable_shortness = l * 0.80; // When to start looking for stop characters
          var reverse = typeof(reverse) != "undefined" ? reverse : false;
          var s = reverse ? s.split("").reverse().join("") : s;
          var short_s = "";

          for(var i = 0; i < l - 1; i++) {
            short_s += s[i];
            if(i >= acceptable_shortness && stop_chars.indexOf(s[i]) >= 0) {
              break;
            }
          }
          if(reverse) {
            return short_s.split("").reverse().join(""); }
          return short_s;
        }

        scope.saveData = function() {
          $timeout(function() {
            scope.save()
          })
        }
      }
    };
  }]).directive('detailsCheck', ['$timeout', function($timeout) {
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
  }]).directive('detailsDate', ['$timeout', function($timeout) {
    return {
      template: '<a onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" ng-mouseleave="overclass= \'\'" href="#" editable-bsdate="date" blur="submit" e-ng-change="pastTime()" e-datepicker-popup="dd-MMMM-yyyy" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (date | amDateFormat:"dddd, DD MMMM YYYY" ) || ("global.empty"|translate) }}<i ng-class="overclass"></i></a>',
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
              shortcut.add("enter", function() {
                element.find('.editable-input').submit()
                shortcut.remove("enter");
              }, { "disable_in_input": false });
            });
          },
          scope.saveData = function(data) {
            scope.date.setHours(scope.previousTime.getHours());
            scope.date.setMinutes(scope.previousTime.getMinutes());
            $timeout(function() {
              scope.save({
                data: data,
                type: scope.column
              })
            })
          }
          scope.pastTime = function(){
            scope.previousTime = new Date(scope.date)
          }

      }
    };
  }]).directive('detailsArea', ['$timeout', function($timeout) {
    return {
      template: '<a e-rich-textarea onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()"><span ng-bind-html="value || empty_message"></span><i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope: {
        value: "=",
        save: "&",
        validate: "&",
        column: "@",
        empty_message: "@emptyMessage"
      },
      link: function(scope, element) {
        scope.selectField = function() {
          $timeout(function() {
            element.find('.editable-input').select();
            // var editor = new MediumEditor('.editable-input');
          });
        };

        scope.saveData = function() {
          $timeout(function() {
            scope.save()
          })
        }
      }
    };
  }]).directive('bigArea', ['$timeout', function($timeout) {
    return {
      template: '<a e-rich-textarea onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" e-cols="100" onbeforesave="validate()(column,$data)" onaftersave="saveData()"><span ng-bind-html="value || empty_message || (\'global.empty\'|translate)"></span><i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope: {
        value: "=",
        save: "&",
        validate: "&",
        column: "@",
        empty_message: "@emptyMessage"
      },
      link: function(scope, element) {
        scope.selectField = function() {
            var elem = element.find('.editable-input')
            $timeout(function() {
              elem.select();
              if(scope.value == "none")
                elem.val("")
            });

          },
          scope.saveData = function() {
            $timeout(function() {
              scope.save()
            })
          }
      }
    };
  }]).directive('detailsNumber', ['$timeout', function($timeout) {
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
  }]).directive('detailsSelect', ['$timeout', '$filter', function($timeout, $filter) {
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
  }]).directive('detailsTimeZone', ['$timeout', '$filter', function($timeout, $filter) {
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
        scope.showStatus = function() {
          var selected = $filter('filter')(scope.options, scope.value);
          return selected.length ? selected[0].value : 'Not set';
        };
        scope.saveData = function() {
          $timeout(function() {
            scope.save()
          })
        }
      }
    };
  }]).directive('detailsTime', ['$timeout', function($timeout) {
    return {
      template: '<a onshow="selectField()" ng-mouseover="overclass = \'fi-pencil size-14\'" blur="submit" ng-mouseleave="overclass= \'\'" href="#" editable-bstime="time" e-show-meridian="false" e-minute-step="15" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (time | date:"HH:mm") || ("global.empty"|translate) }}<i ng-class="overclass"></i></a><timepicker ng-hide="true" />',
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
  }])
