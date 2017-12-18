'use strict';
angular.module('scalearAngularApp')
  .directive('questionBlock', ['$log', '$translate', 'Forum', '$state', '$rootScope', 'User', '$filter', 'ScalearUtils', 'VideoInformation', 'UserSession', '$timeout', 'MobileDetector', function($log, $translate, Forum, $state, $rootScope, User, $filter, ScalearUtils, VideoInformation, UserSession, $timeout, MobileDetector) {
    return {
      restrict: "E",
      templateUrl: "/views/forum/question_block.html",
      scope: {
        item: '=',
        pref: '='
      },
      link: function(scope, element, attrs) {
        UserSession.getCurrentUser().then(function(user) {
          scope.current_user = user
          init()
        })

        function init() {
          scope.preview_as_student = $rootScope.preview_as_student
          scope.ask_button_clicked = false
          scope.choices = [{ text: $translate.instant('discussion.private_discussion'), value: 0 }, { text: $translate.instant('discussion.public_discussion'), value: 1 }];
          scope.privacy = scope.choices[scope.current_user.discussion_pref];
          if(typeof scope.item.time == "number"){
            scope.item.time = $filter('format', 'hh:mm:ss')(scope.item.time)
          }
          if(!MobileDetector.isPhone()) {
            $timeout(function(){$('.text_block').focus()});
          }

          if(scope.item.data && scope.item.data.isEdit) {
            scope.privacy = (scope.item.data.privacy == 0) ? scope.choices[0] : scope.choices[1]
            scope.current_question = scope.item.data.content
          }
        }

        var arrayToSeconds = function(a) {
          return(+a[0] || 0) * 60 * 60 + (+a[1] || 0) * 60 + (+a[2] || 0) // minutes are worth 60 seconds. Hours are worth 60 minutes.
        }

        scope.postQuestion = function(item) {
          if(scope.current_question && scope.current_question.length && scope.current_question.trim() != "") {
            if(scope.current_user.discussion_pref != scope.privacy.value) {
              scope.current_user.discussion_pref = scope.privacy.value;
              User.alterPref({}, { privacy: scope.privacy.value })
            }
            scope.time_error = ScalearUtils.validateTimeWithDuration(item.time, VideoInformation.duration)
            if(!(scope.time_error)) {
              scope.ask_button_clicked = true
              item.time = ScalearUtils.arrayToSeconds(item.time.split(':'))
              Forum.createPost({
                  post: {
                    content: scope.current_question,
                    time: item.time,
                    lecture_id: $state.params.lecture_id,
                    privacy: scope.privacy.value
                  }
                },
                function(response) {
                  $log.debug("success");
                  item.data = response.post
                  scope.error_message = null
                  scope.current_question = ''
                },
                function() {
                  $log.debug("failure")
                }
              )
              scope.$emit("discussion_updated")
            }

          } else
            scope.$emit('remove_from_timeline', item)
        }

        scope.updateQuestion = function(question) {
          if(scope.current_question && scope.current_question.length && scope.current_question.trim() != "") {
            scope.time_error = ScalearUtils.validateTimeWithDuration(question.time, VideoInformation.duration)
            if(!(scope.time_error)) {
              scope.ask_button_clicked = true
              question.time = ScalearUtils.arrayToSeconds(question.time.split(':'))
              Forum.updatePost({ post_id: question.data.id }, {
                  content: scope.current_question,
                  time: question.time
                },
                function() {
                  question.data.content = scope.current_question
                  question.data.updated_at = new Date()
                  question.data.edited = true
                  question.data.isEdit = false
                  scope.error_message = null
                  scope.current_question = ''
                }
              )
            }
          } else
            question.data.isEdit = false
        }

        scope.cancelQuestion = function(question) {
          scope.$emit("discussion_updated")
          scope.$emit('remove_from_timeline', question)
        }

        scope.$on('post_question', function(ev, item) {
          if(!item.data || !item.data.isEdit)
            scope.postQuestion(item)
          else
            scope.updateQuestion(item.data)
        });

        shortcut.add("enter", function() {
          if(!scope.item.data || !scope.item.data.isEdit)
            scope.postQuestion(scope.item)
          else
            scope.updateQuestion(scope.item.data)
          scope.$apply()
        }, { "disable_in_input": false });

        scope.$on('$destroy', function() {
          shortcut.remove("enter");
        });
      }
    }
  }]).directive('discussionTimeline', ["Forum", "Timeline", "$translate", '$rootScope', '$filter', '$log', "$window", "MobileDetector", 'UserSession', function(Forum, Timeline, $translate, $rootScope, $filter, $log, $window, MobileDetector, UserSession) {
    return {
      restrict: "A",
      scope: {
        seek: '&',
        data: '&'
      },
      templateUrl: '/views/forum/discussion_timeline.html',
      link: function(scope, element, attrs) {
        UserSession.getCurrentUser()
          .then(function(user) {
            scope.current_user = user
          })
        scope.turncatingcount = 30
        if(MobileDetector.isiPad()) {
          scope.turncatingcount = 15
        }
        scope.item = scope.data()
        scope.preview_as_student = $rootScope.preview_as_student
        scope.formattedTime = $filter('format', 'hh:mm:ss')(scope.item.time)
        scope.private_text = $translate.instant("discussion.private_post")
        scope.public_text = $translate.instant("discussion.public_post")
        scope.deleteDiscussion = function(discussion) {
          Forum.deletePost({ post_id: discussion.data.id },
            function(response) {
              scope.error_message = null
              scope.$emit('remove_from_timeline', discussion)
            },
            function() {}
          )
        }

        scope.flagPost = function() {
          Forum.flagPost({ post_id: scope.item.data.id },
            function(response) {
              scope.item.data.user_flag = 1;
              scope.item.data.flags_count++;
            }
          )
        }
        scope.unflagPost = function() {
          Forum.flagPost({ post_id: scope.item.data.id },
            function(response) {
              scope.item.data.user_flag = 0;
              scope.item.data.flags_count--;
            }
          )
        }

        scope.upvotePost = function() {
          Forum.votePost({
              vote: parseInt(scope.item.data.user_vote) + 1,
              post_id: scope.item.data.id
            },
            function(response) {
              scope.item.data.user_vote = 1;
              scope.item.data.votes_count++;
            }
          )
        }

        scope.downvotePost = function() {
          Forum.votePost({
              vote: parseInt(scope.item.data.user_vote) - 1,
              post_id: scope.item.data.id
            },
            function(response) {
              scope.item.data.user_vote = 0;
              scope.item.data.votes_count--;
            }
          )
        }

        scope.deleteComment = function(comment) {
          Forum.deleteComment({ comment_id: comment.id, post_id: scope.item.data.id }, function(response) {
            var index = scope.item.data.comments.indexOf(comment);
            scope.item.data.comments.splice(index, 1);
            scope.error_message = null
          })
        }

        scope.reply = function(discussion, current_reply) {
          if(current_reply && current_reply.length && current_reply.trim() != "") {
            scope.error_message = null
            $log.debug("discussion", discussion)
            Forum.createComment({ comment: { content: current_reply, post_id: discussion.data.id, lecture_id: discussion.data.lecture_id } }, function(response) {
              console.log(response.comment)
              if(discussion.data.comments)
                discussion.data.comments.push(response.comment)
              else
                discussion.data.comments = [response.comment]
              current_reply = ""
            }, function() {})
          } else {
            scope.error_message = $translate.instant("discussion.cannot_be_empty")
          }
          angular.element('.btn').blur()
        }
      }
    }
  }]).directive('discussionComment', ["Forum", "Timeline", "$translate", '$rootScope', '$log', 'UserSession', function(Forum, Timeline, $translate, $rootScope, $log, UserSession) {
    return {
      restrict: "E",
      scope: {
        comment: '=',
        delete: '&'
      },
      templateUrl: '/views/forum/discussion_comment.html',
      link: function(scope, element, attrs) {
        UserSession.getCurrentUser()
          .then(function(user) {
            scope.current_user = user
          })
        scope.preview_as_student = $rootScope.preview_as_student
        scope.flagComment = function() {
          Forum.flagComment({ comment_flag: { comment_id: scope.comment.id } },
            function(response) {
              scope.comment.user_flag = 1;
              scope.comment.flags_count++;
            }
          )
        }
        scope.unflagComment = function() {
          Forum.flagComment({ comment_flag: { comment_id: scope.comment.id } },
            function(response) {
              scope.comment.user_flag = 0;
              scope.comment.flags_count--;
            }
          )
        }

        scope.upvoteComment = function() {
          Forum.voteComment({ comment_vote: { vote: parseInt(scope.comment.user_vote) + 1, comment_id: scope.comment.id } },
            function(response) {
              scope.comment.user_vote = 1;
              scope.comment.votes_count++;
            }
          )
        }

        scope.downvoteComment = function() {
          Forum.voteComment({ comment_vote: { vote: parseInt(scope.comment.user_vote) - 1, comment_id: scope.comment.id } },
            function(response) {
              scope.comment.user_vote = 0;
              scope.comment.votes_count--;
            }
          )

        }
      }
    }
  }]).directive('votingButton', ['$translate', '$log', function($translate, $log) {
    return {
      restrict: 'E',
      scope: {
        votes_count: '=votesCount',
        voted: '=',
        up: '&',
        down: '&',
        direction: '@'

      },
      templateUrl: '/views/forum/like_button.html',
      link: function(scope, element) {
        scope.like_text = $translate.instant('discussion.like')
        scope.unlike_text = $translate.instant('discussion.unlike')
        angular.element(element.find('.looks-like-a-link')).css('display', scope.direction == 'horizontal' ? 'inline-block' : 'block')
      }
    }
  }]).directive('flagButton', ['$translate', '$log', function($translate, $log) {
    return {
      restrict: 'E',
      scope: {
        flagged: '=',
        flag: '&',
        unflag: '&',
      },
      templateUrl: '/views/forum/flag_button.html',
      link: function(scope, element) {
        scope.flag_text = $translate.instant("discussion.flag_post")
        scope.unflag_text = $translate.instant("discussion.unflag_post")
      }
    }
  }]).directive('commentBox', ['$log', function($log) {
    return {
      restrict: 'E',
      scope: {
        discussion: '&',
        submit: "&"
      },
      templateUrl: '/views/forum/comment_box.html',
      link: function(scope, element) {
        scope.showfield = false;
        scope.submitComment = function() {
          scope.submit()(scope.discussion(), scope.comment);
          scope.comment = null;
          scope.hideField();
          $log.debug(scope.showfield)
        }
        scope.toggleField = function() {
          scope.showfield = !scope.showfield
        }
        scope.hideField = function() {
          if(!scope.comment && scope.showfield) {
            scope.toggleField();
          }
        }
      }
    }
  }])
