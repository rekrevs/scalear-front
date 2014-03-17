'use strict';

angular.module('scalearAngularApp')
  .controller('copyCourseCtrl',['$scope','Course','SharedItem','$stateParams', '$translate','$log','$window','$state', function ($scope,Course, SharedItem,$stateParams, $translate, $log, $window, $state) {
        Course.courseCopy({}, function(response){
            $scope.courses=JSON.parse(response.courses);
            $scope.teachers = response.teachers;
        });

        $scope.teachers_selected=[]
        $scope.teacher=""
        $scope.data_to_copy={}

        $scope.copy_to= function(){
            // will go to another state showing chosen data only, abiity to go back and update, or write email and click copy.
            SharedItem.create({},{data: $scope.data_to_copy, shared_with: $scope.teacher}, function(){
                console.log("success")
                $state.go("course_list");
            })
        }

        $scope.selectMatch = function(selection) {
            // only add it if not there
            // allow deleting items later.
            $scope.teachers_selected.push(selection.email);
            $scope.teacher=selection.email;
            $scope.teacher_selected = '';
        };

        $scope.checkboxClick = function(group, $event){
            console.log($event.target.checked);
            console.log(group.checked)
            $event.stopPropagation();



        }

        $scope.select_all_modules = function(course, $event){
            $event.stopPropagation();
            for(var module in course.groups)
            {
                $scope.select_all_items(course.groups[module], $event);
            }
        }

        $scope.initialize_data = function(item){
            if(!$scope.data_to_copy[item.course_id])
                $scope.data_to_copy[item.course_id]={}

            if(!$scope.data_to_copy[item.course_id][item.group_id])
                $scope.data_to_copy[item.course_id][item.group_id]={}

            if(!$scope.data_to_copy[item.course_id][item.group_id][item.get_class_name])
                $scope.data_to_copy[item.course_id][item.group_id][item.get_class_name]=[]

        }

        $scope.select_all_items = function(module, $event){
            $event.stopPropagation();
              for(var element in module.get_items_json)
              {
                  var item = module.get_items_json[element]
                  $scope.initialize_data(item);
                  $scope.data_to_copy[item.course_id][item.group_id][item.get_class_name].push(item.id)
                  item.checked=true;
              }
        }

        $scope.itemClick = function(item, $event){
            console.log($event.target.checked);
            console.log(item.checked)
            $event.stopPropagation();


            $scope.initialize_data(item);

            if($event.target.checked){
                $scope.data_to_copy[item.course_id][item.group_id][item.get_class_name].push(item.id)
                console.log("here checked")
            }else{
                var index= $scope.data_to_copy[item.course_id][item.group_id][item.get_class_name].indexOf(item.id)
                $scope.data_to_copy[item.course_id][item.group_id][item.get_class_name].splice(index, 1)
            }
        }
  }]);
