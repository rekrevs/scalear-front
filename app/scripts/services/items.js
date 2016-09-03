'use strict';

angular.module('scalearAngularApp')
  .factory('ItemsModel', ['LectureModel', 'QuizModel', 'LinkModel', '$rootScope', function(LectureModel, QuizModel, LinkModel, $rootScope) {

    var items_obj = { lecture: {}, quiz: {}, customlink: {} };

    $rootScope.$on("Module:set_items", function(ev, items) {
      setItems(items)
    })

    $rootScope.$on("Item:added", function(ev, item) {
      addToCollection(item)
    })

    $rootScope.$on("Item:removed", function(ev, item) {
      removeFromCollection(item)
    })

    function setItems(items) {
      items.forEach(function(item) {
        addToCollection(item)
      })
      $rootScope.$broadcast("Item:ready", items)
    }

    function addToCollection(item) {
      var it = null
      if(item.class_name == 'lecture') {
        it = LectureModel.createInstance(item)
      } else if(item.class_name == 'quiz') {
        it = QuizModel.createInstance(item)
      } else {
        it = LinkModel.createInstance(item)
      }
      items_obj[item.class_name][item.id] = it
      $rootScope.$broadcast("update_module_time", item.group_id)
      $rootScope.$broadcast('update_module_statistics')
    }

    function removeFromCollection(item) {
      delete items_obj[item.class_name][item.id]
      $rootScope.$broadcast('update_module_statistics')
      if(item.class_name == 'lecture') {
        $rootScope.$broadcast("update_module_time", item.group_id)
      }
    }

    function getLecture(id) {
      return items_obj['lecture'][id]
    }

    function getQuiz(id) {
      return items_obj['quiz'][id]
    }

    function getLink(id) {
      return items_obj['customlink'][id]
    }

    function getById(id, type) {
      return items_obj[type][id]
    }

    function getSelectedItem() {
      return LectureModel.getSelectedLecture() || QuizModel.getSelectedQuiz() || LinkModel.getSelectedLink();
    }

    function setSelectedItem(item) {
      clearAllSelected()
      if(item.class_name == 'lecture') {
        LectureModel.setSelectedLecture(item)
      } else if(item.class_name == 'quiz') {
        QuizModel.setSelectedQuiz(item)
      } else {
        LinkModel.setSelectedLink(item)
      }
    }

    function clearAllSelected() {
      LectureModel.clearSelectedLecture()
      QuizModel.clearSelectedQuiz()
      LinkModel.getSelectedLink()
    }

    return {
      getLecture: getLecture,
      getQuiz: getQuiz,
      getLink: getLink,
      getSelectedItem: getSelectedItem,
      setSelectedItem: setSelectedItem,
      clearAllSelected: clearAllSelected,
      getById: getById
    }

  }])
