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
}]).directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var doc = document;
            element.on('click',function(){
               if (doc.selection) 
               {
                  var range = doc.body.createTextRange();
                  range.moveToElementText(doc.getElementById(attrs.id));
                  range.select();
               }
               else if (window.getSelection) 
               {
                  var range = doc.createRange();
                  range.selectNode(doc.getElementById(attrs.id));
                  window.getSelection().addRange(range);
               }
            })
            
        }
    };
});