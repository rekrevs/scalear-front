'use strict';

angular.module('scalearAngularApp')
  .directive('autoFillSync', ["$timeout", function($timeout) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {
        var origVal = elem.val();
        $timeout(function() { // a hack, we can't guarantee that 500 ms means browser will auto-fill first.
          var newVal = elem.val();
          if(ngModel.$pristine && origVal !== newVal) {
            ngModel.$setViewValue(newVal);
          }
        }, 500);
      }
    }

  }]).directive('format', ['$filter', function($filter) {
    return {
      require: '?ngModel',
      link: function(scope, elem, attrs, ctrl) {
        if(!ctrl) return;
        ctrl.$formatters.unshift(function(a) {
          return $filter('formattime')(ctrl.$modelValue, attrs.format)
        });
      }
    };
  }]).directive('profileImage', ['$window', function($window) {
    return {
      replace: true,
      restrict: "E",
      scope: {
        email: "=",
        imagesize: "@",
        background: "@"
      },
      templateUrl: "/views/profile_image.html",
      link: function(scope, element) {
        scope.$watch('email', function() {
          if(scope.email) {
            scope.source_image = 'https://www.gravatar.com/avatar/' + md5(scope.email) + '?s=' + scope.imagesize + '&r=pg&default=https%3A%2F%2Fs.gravatar.com%2Favatar%2F7b2c0c5390921bbccd4818d0cf4bcb71%3Fs%3D' + scope.imagesize + '%26r%3Dpg';
          } else {
            scope.source_image = 'https://www.gravatar.com/avatar/000000000?s=' + scope.imagesize + '&r=pg&default=https%3A%2F%2Fs.gravatar.com%2Favatar%2F7b2c0c5390921bbccd4818d0cf4bcb71%3Fs%3D' + scope.imagesize + '%26r%3Dpg';

          }
        });
      }
    };
  }]).directive('contextMenu', ['$window', '$log', function($window, $log) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var menuElement = angular.element(element.find('.' + attrs.target))
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
          menuElement.css('top', event.clientY + 5 + 'px');
          menuElement.css('left', event.clientX - 10 + 'px');
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
  }]).directive('teacherCourseItem', ['ErrorHandler', function(ErrorHandler) {
    return {
      restrict: "E",
      scope: {
        course: '=',
        teachers: '=',
        deletecourse: '=',
        filterteacher: '=',
        currentuser: "="
      },
      templateUrl: '/views/teacher/course_list/teacher_course_item.html',
      link: function(scope) {}
    };
  }]).directive('courseItem', ['ErrorHandler', function(ErrorHandler) {
    return {
      replace: true,
      restrict: "E",
      scope: {
        course: '=',
        teachers: '=',
        unenroll: '='
      },
      templateUrl: '/views/student/course_list/student_course_item.html',
      link: function(scope) {}
    };
  }]).directive('userItem', ['ErrorHandler', function(ErrorHandler) {
    return {
      replace: true,
      restrict: "E",
      scope: {
        user: '=',
        select: '=',
        emailsingle: '=',
        removestudent: '=',
        deletemode: '='
      },
      templateUrl: '/views/user_item.html',
      link: function(scope) {
        scope.toggleSelect = function() {
          scope.select(scope.user)
        }
      }
    };
  }]).directive('announcementItem', ['ErrorHandler', function(ErrorHandler) {
    return {
      // replace: true,
      restrict: "E",
      scope: {
        announcement: '=',
        saveannouncement: '=',
        showannouncement: '=',
        hideannouncement: '=',
        deleteannouncement: '=',
        saving: '=',
        index: '='
      },
      templateUrl: '/views/announcementItem.html',
      link: function(scope) {}
    };
  }]).directive('screenfull', function() {
    return {
      restrict: 'A',
      scope: {
        active: '='
      },
      link: function(scope, element, attrs) {
        scope.$watch('active', function() {
          if(screenfull.enabled) {
            if(scope.active){
              var mainVideoContainer = angular.element(element)[0]              
           
              if (mainVideoContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                mainVideoContainer.webkitRequestFullscreen();
              } else {
                screenfull.request(mainVideoContainer);
              }
            }
            else
              screenfull.exit()
          }
        })
      }
    }
  }).directive('enrollmentModal', ['$modal', function($modal) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element) {
        scope.open = function() {
          angular.element('.button').blur()
          $modal.open({
            templateUrl: '/views/student/course_list/enroll_modal.html',
            controller: "StudentEnrollModalCtrl"
          })
        }
      }
    }
  }]).directive('calendarModal', ['$modal', function($modal) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element) {
        scope.openCalendar = function() {
          angular.element('.button').blur()
          $modal.open({
            templateUrl: '/views/student/calendar/calendar.html',
            controller: "CalendarModalCtrl"
          })
        }

      }
    }

  }]).directive('enrollHelpModal', ['$modal', 'UserSession','$location', function($modal, UserSession,$location) {
    return {
      restrict: 'A',
      replace: true,
      link: function(scope, element) {
        scope.openHelpModal = function(course) {
          UserSession.getCurrentUser().then(function(user) {
            scope.current_user = user
          })
          scope.course = course
          scope.enrollment_url = $location.absUrl().split('courses')[0]+"courses/enroll?id="+scope.course.unique_identifier
          scope.enrollment_url_guest = $location.absUrl().split('courses')[0]+"courses/enroll?id="+scope.course.guest_unique_identifier
          // scope.getTextToCopy = function() {
          //   return $("#enrollment_message").text();
          // }
          // scope.animateCopy = function() {
          //   $('#enrollment_message').select()
          //   $('#enrollment_message, #enrollment_message li').children().animate({ color: "#428bca" }, "fast").delay(400).animate({ color: "black" }, "fast");
          // }
          scope.copySuccess = function (e) {
            $('#enrollment_message, #enrollment_message li')
            .children()
            .animate({ color: "#428bca" }, "fast")
            .delay(300)
            .animate({ color: "black" }, "fast", function () {
               e.clearSelection();
            });
          }

          scope.copyError = function (e) {

          }

          $modal.open({
            templateUrl: '/views/teacher/course/help_enroll.html',
            controller: ['$scope', '$modalInstance', function($scope, $modalInstance){
              $scope.close = function () {
               $modalInstance.dismiss();
             };
           }],
            scope: scope
          })
        }

      }
    }

  }]).directive('embedSrc', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var current = element;
        scope.$watch(function() {
          return attrs.embedSrc;
        }, function() {
          var clone = element
            .clone()
            .attr('src', attrs.embedSrc);
          current.replaceWith(clone);
          current = clone;
        });
      }
    };
  }).directive('ngAutoExpand', function() {
    return {
      restrict: 'A',
      link: function($scope, elem, attrs) {
        elem.bind('keyup', function($event) {
          var element = $event.target;

          $(element).height(0);
          var height = $(element)[0].scrollHeight;

          // 8 is for the padding
          if(height < 20) {
            height = 28;
          }
          $(element).height(height - 8);
        });

        // Expand the textarea as soon as it is added to the DOM
        setTimeout(function() {
          var element = elem;

          $(element).height(0);
          var height = $(element)[0].scrollHeight;

          // 8 is for the padding
          if(height < 20) {
            height = 28;
          }
          $(element).height(height - 8);
        }, 0)
      }
    };
  }).directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          if(event.shiftKey == false) {
            scope.$apply(function() {
              scope.$eval(attrs.ngEnter);
            });
            event.preventDefault();
          }
        }
      });
    };
  })
