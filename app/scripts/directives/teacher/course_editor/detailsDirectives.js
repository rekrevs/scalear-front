'use strict';

angular.module('scalearAngularApp')
  .directive('detailsText', function ($timeout) {
    return {
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" onaftersave="save_data()">{{ value || "empty" }} <i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
      },
      link:function(scope){
        scope.save_data=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  })
  .directive('detailsCheck', function ($timeout) {
    return {
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-checkbox="checked" e-title="{{title}}" class="editable-checkbox" onaftersave="save_data()">{{ checked && yes || no }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	checked: "=",
      	save: "&",
      	title: "@",
      	yes: "@",
      	no: "@"
      },
      link:function(scope){
        scope.save_data=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  })
  .directive('detailsDate', function ($timeout) {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-date="date" onaftersave="save_data()">{{ (date | date:"MM/dd/yyyy") || \'empty\' }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	date: "=",
      	save: "&",
      },
      link:function(scope){
        scope.save_data=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  })
  .directive('detailsArea', function ($timeout) {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" e-cols="15" onaftersave="save_data()">{{ value || "Empty" }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
      },
      link:function(scope){
        scope.save_data=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  })
  .directive('detailsNumber', function ($timeout) {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-number="value" e-min="min" onaftersave="save_data()">{{ value }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
      	min: "@"
      },
      link:function(scope){
        scope.save_data=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };

  })
  .directive('detailsSelect', function ($timeout, $filter) {
    return {
      template: '<a href="#" editable-select="value" buttons="no" e-ng-options="s.value as s.text for s in options" onaftersave="save_data()">{{ showStatus() }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
        value: "=",
        options: "=",
        save: "&",        
      },
      link:function(scope){
        scope.showStatus = function() {
          var selected = $filter('filter')(scope.options, {value: scope.value});
          return selected.length ? selected[0].text : 'Not set';
        };
        scope.save_data=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };

  });
