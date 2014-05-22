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
        imagesize: "@",
        background: "@"
      },
      templateUrl: "/views/profile_image.html",
      link: function (scope, element) {
        scope.$watch('email', function(){
          if(scope.email){
            scope.source_image = 'http://www.gravatar.com/avatar/'+md5(scope.email)+'?s='+scope.imagesize+'&r=pg&default=https%3A%2F%2Fs.gravatar.com%2Favatar%2F7b2c0c5390921bbccd4818d0cf4bcb71%3Fs%3D'+scope.imagesize+'%26r%3Dpg';
          }
          else{
            scope.source_image = 'http://www.gravatar.com/avatar/000000000?s='+scope.imagesize+'&r=pg&default=https%3A%2F%2Fs.gravatar.com%2Favatar%2F7b2c0c5390921bbccd4818d0cf4bcb71%3Fs%3D'+scope.imagesize+'%26r%3Dpg';

          }
          //else{
            // element.css('height', scope.imagesize+'px');
            // element.css('width', scope.imagesize+'px');
            //scope.source_image = null
          //}
          // element.attr('src', scope.source_image)
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
}]).directive('teacherCourseItem', ['ErrorHandler',function(ErrorHandler) {
  return{
    replace:true,
    restrict: "E",
    scope:{
      course: '=',
      teachers: '=',
      deletecourse: '=',
      filterteacher: '='
    },
    templateUrl: '/views/teacher_course_item.html',
    link: function(scope){}
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
}]).directive('userItem', ['ErrorHandler',function(ErrorHandler) {
  return{
    replace:true,
    restrict: "E",
    scope:{
      user: '=',
      select: '=',
      emailsingle: '=',
      removestudent: '='
    },
    templateUrl: '/views/user_item.html',
    link: function(scope){
      scope.$watch('user', function(){
        if(scope.user){
          scope.user.full_name = scope.user.name+' '+scope.user.last_name;
        }
      });
      scope.toggleSelect = function(){
        scope.select(scope.user)
      }
    }
  };
}]).directive('announcementItem', ['ErrorHandler',function(ErrorHandler) {
  return{
    replace:true,
    restrict: "E",
    scope:{
      announcement: '=',
      saveannouncement: '=',
      showannouncement:'=',
      hideannouncement: '=',
      deleteannouncement: '=',
      saving: '=',
      index: '='
    },
    templateUrl: '/views/announcementItem.html',
    link: function(scope){
      scope.$watch('announcement', function(val, val2){
        if(val != val2){
          console.log(scope.announcement)
        }
      })
      }
  };
}]).directive('studentAnnouncementItem', ['ErrorHandler',function(ErrorHandler) {
  return{
    replace:true,
    restrict: "E",
    scope:{
      announcement: '='
    },
    templateUrl: '/views/student/calendar/announcementItem.html',
    link: function(scope){
      }
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
}).directive('smartImage', ['$http', function($http){
  return{
    restrict: 'E',
    scope:{
      defaultimage: '=',
      desiredimage: '=',
      notfound: '='
    },
    templateUrl: '/views/smart_image.html',
    link: function(scope, element){
      var image_pattern = new RegExp('\.(((g|G)(i|I)(f|F))|((j|J)(p|P)(e|E)?(g|G))|((p|P)(n|N)(g|G)))$');
      var smart_image = angular.element('#course-image-smart')
      smart_image[0].onerror = function(){
        scope.notfound = 'courses.image_not_found'
        smart_image[0].src = scope.defaultimage
        scope.$apply();
      }
      console.log(smart_image[0])
      scope.$watch('desiredimage', function(){
        if(!scope.desiredimage){
          scope.finalimage = scope.defaultimage;
          scope.notfound = ''
        }
        else{
          if(image_pattern.test(scope.desiredimage)){
            scope.finalimage = scope.desiredimage;
            scope.notfound = ''
          }
        }

      });
    }
  }
}]).directive('noticeMessage',function(){
  return{
    restrict:'E',
    scope:{
      message:'@',
      action:"&buttonAction",
      button_title:"@buttonTitle"
    },
    template:'<span>{{message}}</span>'+
             '<button ng-click="action()" class="btn" style="font-size: 12px;padding: 0px 6px;margin: 1px 12px;background: lightgray;">{{button_title}}</button>'
  }
})
