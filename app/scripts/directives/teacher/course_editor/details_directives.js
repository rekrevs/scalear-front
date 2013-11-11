'use strict';

angular.module('scalearAngularApp')
  .directive('detailsText', ['$timeout',function ($timeout) {
    return {
      template: '<a href="#" onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || "empty" }} <i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
        validate: "&",
        column: "@"
      },
      link:function(scope, element){
      	scope.selectField = function()
      	{
      		if(scope.column=="url"){
      		  $timeout(function(){
      		  	element.find('.editable-input').select();
      		  });
      		}
      	};
      	
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  }])
  .directive('detailsCheck', ['$timeout',function ($timeout) {
    return {
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-checkbox="checked" e-title="{{title}}" class="editable-checkbox" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ checked && yes || no }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	checked: "=",
      	save: "&",
      	title: "@",
      	yes: "@",
      	no: "@",
        validate: "&",
        column: "@"
      },
      link:function(scope){
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  }])
  .directive('detailsDate', ['$timeout',function ($timeout) {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-bsdate="date" e-datepicker-popup="dd-MMMM-yyyy" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ (date | date:"MM/dd/yyyy") || \'empty\' }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	date: "=",
      	save: "&",
        validate: "&",
        column: "@"
      },
      link:function(scope){
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  }])
  .directive('detailsArea', ['$timeout',function ($timeout) {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" e-cols="15" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || "Empty" }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
        validate: "&",
        column: "@"
      },
      link:function(scope){
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };
  }])
  .directive('detailsNumber', ['$timeout',function ($timeout) {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-number="value" e-min="min" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
      	min: "@",
        validate: "&",
        column: "@"
      },
      link:function(scope){
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };

  }])
  .directive('detailsSelect', ['$timeout','$filter',function ($timeout, $filter) {
    return {

      template: '<a href="#" editable-select="value" buttons="no" e-ng-options="s.value as s.text for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px;">{{ showStatus() }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
        value: "=",
        options: "=",
        save: "&",  
        validate: "&",
        column: "@"              
      },
      link:function(scope){
        scope.showStatus = function() {
          var selected = $filter('filter')(scope.options, {value: scope.value});
          return selected.length ? selected[0].text : 'Not set';
        };
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };

  }]);
