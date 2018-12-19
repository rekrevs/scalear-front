/* istanbul ignore next */ 
angular.module('scalearAngularApp')
  .controller('schoolStatisticsCtrl', ['$scope', 'Kpi', 'Page', '$rootScope', '$translate', '$modal', '$q', 'ScalearUtils', 'UserSession','User','ErrorHandler', function($scope, Kpi, Page, $rootScope, $translate, $modal, $q, ScalearUtils, UserSession, User,ErrorHandler) {

    Page.setTitle('statistics.statistics');
    $rootScope.subheader_message = $translate.instant("statistics.statistics_dashboard")
    UserSession.getCurrentUser()
      .then(function (user) {
        User.getSubdomains({ id: user.id },
          function (data) {
            $scope.subdomains = data.subdomains
            if ($scope.subdomains.length == 1)
              $scope.report.selected_domain = $scope.subdomains[0]
            else {
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
 
    $scope.report.start_date = moment().subtract(30,'days').format('DD-MMMM-YYYY')
    $scope.report.end_date = moment().format('DD-MMMM-YYYY')
   
    $scope.show_YT_statistics_loading=false
    $scope.show_YT_statistics = false

    $scope.courses_details_privacy_statuses = {} //{crs1:{course_name:'crs1',teacher_mail:'a@b.co',teacher_name:'a',public:1,private:2,unlisted:3}}
   
    $scope.total_courses = 0
    $scope.total_students = 0
    $scope.total_teachers = 0
    $scope.total_lectures = 0

    function addCourse(course, email, teacher, status) {//status would be public,private or unlisted
      var courses_to_privacy = $scope.courses_details_privacy_statuses
      if (typeof courses_to_privacy[course] == 'undefined') {
        courses_to_privacy[course] = { 'course_name': course, 'teacher_mail': email, 'teacher_name': teacher, public: 0, private: 0, unlisted: 0 }
        courses_to_privacy[course][status] = 1
      } else {
        courses_to_privacy[course][status] += 1
      }
    }

    function summarizeYoutubePrivacyStatus(privacy_statuses) {
      $scope.show_YT_statistics = true
      if (privacy_statuses && privacy_statuses.length) {
        privacy_statuses.forEach((privacy_status) => {
          var status = privacy_status.privacy_status
          var teacher_mail = privacy_status.teacher_mail
          var teacher_name = privacy_status.teacher_name
          var course = privacy_status.course

          addCourse(course, teacher_mail, teacher_name, status)
        })
        $scope.show_YT_statistics_loading = false
      }
    }

    function getRequestUrl(YT_video_ids) {
      var ids_coma_separated = YT_video_ids.join(',') 
      return 'https://www.googleapis.com/youtube/v3/videos?id=' + ids_coma_separated + '&key=AIzaSyAztqrTO5FZE2xPI4XDYbLeOXE0vtWoTMk&part=status'
    }

    function setYoutubePrivacyStatus(YT_ids_to_course_data) {
      var privacy_statuses = []
     
      var YT_videos_ids = Object.keys(YT_ids_to_course_data)
      var request_url = getRequestUrl(YT_videos_ids)
      
      var YT_video_id
      var course_data
      var privacy_status
     
      $.getJSON(request_url, function (response) {
        if (response && response.items.length) {
          privacy_statuses = response.items.map( (item) =>{ 
            YT_video_id = item.id
            privacy_status = item.status.privacyStatus
            course_data = YT_ids_to_course_data[YT_video_id]
          
            return { 
              "id": YT_video_id,
              "privacy_status": privacy_status,
              "teacher_mail": course_data.email,
              "course": course_data.course,
              "teacher_name":course_data.teacher
            }
          })
        }
      })
        .done(() => { 
          summarizeYoutubePrivacyStatus(privacy_statuses)
        });
    }
    
    $scope.showYoutubePrivacyStatus = function () {
      $scope.show_YT_statistics_loading = true
      Kpi.getAllYoutubeVideoUrls([],
        function (jurls) {
          urls = jurls.map(function (jurl) { return Object.values(jurl) }) //[[youtube_video_url,course_id],[...]]
          var chunk = 20
          for (var i = 0; i < urls.length; i += chunk) {
            subset_urls = urls.slice(i, i + chunk);
            Kpi.getAllYoutubeData({ urls_courses_ids: [subset_urls] },
              function (YT_ids_to_course_data) { // [youtube_video_id:{teacher_mail:"x@y.z",teacher_name:"x",course:"course 1"},...]
                setYoutubePrivacyStatus(YT_ids_to_course_data)
              }
            )
          }
        }
      )
    }

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
      $scope.total_courses  = 0
      $scope.total_students = 0
      $scope.total_teachers = 0
      $scope.total_lectures = 0
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


    $scope.showStatistics = function () {
      validateDate()
        .then(function (errors) {
          $scope.loading = true
          $scope.show_statistics = false
          reset_variables()
          Kpi.getAllCoursesIds({
            domain: $scope.report.selected_domain
          },
            function (all_courses_ids) {
              var limit_course = 100
              $scope.course_data_array = []  
              while(all_courses_ids.length>0) {                
                iterative_courses_ids = all_courses_ids.splice(0,limit_course)               
                Kpi.readTotalsForDuration({
                  start_date: $scope.report.start_date,
                  end_date: $scope.report.end_date,
                  course_ids: [iterative_courses_ids]
                }, function (data) {
                  $scope.total_courses += data.total_courses
                  $scope.total_students += data.total_students
                  $scope.total_teachers += data.total_teachers
                  $scope.total_lectures += data.total_lectures
                  if (iterative_courses_ids.length < 10) {
                    remaining_get_course_data = 0
                  }
                  getReportDataCourseDuration(data.course_ids)
                })
              } 
            })
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
            $scope.show_statistics = true
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
