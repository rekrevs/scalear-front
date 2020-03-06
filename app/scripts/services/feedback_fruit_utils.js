'use strict';

angular.module('scalearAngularApp')
    .service('FeedbackFruitUtils', ['$rootScope', '$q', 'Lecture', function ($rootScope, $q, Lecture) {
    //   var getAccessToken = function () {
    //       var deferred = $q.defer()
    //       var data = "client_id=ScalableLearning&" +
    //           "client_secret=of1Xxlp00yrWNOsnri2sSA&" +
    //           "grant_type=password&" +
    //           "username=poussy@novelari.com&" +
    //           "password=poussy123&" +
    //           "scope=api.users.read,api.activity_groups.write,api.activity_groups.read,api.emails.write,api.emails.read,api.invitations.write,api.invitations.read,api.videos.write,api.videos.read,api.video_fragments.write,api.video_fragments.read,api.open_questions.write,api.open_questions.read,api.multiple_choice_questions.write,api.multiple_choice_questions.read,api.annotations.write,api.annotations.read"
    //       //get access token
    //       var access_token
    //       var xhr = new XMLHttpRequest()
    //       xhr.withCredentials = true
    //       xhr.open('POST', 'https://staging-accounts.feedbackfruits.com/auth/token')
    //       xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    //       xhr.onreadystatechange = function () {
    //           if (xhr.readyState == 4 && xhr.status == 200) {
    //               var response = JSON.parse(xhr.responseText);
    //               access_token = response.access_token
    //               console.log(access_token)
    //               deferred.resolve(access_token)
                  
    //           }
    //       }
    //       xhr.send(data);
    //       return deferred.promise
    //   }
      // get current user id
      var getCurrentUserId = function (access_token) {
          var user_id
          var xhr = new XMLHttpRequest()
          xhr.open('POST', 'https://staging-api.feedbackfruits.com/v1/users/current', true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  var response = JSON.parse(xhr.responseText);
                  user_id = response.data.id
                  console.log("user_id:", user_id)
              }
          }
          xhr.send();
          // curl 'https://staging-api.feedbackfruits.com/v1/users/current' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMyMzMxNzMuMjIyLCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzIyOTU3MywianRpIjoiZmUzMzYzNzgtMGM3NS00ZWFhLTk4NzMtNzdjNjdhNzQzY2RkIn0.dRpeOEZ2zc0FFxcJuB4czCgJ00iIxr2EwaXbhepClbs'
      }
      // create an activity group
      var createActivityGroupId = function (access_token) { 
          var deferred = $q.defer()
          var xhr = new XMLHttpRequest()
          var activity_group_id
          var activity_group_response
          xhr.open('POST', 'https://staging-api.feedbackfruits.com/v1/activity_groups')
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
          var binary_data = '{"data":{"attributes":{"enrollability":"restricted"},"relationships":{"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'
          var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  activity_group_response = JSON.parse(xhr.responseText);
                  activity_group_id = activity_group_response['data'][0].id
                  console.log("activity_group_id:", activity_group_id)
                  console.log("activity_group_response:", activity_group_response)
                  deferred.resolve(activity_group_id)
              }
          }
          xhr.send(blob)
          // curl 'https://staging-api.feedbackfruits.com/v1/activity_groups' -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMzNTY2MTQuMzA1LCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzM1MzAxNCwianRpIjoiNjQwMDk1MTItYTA1Mi00OTlhLTllM2UtODIzZjc3MjA2Yzg1In0.uZhLUHXXd9wL6nF2Fe75jhlNe7D2OYn582C2oBww1OQ'   -H 'Content-Type: application/vnd.api+json' --data-binary '{"data":{"attributes":{"enrollability":"restricted"},"relationships":{"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'
          // activity group id =  9e73846e-bd75-4ed1-84c0-f8c334eccda3
          return deferred.promise
      }
      //get media id 
      var uploadLectureVideo = function (url,access_token) {
          var deferred = $q.defer()
          var media_id
          var data = 'url=' + url
          var xhr = new XMLHttpRequest()
          var media_response
          xhr.open('POST', 'https://staging-media.feedbackfruits.com', true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  media_response = JSON.parse(xhr.responseText);
                  media_id = media_response.id
                  console.log("media_id:", media_id)
                  deferred.resolve(media_id)
                  
              }
          }
          xhr.send(data);
          //  curl -XPOST  https://staging-media.feedbackfruits.com\
          //  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMzMTQzNzQuMzU2LCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzMxMDc3NCwianRpIjoiNzBjMzc2OGItNTljNS00YzZjLThmNTItYWQ4YmVkOTdkMTk5In0.JxRhE71H2tzCknUC1DVF1nCzmlPNYH-7LkQZGrMoCWc'\
          //  -d 'url=https://www.youtube.com/watch?v=_yu49cDjhPU'\

          // media id = 2abf16f3-4b1d-4c49-ab14-aa451f51fe2f
          return deferred.promise
      }
      // create video activity
      var createActivityVideo = function (access_token, media_id, activity_group_id) {
          var deferred = $q.defer()
          var activity_video_id
          var activity_video_response
          var xhr = new XMLHttpRequest()
          xhr.open('POST', 'https://staging-api.feedbackfruits.com/v1/engines/multimedia/videos')
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  activity_video_response = JSON.parse(xhr.responseText);
                  activity_video_id = activity_video_response.data[0].id
                  console.log("activity_video_id:", activity_video_id)
                  deferred.resolve(activity_video_id)
              }
          }
          var binary_data = '{"data":{"attributes":{"title":"TITLE OF VIDEO"},' +
              '"relationships":{"media":{"data":{"type":"media","id":"' + media_id + '"}},' +
              '"extension":{"data":{"type":"extensions","id":"video"}},' +
              '"group":{"data":{"type":"activity-groups","id":"' + activity_group_id + '"}}},"type":"videos"}}'

          var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
          xhr.send(blob);
          // curl 'https://staging-api.feedbackfruits.com/v1/engines/multimedia/videos'\
          //  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODMzMTQzNzQuMzU2LCJpc3MiOiJGZWVkYmFja0ZydWl0cyBBY2NvdW50cyIsInNjb3BlIjoiYXBpLnVzZXJzLnJlYWQsYXBpLmFjdGl2aXR5X2dyb3Vwcy53cml0ZSxhcGkuYWN0aXZpdHlfZ3JvdXBzLnJlYWQsYXBpLmVtYWlscy53cml0ZSxhcGkuZW1haWxzLnJlYWQsYXBpLmludml0YXRpb25zLndyaXRlLGFwaS5pbnZpdGF0aW9ucy5yZWFkLGFwaS52aWRlb3Mud3JpdGUsYXBpLnZpZGVvcy5yZWFkLGFwaS52aWRlb19mcmFnbWVudHMud3JpdGUsYXBpLnZpZGVvX2ZyYWdtZW50cy5yZWFkLGFwaS5vcGVuX3F1ZXN0aW9ucy53cml0ZSxhcGkub3Blbl9xdWVzdGlvbnMucmVhZCxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy53cml0ZSxhcGkubXVsdGlwbGVfY2hvaWNlX3F1ZXN0aW9ucy5yZWFkLGFwaS5hbm5vdGF0aW9ucy53cml0ZSxhcGkuYW5ub3RhdGlvbnMucmVhZCIsInN1YiI6ImNjYWRjZDM0LTRiNjktNDE0OS04NWQ3LTIxMjcyMmI4YWVmMSIsImlhdCI6MTU4MzMxMDc3NCwianRpIjoiNzBjMzc2OGItNTljNS00YzZjLThmNTItYWQ4YmVkOTdkMTk5In0.JxRhE71H2tzCknUC1DVF1nCzmlPNYH-7LkQZGrMoCWc'\
          //  -H 'Content-Type: application/vnd.api+json'\
          //  --data-binary '{"data":{"attributes":{"title":"TITLE OF VIDEO"},"relationships":{"media":{"data":{"type":"media","id":"2abf16f3-4b1d-4c49-ab14-aa451f51fe2f"}},"extension":{"data":{"type":"extensions","id":"video"}},"group":{"data":{"type":"activity-groups","id":"9e73846e-bd75-4ed1-84c0-f8c334eccda3"}}},"type":"videos"}}'
          return deferred.promise
      }
      //put video on the activity group as its activity
      var attachVideoToGroup = function (access_token, activity_group_id, activity_video_id) {
          var deferred = $q.defer()
          var patch_video_id
          var patch_video_response
          var xhr = new XMLHttpRequest()
          xhr.open('PATCH', 'https://staging-api.feedbackfruits.com/v1/activity_groups/' + activity_group_id)
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                  patch_video_response = JSON.parse(xhr.responseText);
                  patch_video_id = patch_video_response.data.id
                  console.log("activity_video_id:", activity_video_id)
                  deferred.resolve(patch_video_id)
              }
          }
          var binary_data = '{"data":{"id":"' + activity_group_id + '",' +
              '"attributes":{},' +
              '"relationships":{"activity":{"data":{"type":"videos","id":"' + activity_video_id + '"}},' +
              '"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'
          var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
          xhr.send(blob);
          // curl 'https://staging-api.feedbackfruits.com/v1/activity_groups/GROUP_ID'\
          //  -H 'Authorization: Bearer XXX'\
          //  -X PATCH\
          //  -H 'Content-Type: application/vnd.api+json'\
          //  --data-binary '{"data":{"id":"GROUP_ID","attributes":{},"relationships":{"activity":{"data":{"type":"videos","id":"ACTIVITY_ID"}},"extension":{"data":{"type":"extensions","id":"video"}}},"type":"activity-groups"}}'
          return deferred.promise
      }
      //add teacher email
      var registerTeacherEmail = function (access_token, teacher_email) {
          var deferred = $q.defer()
          var email_id
          var add_teacher_email_response
          var xhr = new XMLHttpRequest()
          xhr.open('POST', 'https://staging-api.feedbackfruits.com/v1/emails', true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
                  add_teacher_email_response = JSON.parse(xhr.responseText);
                  email_id = add_teacher_email_response.data.id
                  console.log("email_id:", email_id)
                  deferred.resolve(email_id)
              }
          }
          var binary_data = '{"data":{"attributes":{"address":"' + teacher_email + '"},"type":"emails"}}'
          var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
          xhr.send(blob);
          // curl 'https://staging-api.feedbackfruits.com/v1/emails'\
          // -H 'Authorization: Bearer XXX'\
          // -H 'Content-Type: application/vnd.api+json'\
          // --data-binary '{"data":{"attributes":{"address":"poussy.amr.nileu@gmail.com"},"type":"emails"}}'
          return deferred.promise
       }

      //invite teacher
      var inviteTeacher = function (access_token, activity_group_id, email_id) {
          var deferred = $q.defer()
          var invitation_id
          var invitation_response
          var xhr = new XMLHttpRequest()
          xhr.open('POST', 'https://staging-api.feedbackfruits.com/v1/invitations', true)
          xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
          xhr.setRequestHeader('Content-Type', 'application/vnd.api+json');
          xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 201)) {
                  invitation_response = JSON.parse(xhr.responseText);
                  invitation_id = invitation_response.data.id
                  console.log("invitation_id:", invitation_id)
                  deferred.resolve(invitation_id)
              }
          }
          var binary_data = '{"data":{"attributes":{"admin":true,"status":"pending"},"relationships":{"group":{"data":{"type":"activity-groups","id":"' + activity_group_id + '"}},"email":{"data":{"type":"emails","id":"' + email_id + '"}}},"type":"invitations"}}'
          var blob = new Blob([binary_data], { type: 'application/vnd.api+json' })
          xhr.send(blob);
          //curl 'https://staging-api.feedbackfruits.com/v1/invitations'\
          // -H 'Content-Type: application/vnd.api+json'\
          // --data-binary '{"data":{"attributes":{"admin":true,"status":"pending"},"relationships":{"group":{"data":{"type":"activity-groups","id":"GROUP_ID"}},"email":{"data":{"type":"emails","id":"EMAIL_ID"}}},"type":"invitations"}}'
          return deferred.promise
      }

      return {
          //Give teacher access
          assignVideoAccessToTeacher: function () {
              registerTeacherEmail(access_token, teacher_email)
                  .then(function (email_id) {
                      inviteTeacher(access_token, activity_group_id, email_id)
                  })

          },
          exportVideoToFbf: function (url) {
            Lecture.getFeedbackFruitAccessToken({}).then(function (access_token) {
                //   console.log("access_token:", access_token)
                  createActivityGroupId(access_token).then(function (activity_group_id) {
                    //   console.log("activity_group_id:", activity_group_id)
                      uploadLectureVideo(url,access_token).then(function (media_id) {
                        //   console.log("media_id:", media_id)
                          createActivityVideo(access_token, media_id, activity_group_id).then(function (activity_video_id) {
                            //   console.log("activity_video_id:", activity_video_id)
                              attachVideoToGroup(access_token, activity_group_id, activity_video_id).then(function () {
                                  console.log('video attached')
                                  return true
                              })

                          })
                      })

                  })
              })
          }
      }
  }])