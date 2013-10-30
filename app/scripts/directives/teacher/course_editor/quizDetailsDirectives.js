'use strict';

angular.module('scalearAngularApp')
  .directive('detailsText', function () {
    return {
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="m[name]" onaftersave="now()">{{ m[name] || "empty" }} <i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	name: "@",
      	callfn: "&",
      	m: "="
      },
      link: function postLink(scope, element, attrs) {
 //     	var d=scope.name;
   //   	scope.e=scope.m[d];
      	
        scope.now = function()
        {
   //     	var d=scope.name;
     // 		scope.m[d]=scope.e;
        	scope.callfn();
        };
      
      }
    };
  })
  .directive('detailsCheck', function () {
    return {
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-checkbox="m[name]" e-title="{{etitle}}" class="editable-checkbox" onaftersave="callfn()">{{ m[name] && yes || no }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	name: "@",
      	callfn: "&",
      	m: "=",
      	etitle: "@",
      	yes: "@",
      	no: "@"
      },
    };
  })
  .directive('detailsDate', function () {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-date="m[name]" onaftersave="callfn()">{{ (m[name] | date:"dd/MM/yyyy") || \'empty\' }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	name: "@",
      	callfn: "&",
      	m: "=",
      },
    };
  })
  .directive('detailsArea', function () {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="m[name]" e-rows="5" e-cols="15" onaftersave="callfn()">{{ m[name] || "Empty" }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	name: "@",
      	callfn: "&",
      	m: "=",
      },
    };
  })
  .directive('detailsNumber', function () {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-number="m[name]" e-min="min" onaftersave="callfn()">{{ m[name] }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	name: "@",
      	callfn: "&",
      	m: "=",
      	min: "@"
      },
    };
  });
