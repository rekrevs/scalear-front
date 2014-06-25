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
            angular.element($window).on('click', function(event) {
              console.log(event)
              if (scope.opened && event.which !=3) {
                scope.$apply(function() {
                  event.preventDefault();
                  close(menuElement); 
                  angular.element($window).off('click')
                });
              }
            });
          },
          close = function close(element) {
            scope.opened = false;
            element.removeClass('open');
            angular.element('body').css('overflow', 'auto')
            angular.element($window).off('click')
          };

      menuElement.css('position', 'fixed');
      menuElement.css('cursor', 'pointer');

      scope.$watch('opened',function(){
        if(!scope.opened)
        //   open(event, menuElement);
        // else
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
            screenfull.request(angular.element(element)[0]);
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
}]).directive('contentNavigator',['Module', '$stateParams', '$state', '$timeout', function(Module, $stateParams, $state, $timeout){
  return{
    restrict:'E',
    replace: 'true',
    scope:{
      modules: '=',
      currentmodule: '=',
      currentitem: '=',
      mode: '@'
    },
    templateUrl:"/views/content_navigator.html",
   link:function(scope, element, attr){
      scope.toggleNavigator = function(){
        scope.open_navigator = !scope.open_navigator
      }
      scope.showModuleCourseware = function(module){
        if(module.id != scope.currentmodule.id){
          scope.currentmodule = module//$scope.modules_obj[module_id];
          // $scope.close_selector = true;
          Module.getLastWatched(
            {course_id: $stateParams.course_id, module_id: module.id}, function(data){
              $timeout(function(){
                scope.toggleNavigator();
              })
              if(data.last_watched != -1){
                $state.go('course.courseware.module.lecture', {'module_id': module.id, 'lecture_id': data.last_watched})
                scope.currentitem = data.last_watched
              }
              else{
                $state.go('course.courseware.module.quiz', {'module_id': module.id, 'quiz_id': module.quizzes[0].id})
                scope.currentitem = module.quizzes[0].id
              }
          }) 
        }  
      }


      scope.showItemCourseware = function(item){
        console.log(item)
        $timeout(function(){
          scope.toggleNavigator();
        })
        var item_id = item.class_name+'_id';
        if(item.class_name == 'lecture'){
          $state.go('course.courseware.module.'+item.class_name, {'module_id': item.group_id, 'lecture_id': item.id})
        }
        else if(item.class_name == 'quiz'){
          $state.go('course.courseware.module.'+item.class_name, {'module_id': item.group_id, 'quiz_id': item.id})
        }
        
      }

      scope.showModuleInclass = function(module){
        $timeout(function(){
          scope.toggleNavigator();
        })
        scope.currentmodule = module//$scope.getSelectedModule()
        $state.go('course.inclass.module',{module_id: module.id})
        // $scope.toggleSelector();
      }
   }
  }
}]);
