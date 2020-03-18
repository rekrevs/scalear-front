'use strict';

angular.module('scalearAngularApp')
  .controller('lectureProgressCtrl', ['$scope', '$stateParams', '$timeout', 'Module', '$log', 'Lecture', 'Quiz', 'ModuleModel', function($scope, $stateParams, $timeout, Module, $log, Lecture, Quiz, ModuleModel) {
    
    $scope.module = ModuleModel.getSelectedModule()
    $scope.getAllItemsProgress = function(offset, limit) {
      $scope.lecture_limit = limit
      $scope.lecture_offset = offset
      $scope.loading_lectures = true
      Module.getAllItemsProgress({
          course_id: $stateParams.course_id,
          module_id: $stateParams.module_id,
          offset: $scope.lecture_offset,
          limit: $scope.lecture_limit
        },
        function(data) {
          $log.debug("getAllItemsProgress response", data)
          var obj = {}

          obj.lecture_names = data.lecture_names
          obj.total_lec_quiz = data.total_lec_quiz
          obj.total = data.total

          obj.lecture_students = $scope.lecture_students || []
          obj.solved_count = $scope.solved_count || {}
          obj.lecture_status = $scope.lecture_status || {}
          obj.late_lectures = $scope.late_lectures || {}

          obj.lecture_students = obj.lecture_students.concat(JSON.parse(data.students));
          angular.extend(obj.solved_count, data.solved_count)
          angular.extend(obj.lecture_status, data.lecture_status)
          angular.extend(obj.late_lectures, data.late_lectures)

          $log.debug(obj)
          angular.extend($scope, obj)

          $timeout(function() {
            $scope.getRemainingLectureProgress()
          })

        }
      );
    }
    $scope.updateStatus = function(student_id, module_id, status, lecture_quiz) {
      if(status)
        status = (status == "Finished on Time") ? 1 : 2
      else
        status = 0
      if(lecture_quiz == 1) { //1 for lecture 2 for quiz
        Lecture.changeLectureStatus({
          course_id: $stateParams.course_id,
          lecture_id: module_id
        }, {
          user_id: student_id,
          status: status
        })
      } else {
        Quiz.changeQuizStatus({
          course_id: $stateParams.course_id,
          quiz_id: module_id
        }, {
          user_id: student_id,
          status: status
        })
      }

    }
    $scope.getRemainingLectureProgress = function() {
      if($scope.lecture_offset + $scope.lecture_limit <= parseInt($scope.total))
        $scope.getAllItemsProgress($scope.lecture_offset + $scope.lecture_limit, $scope.lecture_limit)
      else {
        $scope.loading_lectures = false
      }
    }
    $scope.getAllItemsProgress(0, 1) 

  }]);
