'use strict';

angular.module('scalearAngularApp')
  .controller('progressModuleCtrl', ['$timeout', '$scope', '$stateParams','Course', 'Module', function ($timeout, $scope, $stateParams, Course, Module) {

    $scope.disableInfinitScrolling = function(){
        console.debug("infinit scrolling disable")
        $scope.lecture_scroll_disable = true
        $scope.quiz_scroll_disable = true
        $scope.chart_scroll_disable= true
    }

    $scope.tabState = function(state){
        if(state)
            $scope.tab_state = state
        else
            return $scope.tab_state
    }

    $scope.getImgData = function(elm) {
        var chartArea=elm.children()[0].getElementsByTagName('svg')[0].parentNode;
        var svg = chartArea.innerHTML;
        var doc = chartArea.ownerDocument;
        var canvas = doc.createElement('canvas');
        canvas.setAttribute('width', chartArea.offsetWidth);
        canvas.setAttribute('height', chartArea.offsetHeight);

        canvas.setAttribute(
            'style',
            'position: absolute; ' +
            'top: ' + (-chartArea.offsetHeight * 2) + 'px;' +
            'left: ' + (-chartArea.offsetWidth * 2) + 'px;'
        );
        doc.body.appendChild(canvas);
        canvg(canvas, svg);
        var imgData = canvas.toDataURL('image/png');
        canvas.parentNode.removeChild(canvas);
        return imgData;
    }

    $scope.saveAsImg = function(event) {
        var elm = angular.element(event.target.previousElementSibling)
        var imgData = $scope.getImgData(elm);
        window.location = imgData.replace('image/png', 'image/octet-stream');
    }

    var getModuleCharts = function(){
        $scope.loading_module_chart=true
        Module.getModuleCharts(
            {             
                course_id: $stateParams.course_id,
                module_id:$stateParams.module_id
            },
            function(data){
                console.log(data)
                $scope.module = data.module
                $scope.module_chart = createModuleChart(data.module_data)
                $scope.loading_module_chart=false
            },
            function(){
                alert("Failed to load module, please check your internet connection")
            })
    }

    var formatMouleChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": "Students","type": "string"},
                {"label": "Students","type": "number"},
            ]
        formated_data.rows= []
        var x_titles=['Not Started Watching', "Watched <= 50%", "Completed On Time", "Completed Late"]
        for(var ind in data)
        {
            var row=
            {"c":
                [
                    {"v":x_titles[ind]},
                    {"v":data[ind]},
                ]
            }
            formated_data.rows.push(row)
        }
        return formated_data
    }

    var createModuleChart = function(chart_data){
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['#0c81c8'],
            "title": "Module Progress",
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": "Number of Students"
            }
        };
        chart.data = formatMouleChartData(chart_data)
        return chart
    }


    getModuleCharts()


}]); 