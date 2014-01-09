'use strict';

angular.module('scalearAngularApp')
  .controller('progressMainCtrl', ['$scope','$timeout','$stateParams','Course','Module', '$translate','$log', function ($scope, $timeout, $stateParams, Course, Module, $translate, $log) {

  	  	$scope.moduleProgressTab=function(){
  	  		enableModuleScrolling()
	        if($scope.module_offset == null)
	           	getModuleProgress(0,20)
  	  	}

  	  	var getModuleProgress = function(offset, limit){
        $scope.module_limit =  limit
        $scope.module_offset = offset
        $scope.loading_modules=true 
        disableModuleScrolling()

        Course.getModuleProgress(
            {
                course_id:$stateParams.course_id,
                offset:$scope.module_offset, 
                limit: $scope.module_limit
            },
            function(data){
            	$log.debug(data)
                console.log(data)
                var obj={}

                obj.module_names = data.module_names
                obj.total = data.total

                obj.module_students = $scope.module_students || []
                obj.module_status= $scope.module_status|| {}
                obj.late_modules = $scope.late_modules || {}

                obj.module_students = obj.module_students.concat(data.students);
                angular.extend(obj.module_status,data.module_status)
                angular.extend(obj.late_modules, data.late_modules)

                $log.debug(obj)

                angular.extend($scope, obj)

                $timeout(function(){
                	enableModuleScrolling()
                    $scope.loading_modules=false
                    $('.student').tooltip({"placement": "left", container: 'body'})
                })
                    
            },
            function(){
                //alert('Could not load data, please check your internet connection')
            }
        );
    } 

    $scope.getRemainingModuleProgress = function(){
        if($scope.module_offset+$scope.module_limit<=parseInt($scope.total))
            getModuleProgress($scope.module_offset+$scope.module_limit,$scope.module_limit) 
        else
        	disableModuleScrolling()
    }

    var enableModuleScrolling = function(){
    	$scope.module_scroll_disable = false
    }
    var disableModuleScrolling = function(){
    	$scope.module_scroll_disable = true
    }

    $scope.updateStatus= function(student_id, module_id, module_status){
        if(module_status)
            module_status = (module_status == "Finished on Time")? 1 : 2
        else
            module_status = 0

        Module.changeModuleStatus(
            {module_id:module_id},
            {
                user_id: student_id,
                status: module_status
            }
        )
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.totalChartTab = function(){
    	disableModuleScrolling()
        if(!$scope.total_chart){
           $scope.loading_total_charts = true
           getTotalChart()
        }
    }

    var getTotalChart=function(){
    	Course.getTotalChart(
    		{course_id: $stateParams.course_id},
    		function(data){
                $scope.student_progress = data.student_progress
    			$scope.total_chart = createTotalChart($scope.student_progress)	
    			$scope.loading_total_charts = false
                $scope.$watch("current_lang", redrawChart);
    		},
    		function(){
    			//alert("Failed to load student progress, please check your internet connection")
    		}
		)
    }

    $scope.getTotalChartHeight = function(rows){
    	return rows.length * 30+50
    }

    $scope.formatTotalChartData = function(data){
		var formated_data ={}
		formated_data.cols=
			[
				{"label": $translate('courses.students'),"type": "string"},
				{"label": $translate('courses.quiz'),"type": "number"},
				{"label": $translate('groups.lecture'),"type": "number"}
			]
		formated_data.rows= []
		for(var ind in data)
		{
			var row=
			{"c":
				[
					{"v":data[ind][0]},
					{"v":data[ind][1], "f":data[ind][1].toFixed(0)+'%'},
					{"v":data[ind][2], "f":data[ind][2].toFixed(0)+'%'}
				]
			}
			formated_data.rows.push(row)
		}
		return formated_data
    }

    var createTotalChart = function(chart_data){
    	var chart = {};
        chart.type = "BarChart"
        chart.options = {
            "colors": ['#0c81c8','darkred'],
            "title": "Student Progress",
            "isStacked": "false",
            "fill": 20,
            "height": $scope.getTotalChartHeight(chart_data),
            "displayExactValues": true,
            "fontSize" : 12,

            "hAxis": { 
                    "maxValue":100,
                    "minValue":0
            },
            chartArea:{top: 10},
            "vAxis": {
                "title": $translate("courses.statistics")
            }
        };
	  	chart.data = $scope.formatTotalChartData(chart_data)
	  	return chart
    }
    
    var redrawChart = function(new_val, old_val){ 
        if(new_val != old_val){
            $scope.total_chart = {}
            $timeout(function(){
                $scope.total_chart = createTotalChart($scope.student_progress)
            })
        }
    }


  }]);
