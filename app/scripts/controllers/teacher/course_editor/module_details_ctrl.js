'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$state', 'Module', 'Document', '$q','$stateParams','$log', function ($scope, $state, Module, Documents,$q, $stateParams, $log) {
    
    $scope.$watch('module_obj['+$stateParams.module_id+']', function(){
      if($scope.module_obj && $scope.module_obj[$stateParams.module_id])
        $scope.module=$scope.module_obj[$stateParams.module_id]
    })

    //**************************FUNCTIONS****************************************///
	  $scope.validateModule = function(column,data) {
      $log.debug(data)
	    var d = $q.defer();
	    var group={}
	    group[column]=data;
	    Module.validateModule(
	    	{course_id:$stateParams.course_id,
	    	module_id:$scope.module.id},
	    	group,
	    	function(){
				d.resolve()
			},function(data){
				$log.debug(data.status);
				$log.debug(data);
			if(data.status==422)
			 	d.resolve(data.data.errors.join());
			else
				d.reject('Server Error');
			}
	    )
	    return d.promise;
    };
    
      $scope.updateModule=function(data,type){
        console.log('hello world')
        console.log(data)
        console.log(type)
        if(data && data instanceof Date){ 
              console.log('goodbye')
              data.setMinutes(data.getMinutes() + 120);
              $scope.module[type] = data

              console.log($scope.module[type])
        }
        var modified_module=angular.copy($scope.module);
        delete modified_module.id;
        delete modified_module.items;
        delete modified_module.documents;
        delete modified_module.created_at;
        delete modified_module.updated_at;
        delete modified_module.total_time;
        delete modified_module.total_questions;
        delete modified_module.total_quiz_questions;

        Module.update(
          {course_id:$stateParams.course_id,
          	module_id: $scope.module.id},
          {group: modified_module},
          function(response){
            $log.debug(response)
          },
          function(){
            //alert("Failed to update module, please check your internet connection")
          }
        );
      }
    }]);