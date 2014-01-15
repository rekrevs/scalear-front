'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'Document','$stateParams', '$translate','$q','$log', '$filter', function ($scope, $state, Module, Document, $stateParams, $translate, $q, $log, $filter) {
        

        $scope.$watch('module_obj['+$stateParams.module_id+']', function(){
            if($scope.module_obj && $scope.module_obj[$stateParams.module_id]){
                $scope.module=$scope.module_obj[$stateParams.module_id]
            }
            init();
        })

        var init = function(){
            Module.getModules(
                {
                    course_id:$stateParams.course_id,
                    module_id:$stateParams.module_id
                },
                function(data){

                    $scope.$watch('module',function(){
                        if($scope.module)
                            angular.extend($scope.module, data)
                    })
                    
                },
                function(){}
            )
        }        

    	$scope.addDocument=function(){
    		$log.debug($scope.module.id)
    		$scope.document_loading=true
    		Module.newDocument({course_id:$stateParams.course_id, module_id:$scope.module.id},
    			{},
    			function(doc){
    				$log.debug(doc)
                    doc.document.url = "http://"
    				$scope.module.documents.push(doc.document)
    				$scope.document_loading=false
    			}, 
    			function(){
    				//alert("Failed to add document, please check your internet connection")
    			}
			);
    	}


    	$scope.removeDocument=function (elem) {
    		//if(confirm($translate('groups.you_sure_delete_document', {doc: elem.name}))){
	    		Document.destroy(
					{document_id: elem.id},{},
					function(){
						$scope.module.documents.splice($scope.module.documents.indexOf(elem), 1)
					}, 
					function(){
						//alert("Failed to delete document, please check your internet connection")
					}
				);
	    	//}
    	}
		$scope.validateName= function(data, elem){
			var d = $q.defer();
		    var doc={}
		    doc.name=data;
		    Document.validateName(
		    	{document_id: elem.id},
		    	doc,
		    	function(data){
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
		}
			
		$scope.validateURL= function(data, elem){
			var d = $q.defer();
		    var doc={}
		    doc.url=data;
		    Document.validateURL(
		    	{document_id: elem.id},
		    	doc,
		    	function(data){
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
		}
    	$scope.updateDocument=function(elem){
    		//$log.debug($scope.module.documents[index])
            elem.url = $filter("formatURL")(elem.url)
    		Document.update(
    			{document_id: elem.id},
    			{"document":{
    				url: elem.url,
    				name: elem.name
    				}
    			},
    			function(resp){
    				elem.errors=""
    			},
    			function(resp){
    				//alert("Failed to update document information, please check your internet connection")
    				elem.errors=resp.data.errors;
    			}
			);
    	}
    }]);