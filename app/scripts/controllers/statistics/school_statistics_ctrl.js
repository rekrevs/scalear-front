/* istanbul ignore next */ 
angular.module('scalearAngularApp')
  .controller('schoolStatisticsCtrl', ['$scope', 'Kpi', 'Page', '$rootScope', '$translate', '$modal', '$q', 'ScalearUtils', 'UserSession','User','ErrorHandler', function($scope, Kpi, Page, $rootScope, $translate, $modal, $q, ScalearUtils, UserSession, User,ErrorHandler) {

    Page.setTitle('statistics.statistics');
    $rootScope.subheader_message = $translate.instant("statistics.statistics_dashboard") 
    UserSession.getCurrentUser()
      .then(function(user) {
        User.getSubdomains({ id: user.id },
          function(data) {
            $scope.subdomains = data.subdomains
            if($scope.subdomains.length == 1)
              $scope.report.selected_domain = $scope.subdomains[0]
            else{
              $scope.report.selected_domain = 'All'
              $scope.subdomains.unshift('All');              
            }
          })
      })

    $scope.show_statistics = false;
    $scope.report = {}
    $scope.errors = {}
    var days_in_week = 7;
    var default_report_duration = 4 //weeks

    $scope.total_hours =  0
    $scope.total_online_quiz_solved =  0
    $scope.total_questions =  0
    $scope.total_questions_answered_students =  0
    $scope.total_questions_answered_teachers =  0

    var total_hours =  0
    var total_online_quiz_solved =  0
    var total_questions =  0
    var total_questions_answered_students =  0
    var total_questions_answered_teachers =  0
    var remaining_get_course_data = 0
    var privacy_statuses = {}

    $scope.report.start_date = moment().subtract(30,'days').format('DD-MMMM-YYYY')
    $scope.report.end_date = moment().format('DD-MMMM-YYYY')

    $scope.show_youtube_statistics = false
    $scope.total_youtube_video_private = 0
    $scope.total_youtube_video_public = 0
    $scope.total_youtube_video_unlisted = 0
    $scope.youtube_video_urls

    function reset_variables() {
      $scope.total_hours = 0
      $scope.total_online_quiz_solved = 0
      $scope.total_questions = 0
      $scope.total_questions_answered_students = 0
      $scope.total_questions_answered_teachers = 0
      $scope.total_student_watched = 0
      $scope.total_course_been_watched = 0
      $scope.total_online_quiz_course = 0
      $scope.total_online_quiz_lecture = 0
      $scope.total_online_quiz_student = 0
      $scope.total_questions_students = 0
      $scope.total_questions_courses = 0
      $scope.total_questions_lectures = 0
      $scope.total_hours_string = ScalearUtils.toHourMin($scope.total_hours)
      $scope.total_student_watched_string = ScalearUtils.toHourMin($scope.total_student_watched)
      $scope.total_course_been_watched_string = ScalearUtils.toHourMin($scope.total_course_been_watched)
      total_hours = 0
      total_online_quiz_solved = 0
      total_questions = 0
      total_questions_answered_students = 0
      total_questions_answered_teachers = 0
    }


    function validateDate() {
      var deferred = $q.defer()
      var errors = {}

      $scope.report.start_date = new Date($scope.report.start_date)
      $scope.report.end_date = new Date($scope.report.end_date)

      if (($scope.report.start_date == "Invalid Date")) {
        errors.start_date = "not a Date"
        deferred.reject(errors)
      } else if (($scope.report.end_date == "Invalid Date")) {
        errors.end_date = "not a Date"
        deferred.reject(errors)
      } else
        if (!($scope.report.start_date < $scope.report.end_date)) {
          errors.start_date = "must be before end date"
          deferred.reject(errors)
        } else {
          errors.start_date = null
          errors.end_date = null

          deferred.resolve(errors)
        }
      $scope.report.start_date = moment($scope.report.start_date).format('DD-MMMM-YYYY')
      $scope.report.end_date = moment($scope.report.end_date).format('DD-MMMM-YYYY')
      return deferred.promise
    }


    function getYoutubePrivacyStatus(data) {
      //youtube snippet code
      //return [[video url1,privacy],[video url2,privacy]]
      return [["ww.ut1.com", 'public'], 
              ["ww.ut2.com", 'public'],
              ["ww.ut3.com", 'public'],
              ["ww.ut1.com", 'private'],
              ["ww.ut2.com", 'private'],
              ["ww.ut3.com", 'private'],
              ["ww.ut1.com", 'unlisted'],
              ["ww.ut2.com", 'unlisted'], 
              ["ww.ut3.com", 'unlisted']]
    }


    function summarizeYoutubePrivacyStatus(privacy_statuses) {
      if (privacy_statuses.length) {
        for (var i in privacy_statuses) {
          var url_status = privacy_statuses[i][1]
          switch (url_status) {
            case "public":
              $scope.total_youtube_video_public += 1
              break;
            case "private":
              $scope.total_youtube_video_private += 1
              break;
            case "unlisted":
              $scope.total_youtube_video_unlisted += 1
              break;
          }
        }
      }
    }


    $scope.showYoutubePrivacyStatus = function () {
      //execute function to retrieve youtube urls from backend
      Kpi.getAllYoutubeVideoUrls({},
        function (data) {
          //retrieve data from youtube to get the privacy status of these urls 
          var privacy_statuses = getYoutubePrivacyStatus(data) //data array of youtube urls
          //summarize privacy statuses 
          summarizeYoutubePrivacyStatus(privacy_statuses)
          $scope.show_youtube_statistics = true
        }
      )
    },


    $scope.showStatistics = function () {
      validateDate()
        .then(function (errors) {
          $scope.loading = true
          $scope.show_statistics = false
          reset_variables()
          Kpi.readTotalsForDuration({
            start_date: $scope.report.start_date,
            end_date: $scope.report.end_date,
            domain: $scope.report.selected_domain
          },
            function (data) {
              $scope.show_statistics = true
              var limit_course = 100
              $scope.total_courses = data.total_courses
              $scope.total_students = data.total_students
              $scope.total_teachers = data.total_teachers
              $scope.total_lectures = data.total_lectures
              remaining_get_course_data = data.course_ids.length
              $scope.course_data_array = []
              while (data.course_ids.length > 0) {
                getReportDataCourseDuration(data.course_ids.splice(0, limit_course))
              }
            }
          )
          angular.extend($scope.errors, errors)
        })
        .catch(function (errors) {
          $scope.show_statistics = false
          angular.extend($scope.errors, errors)
          return true
        })
    }

    function getReportDataCourseDuration(course_ids){
      Kpi.getReportDataCourseDuration({
            start_date: $scope.report.start_date,
            end_date: $scope.report.end_date,
            course_ids: course_ids
          },
          function(data) {
            remaining_get_course_data -= course_ids.length
            total_hours += data.total_hours
            total_online_quiz_solved += data.total_online_quiz_solved
            total_questions += data.total_questions
            total_questions_answered_students += data.total_questions_answered_students
            total_questions_answered_teachers += data.total_questions_answered_teachers
            angular.forEach(data.course_data, function(value, key) {
              value["id"] = key
              value["total_view_string"] = ScalearUtils.toHourMin(value["total_view"])
              value["active_view_string"] = ScalearUtils.toHourMin(value["active_view"])
              value["total_view"] = value["total_view"] 
              value["active_view"] = value["active_view"] 
              $scope.course_data_array.push(value)
            })
            if(remaining_get_course_data == 0 ){
              $scope.loading = false
              $scope.total_hours = total_hours
              $scope.total_online_quiz_solved = total_online_quiz_solved
              $scope.total_questions = total_questions
              $scope.total_questions_answered_students = total_questions_answered_students
              $scope.total_questions_answered_teachers = total_questions_answered_teachers

              total_students = $scope.total_students == 0 ? 1.0 : $scope.total_students
              total_courses = $scope.total_courses == 0 ? 1.0 : $scope.total_courses
              total_lectures = $scope.total_lectures == 0 ? 1.0 : $scope.total_lectures 

              $scope.total_student_watched  =  ($scope.total_hours / total_students ),
              $scope.total_course_been_watched  =  ($scope.total_hours / total_courses )  ,
              $scope.total_online_quiz_course  =   ($scope.total_online_quiz_solved  / total_courses ).toFixed(1) ,
              $scope.total_online_quiz_lecture  =   ($scope.total_online_quiz_solved / total_lectures ).toFixed(1) ,
              $scope.total_online_quiz_student  =   ($scope.total_online_quiz_solved / total_students ).toFixed(1) ,
              $scope.total_questions_students  =  ( $scope.total_questions  / total_students ).toFixed(1) ,
              $scope.total_questions_courses  =  ( $scope.total_questions  /  total_courses ).toFixed(1) ,
              $scope.total_questions_lectures  =  ( $scope.total_questions  /  total_lectures ).toFixed(1),

              $scope.total_hours_string = ScalearUtils.toHourMin($scope.total_hours)
              $scope.total_student_watched_string = ScalearUtils.toHourMin($scope.total_student_watched)
              $scope.total_course_been_watched_string = ScalearUtils.toHourMin($scope.total_course_been_watched)
            }
          }
        ) 
    }


    $scope.exportCSV = function() {
      Kpi.exportSchoolStatistics({
        start_date: $scope.report.start_date,
        end_date: $scope.report.end_date,
        domain: $scope.report.selected_domain
      },function(response){
          if(response.notice) {
            ErrorHandler.showMessage($translate.instant("error_message.export_school_administration"), 'errorMessage', 4000, 'success');
          }
      })
    }


    $scope.sortting={
        total_view_string: function (value) {
            //this will sort by the length of the first name string
            return value.total_view;
        },
        active_view_string: function (value) {
            //this will sort by the length of the first name string
            return value.active_view;
        }    }

  }]);
