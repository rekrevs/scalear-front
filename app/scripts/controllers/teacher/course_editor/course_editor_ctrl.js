'use strict';

angular.module('scalearAngularApp')
  .controller('courseEditorCtrl', ['$rootScope', '$scope', '$state', '$translate', '$log', 'Page', '$modal', '$timeout', 'ContentNavigator', 'DetailsNavigator', 'Preview', 'ScalearUtils', 'CourseModel', 'ModuleModel', 'ItemsModel', 'LectureModel', 'QuizModel', 'LinkModel', function($rootScope, $scope, $state, $translate, $log, Page, $modal, $timeout, ContentNavigator, DetailsNavigator, Preview, ScalearUtils, CourseModel, ModuleModel, ItemsModel ,LectureModel, QuizModel, LinkModel) {

    $scope.course = CourseModel.getSelectedCourse()
    Page.setTitle($translate.instant('navigation.content') + ': ' + $scope.course.name);

    ContentNavigator.open()
    DetailsNavigator.open()

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
          var selected_module = ModuleModel.getSelectedModule()
          if(selected_module && selected_module.id == module.id) {
            $state.go('course.course_editor')
          }
        })
    }

    function addItemBytype(type, module_id) {
      if(type == 'video')
        $scope.addLecture(0)
      else if(type == 'inclass_video')
        $scope.addLecture(1)
      else if(type == 'distance_peer')
        $scope.addLecture(2)
      else if(type == 'link')
        $scope.addCustomLink(module_id || $state.params.module_id)
      else
        $scope.addQuiz(type)
    }

    $scope.addLecture = function(video_type) {
      LectureModel.create(video_type)
        .then(function(lecture) {
          emptyClipboard()
          $state.go('course.module.course_editor.lecture', { lecture_id: lecture.id })
        })
    }

    $scope.removeLecture = function(lecture) {
      lecture.remove()
        .then(function() {
          emptyClipboard()
          if($state.params.lecture_id == lecture.id)
            $state.go('course.module.course_editor.overview')
        })
    }

    $scope.addQuiz = function(type) {
      QuizModel.create(type)
        .then(function(quiz) {
          emptyClipboard()
          $state.go('course.module.course_editor.quiz', { quiz_id: quiz.id })
        })
    }

    $scope.removeQuiz = function(quiz) {
      quiz.remove()
        .then(function() {
          emptyClipboard()
          if($state.params.quiz_id == quiz.id)
            $state.go('course.module.course_editor.overview')
        })
    }

    $scope.addCustomLink = function(module_id) {
      LinkModel.create()
        .then(function(link) {
          $state.go('course.module.course_editor.customlink', { customlink_id: link.id })
        })
    }

    $scope.removeCustomLink = function(link) {
      link.remove()
        .then(function() {
          emptyClipboard()
          if($state.params.customlink_id == link.id)
            $state.go('course.module.course_editor.overview')
        })
    }

    $scope.previewStudent = function() {
      Preview.start()
    }

    $scope.copy = function(item) {
      $rootScope.clipboard = {
        id: item.id,
        name: item.name,
        type: item.class_name || 'module',
        show_msg: true
      }
    }

    var emptyClipboard = function() {
      $rootScope.clipboard = null
    }

    $scope.paste = function(module_id) {
      var item = $rootScope.clipboard

      if(item.type == 'module') {
        ModuleModel.paste(item)
      } else if(item.type == 'lecture') {
        LectureModel.paste(item, module_id)
      } else if(item.type == 'quiz') {
        QuizModel.paste(item, module_id)
      } else if(item.type == 'customlink') {
        LinkModel.paste(item, module_id)
      }

    }

    var openSharingModal = function(data) {
      $modal.open({
        templateUrl: '/views/teacher/course_editor/sharing_modal.html',
        controller: "sharingModalCtrl",
        resolve: {
          selected_module: function() {
            return ModuleModel.getById(data.module_id)
          },
          selected_item: function() {
            if(data.item) {
              return ItemsModel.getById(data.item.id, data.item.class_name)
            }
          }
        }
      });
    }

  }]);
