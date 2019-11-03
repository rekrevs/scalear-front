'use strict';

angular.module('scalearAngularApp')
  .directive('mainNavigation', ['$state', '$tour', 'scalear_api', '$timeout', '$cookieStore', '$rootScope', 'Impersonate', 'ContentNavigator', 'User', 'Preview', '$log','UserSession', function($state, $tour, scalear_api, $timeout, $cookieStore, $rootScope, Impersonate, ContentNavigator, User, Preview, $log, UserSession) {
    return {
      replace: true,
      restrict: "E",
      transclude: "true",
      scope: {
        user: '=',
        teacher_courses: '=teacherCourses',
        student_courses: '=studentCourses',
      },
      templateUrl: "/views/main_navigation.html",
      link: function(scope, element) {
        scope.scalear_api = scalear_api
        scope.lti_embed  = location.hash.indexOf('lti_course_list') != -1;
        $rootScope.$watch('preview_as_student', function() {
          scope.preview_as_student = $rootScope.preview_as_student
        })

        scope.logout = function() {
          $rootScope.busy_loading = true;
          $timeout(function() {
            UserSession.logout().then(function(){
              $state.go("login");
              $rootScope.busy_loading = false;
            })
          }, 200);
        }

        scope.areShared = function() {
          return scope.user && scope.user.accepted_shared
        }
        scope.getEndDate = function(start_date, duration) {
          return start_date.setDate(start_date.getDate() + (duration * 7));
        }

        scope.goToCourse = function(course, role) {
          if(course.id != $state.params.course_id){
            $state.go('course', { course_id: course.id })
            scope.closeMenu()
          }
        }

        scope.startTour = function() {
          $log.debug($state.current.name)
          scope.$emit('start_tour', { state: $state.current.name })
        }

        scope.closeMenu =function(event) {
          $timeout(function() {
            angular.element('.toggle-topbar').click();
          })
        }

        scope.disablePreview = function() {
          Preview.stop()
        }
      }
    };
  }]).directive('teacherNavigation', ['$rootScope', '$state', 'ContentNavigator', 'DetailsNavigator', 'Impersonate', '$cookieStore', function($rootScope, $state, ContentNavigator, DetailsNavigator, Impersonate, $cookieStore) {
    return {
      replace: true,
      restrict: "E",
      scope: {},
      templateUrl: '/views/teacher/teacher_sub_navigation.html',
      link: function(scope) {
        scope.ContentNavigator = ContentNavigator
        scope.DetailsNavigator = DetailsNavigator
        scope.$state = $state
          // scope.$watch("$state.includes('*.module.**')",function(value){
          // 	scope.in_module_state = value
          // })
        scope.$on("Course:ready",function(ev, course_data){
          scope.course = course_data
        })

        scope.initFilters = function() {
          scope.progress_item_filter = { lecture_quizzes: true, confused: true, charts: true, discussion: true, free_question: true };
          scope.progress_filter = { quiz: true, survey: true };
        }

        scope.toggleNavigator = function() {
          ContentNavigator.setStatus(!ContentNavigator.getStatus())
        }

        scope.toggleDetails = function() {
          DetailsNavigator.setStatus(!DetailsNavigator.getStatus())
        }

        var setDetails = function(val) {
          DetailsNavigator.setStatus(val)
        }

        scope.goToEditor = function() {
          $state.includes("**.module.**") ? $state.go("course.module.course_editor.overview") : $state.go("course.course_editor")
        }

        scope.goToProgress = function() {
          $state.includes("**.module.**") ? $state.go("course.module.progress_overview") : $state.go("course.progress_overview")
        }

        scope.goToClass = function() {
          $state.includes("**.module.**") ? $state.go("course.module.inclass") : $state.go("course.inclass")
        }

        scope.pasteItem = function() {
          $rootScope.$broadcast('paste_item')
        }

        scope.print = function() {
          $rootScope.$broadcast('print')
        }

        scope.updateProgressItemFilter = function(type) {
          if(type == 'lecture_quizzes') {
            scope.progress_item_filter['charts'] = !scope.progress_item_filter['lecture_quizzes']
            scope.progress_item_filter['free_question'] = !scope.progress_item_filter['lecture_quizzes']
          }
          scope.progress_item_filter[type] = !scope.progress_item_filter[type]
          $rootScope.$broadcast('progress_item_filter_update', scope.progress_item_filter)
        }

        scope.updateProgressFilter = function(type) {
          scope.progress_filter[type] = !scope.progress_filter[type]
          $rootScope.$broadcast('progress_filter_update', scope.progress_filter)
        }

        setDetails(true)
      }
    };
  }]).directive('studentNavigation', ['ContentNavigator', 'TimelineNavigator', '$state', function(ContentNavigator, TimelineNavigator, $state) {
    return {
      replace: true,
      restrict: "E",
      transclude: true,
      scope: {},
      templateUrl: '/views/student/student_sub_navigation.html',
      link: function(scope) {
        scope.ContentNavigator = ContentNavigator
        scope.TimelineNavigator = TimelineNavigator

        scope.$on("Course:ready",function(ev, course_data){
          scope.course = course_data
        })

        scope.toggleNavigator = function() {
          if(!$state.includes('course.content_selector'))
            ContentNavigator.setStatus(!ContentNavigator.getStatus())
        }

        scope.toggleTimeline = function() {
          TimelineNavigator.setStatus(!TimelineNavigator.getStatus())
        }
      }
    };
  }]).directive('contentNavigator', ['Module', '$stateParams', '$state', '$timeout', 'Lecture', 'Course', 'ContentNavigator', '$rootScope', 'Preview', '$log', 'MobileDetector','UserSession', 'VideoInformation', 'ScalearUtils', function(Module, $stateParams, $state, $timeout, Lecture, Course, ContentNavigator, $rootScope, Preview, $log, MobileDetector,UserSession, VideoInformation, ScalearUtils) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        mode: '@',
        open_navigator: '=open'
      },
      templateUrl: "/views/content_navigator.html",
      link: function(scope, element, attr) {
        scope.$state = $state
        UserSession.getCurrentUser()
          .then(function(user) {
            scope.current_user = user
          })
        scope.$on('Module:ready',function(ev, modules){
          scope.modules = modules
        })
        scope.$watch('$state.params', function() {
          if($state.params.module_id) {
            scope.currentmodule = { id: $state.params.module_id }
            scope.currentitem = { id: $state.params.lecture_id || $state.params.quiz_id || $state.params.customlink_id }
            $timeout(function() {
              scope.scrollIntoView(scope.currentmodule)
            })
          } else {
            scope.currentmodule = null
            scope.currentitem = null
          }
        })
        $rootScope.$watch('clipboard', function() {
          scope.clipboard = $rootScope.clipboard
        })
        scope.$on('item_done', function(ev, item) {
          var time = 0
          if(!ContentNavigator.getStatus()) {
            // ContentNavigator.open()
            time = 700
          }
          $timeout(function() {
            if(!item.done) {
              item.done = true
              item.blink = true
              $timeout(function() {
                item.blink = false
              }, 1000)
            }
          }, time)
        })
        scope.$on('content_navigator_overlay', function(ev, data){
          toggleModuleOverlay(data.status)
        })

        scope.moduleSortableOptions = {
          axis: 'y',
          dropOnEmpty: false,
          handle: '.handle',
          cursor: 'crosshair',
          items: '.module',
          opacity: 0.4,
          scroll: true,
          update: function(e, ui) {
            Module.saveSort({ course_id: $state.params.course_id }, { group: scope.modules });
          }
        }

        scope.itemSortableOptions = {
          axis: 'y',
          dropOnEmpty: false,
          handle: '.handle',
          cursor: 'crosshair',
          items: '.item',
          opacity: 0.4,
          scroll: true,
          update: function(e, ui) {
            var group_id = ui.item.scope().item.group_id
            var items = ui.item.scope().$parent.module.items
            Lecture.saveSort({
              course_id: $state.params.course_id,
              group: group_id
            }, { items: items });
          }
        }


        function toggleModuleOverlay(status){
          scope.show_module_overlay = status
        }

        scope.showModuleCourseware = function(module, event) {
          scope.currentmodule = module
          $state.go("course.module.courseware.overview", {'module_id': module.id})
          event.stopPropagation()
        }

        scope.showItem = function(item, mode) {
          if($state.includes("**.progress.**") || $state.includes("**.progress_overview")) {
            if($state.includes("course.module.progress"))
              $rootScope.$broadcast("scroll_to_item", item)
          } else {
            var params = { 'module_id': item.group_id }
            $log.debug(item)
            var item_type = item.class_name.toLowerCase()
            params[item_type + '_id'] = item.id
            if(MobileDetector.isPhone()){
              setTimeout(function(){
                console.log('before close')
                ContentNavigator.close()}
              ,3000)
            }
            $state.go('course.module.' + mode + '.' + item_type, params)
            if(!(mode == 'courseware' && item_type == 'customlink')) {
              scope.currentitem = { id: $state.params.lecture_id || $state.params.quiz_id || $state.params.customlink_id }
            }

          }
        }

        scope.showModule = function(module, event) {
          if(scope.currentmodule){
            event.stopPropagation()
          }
          if($state.includes("course.progress_overview") || $state.includes("course.progress_main") || $state.includes("course.progress_graph") || $state.includes("course.progress")) {
            $state.go('course.module.progress_overview', { module_id: module.id })
          } else if($state.includes("course.module.progress_overview") || $state.includes("course.module.progress") || $state.includes("course.module.progress_statistics") || $state.includes("course.module.progress_students")) {
            $state.go('.', { module_id: module.id })
          } else if($state.includes("course.module.inclass") || $state.includes("course.inclass")) {
            $state.go('course.module.inclass', { module_id: module.id })
          } else {
            $state.go('course.module.course_editor.overview', { module_id: module.id })
            scope.currentmodule = { id: $state.params.module_id }
          }
          $timeout(function() {
            scope.scrollIntoView(scope.currentmodule)
          })
        }

        scope.removeModuleHover = function(event,ui, data){
          data.module.hovered = false
          ScalearUtils.safeApply();
        }

        scope.showModuleHover = function(event,ui, data) {
          data.module.hovered = true
          ScalearUtils.safeApply();
        }

        scope.preview = function() {
          if (VideoInformation.current_time!=0){
            $state.params['time'] = Math.floor(VideoInformation.current_time)
          }
          var params = $state.params
          params.prevState = $state.current.name
          $state.go("preview",params, { reload: true })
        }

        scope.addModule = function() {
          $rootScope.$broadcast('add_module')
        }

        scope.paste = function(event, module_id) {
          if(scope.clipboard.type == 'module')
            $rootScope.$broadcast('paste_item')
          else
            $rootScope.$broadcast('paste_item', module_id)
        }

        scope.copyDraggedItem=function(event,ui, data){
          $rootScope.$broadcast('copy_item', data.draggedItem)
        }

        scope.pasteDraggedItem = function(event,ui, data) {
          if(scope.currentmodule.id == data.module.id){
            $rootScope.$broadcast('clear_item')
          } else {
            $rootScope.$broadcast('paste_item', data.module.id, {cut: true})
            toggleModuleOverlay(true)
          }
          scope.currentmodule.id = data.module.id
          data.module.hovered = false
        }

        scope.scrollIntoView = function(module) {
          if($('#module_' + module.id).length) {
            $('.modules_container').scrollToThis('#module_' + module.id, { offsetTop: $('.modules_container').offset().top, duration: 400 });
          }
        }

        scope.goToCourseInfoStudent = function() {
          scope.currentmodule = null
          $state.go("course.course_information")
        }
      }
    }
  }]).directive("timelineFilters", ['$rootScope', '$log', 'TimelineFilter', function($rootScope, $log, TimelineFilter) {
    return {
      restrict: "E",
      scope: {},
      template: '<i class="timeline-settings" id="timeline_settings_btn" pop-over="popover_options"></i>',
      link: function(scope) {
        scope.initFilters = function() {
          scope.timeline_filter = TimelineFilter
        }

        scope.exportNotes = function() {
          $rootScope.$broadcast("export_notes")
        }

        scope.updateLectureFilter = function(type) {
          scope.timeline_filter.toggle(type)
        }

        var template = '<ul ng-init="initFilters()" class="no-margin">' +
          '<li>' +
          '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'note\')">' +
          '<input id="showNotesCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'note\')" />' +
          '<span style="font-size:12px" translate>course_settings.show_notes</span>' +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'discussion\')">' +
          '<input id="showQuestionsCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'discussion\')" />' +
          '<span style="font-size:12px" translate>course_settings.show_discussion</span>' +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'quiz\')">' +
          '<input id="showQuizzesCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'quiz\')" />' +
          '<span style="font-size:12px" translate>course_settings.show_quizzes</span>' +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'confused\')">' +
          '<input id="showConfusedCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'confused\')" />' +
          '<span style="font-size:12px" translate>course_settings.show_confused</span>' +
          '</div>' +
          '</li>' +
          '<li>' +
          '<div class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="updateLectureFilter(\'marker\')">' +
          '<input id="showMarkersCheckbox" class="with-tiny-margin-right" type="checkbox" ng-checked="timeline_filter.get(\'marker\')" />' +
          '<span style="font-size:12px" translate>course_settings.show_markers</span>' +
          '</div>' +
          '</li>' +
          '<li>' +
          '<a class="looks-like-a-link lighter-grey dark-text with-small-padding-left with-small-padding-right" ng-click="exportNotes()">' +
          '<span style="font-size:12px" translate>course_settings.download_notes</span>' +
          '</a>' +
          '</li>' +
          '</ul>'

        scope.popover_options = {
          content: template,
          html: true,
          placement: "left"
        }
      }
    };
  }]).directive("userNavigation",[function(){
  	return{
  		replace: true,
      restrict: "E",
      scope: {
        message: "="
      },
      templateUrl: '/views/user_sub_navigation.html',
      link: function(scope) {

      }
  	}
  }])
