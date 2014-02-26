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
           // var element = this[0];
           // console.log(this, element);
           console.log(attrs.id)
            element.on('click',function(){
               if (document.selection) 
               {
                  var range = document.body.createTextRange();
                  range.moveToElementText(document.getElementById(attrs.id));
                  range.select();
               }
               else if (window.getSelection) 
               {
                  var range = document.createRange();
                  range.selectNode(document.getElementById(attrs.id));
                  window.getSelection().addRange(range);
               }
            })
            
        }
    };
});