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
    // $scope.report.start_date = new Date()
    // $scope.report.end_date = new Date()
    // $scope.report.start_date.setDate($scope.report.end_date.getDate() - (days_in_week * default_report_duration));

    $scope.report.start_date = moment().subtract(30,'days').format('DD-MMMM-YYYY')
    $scope.report.end_date = moment().format('DD-MMMM-YYYY')
    
    function validateDate() {
      var deferred = $q.defer()
      var errors = {}

      $scope.report.start_date = new Date($scope.report.start_date)
      $scope.report.end_date = new Date($scope.report.end_date)
      console.log($scope.report.start_date)
      console.log($scope.report.end_date)

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

    $scope.showStatistics = function() {
      console.log(typeof($scope.report.start_date))
      console.log(typeof($scope.report.end_date))

      validateDate()
        .then(function(errors) {
          $scope.loading = true
          $scope.show_statistics = false

          Kpi.readTotalsForDuration({
              start_date: $scope.report.start_date,
              end_date: $scope.report.end_date,
              domain: $scope.report.selected_domain
            },
            function(data) {
              // console.log(data)
              $scope.show_statistics = true
              $scope.loading = false
              data["total_hours_string"] = ScalearUtils.toHourMin(data["total_hours"])
              data["total_student_watched_string"] = ScalearUtils.toHourMin(data["total_student_watched"])
              data["total_course_been_watched_string"] = ScalearUtils.toHourMin(data["total_course_been_watched"])

              angular.extend($scope, data)

              $scope.course_data_array = []
              angular.forEach($scope.course_data, function(value, key) {
                value["id"] = key
                value["total_view_string"] = ScalearUtils.toHourMin(value["total_view"])
                value["total_view"] = value["total_view"] 
                $scope.course_data_array.push(value)
              })

            }
          )
          angular.extend($scope.errors, errors)
        })
        .catch(function(errors) {
          $scope.show_statistics = false
          angular.extend($scope.errors, errors)
          return true
        })
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
        }
    }

  }]);
