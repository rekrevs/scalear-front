'use strict';

angular.module('scalearAngularApp')
  .controller('lectureMiddleCtrl', ['$state', '$stateParams', '$scope', '$translate', '$log', '$rootScope', '$timeout', '$q', 'DetailsNavigator', 'ngDialog', 'ItemsModel', 'VideoQuizModel', 'ScalearUtils', 'MarkerModel', '$urlRouter', 'VideoInformation', 'VimeoModel', 'MobileDetector', 'FeedbackFruitUtils', function ($state, $stateParams, $scope, $translate, $log, $rootScope, $timeout, $q, DetailsNavigator, ngDialog, ItemsModel, VideoQuizModel, ScalearUtils, MarkerModel, $urlRouter, VideoInformation, VimeoModel, MobileDetector, FeedbackFruitUtils) {

    $scope.lecture = ItemsModel.getLecture($stateParams.lecture_id)
    ItemsModel.setSelectedItem($scope.lecture)
    $scope.quiz_layer = {}
    $scope.lecture_player = {}
    $scope.lecture_player.events = {}
    $scope.marker_errors = {}
    $scope.quiz_errors = {}

    $scope.vimeo_video_id = 0
    $scope.transcoding = false

    if (isVimeo) {
      VimeoModel.getVimeoUploadingStatus($scope.lecture.id)
        .then(function (status) {
          $scope.transcoding = status == "transcoding" ? true : false
        })
      VimeoModel.getVimeoVideoId($scope.lecture.id)
        .then(function (vimeo_video_id) {
          $scope.vimeo_video_id = vimeo_video_id == 'none' ? $scope.lecture.url.split('https://vimeo.com/')[1] : vimeo_video_id
        })
    }

    $scope.$on('transcoding_begins',function(ev,vimeoVidId){      
      $scope.transcoding = true
      $scope.vimeo_video_id = vimeoVidId.vimeoVidId
    })

    $scope.$on('transcoding_ends',function(ev){  
      $scope.transcoding = false
      $stateParams.transcoding = $scope.transcoding 
    })

    var listnerDeleteVideo=$rootScope.$on('delete_video',function(ev){  
       VimeoModel.deleteVideo($scope.vimeo_video_id,$scope.lecture.id)
      resetVideoDetails()
    }) 

    function isVimeo(){
      return  $scope.lecture.url.includes('https://vimeo.com/')
    }

    function resetVideoDetails() {
      $scope.lecture.url = 'none'
      $scope.lecture.duration = 0
    }

    $scope.cancelTranscoding = function () {
      VimeoModel.deleteVideo($scope.vimeo_video_id,$scope.lecture.id)
      $scope.transcoding = false
      $rootScope.$broadcast('transcoding_canceled', {})
    }

    $scope.alert = {
      type: "alert",
      msg: "error_message.got_some_errors"
    }
    $scope.hide_alerts = true;
    
    setUpShortcuts()
    setUpEventsListeners()
    $scope.exportVideo = function(){
      FeedbackFruitUtils.exportVideoToFbf($scope.lecture.url)
      // var data = "client_id=ScalableLearning&" +
    //     "client_secret=of1Xxlp00yrWNOsnri2sSA&" +
    //     "grant_type=password&" +
    //     "username=poussy@novelari.com&" +
    //     "password=poussy123&" +
    //     "scope=api.users.read,api.activity_groups.write,api.activity_groups.read,api.emails.write,api.emails.read,api.invitations.write,api.invitations.read,api.videos.write,api.videos.read,api.video_fragments.write,api.video_fragments.read,api.open_questions.write,api.open_questions.read,api.multiple_choice_questions.write,api.multiple_choice_questions.read,api.annotations.write,api.annotations.read"

    //   //get access token
    //   var access_token
    //   var xhr = new XMLHttpRequest()
    //   xhr.withCredentials = true
    //   xhr.open('POST', 'https://staging-accounts.feedbackfruits.com/auth/token')
    //   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    //   xhr.send(data);
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //       var response = JSON.parse(xhr.responseText);
    //       access_token = response.access_token
    //       var refresh_token = response.refresh_token
    //       console.log(access_token)
    //     }
    //   }

    //   // get current user id
    //   var user_id
    //   var xhr = new XMLHttpRequest()
    //   xhr.open('GET', 'https://staging-api.feedbackfruits.com/v1/users/current', true)
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //       var response = JSON.parse(xhr.responseText);
    //       user_id = response.data.id
    //       console.log("user_id:", user_id)
    //     }
    //   }
    //   xhr.send();
    //   // curl 'https://staging-api.feedbackfruits.com/v1/users/current' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMyMzMxNzMuMjIyLCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzIyOTU3MywianRpIjoiZmUzMzYzNzgtMGM3NS00ZWFhLTk4NzMtNzdjNjdhNzQzY2RkIn0.dRpeOEZ2zc0FFxcJuB4czCgJ00iIxr2EwaXbhepClbs'



    //   // create an activity group
    //   var xhr = new XMLHttpRequest()
    //   var activity_group_id
    //   var activity_group_response
    //   xhr.open('GET', 'https://staging-api.feedbackfruits.com/v1/activity_groups')
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //   xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    //   var binary_data = '{"data":{"attributes":{"enrollability":"restricted"},"relationships":{"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'
    //   blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //       activity_group_response = JSON.parse(xhr.responseText);
    //       activity_group_id = activity_group_response['data'][0].id
    //       console.log("activity_group_id:", activity_group_id)
    //     }
    //   }
    //   xhr.send(blob)
    //   // curl 'https://staging-api.feedbackfruits.com/v1/activity_groups' \
    //   //  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMzMTQzNzQuMzU2LCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzMxMDc3NCwianRpIjoiNzBjMzc2OGItNTljNS00YzZjLThmNTItYWQ4YmVkOTdkMTk5In0.JxRhE71H2tzCknUC1DVF1nCzmlPNYH-7LkQZGrMoCWc'\
    //   //  -H 'Content-Type: application/vnd.api+json'\
    //   //  --data-binary '{"data":{"attributes":{"enrollability":"restricted"},"relationships":{"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'
    //   // activity group id =  9e73846e-bd75-4ed1-84c0-f8c334eccda3

    //   //get media id 
    //   var media_id
    //   var data = 'url=https://www.youtube.com/watch?v=_yu49cDjhPU'
    //   var xhr = new XMLHttpRequest()
    //   var media_response
    //   xhr.open('POST', 'https://staging-media.feedbackfruits.com', true)
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //       media_response = JSON.parse(xhr.responseText);
    //       media_id = media_response.id
    //       console.log("media_response:", media_response)
    //     }
    //   }
    //   xhr.send(data);
    //   //  curl -XPOST  https://staging-media.feedbackfruits.com\
    //   //  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMzMTQzNzQuMzU2LCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzMxMDc3NCwianRpIjoiNzBjMzc2OGItNTljNS00YzZjLThmNTItYWQ4YmVkOTdkMTk5In0.JxRhE71H2tzCknUC1DVF1nCzmlPNYH-7LkQZGrMoCWc'\
    //   //  -d 'url=https://www.youtube.com/watch?v=_yu49cDjhPU'\

    //   // media id = 2abf16f3-4b1d-4c49-ab14-aa451f51fe2f

    //   // create video activity
    //   var activity_video_id
    //   var activity_video_response
    //   var xhr = new XMLHttpRequest()
    //   xhr.open('GET', 'https://staging-api.feedbackfruits.com/v1/engines/multimedia/videos')
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //   xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //       activity_video_response = JSON.parse(xhr.responseText);
    //       activity_video_id = activity_video_response.data[0].id
    //       console.log("activity_video_id:", activity_video_id)
    //     }
    //   }
    //   var binary_data = '{"data":{"attributes":{"title":"TITLE OF VIDEO"},' +
    //     '"relationships":{"media":{"data":{"type":"media","id":"' + media_id + '"}},' +
    //     '"extension":{"data":{"type":"extensions","id":"video"}},' +
    //     '"group":{"data":{"type":"activity-groups","id":"' + activity_group_id + '"}}},"type":"videos"}}'

    //   var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
    //   xhr.send(blob);
    //   // curl 'https://staging-api.feedbackfruits.com/v1/engines/multimedia/videos'\
    //   //  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMzMTQzNzQuMzU2LCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzMxMDc3NCwianRpIjoiNzBjMzc2OGItNTljNS00YzZjLThmNTItYWQ4YmVkOTdkMTk5In0.JxRhE71H2tzCknUC1DVF1nCzmlPNYH-7LkQZGrMoCWc'\
    //   //  -H 'Content-Type: application/vnd.api+json'\
    //   //  --data-binary '{"data":{"attributes":{"title":"TITLE OF VIDEO"},"relationships":{"media":{"data":{"type":"media","id":"2abf16f3-4b1d-4c49-ab14-aa451f51fe2f"}},"extension":{"data":{"type":"extensions","id":"video"}},"group":{"data":{"type":"activity-groups","id":"9e73846e-bd75-4ed1-84c0-f8c334eccda3"}}},"type":"videos"}}'

    //   //video can be put on the activity group as its activity
    //   var patch_video_id
    //   var patch_video_response
    //   var xhr = new XMLHttpRequest()
    //   xhr.open('PATCH', 'https://staging-api.feedbackfruits.com/v1/activity_groups/' + activity_group_id)
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //   xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //       patch_video_response = JSON.parse(xhr.responseText);
    //       patch_video_id = patch_video_response.data[0].id
    //       console.log("activity_video_id:", activity_video_id)
    //     }
    //   }
    //   var binary_data = '{"data":{"id":"' + activity_group_id + '",' +
    //     '"attributes":{},' +
    //     '"relationships":{"activity":{"data":{"type":"videos","id":"' + activity_video_id + '"}},' +
    //     '"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'
    //   var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
    //   xhr.send(blob);
    //   // curl 'https://staging-api.feedbackfruits.com/v1/activity_groups/GROUP_ID'\
    //   //  -H 'Authorization: Bearer XXX'\
    //   //  -X PATCH\
    //   //  -H 'Content-Type: application/vnd.api+json'\
    //   //  --data-binary '{"data":{"id":"GROUP_ID","attributes":{},"relationships":{"activity":{"data":{"type":"videos","id":"ACTIVITY_ID"}},"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'


    //   //Give teacher access
    //   //add teacher email
    //   var email_id
    //   var add_teacher_email_response
    //   var xhr = new XMLHttpRequest()
    //   xhr.open('POST', 'https://staging-api.feedbackfruits.com/v1/emails', true)
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //   xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
    //       add_teacher_email_response = JSON.parse(xhr.responseText);
    //       email_id = add_teacher_email_response.data.id
    //       console.log("email_id:", email_id)
    //     }
    //   }
    //   var binary_data = '{"data":{"attributes":{"address":"poussy.amr.nileu@gmail.com"},"type":"emails"}}'
    //   var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
    //   xhr.send(blob);
    //   // curl 'https://staging-api.feedbackfruits.com/v1/emails'\
    //   // -H 'Authorization: Bearer XXX'\
    //   // -H 'Content-Type: application/vnd.api+json'\
    //   // --data-binary '{"data":{"attributes":{"address":"poussy.amr.nileu@gmail.com"},"type":"emails"}}'

    //   //invite teacher
    //   var invitation_id
    //   var invitation_response
    //   var xhr = new XMLHttpRequest()
    //   xhr.open('POST', 'https://staging-api.feedbackfruits.com/v1/invitations', true)
    //   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //   xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
    //   xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
    //       invitation_response = JSON.parse(xhr.responseText);
    //       invitation_id = invitation_response.data.id
    //       console.log("invitation_id:", invitation_id)
    //     }
    //   }
    //   var binary_data = '{"data":{"attributes":{"admin":true,"status":"pending"},"relationships":{"group":{"data":{"type":"activity-groups","id":"' + activity_group_id + '"}},"email":{"data":{"type":"emails","id":"' + email_id + '"}}},"type":"invitations"}}'
    //   var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
    //   xhr.send(blob);
    // //curl 'https://staging-api.feedbackfruits.com/v1/invitations'\
    // // -H 'Content-Type: application/vnd.api+json'\
    // // --data-binary '{"data":{"attributes":{"admin":true,"status":"pending"},"relationships":{"group":{"data":{"type":"activity-groups","id":"GROUP_ID"}},"email":{"data":{"type":"emails","id":"EMAIL_ID"}}},"type":"invitations"}}'

    };
 
    
    $scope.lecture_player.events.onMeta = function() {
      // update duration for all video types.
      var total_duration = $scope.lecture_player.controls.getDuration()
      if (Math.ceil($scope.lecture.duration) != Math.ceil(total_duration)) {
        $scope.lecture.duration = total_duration
        $scope.lecture.update()
        $rootScope.$broadcast("update_module_time", $scope.lecture.group_id)
      }
      $scope.slow = false

      $scope.video_ready = false
    }

    $scope.lecture_player.events.onReady = function() {
      VideoInformation.waitForDurationSetup()
        .then(function(){
          $scope.video_ready = true
          var time = $state.params.time
          if (time) {
            $timeout(function (argument) {
              $scope.seek(time-0.2)
            })
          } else if (!($rootScope.is_mobile)) {
            $scope.lecture_player.controls.seek_and_pause(0)
          }
          $scope.lecture.timeline.items.forEach(function(item) {
            item.data && addItemToVideoQueue(item.data, item.type);
          })
        })
    }

    $scope.lecture_player.events.onPlay = function() {
      $scope.slow = false
      if ($scope.selected_quiz) {
        $scope.selected_quiz.hide_quiz_answers = true
        hideQuizBackground()
      }
    }
    $scope.lecture_player.events.onSlow = function(is_youtube) {
      $scope.is_youtube = is_youtube
      $scope.slow = true
    }
    function showMarker(marker) {
      $rootScope.$broadcast("show_online_marker", marker)
    }

    function addItemToVideoQueue(item_data, type) {
      item_data.cue = $scope.lecture_player.controls.cue($scope.lecture.start_time + (item_data.time - 0.1), function() {

        if (!$scope.lecture_player.controls.paused()) {
          $timeout(function() {
            if (type == 'quiz'){

              $scope.lecture_player.controls.seek_and_pause(item_data.time);
              $scope.showOnlineQuiz(item_data);
            } else if ( !item_data.as_slide) {
              $scope.showAnnotation(item_data)
            } else {
              showMarker(item_data)
            }
          })
        }
      })
    }

    function removeItemFromVideoQueue(item_data) {
      if (item_data.cue) {
        $scope.lecture_player.controls.removeTrackEvent(item_data.cue.id)
      }
    }

    $scope.closeAlerts = function() {
      $scope.hide_alerts = true;
    }

    $scope.refreshVideo = function() {
      $scope.slow = false
      $scope.video_ready = false
      var temp_url = $scope.lecture.url
      $scope.lecture.url = ""
      $timeout(function() {
        $scope.lecture.url = temp_url
      })
    }

    $scope.seek = function(time) { 
      $scope.lecture_player.controls.seek(time)
      if (!$scope.editing_mode) {
        $scope.dismissMarkerAnnotation()
      }
    }

    $scope.addQuestion = function() {
      $scope.lecture_player.controls.pause();
      $scope.openQuestionsModal()
    }

    $scope.insertQuiz = function(quiz_type, question_type) {
      var insert_time = $scope.lecture_player.controls.getTime()

      VideoQuizModel.addVideoQuiz(insert_time, quiz_type, question_type)
        .then(function(quiz) {
          $scope.lecture_player.controls.seek_and_pause(quiz.time)
          $scope.editing_mode = false
          $scope.quiz_deletable = true
          $scope.showOnlineQuiz(quiz)

          addItemToVideoQueue(quiz, "quiz")
          DetailsNavigator.open()
        })
    }

    $scope.showOnlineQuiz = function(quiz) {
      $scope.selected_quiz = VideoQuizModel.getSelectedVideoQuiz()
      $scope.last_details_state = DetailsNavigator.getStatus()

      if ($scope.selected_quiz != quiz) {
        saveOpenEditor()
          .then(function() {
            $scope.hide_alerts = true;
            $scope.submitted = false
            $scope.editing_mode = false;
            $timeout(function() {
              $scope.editing_mode = true;
            })
            $scope.selected_quiz = VideoQuizModel.createInstance(quiz).setAsSelected()
            $scope.selected_quiz.selected = true
            $scope.selected_quiz.hide_quiz_answers = false
            $scope.editing_type = 'quiz'
            $scope.lecture_player.controls.seek_and_pause(quiz.time)

            if ($scope.selected_quiz.isTextQuiz()) {
              $scope.selected_quiz.getTextQuizAnswers()
              $scope.double_click_msg = ""
              showQuizBackground($scope.selected_quiz)
            } else {
              $scope.selected_quiz.getInVideoQuizAnswers();
              $scope.double_click_msg = "editor.messages.double_click_new_answer";
              hideQuizBackground()
            }
          })
      }
    }

    function showQuizBackground(quiz) {
      if (quiz.isTextQuiz()) {
        $scope.quiz_layer.backgroundColor = "white"
        $scope.quiz_layer.overflowX = 'hidden'
        $scope.quiz_layer.overflowY = 'auto'
      }
    }

    function hideQuizBackground() {
      $scope.quiz_layer.backgroundColor = "transparent"
      $scope.quiz_layer.overflowX = ''
      $scope.quiz_layer.overflowY = ''
    }

    $scope.addDoubleClickBind = function(event) { 
      if ($scope.editing_mode && $scope.editing_type == 'quiz' && !$scope.selected_quiz.hide_quiz_answers && !$scope.selected_quiz.isFreeTextVideoQuiz()) {
   
        var answer_width, answer_height,
          answer_text = "Answer " + ($scope.selected_quiz.answers.length + 1)

        if ($scope.selected_quiz.isDragQuiz()) {
          answer_width = 150
          answer_height = 40
        } else {
          answer_width = 13
          answer_height = 13
        }

        var element = angular.element(event.target);
        if (element.attr('id') == "ontop") {
          var left = event.pageX - element.offset().left - 6 //event.offsetX - 6
          var top = event.pageY - element.offset().top - 6 //event.offsetY - 6
          var the_top = top / element.height();
          var the_left = left / element.width()
          var the_width = answer_width / element.width();
          var the_height = answer_height / (element.height());
          $scope.selected_quiz.addAnswer(answer_text, the_height, the_width, the_left, the_top)
          if (window.getSelection)
            window.getSelection().removeAllRanges();
          else if (document.selection)
            document.selection.empty();
        }
      }
    }

    function isFormValid() {
      var correct = 0;
      if (!$scope.selected_quiz.isFreeTextVideoQuiz()) {
        for (var idx in $scope.selected_quiz.answers) {
          if (!$scope.selected_quiz.answers[idx].answer || $scope.selected_quiz.answers[idx].answer.trim() == "") {
            $scope.alert.msg = "editor.messages.provide_answer"
            return false
          }
          if ($scope.selected_quiz.isDragQuiz())
            correct = 1
          else
            correct = $scope.selected_quiz.answers[idx].correct || correct;
        }
        if (!correct && (!$scope.selected_quiz.isSurvey() && !$scope.selected_quiz.isTextSurvey())) {
          $scope.alert.msg = "editor.messages.quiz_no_answer"
          return false
        }
      }
      return true;
    };

    $scope.saveQuizBtn = function(options) { 
      $scope.quiz_errors = {}
      return $scope.selected_quiz.validate()
        .then(function(data) {
          if (!(data && data.errors)) {
            removeItemFromVideoQueue($scope.selected_quiz);

            addItemToVideoQueue($scope.selected_quiz, "quiz");
            $scope.selected_quiz.update()
            return saveQuizAnswers(options)
          } else {
            angular.extend($scope.quiz_errors, data.errors)
            return true
          }
        })
      // .catch(function(errors) {
      //   angular.extend($scope.quiz_errors, errors)
      //   return true
      // })
    }

    function saveQuizAnswers(options) {
      if ((
          ($scope.answer_form.$valid && $scope.selected_quiz.isTextVideoQuiz()) ||
          ((!$scope.selected_quiz.isTextVideoQuiz() || $scope.selected_quiz.isTextSurvey()) && isFormValid())
        ) && $scope.selected_quiz.answers.length) {
        $scope.submitted = false;
        $scope.hide_alerts = true;
        $scope.quiz_deletable = false

        $scope.selected_quiz.updateAnswers()
          .then(function() {
            if (!(options && options.exit)) {
              $scope.selected_quiz.getQuizAnswers()
            }
          })

        if (options && options.exit) {
          $scope.exitQuizBtn()
        }
        return false
      } else {
        if ($scope.selected_quiz.isTextVideoQuiz()) {
          $scope.alert.msg = $scope.answer_form.$error.atleastone ? "editor.messages.quiz_no_answer" : "editor.messages.provide_answer"
        }
        $scope.submitted = true;
        $scope.hide_alerts = false;
        $scope.lecture_player.controls.seek_and_pause($scope.selected_quiz.time);
        $scope.selected_quiz.hide_quiz_answers = false      
        showQuizBackground($scope.selected_quiz)                
        return true
      }
    }

    $scope.exitQuizBtn = function() {
      if ($scope.quiz_deletable) {
        $scope.selected_quiz.deleteQuiz()
      }
      closeQuizMode()
      if (!$scope.last_details_state)
        DetailsNavigator.close()
    }

    $scope.deleteQuizButton = function(quiz) {
      if ($scope.selected_quiz == quiz)
        closeQuizMode()
      quiz.deleteQuiz()
        .then(function() {
          removeItemFromVideoQueue(quiz)
        })
    }

    function closeQuizMode() {
      closeEditor()
      $scope.submitted = false
      $scope.quiz_layer.backgroundColor = ""
      clearQuizVariables()
      closePreviewInclass()
    }

    function clearQuizVariables() {
      if ($scope.selected_quiz)
        $scope.selected_quiz.selected = false
      $scope.selected_quiz = null
      $scope.quiz_errors = {}
      $scope.quiz_deletable = false
      VideoQuizModel.clearSelectedVideoQuiz()
    }


    $scope.createVideoLink = function() {
      var time = Math.floor($scope.lecture_player.controls.getTime())
      return { url: $state.href('course.module.courseware.lecture', { module_id: $scope.lecture.group_id, lecture_id: $scope.lecture.id, time: time }, { absolute: true }), time: time }
    }

    $scope.openQuizList = function(ev) {
      DetailsNavigator.open()
      angular.element(ev.target).blur()
      var temp_quiz = {}
      $scope.lecture.addToTimeline(0, "quiz", temp_quiz)
      $timeout(function() {
        $scope.lecture.removeFromTimeline(temp_quiz, 'quiz')
      })
    }

    $scope.addOnlineMarker = function(display_editor) {
      var insert_time = $scope.lecture_player.controls.getTime()
      var answer_width = 250,
        answer_height = 100,
        element = angular.element("#ontop"),
        the_top = 0.9,
        the_left = 0,
        the_width = 0.5,
        the_height = 0.1;

      MarkerModel.addMarker(insert_time, the_height, the_width, the_left, the_top)
        .then(function(marker) {

          addItemToVideoQueue(marker, "marker")
          if (display_editor) {
            $scope.lecture_player.controls.seek_and_pause(insert_time)
            DetailsNavigator.open()
            if (!$scope.editing_mode || ($scope.editing_mode && $scope.editing_type != 'quiz'))
              $scope.showOnlineMarker(marker)
          }
        })
    }

    function saveOpenEditor() {
      var deferred = $q.defer();
      var promise = $q.when(false);
      if ($scope.editing_mode) {
        if ($scope.selected_marker) {
          promise = $scope.saveMarkerBtn($scope.selected_marker, { exit: true })
        } else if ($scope.selected_quiz) {
          promise = $scope.saveQuizBtn({ exit: true })
        }
      }
      promise.then(function(error) {
        error ? deferred.reject() : deferred.resolve()
      })
      return deferred.promise
    }

    $scope.showOnlineMarker = function(marker) {
      $scope.selected_marker = MarkerModel.getSelectedMarker()
      if ($scope.selected_marker != marker) {
        saveOpenEditor()
          .then(function() {
            $scope.editing_mode = false;
            $timeout(function() {
              $scope.editing_mode = true;
            })
            $scope.selected_marker = MarkerModel.createInstance(marker).setAsSelected()
            $scope.editing_type = 'marker'
            $scope.lecture_player.controls.seek_and_pause(marker.time)
          })
      }
    }

    $scope.showAnnotation = function(marker) {
      $scope.selected_marker = marker
      $scope.lecture_player.controls.cue($scope.lecture.start_time + (marker.time - 0.1 + marker.duration), function() {
        $scope.dismissMarkerAnnotation()
      })
    }

    $scope.dismissMarkerAnnotation = function(){
      $scope.selected_marker = null
    }

    $scope.deleteMarkerButton = function(marker) {
      if ($scope.selected_marker == marker) {
        closeMarkerMode()
      }
      marker.deleteMarker()
        .then(function() {
          removeItemFromVideoQueue(marker)
        })
    }

    $scope.saveMarkerBtn = function(marker, options) {
      return marker.validate()
        .then(function() {
          var same_markers = $scope.lecture.timeline.getItemsBetweenTimeByType(marker.time, marker.time, "marker")
          if (same_markers.length > 0 && same_markers[0].data.id != marker.id) {
            $scope.alert.msg = "error_message.another_marker" //"There is another marker at the same time"
            $scope.hide_alerts = false;
            return true
          } else {
            removeItemFromVideoQueue(marker)
            addItemToVideoQueue(marker, "marker")
            marker.update()
            closeMarkerMode()
            return false
          }
        })
        .catch(function(errors) {
          angular.extend($scope.marker_errors, errors)
          return true
        })
    }

    function closeMarkerMode() {
      closeEditor()
      clearMarkerVariables()
    }

    function clearMarkerVariables() {
      $scope.dismissMarkerAnnotation()
      $scope.marker_errors = {}
      MarkerModel.clearSelectedMarker()
    }

    function closeEditor() {
      $scope.editing_mode = false;
      $scope.hide_alerts = true;
      $scope.editing_type = null
    }


    $scope.togglePreviewInclass = function() {
      $scope.filtered_timeline_items ? closePreviewInclass() : openPreviewInclass()
    }

    function closePreviewInclass() {
      $scope.filtered_timeline_items = null
      $scope.selected_inclass_item = null
    }

    function openPreviewInclass() {
      $scope.filtered_timeline_items = angular.copy($scope.lecture.timeline.getItemsBetweenTime($scope.selected_quiz.start_time, $scope.selected_quiz.end_time))
      for (var item_index = 0; item_index < $scope.filtered_timeline_items.length; item_index++) {
        var current_item = $scope.filtered_timeline_items[item_index]
        current_item.data.background = "lightgrey"
        current_item.data.color = "black"
        if (current_item.type == 'quiz') {
          current_item.data.inclass_title = $translate.instant('inclass.self_stage')
          current_item.data.background = "#008CBA"
          current_item.data.color = "white"

          var start_item = { time: current_item.data.start_time, type: 'marker', data: { time: current_item.data.start_time } }
          $scope.filtered_timeline_items.splice(0, 0, start_item);
          item_index++

          var group_quiz = angular.copy(current_item)
          group_quiz.data.inclass_title = $translate.instant('inclass.group_stage')
          group_quiz.data.background = "#43AC6A"
          $scope.filtered_timeline_items.splice(++item_index, 0, group_quiz);

          var discussion = angular.copy(current_item)

          discussion.data.inclass_title = $translate.instant('inclass.discussion_stage')
          discussion.data.background = "darkorange"
          discussion.data.color = "white"
          $scope.filtered_timeline_items.splice(++item_index, 0, discussion);
          if (current_item.data.time < current_item.data.end_time) {
            var end_item = { time: current_item.data.end_time, type: 'marker', data: { time: current_item.data.end_time } }
            $scope.filtered_timeline_items.splice($scope.filtered_timeline_items.length, 0, end_item);
          }
          continue;
        }
      }
      $scope.filtered_timeline_items[0].data.inclass_title = $translate.instant('inclass.intro_stage')
      $scope.filtered_timeline_items[0].data.background = "lightgrey"
      $scope.filtered_timeline_items[0].data.color = "black"

      $scope.goToInclassItem($scope.filtered_timeline_items[0])
    }

    $scope.goToInclassItem = function(item) {
      $scope.selected_inclass_item = item
      $scope.lecture_player.controls.seek_and_pause($scope.selected_inclass_item.data.time)
      $scope.selected_quiz.hide_quiz_answers = $scope.selected_inclass_item.type != 'quiz'
      if ($scope.selected_inclass_item.type == 'quiz') {
        $scope.selected_quiz.hide_quiz_answers = false
        showQuizBackground($scope.selected_quiz)
      } else {
        $scope.selected_quiz.hide_quiz_answers = true
        hideQuizBackground()
      }
    }

    $scope.inclassNextItem = function() {
      var next_index = $scope.filtered_timeline_items.indexOf($scope.selected_inclass_item) + 1
      if (next_index < $scope.filtered_timeline_items.length)
        $scope.goToInclassItem($scope.filtered_timeline_items[next_index])
    }

    $scope.inclassPrevItem = function() {
      var prev_index = $scope.filtered_timeline_items.indexOf($scope.selected_inclass_item) - 1
      if (prev_index >= 0)
        $scope.goToInclassItem($scope.filtered_timeline_items[prev_index])
    }

    function startTrimMode() {
      $scope.editing_mode = true
      $scope.editing_type = 'video'
    }

    function saveTrimVideo() {
      $scope.lecture.start_time = Math.floor($scope.lecture.start_time)
      $scope.lecture.end_time = Math.floor($scope.lecture.end_time)
    
      closeEditor()
      $scope.refreshVideo()
    }

    function setUpShortcuts() {
      shortcut.add("i", function() {
        $scope.addQuestion()
      }, { "disable_in_input": true, 'propagate': false });

      shortcut.add("n", function() {
        $scope.addOnlineMarker(true)
      }, { "disable_in_input": true, 'propagate': false });

      shortcut.add("Shift+n", function() {
        $scope.addOnlineMarker(false)
      }, { "disable_in_input": true, 'propagate': false });
    }

    function removeShortcuts() {
      shortcut.remove("i");
      shortcut.remove("n");
      shortcut.remove("Shift+n");
    }

    function setUpEventsListeners() {
      $scope.$on("show_online_quiz", function(ev, quiz) {
        $scope.showOnlineQuiz(quiz)
      })

      $scope.$on("delete_online_quiz", function(ev, quiz) {
        $scope.deleteQuizButton(quiz)
      })

      $scope.$on("show_online_marker", function(ev, marker) {
        $scope.showOnlineMarker(marker)
      })

      $scope.$on("delete_online_marker", function(ev, marker) {
        $scope.deleteMarkerButton(marker)
      })

      $scope.$on("add_online_quiz", function(ev, quiz_type, question_type) {
        $scope.insertQuiz(quiz_type, question_type)
      })

      $scope.$on("start_trim_video", function() {
        startTrimMode()
      })

      $scope.$on("close_trim_video", function() {
        saveTrimVideo()
      })

      $scope.$on("show_quiz_background", function(ev, quiz) {
        showQuizBackground(quiz)
      })

      $scope.$on("hide_quiz_background", function(ev) {
        hideQuizBackground()
      })
    }

    function showUnsavedQuizDialog() {
      return ngDialog.openConfirm({
        template: '<div class="ngdialog-message">\
                  <h2><b><span translate>lectures.messages.change_lost</span></b></h2>\
                  <span translate>lectures.messages.navigate_away</span>\
                  </div>\
                  <div class="ngdialog-buttons">\
                      <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)" translate>global.leave</button>\
                      <button type="button" class="ngdialog-button ngdialog-button-primary"  ng-click="confirm(1)"translate>global.stay</button>\
                  </div>',
        plain: true,
        className: 'ngdialog-theme-default ngdialog-dark_overlay ngdialog-theme-custom',
        showClose: false,
      })
    }

    function changeState(toState, toParams, options) {
      $scope.leave_state = true
      $state.go(toState, toParams, options)
      unregisterStateEvent()
    }

    function cancelEditedChanges() {
      if ($scope.selected_marker) {
        closeMarkerMode()
      } else
      if ($scope.selected_quiz) {
        $scope.exitQuizBtn()
      }
    }

    var unregisterStateEvent = $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams, options) {
        event.preventDefault();
        saveOpenEditor()
          .then(function success() {
            changeState(toState, toParams, {})
          }, function fail() {
            showUnsavedQuizDialog()
              .catch(function(value) { //leave
                cancelEditedChanges()
                changeState(toState, toParams, {})
              })
          })
      })

    $scope.$on("$destroy", function() {
      removeShortcuts()
      listnerDeleteVideo()
    })
    
  }]);
