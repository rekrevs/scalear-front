'use strict';

angular.module('scalearAngularApp')
  .controller('importFromCtrl',['SharedItem','$scope','Course','$stateParams', '$translate','$log','$window', function (SharedItem, $scope, Course,$stateParams, $translate, $log, $window) {

console.log($stateParams);
        // over here get the shared item data -> call it courses
        //and in view loop on them to display the data, with checkboxes to choose what to import.
        // translations
        // must save course data first, and do this on success,
        // use better url, to work with shared items or other courses
        // will remove notification and record of shared item when copy over?
        SharedItem.show({shared_item_id:$stateParams.shared_item}, function(response){
            console.log("success")
            $scope.courses= JSON.parse(response.courses)
        })


        $scope.data_to_copy={}

        $scope.copy_to= function(){
            // will go to another state showing chosen data only, abiity to go back and update, or write email and click copy.
            SharedItem.create({},{data: $scope.data_to_copy, shared_with: $scope.teacher}, function(){
                console.log("success")
                $state.go("course_list");
            })
        }

        $scope.select_all_modules = function(course, $event){
            $event.stopPropagation();
            for(var module in course.access_groups)
            {
                $scope.select_all_items(course.access_groups[module], $event);
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
            for(var element in module.access_items)
            {
                var item = module.access_items[element]
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
