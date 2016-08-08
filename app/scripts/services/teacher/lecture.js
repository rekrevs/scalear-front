'use strict';

angular.module('scalearAngularApp')
  .factory('Lecture', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/courses/:course_id/lectures/:lecture_id/:action', { course_id: $stateParams.course_id, lecture_id: '@id', lang: $translate.uses() }, {
      'create': { method: 'POST', headers: headers },
      'index': { method: 'GET', isArray: true, headers: headers },
      'update': { method: 'PUT', headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'show': { method: 'GET', headers: headers },
      'newLecture': { method: 'GET', params: { action: 'new_lecture_angular' }, headers: headers },
      'getQuizData': { method: 'GET', params: { action: 'get_old_data_angular' }, headers: headers },
      'getHtmlData': { method: 'GET', params: { action: 'get_html_data_angular' }, headers: headers },
      'newQuiz': { method: 'GET', params: { action: 'new_quiz_angular' }, headers: headers },
      'newMarker': { method: 'GET', params: { action: 'new_marker' }, headers: headers },
      'updateAnswers': { method: 'POST', params: { action: 'save_answers_angular' }, headers: headers },
      'addAnswer': { method: 'POST', ignoreLoadingBar: true, params: { action: 'add_answer_angular' }, headers: headers },
      'removeAnswer': { method: 'POST', ignoreLoadingBar: true, params: { action: 'remove_answer_angular' }, headers: headers },
      'saveSort': { method: 'POST', ignoreLoadingBar: true, params: { action: 'sort' }, headers: headers },
      "validateLecture": { method: 'PUT', params: { action: 'validate_lecture_angular' }, headers: headers },
      "getLectureStudent": { method: 'GET', params: { action: 'get_lecture_data_angular' }, headers: headers },
      "confused": { method: 'POST', params: { action: 'confused' }, headers: headers },
      "back": { method: 'POST', ignoreLoadingBar: true, params: { action: 'back' }, headers: headers },
      "pause": { method: 'POST', ignoreLoadingBar: true, params: { action: 'pause' }, headers: headers },
      "saveOnline": { method: 'POST', params: { action: 'save_online' }, headers: headers },
      "saveHtml": { method: 'POST', params: { action: 'save_html' }, headers: headers },
      "deleteConfused": { method: 'DELETE', params: { action: 'delete_confused' }, headers: headers },
      "saveNote": { method: 'POST', params: { action: 'save_note' }, headers: headers },
      "deleteNote": { method: 'DELETE', params: { action: 'delete_note' }, headers: headers },
      "lectureCopy": { method: 'POST', params: { action: 'lecture_copy' }, headers: headers },
      "exportNotes": { method: 'GET', params: { action: 'export_notes' }, headers: headers },
      "changeLectureStatus": { method: 'POST', params: { action: 'change_status_angular' }, headers: headers },
      "updatePercentView": { method: 'POST', ignoreLoadingBar: true, params: { action: 'update_percent_view' }, headers: headers },
      "confusedShowInclass": { method: 'POST', ignoreLoadingBar: true, params: { action: 'confused_show_inclass' }, headers: headers },
      "logVideoEvent": { method: 'POST', ignoreLoadingBar: true, params: { action: 'log_video_event' }, headers: headers },
    });

  }]).factory("LectureModel", ['Lecture', '$rootScope', 'VideoInformation', '$translate', 'Timeline', 'ScalearUtils', '$q', 'ModuleModel', function(Lecture, $rootScope, VideoInformation, $translate, Timeline, ScalearUtils, $q, ModuleModel) {

    var selected_lecture = null

    function setSelectedLecture(lecture) {
      selected_lecture = lecture
      return getSelectedLecture()
    }

    function getSelectedLecture() {
      return selected_lecture
    }

    function clearSelectedLecture() {
      selected_lecture = null
    }

    function isInstance(instance) {
      return(instance.instanceType && instance.instanceType() == "Lecture");
    }

    function create(inclass) {
      var module = ModuleModel.getSelectedModule()
      return Lecture.newLecture({
          course_id: module.course_id,
          group: module.id,
          inclass: inclass
        })
        .$promise
        .then(function(data) {
          data.lecture.class_name = 'lecture'
          var lecture = createInstance(lecture)
          // module.push(lecture)
          $rootScope.$broadcast("Item:added", lecture)
          return lecture
        })
    }

    function paste(lecture){
      Lecture.lectureCopy({ course_id: $stateParams.course_id }, {
          lecture_id: lecture.id,
          module_id: module_id
        },
        function(data) {
          data.lecture.class_name = 'lecture'
          $scope.module_obj[module_id].items.push(data.lecture)
          $scope.module_obj[module_id].total_time += data.lecture.duration
          $scope.items_obj["lecture"][data.lecture.id] = data.lecture
        },
        function() {}
      )
    }

    function createInstance(lecture) {

      if(isInstance(lecture)) {
        return lecture;
      }

      lecture.timeline = new Timeline()

      $rootScope.$on("Module:" + lecture.group_id + ":updated", function(evt, module) {
        if(lecture.appearance_time_module) {
          lecture.appearance_time = module.appearance_time;
        }
        if(lecture.due_date_module) {
          lecture.due_date = module.due_date;
        }
        if(lecture.required_module) {
          lecture.required = module.required;
        }
        if(lecture.graded_module) {
          lecture.graded = module.graded;
        }
      })

      $rootScope.$on("Lecture:" + lecture.id + ":add_to_timeline", function(evt, time, type, item) {
        addToTimeline(time, type, item)
      })

      $rootScope.$on("Lecture:" + lecture.id + ":remove_from_timeline", function(evt, item, type) {
        removeFromTimeline(item, type)
      })

      function update() {
        var modified_lecture = angular.copy(lecture);
        delete modified_lecture.id;
        delete modified_lecture.created_at;
        delete modified_lecture.updated_at;
        delete modified_lecture.class_name;
        delete modified_lecture.className;
        delete modified_lecture.timeline;

        return Lecture.update({
            course_id: lecture.course_id,
            lecture_id: lecture.id
          }, {
            lecture: modified_lecture
          })
          .$promise
          .then(function(data) {
            angular.extend(lecture, data.lecture)
          })
      }

      function validateUrl() {
        var deferred = $q.defer();
        if(VideoInformation.invalidUrl(lecture.url)) {
          console.log("am i here?");
          deferred.resolve($translate('editor.details.incompatible_video_link'));
        } else {
          validate()
            .then(function() {
              var type = VideoInformation.isYoutube(lecture.url)
              if(type) {
                var id = type[1]
                VideoInformation.requestInfoFromYoutube(id)
                  .then(function(data) {
                    if(data.items.length > 0) {
                      deferred.resolve();
                    } else {
                      deferred.reject($translate('editor.details.vidoe_not_exist'));
                    }
                  })
                  .catch(function() {
                    deferred.reject($translate('editor.details.vidoe_not_exist'));
                    return deferred.promise
                  })
              } else if(VideoInformation.isMP4(lecture.url)) {
                deferred.resolve()
              } else {
                deferred.reject($translate('editor.details.incompatible_video_link'))
              }
            })
            .catch(function(msg) {
              deferred.reject(msg)
            })
        }
        return deferred.promise;
      }

      function validate() {
        return Lecture.validateLecture({
            course_id: lecture.course_id,
            lecture_id: lecture.id
          }, lecture)
          .$promise
          .catch(function() {
            if(resp.status == 422)
              return resp.data.errors.join();
            else
              return 'Server Error';
          })
      }

      function updateUrl() {
        var deferred = $q.defer();
        lecture.aspect_ratio = "widescreen"
        lecture.url = lecture.url.trim()
        if(lecture.url && lecture.url != "none" && lecture.url != "http://") {
          var type = VideoInformation.isYoutube(lecture.url)
          if(type) {
            var video_id = type[1];
            if(!VideoInformation.isFinalUrl(lecture.url)) {
              lecture.url = VideoInformation.getFinalUrl(video_id)
            }
            VideoInformation.requestInfoFromYoutube(video_id)
              .then(function(data) {
                var duration = ScalearUtils.parseDuration(data.items[0].contentDetails.duration)
                lecture.duration = lecture.duration || (duration.hour * (60 * 60) + duration.minute * (60) + duration.second)
                lecture.start_time = 0
                lecture.end_time = lecture.duration
                update().then(function() {
                  deferred.resolve();
                });
                $rootScope.$broadcast("update_module_time", lecture.group_id)
              })
          } else {
            var video = $('video')
            video.bind('loadeddata', function(event) {
              lecture.start_time = 0
              lecture.end_time = event.target.duration || 0
              update().then(function() {
                deferred.resolve();
              });
              $rootScope.$broadcast("update_module_time", lecture.group_id)
            });
          }
        } else {
          lecture.url = "none"
          deferred.reject()
        }
        return deferred.promise;
      }

      function remove() {
        return Lecture.destroy({
            course_id: lecture.course_id,
            lecture_id: lecture.id
          }, {})
          .$promise
          .then(function() {
            $rootScope.$broadcast("Item:removed", lecture)
          });
      }

      function addToTimeline(time, type, data) {
        lecture.timeline.add(time, type, data)
      }

      function removeFromTimeline(item, item_type) {
        lecture.timeline.items.splice(lecture.timeline.getIndexById(item.id, item_type), 1)
      }

      function module() {
        return ModuleModel.getById(lecture.group_id)
      }

      function instanceType() {
        return 'Lecture'
      }

      return angular.extend(lecture, {
        update: update,
        validateUrl: validateUrl,
        validate: validate,
        updateUrl: updateUrl,
        addToTimeline: addToTimeline,
        removeFromTimeline: removeFromTimeline,
        instanceType: instanceType,
        remove:remove,
        module:module
      })
    }

    return {
      createInstance: createInstance,
      isInstance: isInstance,
      clearSelectedLecture: clearSelectedLecture,
      getSelectedLecture: getSelectedLecture,
      setSelectedLecture: setSelectedLecture,
      create:create
    }

  }])
