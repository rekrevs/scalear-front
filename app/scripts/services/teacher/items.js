'use strict';

angular.module('scalearAngularApp')
  .factory('ItemsModel',['LectureModel','QuizModel',function(LectureModel, QuizModel){

    var items_obj = { lecture: {}, quiz: {}, customlink: {} };

    function addToList(items_list){
      items_list.forEach(function(item){
        var it = null
        if(item.class_name == 'lecture'){
          it = LectureModel.createInstance(item)
        }else if(item.class_name == 'quiz'){
          it = QuizModel.createInstance(item)
        }else{
          //TODO
          console.log("customlink");
        }
        items_obj[item.class_name][item.id] = it
      })
    }

    function getLecture(id){
      return items_obj['lecture'][id]
    }

    function getQuiz(id){
      return items_obj['quiz'][id]
    }

    function getLink(id){
      return items_obj['customlink'][id]
    }

    function getSelectedItem(){
      return LectureModel.getSelectedLecture() || QuizModel.getSelectedQuiz()
    }

    function setSelectedItem(item){
      clearAllSelected()
      if(item.class_name == 'lecture'){
        LectureModel.setSelectedLecture(item)
      }
      else if(item.class_name == 'quiz'){
        QuizModel.setSelectedQuiz(item)
      }
    }

    function clearAllSelected(){
      LectureModel.clearSelectedLecture()
      QuizModel.clearSelectedQuiz()
    }

    return {
      addToList:addToList,
      getLecture:getLecture,
      getQuiz:getQuiz,
      getLink:getLink,
      getSelectedItem:getSelectedItem,
      setSelectedItem:setSelectedItem
    }

  }])
