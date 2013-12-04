'use strict';

angular.module('scalearAngularApp')
    .controller('moduleDetailsCtrl', ['$scope', '$state', 'Module', 'Documents', 'module','$q','$stateParams', function ($scope, $state, Module, Documents, module, $q, $stateParams) {
      $scope.module=module.data


	  $scope.validateModule = function(column,data) {
      console.log(data)
	    var d = $q.defer();
	    var group={}
	    group[column]=data;
	    Module.validateModule(
	    	{course_id:$stateParams.course_id,
	    	module_id:$scope.module.id},
	    	group,
	    	function(data){
				d.resolve()
			},function(data){
				console.log(data.status);
				console.log(data);
			if(data.status==422)
			 	d.resolve(data.data[column].join());
			else
				d.reject('Server Error');
			}
	    )
	    return d.promise;
    };
    
      $scope.updateModule=function(data,type){
        if(data)
          $scope.module[type] = data.getDate()+"/"+(data.getMonth()+1)+"/"+data.getFullYear() 
        var modified_module=angular.copy($scope.module);
        delete modified_module["id"];
        delete modified_module["documents"];
        delete modified_module["created_at"];
        delete modified_module["updated_at"];
        delete modified_module["total_time"];
        delete modified_module["total_questions"];
        delete modified_module["total_quiz_questions"];
                 
        Module.update(
          {course_id:$stateParams.course_id,
          	module_id: $scope.module.id},
          {group: modified_module},
          function(response){
            console.log(response)
            $scope.$emit('detailsUpdate')
          },
          function(){
            alert("Failed to update module, please check your internet connection")
          }
        );
      }
    }]);