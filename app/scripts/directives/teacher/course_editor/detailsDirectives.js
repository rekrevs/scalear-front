'use strict';

angular.module('scalearAngularApp')
  .directive('detailsText', function () {
    return {
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'"  editable-text="value" onaftersave="save()">{{ value || "empty" }} <i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
      },
    };
  })
  .directive('detailsCheck', function () {
    return {
      template: '<a href="#" ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" editable-checkbox="checked" e-title="{{title}}" class="editable-checkbox" onaftersave="save()">{{ checked && yes || no }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	checked: "=",
      	save: "&",
      	title: "@",
      	yes: "@",
      	no: "@"
      },
    };
  })
  .directive('detailsDate', function () {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-date="date" onaftersave="callfn()">{{ (date | date:"dd/MM/yyyy") || \'empty\' }}<i ng-class="overclass"></i></a>',
      restrict: 'E',
      scope:{
      	date: "=",
      	save: "&",
      },
    };
  })
  .directive('detailsArea', function () {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-textarea="value" e-rows="5" e-cols="15" onaftersave="save()">{{ value || "Empty" }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
      },
    };
  })
  .directive('detailsNumber', function () {
    return {
      template: '<a ng-mouseover="overclass = \'icon-pencil\'" ng-mouseleave="overclass= \'\'" href="#" editable-number="value" e-min="min" onaftersave="save()">{{ value }}<i ng-class="overclass"></i></a> ',
      restrict: 'E',
      scope:{
      	value: "=",
      	save: "&",
      	min: "@"
      },
    };
  });
