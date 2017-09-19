'use strict';

angular.module('scalearAngularApp')
  .factory('Impersonate', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/en/impressionate/:action', {}, {
      'create': { method: 'POST', headers: headers },
      'destroy': { method: 'DELETE', headers: headers }
    });

  }]).factory("Preview", ['Impersonate', '$state', '$cookieStore', 'ContentNavigator', '$rootScope', '$log', 'UserSession', function(Impersonate, $state, $cookieStore, ContentNavigator, $rootScope, $log, UserSession) {


    var current_user = null

    var clean = function() {
      $rootScope.preview_as_student = false
      $cookieStore.remove('preview_as_student')
      $cookieStore.remove('old_user_id')
      $cookieStore.remove('new_user_id')
      $cookieStore.remove('params')
      $cookieStore.remove('state')
    }

    function previewStart() {
      $cookieStore.put('old_user_id', current_user.id)
      $cookieStore.put('state', $state.current.name)
      $cookieStore.put('params', $state.params)
      ContentNavigator.close()
      Impersonate.create({}, { course_id: $state.params.course_id },
        function(data) {
          UserSession.allowRefetchOfUser()
          $cookieStore.put('preview_as_student', true)
          $cookieStore.put('new_user_id', data.user.id)
          $rootScope.preview_as_student = true
          current_user = null
          var params = { course_id: $state.params.course_id }
          var new_state_name = $state.current.name
          if($state.params.module_id) {
            if($state.current.name.indexOf("customlink") == -1 && $state.current.name.indexOf("overview") == -1) {
              if ($state.params.lecture_id){
                new_state_name = "course.module.course_editor.lecture"
              }
              else if ($state.params.quiz_id){
                new_state_name = "course.module.course_editor.quiz"
              }
              else{
                new_state_name = "course.module.course_editor.overview"
              }
              $cookieStore.put('state', new_state_name)
              $state.go(new_state_name.replace("course_editor", "courseware"), $state.params, { })
            } else {
              $state.go('course.module.courseware', $state.params, {  })
            }
          } else if($state.includes("course.edit_course_information")) {
            $state.go('course.course_information', params, {})
          } else {
            $state.go('course', params, {  })
          }


          $rootScope.$broadcast('Course:get_current_courses')
        },
        function() {
          $log.debug("Failed to Preview")
          clean()
        }
      )
    }

    function previewStop() {
      if($cookieStore.get('preview_as_student')) {
        ContentNavigator.close()
        $rootScope.$broadcast("exit_preview")
        Impersonate.destroy({
          old_user_id: $cookieStore.get('old_user_id'),
          new_user_id: $cookieStore.get('new_user_id')
        }, function() {
          UserSession.allowRefetchOfUser()
          var params = $cookieStore.get('params')
          var state = $cookieStore.get('state')
          clean()
          current_user = null
          $state.go(state, params, { reload: true })
          $rootScope.$broadcast('Course:get_current_courses')
        }, function() {
          $log.debug("Failed Closing Preview")
          clean()
        })
      }
    }

    return {
      start: function() {
        UserSession.getCurrentUser()
          .then(function(user) {
            current_user = user
            previewStart()
          })
      },
      stop: previewStop
    }

  }])
