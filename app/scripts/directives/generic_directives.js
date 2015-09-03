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
            scope.source_image = 'https://www.gravatar.com/avatar/'+md5(scope.email)+'?s='+scope.imagesize+'&r=pg&default=https%3A%2F%2Fs.gravatar.com%2Favatar%2F7b2c0c5390921bbccd4818d0cf4bcb71%3Fs%3D'+scope.imagesize+'%26r%3Dpg';
          }
          else{
            scope.source_image = 'https://www.gravatar.com/avatar/000000000?s='+scope.imagesize+'&r=pg&default=https%3A%2F%2Fs.gravatar.com%2Favatar%2F7b2c0c5390921bbccd4818d0cf4bcb71%3Fs%3D'+scope.imagesize+'%26r%3Dpg';

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
}]).directive('contextMenu', ['$window','$log', function($window,$log) {
  return {
    restrict: 'A',
    scope:{
      opened:'='
    },
    link: function(scope, element, attrs) {
      var menuElement = angular.element(element.find('.'+attrs.target))
      menuElement.css('position', 'fixed');
      menuElement.css('cursor', 'pointer');

      var close = function() {
        scope.opened = false;
        angular.element('.open').removeClass('open').css('display', 'none')
        angular.element($window).add(element).off('click')
      };
      var open = function(event) {
        close(); 
        scope.opened = true;
        menuElement.css('width', "10%");
        menuElement.css('top', event.clientY+5+ 'px');
        menuElement.css('left', event.clientX-10 + 'px');
        menuElement.css('zIndex', 10000)
        menuElement.addClass('open');
        menuElement.css('display', 'block')
        angular.element($window).add(element).on('click', function(event) {
          $log.debug(event)              
          if(scope.opened) {
            scope.$apply(function() {
              event.preventDefault();
              event.stopPropagation();
              close(); 
            });
          }
        });
      }

      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          event.stopPropagation();
          open(event); 
        });
      });      
    }
  };
}]).directive('teacherCourseItem', ['ErrorHandler',function(ErrorHandler) {
  return{
    // replace:true,
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
      teachers: '=',
      unenroll:'='
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
      removestudent: '=',
      deletemode: '='
    },
    templateUrl: '/views/user_item.html',
    link: function(scope){
      // var unwatch = scope.$watch('user', function(){
      //   if(scope.user){
      //     scope.user.full_name = scope.user.name+' '+scope.user.last_name;
      //     unwatch()
      //   }
      // });
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
    link: function(scope){}
  };
}])
// .directive('studentAnnouncementItem', ['ErrorHandler',function(ErrorHandler) {
//   return{
//     replace:true,
//     restrict: "E",
//     scope:{
//       announcement: '='
//     },
//     templateUrl: '/views/student/calendar/announcementItem.html',
//     link: function(scope){
//       }
//   };
// }])
.directive('screenfull', function(){
  return {
    restrict: 'A',
    scope:{
      active:'='
    },
    link: function(scope, element, attrs) {
      scope.$watch('active',function(){
        if (screenfull.enabled) {
          if(scope.active)
            screenfull.request(angular.element(element)[0]);
          else
            screenfull.exit()
        }  
      })
          
    }
  }
})
// .directive('smartImage', ['$http','$log', function($http, $log){
//   return{
//     restrict: 'E',
//     scope:{
//       defaultimage: '=',
//       desiredimage: '=',
//       notfound: '='
//     },
//     templateUrl: '/views/smart_image.html',
//     link: function(scope, element){
//       var image_pattern = new RegExp('\.(((g|G)(i|I)(f|F))|((j|J)(p|P)(e|E)?(g|G))|((p|P)(n|N)(g|G)))$');
//       var smart_image = angular.element('#course-image-smart')
//       smart_image[0].onerror = function(){
//         scope.notfound = 'courses.image_not_found'
//         smart_image[0].src = scope.defaultimage
//         scope.$apply();
//       }
//       $log.debug(smart_image[0])
//       scope.$watch('desiredimage', function(){
//         if(!scope.desiredimage){
//           scope.finalimage = scope.defaultimage;
//           scope.notfound = ''
//         }
//         else{
//           if(image_pattern.test(scope.desiredimage)){
//             scope.finalimage = scope.desiredimage;
//             scope.notfound = ''
//           }
//         }

//       });
//     }
  // }
// }])
.directive('noticeMessage',function(){
  return{
    restrict:'E',
    scope:{
      message:'@',
      action:"&buttonAction",
      button_title:"@buttonTitle",
      close:'='
    },
    templateUrl:"/views/notice_message.html",
   link:function(scope, element, attr){
      scope.buttonClick=function(){
        scope.disable_button=true
        scope.action()
      }
   }
  }
}).directive('onFinishRenderFilters', ['$timeout',function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  }
}]).directive('enrollmentModal', ['$modal', function($modal){
  return{
    restrict: 'A',
    replace: true,
    link: function(scope, element){
      scope.open = function () {
        angular.element('.button').blur()
        $modal.open({
            templateUrl: '/views/student/course_list/enroll_modal.html',
            controller: "StudentEnrollModalCtrl"
        })

        // modalInstance.result.then(function (enrollment_key) {
        //   $log.debug($scope.course)
          // $rootScope.show_alert="success"; 
          // ErrorHandler.showMessage($translate('controller_msg.enrolled_in', {course: $scope.course.name}), 'errorMessage', 2000);
          // $timeout(function(){
          //  $rootScope.show_alert=""; 
          // },5000);
            
          // init();

        // }
        // ,
        // function () {
        //     $log.info('Modal dismissed at: ' + new Date());
        // })
      }

    }
  }

}]).directive('calendarModal', ['$modal', function($modal){
  return{
    restrict: 'A',
    replace: true,
    link: function(scope, element){
      scope.openCalendar = function () {
        angular.element('.button').blur()
        $modal.open({
            templateUrl: '/views/student/calendar/calendar.html',
            controller: "CalendarModalCtrl"
        })
      }

    }
  }

}]).directive('dashboardCalendarModal', ['$modal', function($modal){
  return{
    restrict: 'A',
    replace: true,
    link: function(scope, element){
      scope.openCalendar = function () {
        angular.element('.button').blur()
        $modal.open({
            templateUrl: '/views/student/calendar/calendar.html',
            controller: "dashboardCtrl"
        })
      }

    }
  }

}]).directive('enrollHelpModal', ['$modal','$rootScope', function($modal,$rootScope){
  return{
    restrict: 'A',
    replace: true,
    link: function(scope, element){
      scope.openHelpModal = function (course) {
        scope.course= course
        scope.current_user = $rootScope.current_user
        scope.getTextToCopy = function() {
          return $("#enrollment_message").text();
        }
        scope.animateCopy=function(){
           $('#enrollment_message').select()
           $('#enrollment_message, #enrollment_message p').animate({ color: "#428bca" }, "fast").delay(400).animate({ color: "black" }, "fast");
        }
        $modal.open({
            templateUrl: '/views/modals/help_enroll.html',
            scope: scope
        })
      }

    }
  }

}]).directive('embedSrc', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var current = element;
      scope.$watch(function() { return attrs.embedSrc; }, function () {
        var clone = element
                      .clone()
                      .attr('src', attrs.embedSrc);
        current.replaceWith(clone);
        current = clone;
      });
    }
  };
})
