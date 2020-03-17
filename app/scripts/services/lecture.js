'use strict';

angular.module('scalearAngularApp')
  .factory('Lecture', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function ($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/courses/:course_id/lectures/:lecture_id/:action', { course_id: $stateParams.course_id, lecture_id: '@id', lang: $translate.use() }, {
      'update': { method: 'PUT', headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'newLecture': { method: 'GET', params: { action: 'new_lecture_angular' }, headers: headers },
      'getQuizData': { method: 'GET', params: { action: 'get_old_data_angular' }, headers: headers },
      'getHtmlData': { method: 'GET', params: { action: 'get_html_data_angular' }, headers: headers },
      'newQuiz': { method: 'GET', params: { action: 'new_quiz_angular' }, headers: headers },
      'newMarker': { method: 'POST', params: { action: 'new_marker' }, headers: headers },
      'updateAnswers': { method: 'POST', params: { action: 'save_answers_angular' }, headers: headers },
      'saveSort': { method: 'POST', ignoreLoadingBar: true, params: { action: 'sort' }, headers: headers },
      "validateLecture": { method: 'PUT', params: { action: 'validate_lecture_angular' }, headers: headers },
      "getLectureStudent": { method: 'GET', params: { action: 'get_lecture_data_angular' }, headers: headers },
      "confused": { method: 'POST', params: { action: 'confused' }, headers: headers },
      "saveOnline": { method: 'POST', params: { action: 'save_online' }, headers: headers },
      "saveHtml": { method: 'POST', params: { action: 'save_html' }, headers: headers },
      "deleteConfused": { method: 'DELETE', params: { action: 'delete_confused' }, headers: headers },
      "saveNote": { method: 'POST', params: { action: 'save_note' }, headers: headers },
      "deleteNote": { method: 'DELETE', params: { action: 'delete_note' }, headers: headers },
      "lectureCopy": { method: 'POST', params: { action: 'lecture_copy' }, headers: headers },
      "exportNotes": { method: 'GET', params: { action: 'export_notes' }, headers: headers },
      "changeLectureStatus": { method: 'POST', ignoreLoadingBar: true, params: { action: 'change_status_angular' }, headers: headers },
      "updatePercentView": { method: 'POST', ignoreLoadingBar: true, params: { action: 'update_percent_view' }, headers: headers },
      "confusedShowInclass": { method: 'POST', ignoreLoadingBar: true, params: { action: 'confused_show_inclass' }, headers: headers },
      "logVideoEvent": { method: 'POST', ignoreLoadingBar: true, params: { action: 'log_video_event' }, headers: headers },
      "checkIfInvited": { method: 'GET', ignoreLoadingBar: false, params: { action: 'check_if_invited_distance_peer' }, headers: headers },
      "invitedStudent": { method: 'GET', ignoreLoadingBar: true, params: { action: 'invite_student_distance_peer' }, headers: headers },
      "checkInvitedStudentAccepted": { method: 'GET', ignoreLoadingBar: true, params: { action: 'check_invited_student_accepted_distance_peer' }, headers: headers },
      "acceptInvation": { method: 'GET', ignoreLoadingBar: true, params: { action: 'accept_invation_distance_peer' }, headers: headers },
      "caneclDistancePeerSession": { method: 'GET', ignoreLoadingBar: true, params: { action: 'cancel_session_distance_peer' }, headers: headers },
      "checkIfInDistancePeerSession": { method: 'GET', ignoreLoadingBar: true, params: { action: 'check_if_in_distance_peer_session' }, headers: headers },
      "changeStatusDistancePeer": { method: 'GET', ignoreLoadingBar: true, params: { action: 'change_status_distance_peer' }, headers: headers },
      "checkIfDistancePeerStatusIsSync": { method: 'GET', ignoreLoadingBar: true, params: { action: 'check_if_distance_peer_status_is_sync' }, headers: headers },
      "checkIfDistancePeerIsAlive": { method: 'GET', ignoreLoadingBar: true, params: { action: 'check_if_distance_peer_is_alive' }, headers: headers },
      "exportLectureToFeedbackFruit":{ method: 'POST', ignoreLoadingBar: true, params: { action: 'export_lecture_to_feedbackfruit' }, headers: headers }
    });

  }]).factory("LectureModel", ['Lecture', '$rootScope', 'VideoInformation', '$translate', 'Timeline', 'ScalearUtils', '$q', 'ModuleModel', function (Lecture, $rootScope, VideoInformation, $translate, Timeline, ScalearUtils, $q, ModuleModel) {

    var selected_lecture = null

    function setSelectedLecture(lecture) {
      selected_lecture = lecture
      return getSelectedLecture()
    }

    function getSelectedLecture() {
      return selected_lecture
    }

    function clearSelectedLecture() {
      if (selected_lecture) {
        selected_lecture.destroy()
      }
      selected_lecture = null
    }

    function isInstance(instance) {
      return (instance.instanceType && instance.instanceType() == "Lecture");
    }

    function create(video_type) {
      var inclass = false
      var distance_peer = false
      if (video_type == 1) {
        inclass = true
      }
      if (video_type == 2) {
        distance_peer = true
      }
      var module = ModuleModel.getSelectedModule()
      return Lecture.newLecture({
        course_id: module.course_id,
        group: module.id,
        inclass: inclass,
        distance_peer: distance_peer
      })
        .$promise
        .then(function (data) {
          data.lecture.class_name = 'lecture'
          var lecture = createInstance(data.lecture)
          $rootScope.$broadcast("Item:added", lecture)
          return lecture
        })
    }

    function paste(lec, module_id) {
      var module = ModuleModel.getById(module_id)
      return Lecture.lectureCopy({ course_id: module.course_id }, {
        lecture_id: lec.id,
        module_id: module.id
      })
        .$promise
        .then(function (data) {
          data.lecture.class_name = 'lecture'
          var lecture = createInstance(data.lecture)
          $rootScope.$broadcast("Item:added", lecture)
          $rootScope.$broadcast('update_module_statistics')
          return lecture
        })
    }

    function createInstance(lecture) {

      if (isInstance(lecture)) {
        return lecture;
      }

      lecture.timeline = new Timeline()

      $rootScope.$on("Module:" + lecture.group_id + ":updated", function (evt, module) {
        if (lecture.appearance_time_module) {
          lecture.appearance_time = module.appearance_time;
        }
        if (lecture.due_date_module) {
          lecture.due_date = module.due_date;
        }
        if (lecture.required_module) {
          lecture.required = module.required;
        }
        if (lecture.graded_module) {
          lecture.graded = module.graded;
        }
        if (lecture.skip_ahead_module) {
          lecture.skip_ahead = module.skip_ahead;
        }
      })

      $rootScope.$on("Lecture:" + lecture.id + ":add_to_timeline", function (evt, time, type, item) {
        addToTimeline(time, type, item)
      })

      $rootScope.$on("Lecture:" + lecture.id + ":remove_from_timeline", function (evt, item, type) {
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
        delete modified_lecture.selected;

        return Lecture.update({
          course_id: lecture.course_id,
          lecture_id: lecture.id
        }, {
            lecture: modified_lecture
          })
          .$promise
          .then(function (data) {

            angular.extend(lecture, data.lecture)
          })
      }

      function validateUrl() {
        var deferred = $q.defer();
        if (VideoInformation.invalidUrl(lecture.url)) {
          deferred.reject($translate.instant('editor.details.incompatible_video_link'));
        } else {
          validate()
            .then(function () {
              var type = VideoInformation.isYoutube(lecture.url)

              if (type) {
                var id = type[1]
                VideoInformation.emptyCachedInfo()
                VideoInformation.requestInfoFromYoutube(id, lecture.id, 'info: status')
                  .then(function (data) {
                    if (data.items.length > 0) {
                      if (data.items[0].status.uploadStatus === "processed") {
                        deferred.resolve();
                      } else {
                        deferred.reject($translate.instant('editor.details.vidoe_not_exist'));
                      }
                    } else {
                      deferred.reject($translate.instant('editor.details.vidoe_not_exist'));
                    }
                  })
                  .catch(function () {
                    deferred.reject($translate.instant('editor.details.vidoe_not_exist'));
                    return deferred.promise
                  })
              } else {
                deferred.resolve()
              }
            })
            .catch(function (msg) {
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
          .catch(function (resp) {
            if (resp.status == 422)
              return resp.data.errors.join();
            else
              return 'Server Error';
          })
      }

      function updateUrl() {

        VideoInformation.resetValues()
        var deferred = $q.defer();
        lecture.aspect_ratio = "widescreen"
        lecture.url = lecture.url.trim()
        if (lecture.url && lecture.url != "none" && lecture.url != "http://") {

          var type = VideoInformation.isYoutube(lecture.url)
          if (type) {
            var video_id = type[1];
            if (!VideoInformation.isFinalUrl(lecture.url)) {
              lecture.url = VideoInformation.getFinalUrl(video_id)
            }

            VideoInformation.requestInfoFromYoutube(video_id, lecture.id, 'info: duration')
              .then(function (data) {

                var duration = ScalearUtils.parseDuration(data.items[0].contentDetails.duration)
                lecture.duration = (duration.hour * (60 * 60) + duration.minute * (60) + duration.second)
                lecture.start_time = 0
                lecture.end_time = lecture.duration
                update().then(function () {
                  deferred.resolve(true);

                });
                $rootScope.$broadcast("update_module_time", lecture.group_id)
              })
          } else if (VideoInformation.isMP4(lecture.url)) {
            var video = $('video')
            video.bind('loadeddata', function (event) {
              lecture.start_time = 0
              lecture.end_time = event.target.duration || 0
              update().then(function () {
                deferred.resolve(false);
              });
              $rootScope.$broadcast("update_module_time", lecture.group_id)
            });
          } else if (VideoInformation.isMediaSite(lecture.url) || VideoInformation.isVimeo(lecture.url) || VideoInformation.isKaltura(lecture.url) || VideoInformation.isHTML5(lecture.url)) {
            if (VideoInformation.isVimeo(lecture.url)) {
              deferred.resolve(true)
            } else {
              VideoInformation.waitForDurationSetup().then(function (duration) {
                lecture.duration = duration
                lecture.start_time = 0
                lecture.end_time = lecture.duration
                update().then(function () {
                  deferred.resolve(false);
                });
                $rootScope.$broadcast("update_module_time", lecture.group_id)
              })
            }
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
          .then(function () {
            $rootScope.$broadcast("Item:removed", lecture)
          });
      }

      function updateViewPercentage(milestone) {
        return Lecture.updatePercentView({
          course_id: lecture.course_id,
          lecture_id: lecture.id
        }, {
            percent: milestone
          })
          .$promise
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

      function setAsSelected() {
        return setSelectedLecture(lecture)
      }

      function markDone() {
        $rootScope.$broadcast("item_done", lecture)
      }

      function instanceType() {
        return 'Lecture'
      }

      function clearTimeline() {
        lecture.timeline = new Timeline()
      }

      function destroy() {
        clearTimeline()
      }

      return angular.extend(lecture, {
        update: update,
        validateUrl: validateUrl,
        validate: validate,
        updateUrl: updateUrl,
        addToTimeline: addToTimeline,
        removeFromTimeline: removeFromTimeline,
        instanceType: instanceType,
        remove: remove,
        updateViewPercentage: updateViewPercentage,
        module: module,
        setAsSelected: setAsSelected,
        markDone: markDone,
        destroy: destroy
      })
    }
    function exportLectureFBF(){
      return Lecture.exportLectureToFeedbackFruit({
        course_id:1,
        lecture_id:2
      })
        .$promise
        .then(function (data) {
       
          return true
        })
    }
    return {
      createInstance: createInstance,
      isInstance: isInstance,
      clearSelectedLecture: clearSelectedLecture,
      getSelectedLecture: getSelectedLecture,
      setSelectedLecture: setSelectedLecture,
      create: create,
      paste: paste,
      exportLectureFBF:exportLectureFBF
    }

  }])
