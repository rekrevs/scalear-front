'use strict';

angular.module('scalearAngularApp')
  .factory('OnlineMarker', ['$resource', '$http', '$stateParams', 'scalear_api', 'headers', '$rootScope', '$translate', function($resource, $http, $stateParams, scalear_api, headers, $rootScope, $translate) {

    $http.defaults.useXDomain = true;
    return $resource(scalear_api.host + '/:lang/online_markers/:online_markers_id/:action', { lang: $translate.uses() }, {
      'update': { method: 'PUT', headers: headers },
      'destroy': { method: 'DELETE', headers: headers },
      'getMarkerList': { method: 'GET', params: { action: 'get_marker_list' }, headers: headers },
      'validateName': { method: 'PUT', params: { action: 'validate_name' }, headers: headers },
      'updateHide': { method: 'POST', params: { action: 'update_hide' }, headers: headers },
    });
  }]).factory('MarkerModel', ['OnlineMarker', '$rootScope', 'ItemsModel', '$q','$filter','VideoInformation','Lecture', function(OnlineMarker, $rootScope, ItemsModel, $q, $filter, VideoInformation, Lecture) {

    // var marker_list = []
    var selected_marker = null

    function getMarkers() {
      var deferred = $q.defer();
      var lecture = ItemsModel.getSelectedItem();
      OnlineMarker.getMarkerList({ lecture_id: lecture.id },
        function(data) {
          var marker_list = []
          data.markerList.forEach(function(m) {
            var marker = createInstance(m)
            marker_list.push(marker)
            $rootScope.$broadcast("Lecture:" + lecture.id + ":add_to_timeline", marker.time, "marker", marker)
          })
          deferred.resolve(marker_list);
        });
      return deferred.promise;
    }

    function addMarker(insert_time) {
      var deferred = $q.defer()
      var lecture = ItemsModel.getSelectedItem();
      var video_duration = VideoInformation.duration

      if(insert_time < 1)
        insert_time = 1
      if(insert_time >= video_duration)
        insert_time = video_duration - 2

      var same_markers = lecture.timeline.getItemsBetweenTimeByType(insert_time, insert_time, "marker")

      if(same_markers.length > 0) {
        deferred.resolve(same_markers[0].data)
      } else {
        Lecture.newMarker({
            course_id: lecture.course_id,
            lecture_id: lecture.id,
            time: insert_time,
          },
          function(data) {
            var marker = createInstance(data.marker)
            $rootScope.$broadcast("Lecture:" + lecture.id + ":add_to_timeline", marker.time, 'marker', marker)
            deferred.resolve(marker)
          })
      }
      return deferred.promise
    }

    function setSelectedMarker(marker) {
      marker.formatedTime = $filter('format')(marker.time)
      selected_marker = marker
      return getSelectedMarker()
    }

    function getSelectedMarker() {
      return selected_marker
    }

    function clearSelectedMarker() {
       selected_marker = null
    }

    function isInstance(instance) {
      return(instance.instanceType && instance.instanceType() == "Marker");
    }

    function createInstance(marker) {

      if(isInstance(marker)) {
        return marker;
      }

      function instanceType() {
        return 'Marker'
      }

      function setAsSelected() {
        return setSelectedMarker(marker)
      }

      function update() {
        return OnlineMarker.update({ online_markers_id: marker.id }, {
          online_marker: {
            time: marker.time,
            title: marker.title,
            annotation: marker.annotation
          }
        }).$promise
      }

      function deleteMarker() {
        return OnlineMarker.destroy({ online_markers_id: marker.id }, {},
          function() {
            $rootScope.$broadcast("Lecture:" + marker.lecture_id + ":remove_from_timeline", marker, 'marker')
          }).$promise
      }

      function validate() {
        var deferred = $q.defer();
        var online_marker = {}
        online_marker.title = marker.title;
        OnlineMarker.validateName({ online_markers_id: marker.id }, { online_marker: online_marker },
          function() {
            deferred.resolve()
          },
          function(data) {
            if(data.status == 422)
              deferred.resolve(data.data.errors.join());
            else
              deferred.reject('Server Error');
          })
        return deferred.promise;
      }


      return angular.extend(marker, {
        setAsSelected: setAsSelected,
        instanceType: instanceType,
        update: update,
        deleteMarker: deleteMarker,
        validate:validate
      })
    }

    return {
      getMarkers: getMarkers,
      addMarker: addMarker,
      createInstance: createInstance,
      setSelectedMarker:setSelectedMarker,
      getSelectedMarker:getSelectedMarker,
      clearSelectedMarker:clearSelectedMarker
    }

  }])
