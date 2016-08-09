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
    }

    function removeFromCollection(item) {
      delete items_obj[item.class_name][item.id]
    }

    function getLecture(id) {
      return items_obj['lecture'][id]
    }

    function getQuiz(id) {
      console.log(id, items_obj['quiz'])
      return items_obj['quiz'][id]
    }

    function getLink(id) {
      return items_obj['customlink'][id]
    }

    function getById(id, type) {
      return items_obj[type][id]
    }

    function getSelectedItem() {
      return LectureModel.getSelectedLecture() || QuizModel.getSelectedQuiz() || LinkModel.getSelectedLink()
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
      addToCollection: addToCollection,
      removeFromCollection: removeFromCollection,
      getLecture: getLecture,
      getQuiz: getQuiz,
      getLink: getLink,
      getSelectedItem: getSelectedItem,
      setSelectedItem: setSelectedItem,
      clearAllSelected: clearAllSelected,
      getById: getById
    }

  }])
