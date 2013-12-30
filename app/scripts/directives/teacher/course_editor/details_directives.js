'use strict';

angular.module('scalearAngularApp')
  .directive('detailsText', ['$timeout',function ($timeout) {
    return {
      template: '<a href="#" onshow="selectField()" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate) }} <i ng-class="overclass"></i></a>',
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
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-bsdate="date" e-datepicker-popup="dd-MMMM-yyyy" onbeforesave="validate()(column,$data)" onaftersave="saveData($data)">{{ (date | date:"dd/MM/yyyy") || ("empty"|translate) }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	date: "=",
      	save: "&",
        validate: "&",
        column: "@"
      },
      link:function(scope){
        scope.saveData=function(data){
          $timeout(function(){
            scope.save({data:data, type:scope.column})
          })
        }
      }
    };
  }])
  .directive('detailsArea', ['$timeout',function ($timeout) {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate)  }}<i ng-class="overclass"></i></a> ',
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
    .directive('bigArea', ['$timeout',function ($timeout) {
        return {
            template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" e-cols="150" onbeforesave="validate()(column,$data)" onaftersave="saveData()">{{ value || ("empty"|translate)  }}<i ng-class="overclass"></i></a> ',
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
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-select="value" buttons="no" e-ng-options="s.value as (s.text|translate) for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px;">{{ showStatus() }}<i ng-class="overclass"></i></a> ',
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
          return selected.length ? $filter('translate')(selected[0].text) : 'Not set';
        };
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
      }
    };

  }]).directive('detailsTimeZone', ['$timeout','$filter',function ($timeout, $filter) {
    return {

      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-select="value" buttons="no" e-ng-options="s as s for s in options" onbeforesave="validate()(column,$data)" onaftersave="saveData()" e-style="width:120px;">{{ status }}<i ng-class="overclass"></i></a> ',
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
          var selected = $filter('filter')(scope.options, scope.value);
          return selected.length ? selected[0] : 'Not set';
        };
        scope.saveData=function(){
          $timeout(function(){
            scope.save()
          })
        }
        
        scope.$watch('value', function(){
        	if(scope.options)
        		scope.status=scope.showStatus();
        });
        
      }
    };

  }]);
