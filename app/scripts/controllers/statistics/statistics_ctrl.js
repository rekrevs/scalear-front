/* istanbul ignore next */ 
angular.module('scalearAngularApp')
  .controller('statisticsCtrl',['$scope', 'Kpi','Page','$rootScope','$translate','$modal', function ($scope, Kpi, Page, $rootScope, $translate, $modal) {

    Page.setTitle('statistics.statistics');
    $rootScope.subheader_message = $translate.instant("statistics.statistics_dashboard")
    $scope.close_selector = false;

    var init = function() {
      $scope.loading_totals = true
		Kpi.readTotals(
	  		{},
        function(data) {
          angular.extend($scope, data)
          $scope.loading_totals = false
        },
        function() {}
      )

		Kpi.readSeries(
	  		{},
        function(data) {
          $scope.collection = data.series
          $scope.selected_series = $scope.collection[0]
          $scope.getSeriesData($scope.selected_series)
        },
        function() {}
      )

      createChart()
    }

    var createChart = function() {
      $scope.chartConfig = {
        options: {
          chart: {
            zoomType: 'x',
            spacingRight: 20
          },
          tooltip: {
            shared: true
          },
          legend: {
            enabled: false
          },
          subtitle: {
            text: document.ontouchstart === undefined ? $translate.instant('statistics.drag_to_zoom') : $translate.instant('statistics.pinch_to_zoom')
          },
          plotOptions: {
            area: {
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
              },
              lineWidth: 1,
              marker: {
                enabled: false
              },
              shadow: false,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              threshold: null
            },
            line: {
              fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              marker: {
                enabled: false
              },
              threshold: null
            }
          }
        },
        series: [{
          type: 'line',
          name: '#',
          pointInterval: 24 * 3600 * 1000,
          data:[],
          pointStart: Date.UTC(2013, 0, 1)
        }],
        title: {
          text: null
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: null
          }
        },
        yAxis: {
          min: 0,
          max: null,
          title: {
            text: null
          }
        },
        loading: false
      }
    }

    $scope.getSeriesData = function(key) {
      $scope.selected_series = key
      var chart_data = []
      $scope.chartConfig.loading = true
      var start_date = new Date('2013-01-01').toISOString().split("T")[0]
      var end_date = new Date().toISOString().split("T")[0]
      Kpi.readData({ key: key, start: start_date, end: end_date },
        function(series) {
          series.data.forEach(function(elem, ind) {
            chart_data[ind] = elem.value
          })
          $scope.chartConfig.series[0].data = chart_data
          $scope.chartConfig.title.text = $translate.instant('statistics.' + key.toLowerCase()) + " " + $translate.instant('statistics.rate_from') + " " + start_date + " " + $translate.instant('statistics.to') + " " + end_date
          $scope.chartConfig.loading = false
          $scope.stats_title = 'statistics.' + $scope.selected_series.toLowerCase()
        },
        function() {}
      )
    }
    $scope.toggleSelector = function() {
      $scope.close_selector = !$scope.close_selector;
    }

    $scope.emailForm = function() {
      $modal.open({
        templateUrl: '/views/teacher/course/system_email.html',
        controller: 'systemEmailCtrl'
      })
    }

    init()


  }]);
