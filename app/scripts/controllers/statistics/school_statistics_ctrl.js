angular.module('scalearAngularApp')
  .controller('schoolStatisticsCtrl',['$scope', 'Kpi','Page','$rootScope','$translate','$modal','$q', function ($scope, Kpi, Page, $rootScope, $translate, $modal,$q) {

    Page.setTitle('statistics.statistics');
    $rootScope.subheader_message = $translate("statistics.statistics_dashboard")


    $scope.show_statistics = false;
    $scope.report = {}
    $scope.errors = {}
    $scope.report.start_date = new Date()
    $scope.report.end_date = new Date()
    var days_in_week = 7;
    var default_report_duration =  4 //weeks
    $scope.report.start_date.setDate($scope.report.end_date.getDate() - (days_in_week * default_report_duration));

    function validateDate() {
      var deferred = $q.defer()
      var errors = {}
      
      if( !($scope.report.start_date instanceof Date) ){
        errors.start_date = "not a Date"
        deferred.reject(errors)
      }
      else if( !($scope.report.end_date instanceof Date) ){
        errors.end_date = "not a Date"
        deferred.reject(errors)
      }
      else if( !($scope.report.start_date < $scope.report.end_date) ){
        errors.start_date = "must be before end date"
        deferred.reject(errors)
      }
      else{
        errors.start_date = null
        errors.end_date = null

        deferred.resolve(errors)
      }
      return deferred.promise
    }

    $scope.showStatistics = function(){
      validateDate()
      .then(function(errors) {
        $scope.show_statistics =  true
        // Kpi.readTotals(
        //   {
        //     school:true
        //   },
        //   function(data) {
        //     angular.extend($scope, data)
        //   },
        //   function() {}
        // )
        Kpi.readTotalsForDuration(
          {
            start_date:$scope.report.start_date,
            end_date:$scope.report.end_date
          },
          function(data) {
            // console.log("saassdasdadadas")
            console.log(data)
            // console.log(data.total_hours)
            // data.total_hours = secondsToHoursString(data.total_hours)
            // console.log(secondsToHoursString(data.total_hours))
            // console.log(data.total_hours)
            angular.extend($scope, data)
            // console.log(data.Course_data)
            // $scope.loading_totals = false
          },
          function() {}
        )

        angular.extend($scope.errors, errors)
      })
      .catch(function(errors) {
        $scope.show_statistics =  false
        angular.extend($scope.errors, errors)
        return true
      })
    }

    var secondsToHoursString = function(second){
      var date = new Date(null);
      console.log(second)
      date.setSeconds(second); // specify value for SECONDS here
      console.log(date)
      date = date.toISOString().substr(11, 8);
      return date
    }

    var init = function() {
      $scope.loading_totals = true

    }
    init()


  }]);
