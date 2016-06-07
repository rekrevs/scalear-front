'use strict';

angular.module('scalearAngularApp')
  .controller('progressCtrl', ['$scope', '$stateParams', 'ContentNavigator', 'Page', 'Course', 'Module', '$timeout', '$log', function($scope, $stateParams, ContentNavigator, Page, Course, Module, $timeout, $log) {
    Page.setTitle('navigation.progress')
    ContentNavigator.close()

    var getModuleProgress = function(offset, limit) {
      $scope.module_limit = limit
      $scope.module_offset = offset
      $scope.loading_modules = true
        // disableModuleScrolling()

      Course.getModuleProgress({
          course_id: $stateParams.course_id,
          offset: $scope.module_offset,
          limit: $scope.module_limit
        },
        function(data) {
          $log.debug("getModuleProgress response", data)
          var obj = {}

          obj.module_names = data.module_names
          obj.total = data.total

          obj.module_students = $scope.module_students || []
          obj.module_status = $scope.module_status || {}
          obj.late_modules = $scope.late_modules || {}

          obj.module_students = obj.module_students.concat(JSON.parse(data.students));
          angular.extend(obj.module_status, data.module_status)
          angular.extend(obj.late_modules, data.late_modules)

          $log.debug(obj)

          angular.extend($scope, obj)

          $timeout(function() {
            $scope.getRemainingModuleProgress()
              // enableModuleScrolling()
              // $scope.loading_modules=false
              // $('.student').tooltip({"placement": "left", container: 'body'})
          })
        }
      );
    }

    $scope.getRemainingModuleProgress = function() {
      if($scope.module_offset + $scope.module_limit <= parseInt($scope.total))
        getModuleProgress($scope.module_offset + $scope.module_limit, $scope.module_limit)
      else
        $scope.loading_modules = false
        // disableModuleScrolling()
    }

    // var enableModuleScrolling = function(){
    //  $scope.module_scroll_disable = false
    // }
    // var disableModuleScrolling = function(){
    //  $scope.module_scroll_disable = true
    // }

    $scope.updateStatus = function(student_id, module_id, module_status) {
      if(module_status)
        module_status = (module_status == "Finished on Time") ? 1 : 2
      else
        module_status = 0

      Module.changeModuleStatus({
        course_id: $stateParams.course_id,
        module_id: module_id
      }, {
        user_id: student_id,
        status: module_status
      })
    }

    $scope.export=function () {
      Course.exportModuleProgress({course_id: $stateParams.course_id})
    }

    getModuleProgress(0, 20)

  }]);
