'use strict';

angular.module('scalearAngularApp')
  .controller('CourseStatisticsCtrl', function ($scope, Kpi, Course, $translate, $stateParams) {
    Course.show({course_id:$stateParams.course_id},function(response){
        	$scope.start_date=response.course.created_at.split("T")[0]
        	$scope.course_start=response.course.start_date
        	 $scope.course_end = new Date($scope.course_start)
        	$scope.course_end.setTime($scope.course_end.getTime() + (response.course.duration * 604800000))
        	var dd = $scope.course_end.getDate();
        	if(dd < 10){
		        dd = '0'+dd;
		    }
        	var mm = $scope.course_end.getMonth()+1;
        	if(mm<10){
		        mm = '0'+mm;
		    }
        	var yyyy = $scope.course_end.getFullYear();
        	$scope.course_end = yyyy+"-"+mm+"-"+dd
        	console.log($scope.start_date)
        });
    var init =function(){
		$scope.loading_totals = true
		$scope.course_id = $stateParams.course_id
		Kpi.readCourseTotals(
	  		{course_id:$stateParams.course_id},
	  		function(data){
	  			console.log(data)
	  			angular.extend($scope, data)
				$scope.loading_totals = false
	  		},
	  		function(){}
		)


		Kpi.readCourseSeries(
	  		{},
	  		function(data){
	  			$scope.collection = data.series
	  			$scope.selected_series = $scope.collection[0]
	  			createChart($scope.start_date)
	  			$scope.getCourseSeriesData($scope.selected_series+"_"+$stateParams.course_id)
                $scope.$watch("current_lang", redrawChart);
	  		},
	  		function(){}
		)
	}

	var createChart=function(start_date){
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
                pointStart: Date.UTC(start_date.split("-")[0],start_date.split("-")[1]-1,start_date.split("-")[2]),
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
            // $scope.chartConfig = {}
            $scope.getCourseSeriesData($scope.selected_series+"_"+$stateParams.course_id)
        }
    }

	$scope.getCourseSeriesData=function(key){
		
		$scope.selected_series= key.split("_"+$stateParams.course_id)[0]
		var chart_data=[]
		$scope.chartConfig.loading = true
        var d = new Date()

		Kpi.readCourseData({key:key, start:$scope.start_date, end: d.toDateString()},
			function(series){
				console.log(series)
				var not_zero
				for(var i=series.data.length-1; i>=0; i--){
					if(series.data[i].value != 0){
						console.log(series.data[i].value)
						not_zero = i;
						break;
					}
				}
				series.data.splice(not_zero+1, series.data.length-(not_zero+1))
				series.stop = series.data[series.data.length-1].ts
				series.data.forEach(function(elem, ind){
					chart_data[ind]= elem.value
				})
				$scope.chartConfig.series[0].data= chart_data
				$scope.chartConfig.title.text = $translate('statistics.'+key.toLowerCase().split("_"+$stateParams.course_id)[0])+" "+$translate('statistics.rate_from')+" "+series.start.split("T")[0]+" "+$translate('statistics.to')+" "+ series.stop.split("T")[0] 
				$scope.chartConfig.loading = false

			},
			function(){}
		)
		// console.log(series.data)
	}
	init()
  });
