'use strict';

angular.module('scalearAngularApp')
  .controller('coursewareCtrl', ['$scope', '$stateParams', '$log', 'Module', 'Timeline', 'Page', '$state', 'ModuleModel', 'ItemsModel','ErrorHandler', function($scope, $stateParams, $log, Module, Timeline, Page, $state, ModuleModel, ItemsModel, ErrorHandler) {

    Page.setTitle('navigation.lectures');
    Page.startTour();

    var init = function() {
      var module = ModuleModel.getSelectedModule()
      if (module) {
        $scope.module_items = module.items
        Module.getStudentModule({ course_id: $stateParams.course_id, module_id: module.id },
          function(data) {
            console.log(data)
            $scope.module_lectures = data.module_lectures;

            // arrange timeline
            $scope.timeline = {}
            $scope.timeline['lecture'] = {}
            $log.debug("timeline")
            for(var l in $scope.module_lectures) {
              var lec = $scope.module_lectures[l]
              $scope.timeline['lecture'][lec.id] = new Timeline()
              var lec2 = ItemsModel.getLecture(lec.id);
              //in rails 5 virtual attributes is returned as null in lec2, so it overrides the ones in lec, so we delete any null values
              for (var key in lec2){
                if(lec2[key]===null || lec2[key]===undefined){
                  delete lec2[key];
                }
              }
              $scope.timeline['lecture'][lec.id].meta = angular.extend(lec, ItemsModel.getLecture(lec.id))

              // remove quizzes with no answers - else - add it to timeline.
              // if(lec.video_quizzes){
                for(var element = lec.video_quizzes.length - 1; element >= 0; element--) {
                  if(lec.video_quizzes[element].online_answers.length == 0 && lec.video_quizzes[element].question_type != "Free Text Question")
                    lec.video_quizzes.splice(element, 1);
                  else
                    $scope.timeline['lecture'][lec.id].add(lec.video_quizzes[element].time, "quiz", lec.video_quizzes[element])
                }
              // }
              
              for(var type in lec.user_confused) {
                $scope.timeline['lecture'][lec.id].add(lec.user_confused[type].time, "confused", lec.user_confused[type])
              }
              // will be the same timeline later to be able to put in one and filter. (so both will be lecture, no discussion)
              
              for(var type in lec.posts) {
                $scope.timeline['lecture'][lec.id].add(lec.posts[type].time, "discussion", lec.posts[type])
              }

              for(var i in lec.lecture_notes) {
                $scope.timeline['lecture'][lec.id].add(lec.lecture_notes[i].time, "note", lec.lecture_notes[i])
              }
              for(var i in lec.title_markers) {
                $scope.timeline['lecture'][lec.id].add(lec.title_markers[i].time, "marker", lec.title_markers[i])
              }
            }
            $log.debug("timeline", $scope.timeline)
            // if(!$stateParams.lecture_id && !$stateParams.quiz_id){
            //   showModuleCourseware(module)
            // }
          },
          function(error){
            console.log(error.data.errors[0])
            ErrorHandler.showMessage(error.data.errors[0], 'errorMessage', 4000, "error");
            $state.go("course_list"); 
          }
        );
      }
    }

    init();

    // var showModuleCourseware = function(module) {
    //   if(module.items.length) {
    //     if(!$state.params.lecture_id && !$state.params.quiz_id) {
    //       Module.getLastWatched({
    //           course_id: $stateParams.course_id,
    //           module_id: module.id
    //         },
    //         function(data) {
    //           if(data.last_watched != -1) {
    //             $state.go('course.module.courseware.lecture', { 'module_id': module.id, 'lecture_id': data.last_watched })
    //           } else {
    //             $state.go('course.module.courseware.quiz', { 'module_id': module.id, 'quiz_id': module.quizzes[0].id })
    //           }
    //         })
    //     }
    //   } else
    //     $state.go('course.course_information')
    // }

  }]);
