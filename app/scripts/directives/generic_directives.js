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
}).directive('format', ['$filter', function ($filter) {
            return {
                require: '?ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    if (!ctrl) return;


                    ctrl.$formatters.unshift(function (a) {
                        return $filter('formattime')(ctrl.$modelValue, attrs.format)
                    });
                }
            };
}]).directive('profileImage', ['$window', function($window) {
  return {
      replace: true,
      restrict: "E",
      scope:{
        email: "=",
        imagesize: "@"
      },
      templateUrl: "/views/profile_image.html",
      link: function (scope, element) {
        scope.$watch('email', function(){
          if(scope.email){
            scope.source_image = 'http://www.gravatar.com/avatar/'+md5(scope.email)+'?s='+scope.imagesize+'&r=pg';
          }
          else{
            element.css('height', scope.imagesize+'px');
            element.css('width', scope.imagesize+'px');
            scope.source_image = '../../images/user_image.png'
          }
          element.attr('src', scope.source_image)
        });
      }
    };
}]).directive('contextMenu', ['$window', function($window) {
  return {
    restrict: 'A',
    scope:{
      opened:'='
    },
    link: function(scope, element, attrs) {
         var menuElement = angular.element(element.find('.'+attrs.target)),
          open = function open(event, element) {
            angular.element('.open').removeClass('open')
            scope.opened = true;
            element.css('top', event.clientY + 'px');
            element.css('left', event.clientX + 'px');
            element.css('zIndex', 1)
            element.addClass('open');
            angular.element('body').css('overflow', 'hidden')
          },
          close = function close(element) {
            scope.opened = false;
            element.removeClass('open');
            angular.element('body').css('overflow', 'auto')
          };

      menuElement.css('position', 'fixed');
      menuElement.css('cursor', 'pointer');

      scope.$watch('opened',function(){
        if(scope.opened)
          open(event, menuElement);
        else
          close(menuElement);
      })

      element.bind('contextmenu', function(event) {          
        if (scope.opened) {
          scope.$apply(function() {
            event.preventDefault();
            close(menuElement);
          });
        }
        else{
          scope.$apply(function() {
            event.preventDefault();
            open(event, menuElement);
          });
        }
      });
      angular.element($window).bind('click', function(event) {
        if (scope.opened) {
          scope.$apply(function() {
            event.preventDefault();
            close(menuElement);
          });
        }
      });
    }
  };
}]).directive('courseItem', ['ErrorHandler',function(ErrorHandler) {
  return{
    replace:true,
    restrict: "E",
    scope:{
      course: '=',
      teachers: '='
    },
    templateUrl: '/views/courseItem.html',
    link: function(scope){}
  };
}]).directive('teacherCourseItem', ['ErrorHandler',function(ErrorHandler) {
  return{
    replace:true,
    restrict: "E",
    scope:{
      course: '=',
      teachers: '='
    },
    templateUrl: '/views/teacher_course_item.html',
    link: function(scope){}
  };
}]).directive('screenfull', function(){
  return {
    restrict: 'A',
    scope:{
      active:'='
    },
    link: function(scope, element, attrs) {
      scope.$watch('active',function(){
        if (screenfull.enabled) {
          if(scope.active)
            screenfull.request(angular.element(element).parent()[0]);
          else
            screenfull.exit()
        }  
      })
          
    }
  }
})