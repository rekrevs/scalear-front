'use strict';

angular.module('scalearAngularApp')
  .controller('progressModuleCtrl', ['$timeout', '$scope', '$stateParams','Course', 'Module', function ($timeout, $scope, $stateParams, Course, Module) {

    $scope.disableInfinitScrolling = function(){
        console.debug("disable")
        $scope.lecture_scroll_disable = true
        $scope.quiz_scroll_disable = true
        $scope.chart_scroll_disable= true
    }

    var getModuleCharts = function(){
        Module.getModuleCharts(
            {
                module_id:$stateParams.module_id
            },
            function(data){
                console.log(data)
                $scope.module = data.module
                $scope.module_data = data.module_data
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
    getModuleCharts()
}]);



///----------------------------------------------------------------------------------------------------////




// $(function () {
    
//     var chart
//     var overall_chart
//     var all=[]
//     $(document).ready(function() {
        
        
//         $("#c_tab").click(function(event){
//             console.log("confused clicked");
//             // also where is the no lectures message.
//             if($("#tab2").html().trim()=="")
//             {
//             $("#tab2").html("<center><img src='/assets/loading_small.gif' /><%= t('courses.loading') %>...</center>")
//             $.ajax({url:"/<%= I18n.locale %>/courses/<%=@course.id%>/groups/<%= @modulechart.id %>/get_confused", type:'post', dataType:'script'});
//             }
//         });
//         $("#p_tab").click(function(event){
//             console.log("progress clicked")
//             if($("#tab3").html().trim()=="")
//             {
//             $("#tab3").html("<center><img src='/assets/loading_small.gif' /><%= t('courses.loading') %>...</center>")
//             $.ajax({url:"/<%= I18n.locale %>/courses/<%=@course.id%>/groups/<%= @modulechart.id %>/get_progress", type:'post', dataType:'script'});
//             }
//         });
        
//         $("#s_tab").click(function(event){
//             console.log("survey clicked")
//             if($("#tab4").html().trim()=="")
//             {
//             $("#tab4").html("<center><img src='/assets/loading_small.gif' /><%= t('courses.loading') %>...</center>")
//             $.ajax({url:"/<%= I18n.locale %>/courses/<%=@course.id%>/groups/<%= @modulechart.id %>/get_survey", type:'post',data:{"first":true}, dataType:'script'});
//             }
//         });
        
//         $("#q_tab").click(function(event){
//             console.log("quiz clicked")
//             if($("#tab5").html().trim()=="")
//             {
//             $("#tab5").html("<center><img src='/assets/loading_small.gif' /><%= t('courses.loading') %>...</center>")
//             $.ajax({url:"/<%= I18n.locale %>/courses/<%=@course.id%>/groups/<%= @modulechart.id %>/get_quiz", type:'post',data:{"first":true}, dataType:'script'});
//             }
//         });
//         /**
//  * Create a global exportCharts method that takes an array of charts as an argument,
//  * and exporting options as the second argument
//  */
// /**
//  * Create a global getSVG method that takes an array of charts as an argument
//  */
// Highcharts.getSVG = function(charts) {
//     var svgArr = [],
//         top = 0,
//         width = 0;

//     $.each(charts, function(i, chart) {
//         var svg = chart.getSVG();
//         svg = svg.replace('<svg', '<g transform="translate(0,' + top + ')" ');
//         svg = svg.replace('</svg>', '</g>');

//         top += chart.chartHeight;
//         width = Math.max(width, chart.chartWidth);

//         svgArr.push(svg);
//     });

//     return '<svg height="'+ top +'" width="' + width + '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>';
// };


// Highcharts.exportCharts = function(charts, options) {
//     var form
//         svg = Highcharts.getSVG(charts);

//     // merge the options
//     options = Highcharts.merge(Highcharts.getOptions().exporting, options);

//     // create the form
//     form = Highcharts.createElement('form', {
//         method: 'post',
//         action: options.url
//     }, {
//         display: 'none'
//     }, document.body);

//     // add the values
//     Highcharts.each(['filename', 'type', 'width', 'svg'], function(name) {
//         Highcharts.createElement('input', {
//             type: 'hidden',
//             name: name,
//             value: {
//                 filename: options.filename || 'chart',
//                 type: options.type,
//                 width: options.width,
//                 svg: svg
//             }[name]
//         }, null, form);
//     });
//     //console.log(svg); return;
//     // submit
//     form.submit();

//     // clean up
//     form.parentNode.removeChild(form);
// };


//         var colors = Highcharts.getOptions().colors,
//         name = 'Browser brands';
//         var ids = getCount()
//         for(var count in ids)
//         {
//             var the_id = ids[count] 
//             var num=parseInt(count)+1
//             var num_of_lines = 20  // this is the number of lines where 4 words per line in the longest x-axis label. // also need number of choices!
        
//             $("#all_charts").append("<div style='min-width: 300px;' id=container_"+count+"></div><br>")
            
//         chart = new Highcharts.Chart({
//             chart: {
//                 renderTo: 'container_'+count,
//                 type: 'column',
//                 marginLeft:300,
                
//                 // customize later
//                 //height: 200 + (10*num_of_lines),
//                 //spacingBottom: 10 * num_of_lines,
//                 //marginBottom: 10* num_of_lines,
//                 height: 250,
//                 marginBottom: 70,
                
                
//                 events:{
//                     load: function(event) {
//                         //When is chart ready?
//                         //console.log(this); //this refers to the loaded chart.
//                         $(".close").unbind();
//                         $(".close").click(function(event){
//                             $("#snapshot").html("");
//                         });
//                         $(".show_question").unbind();
//                         $(".show_question").click(function (event) {
//                          var url = $(this).data('url');
//                          var time = $(this).data('time');
                         
//                          //console.log("time is "+time);
//                          $("#snapshot").html("");
//                          pop2 = Popcorn.youtube( "#snapshot", url ,{ width: 500, controls: 0}); //youtube unlike normal html5 needs to be run from a webserver
//                          //pop2.on("canplay", function(){
//                          pop2.play();
//                          //});
//                          $(".skip").unbind();
//                          $(".skip").click(function(event){
//                             pop2.pause();
//                             pop2.currentTime(parseInt(time));
//                             return false;
//                          });
//                          $('#myModal').modal('show');
//                          pop2.on("loadeddata", function() {
//                              pop2.pause();
//                              pop2.currentTime(parseInt(time));
//                              //console.log(pop2);
//                              //console.log(pop2.currentTime());
//                          });
                         
                         
                         
                         
//                         });
                        
//                     }
//                 }
//             },
//             title: {
//                 text: "<a class='show_question' href='#myModal' data-toggle='modal' data-time='"+getTime(the_id)+"' data-url='"+getURL(the_id)+"' ><%= t('answer.question') %> "+num+"</a><br>"+getLecture(the_id), //null 
//                 style:{
//                     fontSize: '12px',
                    
//                 },
//                 useHTML: true,
//                 margin: 50
//             },
//             xAxis: {
//                 categories: getCategories(the_id),
//             },
//             yAxis: {
//                 title: {
//                     text: "<%= t('quizzes.number_of_students') %>"
//                 },
//                 allowDecimals:false
//             },
//             legend: {
//                 align:'left',
//                 verticalAlign: 'top',
//                 width:'200px',
//                 //maxHeight:1500,
//                 useHTML: true,
//                 itemWidth: '200px',
//                 labelFormatter: function() {
//                     var words = this.name.split(/[\s]+/);
//                     var numWordsPerLine = 4;
//                     var str = [];
                
//                     for (var word in words) {
//                         if (word > 0 && word % numWordsPerLine == 0)
//                             str.push('<br>');
                
//                         str.push(words[word]);
//                     }
                
//                     return str.join(' ');
//                 },
//                 style:{
//                     fontSize: '10px',
//                 },
//                 itemStyle: {
//                     //width: 200, // or whatever
//                     fontSize: '10px'
//                 },
//             },
//             plotOptions: {
//                 column: {
//                     //cursor: 'pointer',
//                     dataLabels: {
//                         enabled: true,
//                         color: colors[0],
//                         style: {
//                             fontWeight: 'bold'
//                         },
//                         formatter: function() {
//                             return this.y;// +'%';
//                         }
//                     }
//                 }
//             },
//             tooltip: {
//                 formatter: function() {
//                     var point = this.point;
//                         //s = this.x +':<b>'+ this.y;// +'% market share</b><br/>';
                   
//                     var words = this.x.split(/[\s]+/);
//                     var numWordsPerLine = 8;
//                     var str = [];
                
//                     for (var word in words) {
//                         if (word > 0 && word % numWordsPerLine == 0)
//                             str.push('<br>');
                
//                         str.push(words[word]);
//                     }
                
//                     s = str.join(' ');
//                     s = s +':<b>'+ this.y;// +'% market share</b><br/>';
//                     s= "< div class ='tooltipContainer'>"+s+"</div>";
//                     return s;
                    
                    
//                 }
//             },
//             series: [{
//                 name: getName(the_id),
//                 data: getSeries(the_id, colors),
//                 color: 'white'
//             }],
//             exporting: {
//                 enabled: true
//             }
//         });
//         all.push(chart)
//         }
//         $('#export').click(function() {
//             //console.log("all isss")
//             //console.log(all);
//             type=$('#image_type').val();
//             Highcharts.exportCharts(all,{type:type, filename:'<%= @modulechart.name %>'}); //filename: 'my-pdf'
//         });
        
//         $("g.highcharts-legend").css("display","none");
    
        
    
    
//     // overall chart
    
//     overall_chart = new Highcharts.Chart({
//             chart: {
//                 renderTo: 'chart_overall',
//                 type: 'column',
//             },
//             title: {
//                 text: "<%= t('courses.studen_statistics') %>",
//                 style:{
//                     fontSize: '12px',
                    
//                 },
//             },
//             xAxis: {
//                 categories: ["<%= t('courses.not_started_watching') %>", "<%= t('courses.watched') %>"+" <= 50%", "<%= t('courses.completed_on_time') %>", "<%= t('courses.completed_late') %>"]
//             },
//             yAxis: {
//                 title: {
//                     text: "<%= t('quizzes.number_of_students') %>"
//                 },
//                 allowDecimals:false
//             },
//             legend: {
//                 enabled:false
//             },
//             plotOptions: {
//                 column: {
//                     //cursor: 'pointer',
//                     dataLabels: {
//                         enabled: true,
//                         color: colors[0],
//                         style: {
//                             fontWeight: 'bold'
//                         },
//                         formatter: function() {
//                             return this.y;// +'%';
//                         }
//                     }
//                 }
//             },
//             tooltip: {
//                 formatter: function() {
//                     var point = this.point,
//                         s = this.x +':<b>'+ this.y;// +'% market share</b><br/>';
                   
//                     return s;
//                 }
//             },
//             series: [{
//                 //name: getName(the_id),
//                 data: [0,0,0,0],//getSeriesAll(),
//                 color: 'gray'
//             }],
//             exporting: {
//                 enabled: true
//             }
//         });
    
//      getSeriesAll(overall_chart); //plot overall_chart
    
    
    
//     });

    
// });

//   function getTime(id)
//   {
//     var studentProgress= <%= raw @module_questions.to_json %>
//     return studentProgress[id][1]
//   }
//   function getURL(id)
//   {
//     var studentProgress= <%= raw @module_lectures.to_json %>
//     return studentProgress[id][1]
//   }
//   function getLecture(id)
//   {
//     var studentProgress= <%= raw @module_lectures.to_json %>
//         return studentProgress[id][0]
//   }
//   function getCategories(id)
//   {
//     var studentProgress= <%= raw @module_new.to_json %>
//     var array_keys = new Array();
//     //console.log(array_keys)
//     for (var key in studentProgress[id]) {
//         array_keys.push(studentProgress[id][key][2]);
//         //array_values.push(a[key]);
//     }

//         return array_keys
//             //console.log(array_keys)
//   }
//   function getCount()
//   {
//     var studentProgress= <%= raw @module_question_ids.to_json %>
//     //console.log("here"+studentProgress.length)
//     return studentProgress
//   }
//   function getName(id)
//   {
//     var studentProgress= <%= raw @module_questions.to_json %>
//     return studentProgress[id][0]
        
//   }
//  function getSeries(id,colors)
//     {
        
//     var studentProgress= <%= raw @module_new.to_json %>
//     var array_values = new Array();
//     var array_colors = new Array();
//     for (var key in studentProgress[id]) {
//         array_values.push(studentProgress[id][key][0]);
//         array_colors.push(studentProgress[id][key][1]); 
//     }
//     var studentColors= <%= raw @module_colors.to_json %>
//        // x=[{"name":'<%= t("lectures.correct") %>', "data":[], "color":[]}, {"name":'<%= t("lectures.incorrect") %>', "data":[], "color":[]}]
//         x=[]
//         module_data= array_values//studentProgress[id]   //[2,3,4]
//         chart_colors= array_colors//studentColors[id]   //[2,3,4]
//         for(var key in module_data)  // only once // key here is the json key (not number like with array)
//         {   
//             var z= module_data[key]  //z=2
//             var color= chart_colors[key]
            
//                 x[key]={color: color,"y": z}
            
//         }
        
//         //console.debug(x)
        
//         return x
//     }
    
//     function getSeriesAll(overall_chart)
//     {
//     console.log("in get all");
//     var x=[];
//     // so here get the data first since i don't get it in controller anymore.
//     overall_chart.showLoading();
//     $.post("/<%= I18n.locale %>/courses/<%=@course.id%>/groups/<%=@modulechart.id%>/get_overall_chart", function(response){
//         //      $("#loading_"+group_id+"_"+user_id).css("display","none");
//                 //console.log(response)
//         //      if(response["choose"]==0) //original
//         var studentProgress= response["mod_stats"]
    
    
//             x[0]={"y": studentProgress[0]}
//             x[1]={"y": studentProgress[1]}
//             x[2]= {"y": studentProgress[2]}
//             x[3]={"y": studentProgress[3]}
            
//         //overall_chart.series[0].data=x
//         overall_chart.series[0].setData(x,true);
//         console.log(overall_chart.series[0].data)
//         console.log(overall_chart)
//         //overall_chart.redraw();
//         overall_chart.hideLoading();
//         //return x
    
//     });
//     // here!!
            
    
    
//     }  