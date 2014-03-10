

angular.module('scalearAngularApp')
  .controller('statisticsCtrl',['$scope', 'Kpi','$translate','Page', function ($scope, Kpi,$translate, Page) {

    Page.setTitle('Statistics');

	var init =function(){
		$scope.loading_totals = true
		Kpi.readTotals(
	  		{},
	  		function(data){
	  			angular.extend($scope, data)
				$scope.loading_totals = false
	  		},
	  		function(){}
		)

		Kpi.readSeries(
	  		{},
	  		function(data){
	  			$scope.collection = data.series
	  			$scope.selected_series = $scope.collection[0]
	  			$scope.getSeriesData($scope.selected_series)
                $scope.$watch("current_lang", redrawChart);
	  		},
	  		function(){}
		)

        createChart()
	}

    var createChart=function(){
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
                        text: document.ontouchstart === undefined ? $translate('statistics.drag_to_zoom'):$translate('statistics.pinch_to_zoom')
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
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
                    line:{
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
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
                        marker:{
                            enabled:false
                        },
                         threshold: null
                    }
                }
            },
            series: [{
                type: 'line',
                name: '#',
                pointInterval: 24 * 3600 * 1000,
                pointStart: Date.UTC(2012, 0, 1),
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
                max:null,
                title: {
                    text: null
                }
            },
            loading: false,
        }
    }

    var redrawChart=function(new_val, old_val){
        if(new_val != old_val){
            $scope.chartConfig = {}
            createChart()
            $scope.getSeriesData($scope.selected_series)
        }
    }

	$scope.getSeriesData=function(key){
		$scope.selected_series= key
		var chart_data=[]
		$scope.chartConfig.loading = true
        var d = new Date()
		Kpi.readData({key:key, start:'2012-01-01', end: d.toDateString()},
			function(series){
				series.data.forEach(function(elem, ind){
					chart_data[ind]= elem.value
				})
				$scope.chartConfig.series[0].data= chart_data
				$scope.chartConfig.title.text = $translate('statistics.'+key.toLowerCase())+" "+$translate('statistics.rate_from')+" "+series.start.split("T")[0]+" "+$translate('statistics.to')+" "+ series.stop.split("T")[0] 
				$scope.chartConfig.loading = false
			},
			function(){}
		)
	}

    init()


  }]);
