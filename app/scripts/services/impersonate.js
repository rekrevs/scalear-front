'use strict';

angular.module('scalearAngularApp')
  .factory('Impersonate', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/en/impressionate/:action', {}, {
      'create': { method: 'POST', headers: headers },
      'destroy': { method: 'DELETE', headers: headers }
    });

  }])
  .factory("Preview", ['Impersonate', '$state', '$cookieStore', 'ContentNavigator', '$rootScope', '$log', 'UserSession', function(Impersonate, $state, $cookieStore, ContentNavigator, $rootScope, $log, UserSession) {

    var current_user = null

    var clean = function() {
      $cookieStore.remove('preview_as_student')
      $cookieStore.remove('old_user_id')
      $cookieStore.remove('new_user_id')
      $cookieStore.remove('params')
      $cookieStore.remove('state')
    }

    function manageStudentState($state) {
      var default_params = { course_id: $state.params.course_id }
      if ($state.params.module_id) {
        var state_name = "course.module.courseware"
        if ($state.params.lecture_id) {
          state_name += ".lecture"
        } else if ($state.params.quiz_id) {
          state_name += ".quiz"
        } else {
          state_name += ".overview"
        }
        return {name: state_name, params: $state.params, prev: state_name.replace("courseware", "course_editor")}
      } else if ($state.includes("course.edit_course_information")) {
        console.log("2")
        return {name: 'course.course_information', params: default_params, prev: "course.edit_course_information"}
      } else {
        console.log("3")
        return {name: 'course', params: default_params, prev: 'course'}
      }
    }

    function previewStart() {
      if(!$state.params || ($state.params && !$state.params.course_id)){
        $state.params = $cookieStore.get('params')
        $state.current.name = $cookieStore.get('state')
        current_user.id  = $cookieStore.get('old_user_id')
      }
      var new_state = manageStudentState($state)
      var current_state = new_state.prev
      var current_params = $state.params
      $cookieStore.put('old_user_id', current_user.id)
      $cookieStore.put('state', current_state)
      $cookieStore.put('params', current_params)
      ContentNavigator.close()

      Impersonate.create({}, { course_id: $state.params.course_id },
        function(data) {
          $state.go(new_state.name, new_state.params,{notify:false,reload:false, location:'replace', inherit:false});
          UserSession.allowRefetchOfUser()
          $cookieStore.put('preview_as_student', true)
          $cookieStore.put('new_user_id', data.user.id)
          $rootScope.preview_as_student = true
          current_user = null
          $state.go(new_state.name, new_state.params, { reload: true })
          $rootScope.$broadcast('Course:get_current_courses')
        },
        function() {
          // $state.go(current_state, current_params,{notify:false,reload:false, location:'replace', inherit:true});
          $log.debug("Failed to Start Preview")
          clean()
        }
      )
    }

    function previewStop() {
      var current_state = $state.current.name
      var current_params = $state.params
      if ($cookieStore.get('preview_as_student')) {
        var params = $cookieStore.get('params')
        var state = $cookieStore.get('state')
        ContentNavigator.close()
        $rootScope.$broadcast("exit_preview")
        $state.go(state,params,{notify:false,reload:false, location:'replace', inherit:true});

        Impersonate.destroy({
          old_user_id: $cookieStore.get('old_user_id'),
          new_user_id: $cookieStore.get('new_user_id')
        }, function() {
          UserSession.allowRefetchOfUser()
          clean()
          $rootScope.preview_as_student = false
          current_user = null
          $state.go(state, params, { reload: true })
          $rootScope.$broadcast('Course:get_current_courses')
        }, function() {
          $rootScope.preview_as_student = true
          $state.go(current_state,current_params,{notify:false,reload:false, location:'replace', inherit:true});
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
