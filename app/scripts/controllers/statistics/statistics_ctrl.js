

angular.module('scalearAngularApp')
  .controller('statisticsCtrl', function ($scope, Kpi) {

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
	  		},
	  		function(){}
		)

	}

	$scope.getSeriesData=function(key){
		$scope.selected_series= key
		var chart_data=[]
		$scope.chartConfig.loading = true
		Kpi.readData({key:key},
			function(series){
				series.data.forEach(function(elem, ind){
					chart_data[ind]= elem.value
				})
				$scope.chartConfig.series[0].name = key.split("_").join(" ")
				$scope.chartConfig.series[0].data = chart_data
				$scope.chartConfig.title.text = key.split("_").join(" ")+" rate from "+ series.start.split("T")[0]+" to "+ series.stop.split("T")[0] 
				$scope.chartConfig.loading = false
			},
			function(){}
		)
	}
   
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
	                text: document.ontouchstart === undefined ?
	                    'Click and drag in the plot area to zoom in' :
	                    'Pinch the chart to zoom in'
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
                }
            }
        },
        series: [{
            type: 'area',
            name: null,
            pointInterval: 24 * 3600 * 1000,
            pointStart: Date.UTC(2014, 0, 15),
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
            title: {
                text: null
            }
        },
        loading: false,
    }

    init()


  });
