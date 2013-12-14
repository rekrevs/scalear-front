'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'Document','$stateParams', '$translate' ,function ($scope, $state, Module, Document, $stateParams, $translate) {
        
        $scope.$watch('module_obj['+$stateParams.module_id+']', function(){
            if($scope.module_obj && $scope.module_obj[$stateParams.module_id]){
                $scope.module=$scope.module_obj[$stateParams.module_id]
                init()
            }
        })

        var init = function(){
            Module.getModules(
                {
                    course_id:$stateParams.course_id,
                    module_id:$stateParams.module_id
                },
                function(data){
                    angular.extend($scope.module, data)
                },
                function(){
                }
            )
        }

    	$scope.addDocument=function(){
    		console.log($scope.module.id)
    		$scope.document_loading=true
    		Module.newDocument({course_id:$stateParams.course_id, module_id:$scope.module.id},
    			{},
    			function(doc){
    				console.log(doc)
    				$scope.module.documents.push(doc)
    				$scope.document_loading=false
    			}, 
    			function(){
    				alert("Failed to add document, please check your internet connection")
    			}
			);
    	}

    	$scope.removeDocument=function (index) {
    		if(confirm($translate('groups.you_sure_delete_document'))){
	    		Document.destroy(
					{document_id: $scope.module.documents[index].id},{},
					function(){
						$scope.module.documents.splice(index, 1)
					}, 
					function(){
						alert("Failed to delete document, please check your internet connection")
					}
				);
	    	}
    	}

    	$scope.updateDocument=function(index){
    		console.log($scope.module.documents[index])
    		Document.update(
    			{document_id: $scope.module.documents[index].id},
    			{"document":{
    				url: $scope.module.documents[index].url,
    				name: $scope.module.documents[index].name
    				}
    			},
    			function(resp){
    				console.log(resp)
    			},
    			function(){
    				alert("Failed to update document information, please check your internet connection")
    			}
			);
    	}
    }]);