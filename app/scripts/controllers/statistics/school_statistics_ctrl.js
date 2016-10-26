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
        Kpi.readTotalsForDuration(
          {
            start_date:$scope.report.start_date,
            end_date:$scope.report.end_date
          },
          function(data) {
            console.log(data)
            angular.extend($scope, data)

            $scope.course_data_array = []
            angular.forEach($scope.course_data, function(value, key){
              $scope.course_data_array.push(value)
            })

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

    // var init = function() {
    //   $scope.loading_totals = true
    //
    // }
    // init()

    $scope.falData = [{
        "firstName": "Cox",
        "lastName": "Carney",
        "company": "Enormo",
        "employed": true
    },
    {
        "firstName": "Lorraine",
        "lastName": "Wise",
        "company": "Comveyer",
        "employed": false
    },
    {
        "firstName": "Nancy",
        "lastName": "Waters",
        "company": "Fuelton",
        "employed": false
    }]








    var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
var id = 1;

function generateRandomItem(id) {

    var firstname = firstnames[Math.floor(Math.random() * 3)];
    var lastname = lastnames[Math.floor(Math.random() * 3)];
    var birthdate = dates[Math.floor(Math.random() * 3)];
    var balance = Math.floor(Math.random() * 2000);

    return {
        id: id,
        firstName: firstname,
        lastName: lastname,
        birthDate: new Date(birthdate),
        balance: balance
    }
}

$scope.rowCollection = [];

   for (id; id < 5; id++) {
       $scope.rowCollection.push(generateRandomItem(id));
   }


  }]);
