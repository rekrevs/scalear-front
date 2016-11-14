angular.module('scalearAngularApp')
  .controller('schoolStatisticsCtrl', ['$scope', 'Kpi', 'Page', '$rootScope', '$translate', '$modal', '$q', 'ScalearUtils', 'UserSession','User', function($scope, Kpi, Page, $rootScope, $translate, $modal, $q, ScalearUtils, UserSession, User) {

    Page.setTitle('statistics.statistics');
    $rootScope.subheader_message = $translate("statistics.statistics_dashboard")
    $scope.subdomains = ["it.uu.se", "physic.uu.se"]

    UserSession.getCurrentUser()
      .then(function(user) {
        User.getSubdomains({ id: user.id },
          function(data) {
            $scope.subdomains = data.subdomains
          })
      })


    $scope.show_statistics = false;
    $scope.report = {}
    $scope.errors = {}
    $scope.report.start_date = new Date()
    $scope.report.end_date = new Date()
    var days_in_week = 7;
    var default_report_duration = 4 //weeks
    $scope.report.start_date.setDate($scope.report.end_date.getDate() - (days_in_week * default_report_duration));
    $scope.report.selected_domain = ""

    function validateDate() {
      var deferred = $q.defer()
      var errors = {}

      if (!($scope.report.start_date instanceof Date)) {
        errors.start_date = "not a Date"
        deferred.reject(errors)
      } else if (!($scope.report.end_date instanceof Date)) {
        errors.end_date = "not a Date"
        deferred.reject(errors)
      } else if (!($scope.report.start_date < $scope.report.end_date)) {
        errors.start_date = "must be before end date"
        deferred.reject(errors)
      } else {
        errors.start_date = null
        errors.end_date = null

        deferred.resolve(errors)
      }
      return deferred.promise
    }

    $scope.showStatistics = function() {
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
              console.log(data)
              $scope.show_statistics = true
              $scope.loading = false
              data["total_hours"] = ScalearUtils.toHourMin(data["total_hours"])
              data["total_student_watched"] = ScalearUtils.toHourMin(data["total_student_watched"])
              data["total_course_been_watched"] = ScalearUtils.toHourMin(data["total_course_been_watched"])

              angular.extend($scope, data)

              $scope.course_data_array = []
              angular.forEach($scope.course_data, function(value, key) {
                value["id"] = key
                value["total_view"] = ScalearUtils.toHourMin(value["total_view"])
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
      })
    }
  }]);
