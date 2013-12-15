'use strict';

angular.module('scalearAngularApp')
    .controller('moduleMiddleCtrl', ['$scope', '$state', 'Module', 'Document', 'module','$stateParams','$q' ,function ($scope, $state, Module, Document, module, $stateParams, $q) {
        $scope.module=module.data

    	$scope.addDocument=function(){
    		console.log($scope.module.id)
    		$scope.document_loading=true
    		Module.newDocument({course_id:$stateParams.course_id, module_id:$scope.module.id},
    			{},
    			function(doc){
    				console.log(doc)
    				$scope.module.documents.push(doc.document)
    				$scope.document_loading=false
    			}, 
    			function(){
    				//alert("Failed to add document, please check your internet connection")
    			}
			);
    	}

    	$scope.removeDocument=function (elem) {
    		if(confirm("Are you sure you want to delete document?")){
	    		Document.destroy(
					{document_id: elem.id},{},
					function(){
						$scope.module.documents.splice($scope.module.documents.indexOf(elem), 1)
					}, 
					function(){
						alert("Failed to delete document, please check your internet connection")
					}
				);
	    	}
    	}
		$scope.validateName= function(data, elem){
			var d = $q.defer();
		    var doc={}
		    doc["name"]=data;
		    Document.validateName(
		    	{document_id: elem.id},
		    	doc,
		    	function(data){
					d.resolve()
				},function(data){
					console.log(data.status);
					console.log(data);
				if(data.status==422)
				 	d.resolve(data.data.errors['name'].join());
				else
					d.reject('Server Error');
				}
		    )
		    return d.promise;
		}
			
		$scope.validateURL= function(data, elem){
			var d = $q.defer();
		    var doc={}
		    doc["url"]=data;
		    Document.validateURL(
		    	{document_id: elem.id},
		    	doc,
		    	function(data){
					d.resolve()
				},function(data){
					console.log(data.status);
					console.log(data);
				if(data.status==422)
				 	d.resolve(data.data.errors['url'].join());
				else
					d.reject('Server Error');
				}
		    )
		    return d.promise;
		}
    	$scope.updateDocument=function(elem){
    		//console.log($scope.module.documents[index])
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