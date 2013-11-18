'use strict';

angular.module('scalearAngularApp')
  .controller('progressModuleCtrl', ['$timeout', '$scope', '$stateParams','Course', 'Module', function ($timeout, $scope, $stateParams, Course, Module) {

    $scope.disableInfinitScrolling = function(){
        console.debug("infinit scrolling disable")
        $scope.lecture_scroll_disable = true
        $scope.quiz_scroll_disable = true
        $scope.chart_scroll_disable= true
    }

    var getModuleCharts = function(){
        $scope.loading_module_chart=true
        Module.getModuleCharts(
            {
                module_id:$stateParams.module_id
            },
            function(data){
                console.log(data)
                $scope.module = data.module
                $scope.module_data = data.module_data
                $scope.loading_module_chart=false
            },
            function(){
                alert("Failed to load module, please check your internet connection")
            })
    }
    $scope.getModuleChartData=function(){
        console.log("module chart")
        var studentProgress = $scope.module_data;
        console.log(studentProgress);
        
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Choices');
        data.addColumn('number', 'Students');

        data.addRows(studentProgress.length);
        var i=0;
        var c=['Not Started Watching', "Watched <= 50%", "Completed On Time", "Completed Late"]
        for (var key in studentProgress) {
            data.setValue(i, 0, c[key]); //x axis  // first value
            data.setValue(i, 1, studentProgress[key]); // yaxis //correct
            i+=1;
        }
        return data;
    }
    
    $scope.pause=function(){
       $scope.$emit('pausePlayer')
    }
    getModuleCharts()
}]); 