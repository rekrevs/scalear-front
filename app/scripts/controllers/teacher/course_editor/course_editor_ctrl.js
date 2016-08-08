'use strict';

angular.module('scalearAngularApp')
  .controller('courseEditorCtrl', ['$rootScope', '$stateParams', '$scope', '$state', 'Course', 'Module', 'Lecture', 'Quiz', '$translate', '$log', 'Page', '$modal', '$timeout', '$filter', 'CustomLink', 'ContentNavigator', 'DetailsNavigator', 'Preview', 'ScalearUtils', 'Timeline', 'CourseModel', function($rootScope, $stateParams, $scope, $state, Course, Module, Lecture, Quiz, $translate, $log, Page, $modal, $timeout, $filter, CustomLink, ContentNavigator, DetailsNavigator, Preview, ScalearUtils, Timeline, CourseModel) {

    $scope.course = CourseModel.getSelectedCourse()
    Page.setTitle($translate('navigation.content') + ': ' + $scope.course.name);

    ContentNavigator.open()
    DetailsNavigator.open()
      // $scope.timeline = new Timeline()
    $scope.DetailsNavigator = DetailsNavigator
    $scope.ContentNavigator = ContentNavigator
    $scope.delayed_details_status = DetailsNavigator.getStatus()
    $scope.delayed_details_status2 = DetailsNavigator.getStatus()
    $scope.$on('details_navigator_change', function(ev, status) {
      $log.debug("datails status event", status)
      if(!status) {
        $scope.delayed_details_status2 = false
        $timeout(function() {
          $scope.delayed_details_status = false
        }, 350)
      } else {
        $scope.delayed_details_status = true
        $timeout(function() {
          $scope.delayed_details_status2 = true
        }, 350)
      }
    })

    $scope.$on('share_copy', function(event, data) {
      openSharingModal(data)
    })

    $scope.$on('add_module', function() {
      $scope.addModule()
    })

    $scope.$on('add_item', function(event, type) {
      if(!$state.params.module_id) {
        $scope.addModule(function(module_id) {
          $timeout(function() {
            addItemBytype(type, module_id)
          })
        })
      } else
        addItemBytype(type)
      ContentNavigator.open()
    })

    $scope.$on('delete_module', function(event, module) {
      $scope.removeModule(module)
    })

    $scope.$on('delete_item', function(event, item) {
      if(item.class_name == 'lecture')
        $scope.removeLecture(item)
      else if(item.class_name == 'customlink')
        $scope.removeCustomLink(item)
      else
        $scope.removeQuiz(item)
    })

    $scope.$on('copy_item', function(event, item) {
      $scope.copy(item)
    })

    $scope.$on('paste_item', function(event, module_id) {
      $scope.paste(module_id)
    })

    $scope.capitalize = function(s) {
      return ScalearUtils.capitalize(s)
    }

    $scope.addModule = function(callback) {
      ModuleModel.create()
        .then(function(module) {
          $state.go('course.module.course_editor.overview', { module_id: module.id })
          ContentNavigator.open()
          callback && callback(module.id)
        })
    }

    $scope.removeModule = function(module) {
      module.remove()
        .then(function() {
          emptyClipboard()
          if(ModuleModel.getSelectedModule().id == module.id) {
            $state.go('course.course_editor')
          }
        })
    }

    var addItemBytype = function(type, module_id) {
      if(type == 'video')
        $scope.addLecture(module_id || $state.params.module_id, false)
      else if(type == 'inclass_video')
        $scope.addLecture(module_id || $state.params.module_id, true)
      else if(type == 'link')
        $scope.addCustomLink(module_id || $state.params.module_id)
      else
        $scope.addQuiz(module_id || $state.params.module_id, type)
    }

    $scope.addLecture = function(inclass) {
      $scope.item_loading = true
      LectureModel.create(inclass)
        .then(function(lecture) {
          $scope.item_loading = false
          $state.go('course.module.course_editor.lecture', { lecture_id: lecture.id })
        })
    }

    $scope.removeLecture = function(lecture) {
      lecture.remove()
        .then(function() {
          emptyClipboard()
          $rootScope.$broadcast("update_module_time", lecture.group_id)
          $scope.$broadcast('update_module_statistics')
          if($state.params.lecture_id == lecture.id)
            $state.go('course.module.course_editor.overview')
        })
    }

    $scope.addQuiz = function(type) {
      $scope.item_loading = true
      QuizModel.create(type)
        .then(function(quiz) {
          $scope.item_loading = false
          $state.go('course.module.course_editor.quiz', { quiz_id: quiz.id })
        })
    }

    $scope.removeQuiz = function(quiz) {
      quiz.remove()
        .then(function() {
          emptyClipboard()
          $scope.$broadcast('update_module_statistics')
          if($state.params.quiz_id == quiz.id)
            $state.go('course.module.course_editor.overview')
        })
    }

    $scope.previewStudent = function() {
      Preview.start()
    }

    $scope.copy = function(item) {
      $rootScope.clipboard = { id: item.id, name: item.name, type: item.class_name || 'module', show_msg: true }
    }

    var emptyClipboard = function() {
      $rootScope.clipboard = null
    }

    $scope.paste = function(module_id) {
      var clipboard = $rootScope.clipboard

      if(clipboard.type == 'module')
        pasteModule(clipboard)
      else {
        if(clipboard.type == 'lecture')
          pasteLecture(clipboard, module_id)
        else if(clipboard.type == 'quiz')
          pasteQuiz(clipboard, module_id)
        else if(clipboard.type == 'customlink')
          pastLink(clipboard, module_id)
      }
    }

    var pasteModule = function(module) {
      ModuleModel.paste(module)
    }

    var pasteLecture = function(item, module_id) {
      // $scope.item_overlay = true
      // Lecture.lectureCopy({ course_id: $stateParams.course_id }, {
      //     lecture_id: item.id,
      //     module_id: module_id
      //   },
      //   function(data) {
      //     $scope.item_overlay = false
      //     data.lecture.class_name = 'lecture'
      //     $scope.module_obj[module_id].items.push(data.lecture)
      //     $scope.module_obj[module_id].total_time += data.lecture.duration
      //     $scope.items_obj["lecture"][data.lecture.id] = data.lecture
      //   },
      //   function() {}
      // )
    }

    var pasteQuiz = function(item, module_id) {
      $scope.item_overlay = true
      Quiz.quizCopy({ course_id: $stateParams.course_id }, {
          quiz_id: item.id,
          module_id: module_id
        },
        function(data) {
          $log.debug(data)
          $scope.item_overlay = false
          data.quiz.class_name = 'quiz'
          $scope.module_obj[module_id].items.push(data.quiz)
          $scope.items_obj["quiz"][data.quiz.id] = data.quiz
        },
        function() {}
      )
    }


    var pastLink = function(item, module_id) {
      $log.debug("link copy")
      $log.debug(item)
      $scope.item_overlay = true
      CustomLink.linkCopy({
          link_id: item.id,
          course_id: $stateParams.course_id,
          module_id: module_id
        }, {},
        function(data) {
          $log.debug(data)
          $scope.item_overlay = false
          data.link.class_name = 'customlink'
          $scope.module_obj[module_id].items.push(data.link)
          $scope.items_obj["customlink"][data.link.id] = $scope.module_obj[module_id].items[$scope.module_obj[module_id].items.length - 1]
        },
        function() {}
      )
    }

    var openSharingModal = function(data) {
      $modal.open({
        templateUrl: '/views/teacher/course_editor/sharing_modal.html',
        controller: "sharingModalCtrl",
        resolve: {
          selected_module: function() {
            return $scope.module_obj[data.module_id]
          },
          selected_item: function() {
            if(data.item) {
              return $scope.items_obj[data.item.class_name][data.item.id]
            }
          }
        }
      });
    }

    $scope.addCustomLink = function(module_id) {
      Module.newCustomLink({
          course_id: $stateParams.course_id,
          module_id: module_id
        }, {},
        function(data) {
          data.link.url = "http://"
          data.link.class_name = "customlink"
          $scope.module_obj[module_id].items.push(data.link)
          $scope.items_obj["customlink"][data.link.id] = $scope.module_obj[module_id].items[$scope.module_obj[module_id].items.length - 1]
          $state.go('course.module.course_editor.customlink', { customlink_id: data.link.id })
        },
        function() {}
      );
    }

    $scope.removeCustomLink = function(elem) {
      $log.debug(elem)
      CustomLink.destroy({ link_id: elem.id }, {},
        function() {
          $scope.module_obj[elem.group_id].items.splice($scope.module_obj[elem.group_id].items.indexOf(elem), 1)
          delete $scope.items_obj["customlink"][elem.id];
          emptyClipboard()
          if($state.params.customlink_id == elem.id)
            $state.go('course.module.course_editor.overview')
          $scope.$broadcast('update_module_statistics')
        },
        function() {}
      );
    }

  }]);
