'use strict';

angular.module('scalearAngularApp')
  .controller('studentStatisticsCtrl', ['$scope','$stateParams','$timeout','Module', function ($scope, $stateParams, $timeout, Module){
  		$scope.studentStatisticsTab = function(){
	   		$scope.disableInfinitScrolling()
	   		$scope.types=['confused', 'back', 'pause', 'questions']
       		getStudentStatistics()   
	    } 

	    var getStudentStatistics = function(){
	    	console.log("getin data")
	    	$scope.loading_statistics_chart=true
	    	Module.getStudentStatistics(
	    		{
	    			course_id:$stateParams.course_id,
	                module_id:$stateParams.module_id
	            },
	    		function(data){
	    			console.log(data)
	    			$scope.statistics = data
	    			//$scope.statistics_url = $scope.statistics.time_list
	    			 $scope.lecture_url =$scope.statistics.lecture_url
	    			$scope.loading_statistics_chart=false
	    		},
	    		function(){

	    		}
    		)
	    }

	    $scope.test=function(f){
	    	alert(f)
	    }

	    $scope.getChartType=function(ind){
	    	return $scope.types[ind]
	    }

	    $scope.getChartWidth=function(){
	    	return $scope.statistics.width/2
	    }
	    $scope.geChartHeight=function(){
	    	var height = 150
	    	return height
	    }
        $scope.getConfusedChartData = function(type){
	        var studentProgress = $scope.statistics[type];
	        // console.log(studentProgress);
	        
	        var data = new google.visualization.DataTable();
		    data.addColumn('timeofday', 'Choices');
		    data.addColumn('number', type);
		    // data.addColumn('number', 'Incorrect');
	    
		    var size=0
		    for(var e in studentProgress){
	            size++;
		    }

	        data.addRows(size);
	        var i=0;
	        for (var key in studentProgress) {
                var d = new Date(studentProgress[key][0]*1000)
	            data.setValue(i, 0, [d.getUTCHours(),d.getMinutes(),d.getSeconds(),0]); //x axis  // first value
	            data.setValue(i, 1, studentProgress[key][1]); // yaxis //correct
	        	i+=1;
	        }
	        return data;
	    }; 
  }]);
