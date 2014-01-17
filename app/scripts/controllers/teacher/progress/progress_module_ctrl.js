'use strict';

angular.module('scalearAngularApp')
  .controller('progressModuleCtrl', ['$timeout', '$scope', '$stateParams','Course', 'Module', '$translate','$log', function ($timeout, $scope, $stateParams, Course, Module, $translate, $log) {

    $scope.disableInfinitScrolling = function(){
        $log.debug("infinit scrolling disable")
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
                $log.debug(data)
                $scope.module = data.module
                $scope.chart_data = data.module_data
                $scope.student_count = data.students_count
                $scope.module_chart = createModuleChart($scope.chart_data, $scope.student_count)
                $scope.loading_module_chart=false
                $scope.$watch("current_lang", redrawChart);
            },
            function(){
                //alert("Failed to load module, please check your internet connection")

            })

    }

    var formatMouleChartData = function(data){
        var formated_data ={}
        formated_data.cols=
            [
                {"label": $translate('courses.students'),"type": "string"},
                {"label": $translate('courses.students'),"type": "number"}
            ]
        formated_data.rows= []
        var x_titles=[$translate('courses.not_started_watching'), $translate('courses.watched')+" <= 50%", $translate('courses.completed_on_time'), $translate('courses.completed_late')]
        for(var ind in data)
        {
            var row=
            {"c":
                [
                    {"v":x_titles[ind]},
                    {"v":data[ind]}
                ]
            }
            formated_data.rows.push(row)
        }
        return formated_data
    }

    var createModuleChart = function(chart_data, student_count){
        var chart = {};
        chart.type = "ColumnChart"
        chart.options = {
            "colors": ['#0c81c8'],
            "title": $translate('courses.module_progress_charts_quizzes'),
            "isStacked": "true",
            "fill": 20,
            "height": 200,
            "displayExactValues": true,
            "fontSize" : 12,
            "vAxis": {
                "title": $translate("quizzes.number_of_students")+ " ("+$translate("groups.out_of")+" "+student_count+")",
                "gridlines": {
                    "count":8
                },
                "maxValue": student_count -10 
            }
        };
        chart.data = formatMouleChartData(chart_data)
        return chart
    }

    var redrawChart = function(new_val, old_val){ 
        if(new_val != old_val){
            $scope.module_chart = null
            $timeout(function(){
                $scope.module_chart = createModuleChart($scope.chart_data)
            })
        }  
    }
    

    getModuleCharts()
    $scope.$watch('lectureQuizzesTab', function(){
        if( $scope.lectureQuizzesTab)
            $scope.lectureQuizzesTab()
    })



}]); 