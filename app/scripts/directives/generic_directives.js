'use strict';

angular.module('scalearAngularApp')
    .directive('autoFillSync',["$timeout", function($timeout) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
            var origVal = elem.val();
            $timeout(function () { // a hack, we can't guarantee that 500 ms means browser will auto-fill first.
                var newVal = elem.val();
                if(ngModel.$pristine && origVal !== newVal) {
                    ngModel.$setViewValue(newVal);
                }
            }, 500);
        }
    }
}]).directive('format', ['$filter', function ($filter) {
            return {
                require: '?ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    if (!ctrl) return;


                    ctrl.$formatters.unshift(function (a) {
                        return $filter('formattime')(ctrl.$modelValue, attrs.format)
                    });

//
//                    ctrl.$parsers.unshift(function (viewValue) {
//                        var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
//                        elem.val($filter('number')(plainNumber));
//                        return plainNumber;
//                    });
                }
            };
}])
